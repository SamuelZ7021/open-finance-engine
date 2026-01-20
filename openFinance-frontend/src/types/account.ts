import type { Transaction } from "./Transaction";


export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
}

