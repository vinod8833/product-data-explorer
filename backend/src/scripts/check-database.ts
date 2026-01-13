#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';

async function checkDatabase() {
  const logger = new Logger('DatabaseCheck');
  
  try {
    logger.log('Checking database connection and data...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const productRepository = app.get(getRepositoryToken(Product));

    // Check total count
    const totalCount = await productRepository.count();
    logger.log(`Total products in database: ${totalCount}`);

    // Check products with images
    const productsWithImages = await productRepository
      .createQueryBuilder('product')
      .where('product.imageUrl IS NOT NULL')
      .getCount();
    logger.log(`Products with images: ${productsWithImages}`);

    // Get sample products
    const sampleProducts = await productRepository.find({
      take: 5,
      order: { id: 'DESC' }
    });

    logger.log('Sample products:');
    sampleProducts.forEach((product, index) => {
      logger.log(`${index + 1}. ID: ${product.id}`);
      logger.log(`   Title: ${product.title}`);
      logger.log(`   Author: ${product.author}`);
      logger.log(`   Image: ${product.imageUrl}`);
      logger.log(`   Price: ${product.currency} ${product.price}`);
      logger.log('');
    });

    await app.close();
    process.exit(0);

  } catch (error) {
    logger.error(`Database check failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  checkDatabase();
}