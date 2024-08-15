import { Doc, Id } from "./_generated/dataModel";

export type Warehouse = Doc<"warehouses">;
export type WarehouseId = Id<"warehouses">;

export type Transaction = Doc<"transactions"> & {
  from_location?: WarehouseId;
  to_location?: WarehouseId;
  action_type: string;
  description?: string;
};

export type TransactionWithWarehouseInfo = Transaction & {
  from_warehouse?: Warehouse | null;
  to_warehouse?: Warehouse | null;
};

export type TransactionDetails = Doc<"transactions_details"> & {
  transaction: Id<"transactions">;
  materialId: Id<"materials">;
  materialVersionId: Id<"materialVersions">;
  quantity: number;
};
