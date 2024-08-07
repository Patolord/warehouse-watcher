import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    suppliers: defineTable({
        name: v.string(),
        cnpj: v.optional(v.string()),
        email: v.optional(v.string()),
        address: v.optional(v.string()),
    }),
    materials: defineTable({
        rootMaterialId: v.optional(v.id("materials")),
        name: v.string(),
        type: v.optional(v.string()),
        imageFileId: v.optional(v.id("_storage")),
        additionalAttributes: v.optional(v.any()),
        nickname: v.optional(v.string()),
        baseUnit: v.optional(v.string()),
        endDate: v.optional(v.number()),
        isCurrent: v.optional(v.boolean()),
    })
        .index("by_name", ["name"])
        .index("by_type", ["type"]),
    warehouses: defineTable({
        name: v.string(),
        address: v.optional(v.string()),
        latitude: v.optional(v.float64()),
        longitude: v.optional(v.float64()),
    }),
    inventories: defineTable({
        warehouseId: v.id("warehouses"),
        materialId: v.id("materials"),
        materialName: v.string(),
        quantity: v.number(),
        minQuantity: v.optional(v.number()),
    })
        .index("by_material_id", ["materialId"])
        .index("by_warehouse_id", ["warehouseId"])
        .index("by_warehouse_material", ["warehouseId", "materialId"]),
    material_movements: defineTable({
        fromWarehouseId: v.optional(v.id("warehouses")),
        toWarehouseId: v.optional(v.id("warehouses")),
        materials: v.array(
            v.object({
                materialId: v.id("materials"),
                materialName: v.string(),
                quantity: v.number(),
                unitId: v.optional(v.id("material_units")),
            }),
        ),
        status: v.optional(v.string()),
        type: v.string(),

        description: v.optional(v.string()),
    }).index("by_type", ["type"]),
    material_movement_details: defineTable({
        materialName: v.string(),
        movementId: v.id("material_movements"), // Foreign key to material_movements table
        materialId: v.id("materials"), // Foreign key to materials table
        quantity: v.number(),
        unitId: v.optional(v.id("material_units")),
    }).index("by_movement_material", ["movementId", "materialId"]),

    metadata: defineTable({
        materialCount: v.number(),
        warehouseCount: v.number(),
        supplierCount: v.number(),
        pricesCount: v.number(),
    }),
});

export default schema;