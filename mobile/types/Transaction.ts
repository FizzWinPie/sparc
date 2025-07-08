export interface Transaction {
  _id: string;
  receiver: string;
  payer: string;
  amount: number;
  createdAt: Date;
};