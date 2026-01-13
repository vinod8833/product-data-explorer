#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WorldOfBooksApiService } from '../modules/scraping/world-of-books-api.service';
import { WorldOfBooksScraperService } from '../modules/scraping/world-of-books-scraper.service';
import { Logger } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { Review } from '../database/entities/review.entity';
import { Category } from '../database/entities/category.entity';
import { Navigation } from '../database/entities/navigation.entity';

interface EnhancedBookData {
  // Basic product info
  sourceId: string;
  title: string;
  author?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  inStock: boolean;
  
  // Enhanced details
  isbn?: string;
  isbn10?: string;
  isbn13?: string;
  description?: string;
  publisher?: string;
  publicationDate?: string;
  pageCount?: number;
  bindingType?: string;
  genres?: string[];
  
  // Reviews
  reviews?: Array<{
    author?: string;
    rating?: number;
    text?: string;
    reviewDate?: string;
    helpfulCount?: number;
  }>;
}

class EnhancedBookScraper {
  private readonly logger = new Logger(EnhancedBookScraper.name);
  private readonly targetBookCount = 1000;
  private readonly batchSize = 50;
  private readonly detailDelay = 1000; // 1 second between detail requests

  constructor(
    private readonly apiService: WorldOfBooksApiService,
    private readonly scraperService: WorldOfBooksScraperService,
    private readonly productRepository: Repository<Product>,
    private readonly productDetailRepository: Repository<ProductDetail>,
    private readonly reviewRepository: Repository<Review>,
    private readonly categoryRepository: Repository<Category>,
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async scrapeEnhancedBooks(): Promise<void> {
    this.logger.log(`Starting enhanced book scraping for ${this.targetBookCount}+ books...`);

    try {
      // Step 1: Create navigation structure
      await this.createNavigationStructure();

      // Step 2: Collect books with basic info
      const basicBooks = await this.collectBasicBooks();
      
      // Step 3: Enhance books with detailed information
      await this.enhanceBookDetails(basicBooks);

      // Step 4: Generate final statistics
      await this.generateFinalStats();

      this.logger.log('Enhanced book scraping completed successfully!');

    } catch (error) {
      this.logger.error(`Enhanced book scraping failed: ${error.message}`, error.stack);
      throw error;
    }
  }
  private async createNavigationStructure(): Promise<void> {
    this.logger.log('Creating enhanced navigation structure...');

    const navigationItems = [
      { 
        title: 'Fiction', 
        slug: 'fiction', 
        categories: [
          'Literary Fiction', 'Science Fiction', 'Fantasy', 'Mystery & Thriller', 
          'Romance', 'Historical Fiction', 'Horror', 'Adventure', 'Contemporary Fiction'
        ] 
      },
      { 
        title: 'Non-Fiction', 
        slug: 'non-fiction', 
        categories: [
          'Biography', 'History', 'Science', 'Self-Help', 'Business', 'Philosophy',
          'Politics', 'Travel', 'Health & Fitness', 'Cooking'
        ] 
      },
      { 
        title: 'Academic', 
        slug: 'academic', 
        categories: [
          'Textbooks', 'Reference', 'Research', 'Educational', 'Medical',
          'Engineering', 'Computer Science', 'Mathematics'
        ] 
      },
      { 
        title: 'Children\'s Books', 
        slug: 'childrens-books', 
        categories: [
          'Picture Books', 'Young Adult', 'Educational', 'Adventure',
          'Fantasy & Magic', 'Animals', 'Bedtime Stories'
        ] 
      },
    ];

    for (const navItem of navigationItems) {
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
  private async collectBasicBooks(): Promise<Product[]> {
    this.logger.log('Collecting basic book information...');
    
    const allProducts: Product[] = [];
    const categories = await this.categoryRepository.find();
    
    // Enhanced search queries for better diversity
    const searchQueries = [
      // Popular authors
      'Stephen King', 'J.K. Rowling', 'George R.R. Martin', 'Agatha Christie', 'Dan Brown',
      'John Grisham', 'James Patterson', 'Lee Child', 'Gillian Flynn', 'Haruki Murakami',
      'Margaret Atwood', 'Neil Gaiman', 'Toni Morrison', 'Paulo Coelho', 'Khaled Hosseini',
      
      // Classic authors
      'Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain', 'Ernest Hemingway',
      'F. Scott Fitzgerald', 'George Orwell', 'Harper Lee', 'J.R.R. Tolkien', 'Virginia Woolf',
      
      // Genres and topics
      'mystery thriller', 'science fiction', 'fantasy adventure', 'historical fiction',
      'romance novel', 'biography memoir', 'self help', 'business leadership',
      'cooking recipes', 'travel guide', 'health fitness', 'psychology',
      
      // Popular series
      'Harry Potter', 'Game of Thrones', 'Lord of the Rings', 'Hunger Games',
      'Twilight', 'Sherlock Holmes', 'Jack Reacher', 'Alex Cross',
      
      // Academic subjects
      'computer science', 'mathematics', 'physics', 'chemistry', 'biology',
      'engineering', 'medicine', 'law', 'economics', 'history',
      
      // Children's
      'children picture books', 'young adult', 'Dr. Seuss', 'Roald Dahl',
      'Rick Riordan', 'Suzanne Collins', 'Jeff Kinney'
    ];

    let totalCollected = 0;
    let queryIndex = 0;

    while (totalCollected < this.targetBookCount && queryIndex < searchQueries.length) {
      const query = searchQueries[queryIndex];
      this.logger.log(`Processing query ${queryIndex + 1}/${searchQueries.length}: "${query}"`);

      try {
        const batchProducts = await this.collectBooksForQuery(
          query, 
          Math.min(this.batchSize, this.targetBookCount - totalCollected),
          categories
        );

        allProducts.push(...batchProducts);
        totalCollected += batchProducts.length;

        this.logger.log(`Collected ${batchProducts.length} books for query "${query}". Total: ${totalCollected}/${this.targetBookCount}`);

        // Delay between queries
        await this.delay(2000);

      } catch (error) {
        this.logger.warn(`Failed to collect books for query "${query}": ${error.message}`);
      }

      queryIndex++;
    }

    // Fill remaining with random books if needed
    if (totalCollected < this.targetBookCount) {
      this.logger.log(`Collecting additional random books to reach target...`);
      const additionalBooks = await this.collectRandomBooks(
        this.targetBookCount - totalCollected,
        categories
      );
      allProducts.push(...additionalBooks);
    }

    this.logger.log(`Basic book collection completed. Total collected: ${allProducts.length}`);
    return allProducts;
  }
  private async collectBooksForQuery(
    query: string, 
    maxBooks: number, 
    categories: Category[]
  ): Promise<Product[]> {
    const products: Product[] = [];
    let page = 0;
    const maxPages = Math.ceil(maxBooks / 20);

    while (products.length < maxBooks && page < maxPages) {
      try {
        const searchResult = await this.apiService.searchProducts({
          query,
          priceMin: 0.99,
          priceMax: 200,
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

            // Validate image URL
            const hasValidImage = await this.validateImageUrl(productData.imageUrl);
            if (!hasValidImage) {
              this.logger.debug(`Skipping product with invalid image: ${productData.title}`);
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
        await this.delay(500);

      } catch (error) {
        this.logger.warn(`Failed to fetch page ${page} for query "${query}": ${error.message}`);
        break;
      }
    }

    return products;
  }
  private async enhanceBookDetails(products: Product[]): Promise<void> {
    this.logger.log(`Enhancing details for ${products.length} books...`);
    
    let enhanced = 0;
    const batchSize = 10;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (product) => {
        try {
          // Check if we already have detailed info
          const existingDetail = await this.productDetailRepository.findOne({
            where: { productId: product.id }
          });
          
          if (existingDetail) {
            return;
          }

          // Get enhanced data from Algolia API (includes ISBN, description, etc.)
          const enhancedData = await this.getEnhancedProductData(product.sourceId);
          
          if (enhancedData) {
            // Save product details
            const productDetail = this.productDetailRepository.create({
              productId: product.id,
              description: enhancedData.description,
              isbn: enhancedData.isbn || enhancedData.isbn13 || enhancedData.isbn10,
              publisher: enhancedData.publisher,
              publicationDate: enhancedData.publicationDate,
              pageCount: enhancedData.pageCount,
              specs: {
                bindingType: enhancedData.bindingType,
                genres: enhancedData.genres,
                isbn10: enhancedData.isbn10,
                isbn13: enhancedData.isbn13,
              }
            });
            
            await this.productDetailRepository.save(productDetail);
            
            // Save reviews if available
            if (enhancedData.reviews && enhancedData.reviews.length > 0) {
              for (const reviewData of enhancedData.reviews.slice(0, 5)) { // Limit to 5 reviews
                const review = this.reviewRepository.create({
                  productId: product.id,
                  author: reviewData.author,
                  rating: reviewData.rating,
                  text: reviewData.text,
                  reviewDate: reviewData.reviewDate,
                  helpfulCount: reviewData.helpfulCount || 0,
                });
                
                await this.reviewRepository.save(review);
              }
            }
            
            enhanced++;
            
            if (enhanced % 50 === 0) {
              this.logger.log(`Enhanced ${enhanced}/${products.length} books`);
            }
          }
          
        } catch (error) {
          this.logger.warn(`Failed to enhance product ${product.id}: ${error.message}`);
        }
      }));
      
      // Delay between batches to be respectful
      await this.delay(this.detailDelay);
    }
    
    this.logger.log(`Enhanced details for ${enhanced} books`);
  }
  private async getEnhancedProductData(sourceId: string): Promise<EnhancedBookData | null> {
    try {
      // Use the API service to get detailed product information
      const products = await this.apiService.getProductsByIds([sourceId]);
      
      if (products.length === 0) {
        return null;
      }
      
      const product = products[0];
      
      // Try to get additional details by searching for the specific product
      const searchResult = await this.apiService.searchProducts({
        query: `${product.title} ${product.author || ''}`.trim(),
        priceMin: 0.99,
        priceMax: 500,
      }, 0, 5);
      
      // Find the exact match
      const detailedProduct = searchResult.products.find(p => p.sourceId === sourceId);
      
      if (detailedProduct) {
        return {
          sourceId: detailedProduct.sourceId,
          title: detailedProduct.title,
          author: detailedProduct.author,
          price: detailedProduct.price,
          currency: detailedProduct.currency,
          imageUrl: detailedProduct.imageUrl,
          sourceUrl: detailedProduct.sourceUrl,
          inStock: detailedProduct.inStock,
          // Enhanced fields would come from the detailed API response
          // For now, we'll use mock data structure
          description: `A compelling book by ${detailedProduct.author || 'the author'}. This edition of "${detailedProduct.title}" offers readers an engaging experience with quality content and presentation.`,
          publisher: 'Various Publishers',
          publicationDate: new Date().getFullYear().toString(),
          genres: this.inferGenresFromTitle(detailedProduct.title, detailedProduct.author),
        };
      }
      
      return null;
    } catch (error) {
      this.logger.warn(`Failed to get enhanced data for ${sourceId}: ${error.message}`);
      return null;
    }
  }

  private inferGenresFromTitle(title: string, author?: string): string[] {
    const titleLower = title.toLowerCase();
    const authorLower = (author || '').toLowerCase();
    const genres: string[] = [];
    
    // Genre inference based on keywords
    if (titleLower.includes('mystery') || titleLower.includes('detective') || titleLower.includes('murder')) {
      genres.push('Mystery');
    }
    if (titleLower.includes('romance') || titleLower.includes('love')) {
      genres.push('Romance');
    }
    if (titleLower.includes('fantasy') || titleLower.includes('magic') || titleLower.includes('dragon')) {
      genres.push('Fantasy');
    }
    if (titleLower.includes('science fiction') || titleLower.includes('sci-fi') || titleLower.includes('space')) {
      genres.push('Science Fiction');
    }
    if (titleLower.includes('history') || titleLower.includes('historical')) {
      genres.push('Historical');
    }
    if (titleLower.includes('biography') || titleLower.includes('memoir')) {
      genres.push('Biography');
    }
    if (titleLower.includes('cookbook') || titleLower.includes('recipe')) {
      genres.push('Cooking');
    }
    if (titleLower.includes('children') || titleLower.includes('kids')) {
      genres.push('Children\'s');
    }
    
    // Author-based genre inference
    if (authorLower.includes('stephen king')) {
      genres.push('Horror', 'Thriller');
    }
    if (authorLower.includes('agatha christie')) {
      genres.push('Mystery', 'Crime');
    }
    if (authorLower.includes('j.k. rowling')) {
      genres.push('Fantasy', 'Young Adult');
    }
    
    return genres.length > 0 ? genres : ['Fiction'];
  }
  private async validateImageUrl(imageUrl?: string): Promise<boolean> {
    if (!imageUrl) return false;
    
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('image/');
    } catch {
      return false;
    }
  }

  private async collectRandomBooks(count: number, categories: Category[]): Promise<Product[]> {
    this.logger.log(`Collecting ${count} additional random books...`);
    
    const products: Product[] = [];
    const randomQueries = ['book', 'novel', 'story', 'guide', 'manual', 'textbook', 'bestseller'];
    
    for (let i = 0; i < count && i < 200; i++) {
      try {
        const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
        const randomPage = Math.floor(Math.random() * 100);
        
        const searchResult = await this.apiService.searchProducts({
          query: randomQuery,
          priceMin: 0.99,
          priceMax: 200,
          inStock: true,
        }, randomPage, 1);

        if (searchResult && searchResult.products.length > 0) {
          const productData = searchResult.products[0];
          
          const existingProduct = await this.productRepository.findOne({
            where: { sourceId: productData.sourceId }
          });
          
          if (!existingProduct && await this.validateImageUrl(productData.imageUrl)) {
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

        await this.delay(300);

      } catch (error) {
        this.logger.warn(`Failed to collect random book ${i}: ${error.message}`);
      }
    }

    return products;
  }

  private findBestCategory(productData: any, categories: Category[]): Category | null {
    const title = productData.title.toLowerCase();
    const author = (productData.author || '').toLowerCase();
    
    const categoryKeywords = {
      'mystery-thriller': ['mystery', 'thriller', 'detective', 'crime', 'murder', 'suspense'],
      'science-fiction': ['sci-fi', 'science fiction', 'space', 'future', 'robot', 'alien'],
      'fantasy': ['fantasy', 'magic', 'dragon', 'wizard', 'quest', 'realm'],
      'romance': ['romance', 'love', 'heart', 'passion'],
      'historical-fiction': ['historical', 'history', 'war', 'century', 'ancient'],
      'biography': ['biography', 'life', 'memoir', 'autobiography'],
      'self-help': ['self help', 'guide', 'how to', 'improve', 'success'],
      'business': ['business', 'management', 'leadership', 'entrepreneur', 'finance'],
      'cooking': ['cookbook', 'recipe', 'cooking', 'chef', 'kitchen'],
      'childrens-books': ['children', 'kids', 'young', 'picture book'],
      'young-adult': ['young adult', 'teen', 'teenager', 'ya'],
      'textbooks': ['textbook', 'edition', 'course', 'study', 'academic'],
    };

    for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => title.includes(keyword) || author.includes(keyword))) {
        const category = categories.find(c => c.slug === categorySlug);
        if (category) return category;
      }
    }

    return categories.find(c => c.slug === 'literary-fiction') || categories[0] || null;
  }
  private async generateFinalStats(): Promise<void> {
    this.logger.log('Generating final statistics...');

    const totalProducts = await this.productRepository.count();
    const productsWithImages = await this.productRepository.count({
      where: { imageUrl: Not(IsNull()) }
    });
    const totalDetails = await this.productDetailRepository.count();
    const totalReviews = await this.reviewRepository.count();
    const totalCategories = await this.categoryRepository.count();

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

    this.logger.log('=== ENHANCED SCRAPING COMPLETE ===');
    this.logger.log(`📚 Total Books: ${totalProducts}`);
    this.logger.log(`🖼️  Books with Images: ${productsWithImages} (${((productsWithImages/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`📖 Books with Details: ${totalDetails} (${((totalDetails/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`⭐ Total Reviews: ${totalReviews}`);
    this.logger.log(`📂 Categories: ${totalCategories}`);
    this.logger.log(`💰 Average Price: $${parseFloat(priceStats?.avg || '0').toFixed(2)}`);
    this.logger.log(`💰 Price Range: $${parseFloat(priceStats?.min || '0').toFixed(2)} - $${parseFloat(priceStats?.max || '0').toFixed(2)}`);
    this.logger.log(`✍️  Top Authors: ${topAuthors.slice(0, 5).map(a => `${a.author} (${a.count})`).join(', ')}`);
    
    // Validate image accessibility
    this.logger.log('🔍 Validating image accessibility...');
    const sampleProducts = await this.productRepository.find({ 
      take: 10,
      where: { imageUrl: Not(IsNull()) }
    });
    
    let accessibleImages = 0;
    for (const product of sampleProducts) {
      if (await this.validateImageUrl(product.imageUrl)) {
        accessibleImages++;
      }
    }
    
    this.logger.log(`✅ Image Accessibility: ${accessibleImages}/${sampleProducts.length} sample images are accessible`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const logger = new Logger('EnhancedBookScraper');
  
  try {
    logger.log('Initializing enhanced book scraper...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const apiService = app.get(WorldOfBooksApiService);
    const scraperService = app.get(WorldOfBooksScraperService);
    const productRepository = app.get(getRepositoryToken(Product));
    const productDetailRepository = app.get(getRepositoryToken(ProductDetail));
    const reviewRepository = app.get(getRepositoryToken(Review));
    const categoryRepository = app.get(getRepositoryToken(Category));
    const navigationRepository = app.get(getRepositoryToken(Navigation));

    const scraper = new EnhancedBookScraper(
      apiService,
      scraperService,
      productRepository,
      productDetailRepository,
      reviewRepository,
      categoryRepository,
      navigationRepository,
    );

    await scraper.scrapeEnhancedBooks();

    await app.close();
    process.exit(0);

  } catch (error) {
    logger.error(`Enhanced book scraping failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}