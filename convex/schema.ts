import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  activities: defineTable({
    actionType: v.string(),
    time: v.string(),
    details: v.optional(v.any()),
  }),
  materials: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.optional(v.string()),
    imageFileId: v.optional(v.id("_storage")),
    additionalAttributes: v.optional(v.any()),
    currentVersionId: v.optional(v.id("materialVersions")),
    qrCode: v.optional(v.string()),
  })
    .index("by_name", ["name"])
    .index("by_user_and_type", ["userId", "type"]),
  warehouses: defineTable({
    userId: v.string(),
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
  }),
  transactions: defineTable({
    userId: v.string(),
    from_location: v.optional(v.id("warehouses")),
    to_location: v.optional(v.id("warehouses")),
    action_type: v.string(),
    description: v.optional(v.string()), // 'added', 'transferred', 'deleted' (optional for tracking actions)
  }),
  transactions_details: defineTable({
    transaction: v.id("transactions"), // Foreign key to the transaction
    materialId: v.id("materials"), // Foreign key to the material
    materialVersionId: v.id("materialVersions"),
    quantity: v.number(), // Quantity of the material in this transaction
  })
    .index("by_transaction", ["transaction"]) // Index to quickly find all materials in a transaction
    .index("by_material", ["materialId"]), // Index to quickly find all transactions for a material
  inventories: defineTable({
    userId: v.string(), // Add this line
    warehouseId: v.id("warehouses"),
    materialId: v.id("materials"),
    quantity: v.number(),
  })
    .index("by_warehouse", ["warehouseId"])
    .index("by_material", ["materialId"])
    .index("by_warehouse_and_material", ["warehouseId", "materialId"])
    .index("by_userId", ["userId"]), // Add this line
  material_audit_logs: defineTable({
    materialId: v.id("materials"),
    oldName: v.string(),
    newName: v.string(),
  }).index("by_material", ["materialId"]),
  materialVersions: defineTable({
    materialId: v.id("materials"),
    name: v.string(),
    type: v.optional(v.string()),
    versionNumber: v.number(),
  })
    .index("by_material_and_version", ["materialId", "versionNumber"])
    .index("by_material", ["materialId"]),
  embeddings: defineTable({
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
  })
    .index("by_user_and_source", ["userId", "sourceType", "sourceId"])
    .index("by_user", ["userId"]),
});

export default schema;

/*

Warehouse 1 mn72bhxnypszp0gtg1zahk5nsx6ygzk4
Warehouse 2 mn73s4desbq3taf2ztbzt9xmn16yfdsb
Warehouse 3 mn76xqvrdfwc46n15n0ct97ht16yhv5v

Material 1 kh7fqdemwyzs853dwba6bq9vmh6ygdcp
Material 2 kh72cxy0qre6k4ctfchk53y0ks6yh9xc
Material 3 kh72hbfpjsg6dfepbebhxxtreh6yhb33

Transfer 1 ms79w4vmexbrtbwtn5g9d01g856yg0me
Transfer 2 ms79q2zkghevs41dbv4snpnk196yhx0b
Added 1    ms7cadyadp00b7ss994ggstkkx6yhbck
Removed 1  ms7bk2pdnrr0r0qd84skn3k6nx6ygrvf







*/
