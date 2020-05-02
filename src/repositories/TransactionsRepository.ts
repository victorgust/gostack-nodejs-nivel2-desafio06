import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    let sumIncome = 0;
    let sumOutcome = 0;

    transactions.map(transaction => {
      if (transaction.type === 'income') {
        sumIncome += Number(transaction.value);
      } else {
        sumOutcome += Number(transaction.value);
      }
      return 0;
    });

    const balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
