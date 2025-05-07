export interface SplitTransaction {
  transactionId: string;
  groupId: string;
  amount: number;
  name: string;
  payerId: string;
  users: string[]; // Array of user IDs responsible for split
  createdAt: string;
}
