#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WorldOfBooksApiService } from '../modules/scraping/world-of-books-api.service';
import { ScrapingService } from '../modules/scraping/scraping.service';
import { Logger } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';
import { Navigation } from '../database/entities/navigation.entity';

interface CollectionStats {
  totalProducts: number;
  totalCategories: number;
  totalNavigations: number;
  productsWithImages: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  topAuthors: Array<{ author: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
}

class BookDatasetCollector {
  private readonly logger = new Logger(BookDatasetCollector.name);
  private readonly targetProductCount = 1000;
  private readonly batchSize = 100;
  private readonly maxRetries = 3;
  private readonly delayBetweenBatches = 2000; // 2 seconds

  constructor(
    private readonly apiService: WorldOfBooksApiService,
    private readonly scrapingService: ScrapingService,
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: Repository<Category>,
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async collectDataset(): Promise<CollectionStats> {
    this.logger.log(`Starting collection of ${this.targetProductCount} book records...`);

    try {
      // Step 1: Create navigation categories
      await this.createNavigationStructure();

      // Step 2: Collect diverse book data
      const products = await this.collectDiverseBooks();

      // Step 3: Generate statistics
      const stats = await this.generateStats();

      this.logger.log(`Dataset collection completed successfully!`);
      this.logger.log(`Collected ${stats.totalProducts} products with ${stats.productsWithImages} images`);

      return stats;
    } catch (error) {
      this.logger.error(`Dataset collection failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async createNavigationStructure(): Promise<void> {
    this.logger.log('Creating navigation structure...');

    const navigationItems = [
      { title: 'Fiction', slug: 'fiction', categories: ['Literary Fiction', 'Science Fiction', 'Fantasy', 'Mystery & Thriller', 'Romance', 'Historical Fiction'] },
      { title: 'Non-Fiction', slug: 'non-fiction', categories: ['Biography', 'History', 'Science', 'Self-Help', 'Business', 'Philosophy'] },
      { title: 'Academic', slug: 'academic', categories: ['Textbooks', 'Reference', 'Research', 'Educational'] },
      { title: 'Children\'s Books', slug: 'childrens-books', categories: ['Picture Books', 'Young Adult', 'Educational', 'Adventure'] },
    ];

    for (const navItem of navigationItems) {
      // Create or update navigation
      let navigation = await this.navigationRepository.findOne({ where: { slug: navItem.slug } });
      if (!navigation) {
        navigation = this.navigationRepository.create({
          title: navItem.title,
          slug: navItem.slug,
          sourceUrl: `https://www.worldofbooks.com/en-gb/category/${navItem.slug}`,
          lastScrapedAt: new Date(),
        });
        navigation = await this.navigationRepository.save(navigation);
        this.logger.log(`Created navigation: ${navItem.title}`);
      }

      // Create categories
      for (const categoryTitle of navItem.categories) {
        const categorySlug = categoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let category = await this.categoryRepository.findOne({ where: { slug: categorySlug } });
        
        if (!category) {
          category = this.categoryRepository.create({
            navigationId: navigation.id,
            title: categoryTitle,
            slug: categorySlug,
            sourceUrl: `https://www.worldofbooks.com/en-gb/category/${navItem.slug}/${categorySlug}`,
            lastScrapedAt: new Date(),
          });
          await this.categoryRepository.save(category);
          this.logger.log(`Created category: ${categoryTitle}`);
        }
      }
    }
  }

  private async collectDiverseBooks(): Promise<Product[]> {
    this.logger.log('Starting diverse book collection...');
    
    const allProducts: Product[] = [];
    const searchQueries = this.generateSearchQueries();
    const categories = await this.categoryRepository.find();

    let totalCollected = 0;
    let queryIndex = 0;

    while (totalCollected < this.targetProductCount && queryIndex < searchQueries.length) {
      const query = searchQueries[queryIndex];
      this.logger.log(`Processing query ${queryIndex + 1}/${searchQueries.length}: "${query}"`);

      try {
        const batchProducts = await this.collectBooksForQuery(
          query, 
          Math.min(this.batchSize, this.targetProductCount - totalCollected),
          categories
        );

        allProducts.push(...batchProducts);
        totalCollected += batchProducts.length;

        this.logger.log(`Collected ${batchProducts.length} books for query "${query}". Total: ${totalCollected}/${this.targetProductCount}`);

        // Delay between batches to be respectful
        if (queryIndex < searchQueries.length - 1) {
          await this.delay(this.delayBetweenBatches);
        }

      } catch (error) {
        this.logger.warn(`Failed to collect books for query "${query}": ${error.message}`);
      }

      queryIndex++;
    }

    // If we still need more books, collect random books
    if (totalCollected < this.targetProductCount) {
      this.logger.log(`Collecting additional random books to reach target...`);
      const additionalBooks = await this.collectRandomBooks(
        this.targetProductCount - totalCollected,
        categories
      );
      allProducts.push(...additionalBooks);
    }

    this.logger.log(`Book collection completed. Total collected: ${allProducts.length}`);
    return allProducts;
  }

