import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { date } from "zod";

const schema = defineSchema({
  ...authTables,
  materials: defineTable({
    name: v.string(),
    type: v.optional(v.string()),
    imageFileId: v.optional(v.id("_storage")),
    additionalAttributes: v.optional(v.any()),
  })
    .index("by_name", ["name"])
    .index("by_type", ["type"]),
  warehouses: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
  }),
  transactions: defineTable({
    from_location: v.optional(v.id("warehouses")),
    to_location: v.optional(v.id("warehouses")),
    action_type: v.string(), // 'added', 'transferred', 'deleted' (optional for tracking actions)
  }),
  transactions_details: defineTable({
    transaction: v.id("transactions"), // Foreign key to the transaction
    material: v.id("materials"), // Foreign key to the material
    quantity: v.number(), // Quantity of the material in this transaction
  })
    .index("by_transaction", ["transaction"]) // Index to quickly find all materials in a transaction
    .index("by_material", ["material"]), // Index to quickly find all transactions for a material
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
