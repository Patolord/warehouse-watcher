import { ConvexError, v } from "convex/values";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  query,
  QueryCtx,
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
    userId: v.string(),
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
  handler: async (ctx, args) => {
    await ctx.db.insert("embeddings", args);
  },
});

export const createEmbedding = internalAction({
  args: {
    userId: v.string(),
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
  handler: async (ctx, args) => {
    const embedding = await embed(args.text);
    await ctx.runMutation(internal.embeddings.setEmbedding, {
      userId: args.userId,
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
    const userId = await getUserId(ctx);
    const queryEmbedding = await embed(args.query);

    let embeddingsQuery = ctx.db
      .query("embeddings")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.sourceType) {
      embeddingsQuery = embeddingsQuery.filter((q) =>
        q.eq(q.field("sourceType"), args.sourceType)
      );
    }

    const allEmbeddings = await embeddingsQuery.collect();

    const similarItems = allEmbeddings
      .map((item) => ({
        ...item,
        similarity: cosineSimilarity(queryEmbedding, item.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    const results = await Promise.all(
      similarItems.map(async (item) => {
        const source = await ctx.db.get(item.sourceId);
        return {
          ...source,
          similarity: item.similarity,
          textContent: item.textContent,
        };
      })
    );

    return results;
  },
});

// Helper function to get the user ID (implement this based on your authentication system)
export async function getUserId(ctx: QueryCtx): Promise<string> {
  // Implement this based on your authentication system
  // For example, if you're using Convex authentication:
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}

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