  private generateSearchQueries(): string[] {
    return [
      // Popular fiction authors
      'Stephen King', 'J.K. Rowling', 'George R.R. Martin', 'Agatha Christie', 'Dan Brown',
      'John Grisham', 'James Patterson', 'Lee Child', 'Gillian Flynn', 'Haruki Murakami',
      
      // Classic literature
      'Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain', 'Ernest Hemingway',
      'F. Scott Fitzgerald', 'George Orwell', 'Harper Lee', 'J.R.R. Tolkien', 'Virginia Woolf',
      
      // Non-fiction topics
      'biography', 'history', 'science', 'psychology', 'philosophy', 'business',
      'self help', 'cooking', 'travel', 'art', 'music', 'politics',
      
      // Academic subjects
      'mathematics', 'physics', 'chemistry', 'biology', 'computer science',
      'engineering', 'medicine', 'law', 'economics', 'sociology',
      
      // Genres
      'mystery', 'thriller', 'romance', 'fantasy', 'science fiction',
      'horror', 'adventure', 'historical', 'contemporary', 'literary',
      
      // Children's and YA
      'children books', 'young adult', 'picture books', 'educational',
      'Dr. Seuss', 'Roald Dahl', 'Rick Riordan', 'Suzanne Collins',
      
      // Popular series and franchises
      'Harry Potter', 'Lord of the Rings', 'Game of Thrones', 'Hunger Games',
      'Twilight', 'Sherlock Holmes', 'Marvel', 'Star Wars',
      
      // Publishers and imprints
      'Penguin Classics', 'Oxford', 'Cambridge', 'Norton', 'Vintage',
      
      // General terms for variety
      'bestseller', 'award winner', 'classic', 'new release', 'popular'
    ];
  }

  private async collectBooksForQuery(
    query: string, 
    maxBooks: number, 
    categories: Category[]
  ): Promise<Product[]> {
    const products: Product[] = [];
    let page = 0;
    const maxPages = Math.ceil(maxBooks / 20); // Algolia returns ~20 results per page

    while (products.length < maxBooks && page < maxPages) {
      try {
        const searchResult = await this.apiService.searchProducts({
          query,
          priceMin: 0.99, // Minimum price to filter out free/invalid items
          priceMax: 200,  // Maximum reasonable book price
          inStock: true,
        }, page, Math.min(20, maxBooks - products.length));

        if (!searchResult || searchResult.products.length === 0) {
          break;
        }

        for (const productData of searchResult.products) {
          if (products.length >= maxBooks) break;

          try {
            // Skip if we already have this product
            const existingProduct = await this.productRepository.findOne({
              where: { sourceId: productData.sourceId }
            });
            
            if (existingProduct) {
              continue;
            }

            // Assign to a relevant category
            const category = this.findBestCategory(productData, categories);
            
            const product = this.productRepository.create({
              sourceId: productData.sourceId,
              categoryId: category?.id,
              title: productData.title,
              author: productData.author,
              price: productData.price,
              currency: productData.currency,
              imageUrl: productData.imageUrl,
              sourceUrl: productData.sourceUrl,
              inStock: productData.inStock,
              lastScrapedAt: new Date(),
            });

            const savedProduct = await this.productRepository.save(product);
            products.push(savedProduct);

            if (products.length % 10 === 0) {
              this.logger.debug(`Saved ${products.length} products for query "${query}"`);
            }

          } catch (error) {
            this.logger.warn(`Failed to save product: ${error.message}`);
          }
        }

        page++;
        
        // Small delay between pages
        await this.delay(500);

      } catch (error) {
        this.logger.warn(`Failed to fetch page ${page} for query "${query}": ${error.message}`);
        break;
      }
    }

    return products;
  }

  private async collectRandomBooks(count: number, categories: Category[]): Promise<Product[]> {
    this.logger.log(`Collecting ${count} random books...`);
    
    const products: Product[] = [];
    const randomQueries = ['book', 'novel', 'story', 'guide', 'manual', 'textbook'];
    
    for (let i = 0; i < count && i < 200; i++) { // Limit to prevent infinite loops
      try {
        const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
        const randomPage = Math.floor(Math.random() * 50); // Random page up to 50
        
        const searchResult = await this.apiService.searchProducts({
          query: randomQuery,
          priceMin: 0.99,
          priceMax: 200,
          inStock: true,
        }, randomPage, 1);

        if (searchResult && searchResult.products.length > 0) {
          const productData = searchResult.products[0];
          
          // Check if we already have this product
          const existingProduct = await this.productRepository.findOne({
            where: { sourceId: productData.sourceId }
          });
          
          if (!existingProduct) {
            const category = this.findBestCategory(productData, categories);
            
            const product = this.productRepository.create({
              sourceId: productData.sourceId,
              categoryId: category?.id,
              title: productData.title,
              author: productData.author,
              price: productData.price,
              currency: productData.currency,
              imageUrl: productData.imageUrl,
              sourceUrl: productData.sourceUrl,
              inStock: productData.inStock,
              lastScrapedAt: new Date(),
            });

            const savedProduct = await this.productRepository.save(product);
            products.push(savedProduct);
          }
        }

        // Small delay between requests
        await this.delay(200);

      } catch (error) {
        this.logger.warn(`Failed to collect random book ${i}: ${error.message}`);
      }
    }

    return products;
  }

