import Transaction from '../models/Transaction';
import e from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
    title: string;
    type: "income" | "outcome";
    value: number;
}

interface userData {
  transactions: Transaction[];
  balance: Balance;
}

interface UserException {
  message: string;
  name: string;
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

function userException(message: string): UserException {
  const name = "UserException";

  const exception: UserException = ({ message, name });

  return exception;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): userData {
    const balance = this.getBalance();
    const transactions = this.transactions;
    const data: userData = ({ transactions, balance });
    return data;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((acc, tr) => acc + tr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.INCOME);
    const outcome = this.calculateBalance(Type.OUTCOME);
    const total = income - outcome;

      const balance: Balance = { income, outcome, total };
      return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();
    if(type === "outcome" && total < value) {
      throw new Error("Cannot create outcome transaction without a valid balance");
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
