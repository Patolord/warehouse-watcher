import { Id } from "../../../../convex/_generated/dataModel";

export type Warehouse = {
  _id: Id<"warehouses">;
  _creationTime: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type WarehouseId = Id<"warehouses">;

export type Transaction = {
  _id: Id<"transactions">;
  _creationTime: number;
  from_location?: WarehouseId;
  to_location?: WarehouseId;
  action_type: string;
  description?: string;
};

export type TransactionWithWarehouseInfo = Transaction & {
  from_warehouse?: Warehouse | null;
  to_warehouse?: Warehouse | null;
};

export type TransactionDetails = {
  _id: Id<"transactions_details">;
  _creationTime: number;
  transaction: Id<"transactions">;
  materialId: Id<"materials">;
  materialVersionId: Id<"materialVersions">;
  quantity: number;
};
