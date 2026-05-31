import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

type PaymentMethodType = "visa" | "mastercard" | "jazzcash";
type TransactionType = "credit" | "debit";
type TransactionStatus = "completed" | "pending" | "failed";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethodType;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethodType;
  cardLastFour: string;
}

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  payments: PaymentRecord[];
  selectedPaymentMethod: PaymentMethodType;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  payments: [],
  selectedPaymentMethod: "visa",
};

interface AddFundsPayload {
  amount: number;
  paymentMethod: PaymentMethodType;
  cardLastFour: string;
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addFunds: {
      prepare(payload: AddFundsPayload) {
        return {
          payload: {
            ...payload,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          },
        };
      },
      reducer(
        state,
        action: PayloadAction<AddFundsPayload & { id: string; date: string }>
      ) {
        const { amount, paymentMethod, cardLastFour, id, date } =
          action.payload;
        state.balance += amount;
        state.transactions.push({
          id,
          type: "credit",
          amount,
          description: `Added funds via ${paymentMethod}`,
          date,
          status: "completed",
          paymentMethod,
        });
        state.payments.push({
          id,
          amount,
          date,
          status: "completed",
          paymentMethod,
          cardLastFour,
        });
      },
    },
    setSelectedPaymentMethod(
      state,
      action: PayloadAction<PaymentMethodType>
    ) {
      state.selectedPaymentMethod = action.payload;
    },
  },
});

export const { addFunds, setSelectedPaymentMethod } = walletSlice.actions;

export const selectWalletBalance = (state: RootState) => state.wallet.balance;
export const selectWalletTransactions = (state: RootState) =>
  state.wallet.transactions;
export const selectWalletPayments = (state: RootState) =>
  state.wallet.payments;
export const selectSelectedPaymentMethod = (state: RootState) =>
  state.wallet.selectedPaymentMethod;

export default walletSlice.reducer;
