import type { OperationType } from "./OperationType";

export interface TransactionLine {
  accountId: string;
  amount: number;
  type: OperationType;
}