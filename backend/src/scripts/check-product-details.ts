#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';

async function checkProductDetails() {
  const logger = new Logger('ProductDetailsCheck');
  
  try {
    logger.log('Checking product details coverage...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const productRepository = app.get(getRepositoryToken(Product));
    const productDetailRepository = app.get(getRepositoryToken(ProductDetail));

    // Check total counts
    const totalProducts = await productRepository.count();
    const totalDetails = await productDetailRepository.count();
    
    logger.log(`Total products: ${totalProducts}`);
    logger.log(`Total product details: ${totalDetails}`);
    logger.log(`Coverage: ${((totalDetails / totalProducts) * 100).toFixed(1)}%`);

    // Check products with details
    const productsWithDetails = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.detail', 'detail')
      .where('detail.id IS NOT NULL')
      .getCount();

    logger.log(`Products with details: ${productsWithDetails}`);

    // Sample products with details
    const sampleWithDetails = await productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail')
      .where('detail.id IS NOT NULL')
      .orderBy('product.id', 'ASC')
      .take(5)
      .getMany();

    logger.log('Sample products WITH details:');
    sampleWithDetails.forEach((product, index) => {
      logger.log(`${index + 1}. ID: ${product.id}`);
      logger.log(`   Title: ${product.title}`);
      logger.log(`   Publisher: ${product.detail?.publisher || 'N/A'}`);
      logger.log(`   ISBN: ${product.detail?.isbn || 'N/A'}`);
      logger.log(`   Genres: ${product.detail?.genres?.join(', ') || 'N/A'}`);
      logger.log('');
    });

    // Sample products without details
    const sampleWithoutDetails = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.detail', 'detail')
      .where('detail.id IS NULL')
      .orderBy('product.id', 'DESC')
      .take(5)
      .getMany();

    logger.log('Sample products WITHOUT details:');
    sampleWithoutDetails.forEach((product, index) => {
      logger.log(`${index + 1}. ID: ${product.id}`);
      logger.log(`   Title: ${product.title}`);
      logger.log(`   Author: ${product.author || 'N/A'}`);
      logger.log('');
    });

    // Check ID ranges
    const minIdWithDetails = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.detail', 'detail')
      .where('detail.id IS NOT NULL')
      .orderBy('product.id', 'ASC')
      .getOne();

    const maxIdWithDetails = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.detail', 'detail')
      .where('detail.id IS NOT NULL')
      .orderBy('product.id', 'DESC')
      .getOne();

    logger.log(`ID range with details: ${minIdWithDetails?.id} - ${maxIdWithDetails?.id}`);

    await app.close();
    process.exit(0);

  } catch (error) {
    logger.error(`Product details check failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  checkProductDetails();
}