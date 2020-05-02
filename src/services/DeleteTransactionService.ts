import { getCustomRepository } from 'typeorm';

import { json } from 'express';
import RepositoryTransactions from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repositoryTransactions = getCustomRepository(RepositoryTransactions);

    const transaction = await repositoryTransactions.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not exist', 400);
    }

    await repositoryTransactions.delete(id);
  }
}

export default DeleteTransactionService;