  private findBestCategory(productData: any, categories: Category[]): Category | null {
    const title = productData.title.toLowerCase();
    const author = (productData.author || '').toLowerCase();
    
    // Simple category matching based on keywords
    const categoryKeywords = {
      'fiction': ['novel', 'story', 'fiction', 'tale'],
      'science-fiction': ['sci-fi', 'science fiction', 'space', 'future', 'robot', 'alien'],
      'fantasy': ['fantasy', 'magic', 'dragon', 'wizard', 'quest', 'realm'],
      'mystery-thriller': ['mystery', 'thriller', 'detective', 'crime', 'murder', 'suspense'],
      'romance': ['romance', 'love', 'heart', 'passion'],
      'historical-fiction': ['historical', 'history', 'war', 'century', 'ancient'],
      'biography': ['biography', 'life', 'memoir', 'autobiography'],
      'history': ['history', 'historical', 'war', 'ancient', 'civilization'],
      'science': ['science', 'physics', 'chemistry', 'biology', 'research'],
      'self-help': ['self help', 'guide', 'how to', 'improve', 'success'],
      'business': ['business', 'management', 'leadership', 'entrepreneur', 'finance'],
      'philosophy': ['philosophy', 'wisdom', 'ethics', 'meaning', 'existence'],
      'textbooks': ['textbook', 'edition', 'course', 'study', 'academic'],
      'childrens-books': ['children', 'kids', 'young', 'picture book'],
      'young-adult': ['young adult', 'teen', 'teenager', 'ya'],
    };

    for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || author.includes(keyword))) {
        const category = categories.find(c => c.slug === categorySlug);
        if (category) return category;
      }
    }

    // Default to fiction if no specific match
    return categories.find(c => c.slug === 'fiction') || categories[0] || null;
  }

  private async generateStats(): Promise<CollectionStats> {
    this.logger.log('Generating collection statistics...');

    const totalProducts = await this.productRepository.count();
    const totalCategories = await this.categoryRepository.count();
    const totalNavigations = await this.navigationRepository.count();

    const productsWithImages = await this.productRepository.count({
      where: { 
        imageUrl: Not(IsNull())
      }
    });

    // Price statistics
    const priceStats = await this.productRepository
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'avg')
      .addSelect('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .where('product.price > 0')
      .getRawOne();

    // Top authors
    const topAuthors = await this.productRepository
      .createQueryBuilder('product')
      .select('product.author', 'author')
      .addSelect('COUNT(*)', 'count')
      .where('product.author IS NOT NULL')
      .groupBy('product.author')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Get categories with product counts
    const categoriesWithCounts = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin(Product, 'product', 'product.categoryId = category.id')
      .select('category.title', 'category')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('category.id, category.title')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalProducts,
      totalCategories,
      totalNavigations,
      productsWithImages,
      averagePrice: parseFloat(priceStats?.avg || '0'),
      priceRange: {
        min: parseFloat(priceStats?.min || '0'),
        max: parseFloat(priceStats?.max || '0'),
      },
      topAuthors: topAuthors.map(a => ({ author: a.author, count: parseInt(a.count) })),
      topCategories: categoriesWithCounts.map(c => ({ category: c.category, count: parseInt(c.count) })),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const logger = new Logger('BookDatasetCollector');
  
  try {
    logger.log('Initializing NestJS application...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const apiService = app.get(WorldOfBooksApiService);
    const scrapingService = app.get(ScrapingService);
    const productRepository = app.get(getRepositoryToken(Product));
    const categoryRepository = app.get(getRepositoryToken(Category));
    const navigationRepository = app.get(getRepositoryToken(Navigation));

    const collector = new BookDatasetCollector(
      apiService,
      scrapingService,
      productRepository,
      categoryRepository,
      navigationRepository,
    );

    const stats = await collector.collectDataset();

    logger.log('=== DATASET COLLECTION COMPLETE ===');
    logger.log(`Total Products: ${stats.totalProducts}`);
    logger.log(`Products with Images: ${stats.productsWithImages}`);
    logger.log(`Total Categories: ${stats.totalCategories}`);
    logger.log(`Total Navigations: ${stats.totalNavigations}`);
    logger.log(`Average Price: $${stats.averagePrice.toFixed(2)}`);
    logger.log(`Price Range: $${stats.priceRange.min} - $${stats.priceRange.max}`);
    logger.log(`Top Authors: ${stats.topAuthors.slice(0, 5).map(a => `${a.author} (${a.count})`).join(', ')}`);
    logger.log(`Top Categories: ${stats.topCategories.slice(0, 5).map(c => `${c.category} (${c.count})`).join(', ')}`);

    await app.close();
    process.exit(0);

  } catch (error) {
    logger.error(`Dataset collection failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}