import { ConvexError, v } from "convex/values";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  query,
} from "./_generated/server";
import OpenAI from "openai";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function embed(text: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return embedding.data[0].embedding;
}

export const setEmbedding = internalMutation({
  args: {
    sourceId: v.union(
      v.id("materials"),
      v.id("warehouses"),
      v.id("transactions")
    ),
    sourceType: v.union(
      v.literal("material"),
      v.literal("warehouse"),
      v.literal("transaction")
    ),
    embedding: v.array(v.float64()),
    textContent: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("embeddings", {
      sourceId: args.sourceId,
      sourceType: args.sourceType,
      embedding: args.embedding,
      textContent: args.textContent,
    });
  },
});

export const createEmbedding = internalAction({
  args: {
    sourceId: v.union(
      v.id("materials"),
      v.id("warehouses"),
      v.id("transactions")
    ),
    sourceType: v.union(
      v.literal("material"),
      v.literal("warehouse"),
      v.literal("transaction")
    ),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await embed(args.text);
    await ctx.runMutation(internal.embeddings.setEmbedding, {
      sourceId: args.sourceId,
      sourceType: args.sourceType,
      embedding,
      textContent: args.text,
    });
  },
});

export const searchSimilar = query({
  args: {
    query: v.string(),
    sourceType: v.optional(
      v.union(
        v.literal("material"),
        v.literal("warehouse"),
        v.literal("transaction")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Assuming we have an embeddings table in our schema
    const embeddings = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        args.sourceType ? q.eq("sourceType", args.sourceType) : q
      )
      .collect();

    // Here we would normally compute the embedding for the query
    // and compare it with the stored embeddings.
    // For this example, we'll just return the first 5 embeddings.
    const results = embeddings.slice(0, 5).map((embedding) => ({
      sourceId: embedding.sourceId,
      sourceType: embedding.sourceType,
      textContent: embedding.textContent,
      similarity: Math.random(), // Placeholder for actual similarity calculation
    }));

    return results;
  },
});

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

// Helper function to generate text for embedding
export function generateEmbeddingText(
  sourceType: "material" | "warehouse" | "transaction",
  data: any
): string {
  switch (sourceType) {
    case "material":
      return `${data.name} ${data.type || ""}. ${JSON.stringify(data.additionalAttributes) || ""}`;
    case "warehouse":
      return `${data.name}. Located at: ${data.address || ""}. Coordinates: ${data.latitude}, ${data.longitude}`;
    case "transaction":
      return `${data.action_type} - ${data.description || ""}. From: ${data.from_location || "N/A"}. To: ${data.to_location || "N/A"}`;
    default:
      throw new ConvexError("Invalid source type");
  }
}

type EmbeddingSearchResult = {
  sourceId: Id<"materials" | "warehouses" | "transactions">;
  sourceType: "material" | "warehouse" | "transaction";
  textContent: string;
  similarity: number;
};

export const chatWithContext = action({
  args: {
    query: v.string(),
    sourceType: v.optional(
      v.union(
        v.literal("material"),
        v.literal("warehouse"),
        v.literal("transaction")
      )
    ),
  },
  handler: async (
    ctx: ActionCtx,
    args: {
      query: string;
      sourceType?: "material" | "warehouse" | "transaction";
    }
  ): Promise<string> => {
    try {
      // Search for similar items
      const similarItems = (await ctx.runQuery(api.embeddings.searchSimilar, {
        query: args.query,
        sourceType: args.sourceType,
      })) as EmbeddingSearchResult[];

      // Prepare context from similar items
      const context = similarItems
        .map((item) => `${item.sourceType}: ${item.textContent}`)
        .join("\n");

      // Use ChatGPT to generate a response
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant with knowledge about our inventory system.",
          },
          {
            role: "user",
            content: `Query: ${args.query}\n\nRelevant context:\n${context}`,
          },
        ],
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response generated from OpenAI");
      }

      return response;
    } catch (error) {
      console.error("Error in chatWithContext:", error);
      throw new Error(
        `Failed to process chat request: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});