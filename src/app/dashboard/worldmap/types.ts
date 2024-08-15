// types.ts

import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type Warehouse = Doc<"warehouses">;

// If you need to use the Id type separately:
export type WarehouseId = Id<"warehouses">;
