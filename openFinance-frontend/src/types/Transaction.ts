// src/types/transaction.ts

import type { OperationType } from "./OperationType";
// import type { TransactionLine } from "./TransactionLine";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string; // From backend DTO
  date: string; // Helper for frontend compatibility (will be mapped from timestamp if needed)
  category: OperationType;
  // lines removed as they are not in AccountTransactionResponse
  isReversal?: boolean;
}