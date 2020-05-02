import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Valida se tem income suficiente para criar
    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insufficient balance', 400);
    }

    // Cria Categoria caso não tenha
    const categoryRepository = getRepository(Category);

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const categoryCreate = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryCreate);
    }

    const categoryNew = await categoryRepository.findOne({
      where: { title: category },
    });

    // Cria transaction
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryNew?.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
