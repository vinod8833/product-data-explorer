#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WorldOfBooksApiService } from '../modules/scraping/world-of-books-api.service';
import { Logger } from '@nestjs/common';

async function testBookCollection() {
  const logger = new Logger('TestBookCollection');
  
  try {
    logger.log('Initializing NestJS application...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const apiService = app.get(WorldOfBooksApiService);

    // Test basic search
    logger.log('Testing basic book search...');
    const searchResult = await apiService.searchProducts({
      query: 'Harry Potter',
      priceMin: 1,
      priceMax: 50,
      inStock: true,
    }, 0, 5);

    logger.log(`Search Results:`);
    logger.log(`- Total hits: ${searchResult.totalHits}`);
    logger.log(`- Products returned: ${searchResult.products.length}`);
    
    searchResult.products.forEach((product, index) => {
      logger.log(`${index + 1}. ${product.title} by ${product.author || 'Unknown'}`);
      logger.log(`   Price: ${product.currency} ${product.price}`);
      logger.log(`   Image: ${product.imageUrl ? 'Yes' : 'No'}`);
      logger.log(`   In Stock: ${product.inStock}`);
      logger.log('');
    });

    await app.close();
    logger.log('Test completed successfully!');

  } catch (error) {
    logger.error(`Test failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  testBookCollection();
}