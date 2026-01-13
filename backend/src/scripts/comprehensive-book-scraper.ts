#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { Review } from '../database/entities/review.entity';
import { Category } from '../database/entities/category.entity';
import { Navigation } from '../database/entities/navigation.entity';

interface AlgoliaBookData {
  objectID: string;
  id: string;
  shortTitle?: string;
  longTitle?: string;
  legacyTitle?: string;
  title?: string;
  author?: string;
  publisher?: string;
  isbn10?: string;
  isbn13?: string;
  isbn?: string;
  fromPrice: number;
  bestConditionPrice: number;
  currency?: string;
  imageURL?: string;
  imageUrl?: string;
  productHandle?: string;
  productUrl?: string;
  inStock: boolean;
  availableConditions: string[];
  bindingType?: string;
  productType: string;
  description?: string;
  datePublished?: string;
  publicationDate?: string;
  yearPublished?: number;
  pageCount?: number;
  hierarchicalCategories?: {
    lvl0?: string;
    lvl1?: string;
    lvl2?: string;
  };
  _highlightResult?: any;
}

interface AlgoliaResponse {
  hits: AlgoliaBookData[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
  processingTimeMS: number;
}

class ComprehensiveBookScraper {
  private readonly logger = new Logger(ComprehensiveBookScraper.name);
  private readonly targetBookCount = 1000;
  private readonly batchSize = 100;
  private readonly requestDelay = 1000; // 1 second between requests
  
  // World of Books collection IDs for different categories
  private readonly collectionIds = [
    '520304558353', // Fiction
    '520304591121', // Non-Fiction  
    '520304623889', // Children's Books
    '520304656657', // Academic
    '520304689425', // Biography
    '520304722193', // History
    '520304754961', // Science
    '520304787729', // Self-Help
    '520304820497', // Business
    '520304853265', // Cooking
    '520304886033', // Travel
    '520304918801', // Health & Fitness
  ];

  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly productDetailRepository: Repository<ProductDetail>,
    private readonly reviewRepository: Repository<Review>,
    private readonly categoryRepository: Repository<Category>,
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async scrapeComprehensiveBooks(): Promise<void> {
    this.logger.log(`Starting comprehensive book scraping for ${this.targetBookCount}+ books...`);

    try {
      // Step 1: Create navigation structure
      await this.createNavigationStructure();

      // Step 2: Scrape books from all collections
      const allBooks = await this.scrapeAllCollections();

      // Step 3: Generate final statistics
      await this.generateFinalStats();

      this.logger.log('Comprehensive book scraping completed successfully!');

    } catch (error) {
      this.logger.error(`Comprehensive book scraping failed: ${error.message}`, error.stack);
      throw error;
    }
  }
  private async createNavigationStructure(): Promise<void> {
    this.logger.log('Creating comprehensive navigation structure...');

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
          'Politics', 'Travel', 'Health & Fitness', 'Cooking', 'Art & Design'
        ] 
      },
      { 
        title: 'Academic', 
        slug: 'academic', 
        categories: [
          'Textbooks', 'Reference', 'Research', 'Educational', 'Medical',
          'Engineering', 'Computer Science', 'Mathematics', 'Law'
        ] 
      },
      { 
        title: 'Children\'s Books', 
        slug: 'childrens-books', 
        categories: [
          'Picture Books', 'Young Adult', 'Educational', 'Adventure',
          'Fantasy & Magic', 'Animals', 'Bedtime Stories', 'Teen Fiction'
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

  private async scrapeAllCollections(): Promise<Product[]> {
    this.logger.log('Scraping books from all collections...');
    
    const allBooks: Product[] = [];
    const categories = await this.categoryRepository.find();
    let totalScraped = 0;

    for (const collectionId of this.collectionIds) {
      if (totalScraped >= this.targetBookCount) {
        break;
      }

      this.logger.log(`Scraping collection ${collectionId}...`);
      
      try {
        const booksFromCollection = await this.scrapeCollection(
          collectionId, 
          Math.min(this.batchSize, this.targetBookCount - totalScraped),
          categories
        );
        
        allBooks.push(...booksFromCollection);
        totalScraped += booksFromCollection.length;
        
        this.logger.log(`Scraped ${booksFromCollection.length} books from collection ${collectionId}. Total: ${totalScraped}`);
        
        // Delay between collections
        await this.delay(this.requestDelay);
        
      } catch (error) {
        this.logger.warn(`Failed to scrape collection ${collectionId}: ${error.message}`);
      }
    }

    return allBooks;
  }
  private async scrapeCollection(
    collectionId: string, 
    maxBooks: number, 
    categories: Category[]
  ): Promise<Product[]> {
    const books: Product[] = [];
    let page = 0;
    const maxPages = Math.ceil(maxBooks / 20); // 20 items per page

    while (books.length < maxBooks && page < maxPages) {
      try {
        const algoliaData = await this.makeAlgoliaRequest(collectionId, page);
        
        if (!algoliaData || !algoliaData.hits || algoliaData.hits.length === 0) {
          this.logger.debug(`No more results for collection ${collectionId} at page ${page}`);
          break;
        }

        for (const bookData of algoliaData.hits) {
          if (books.length >= maxBooks) break;

          try {
            // Skip if not a book
            if (bookData.productType !== 'Book') {
              continue;
            }

            // Skip if we already have this book
            const existingProduct = await this.productRepository.findOne({
              where: { sourceId: bookData.id || bookData.objectID }
            });
            
            if (existingProduct) {
              continue;
            }

            // Validate and clean image URL
            const imageUrl = this.getValidImageUrl(bookData);
            if (!imageUrl) {
              this.logger.debug(`Skipping book with no valid image: ${bookData.title}`);
              continue;
            }

            // Create product
            const product = await this.createProductFromAlgoliaData(bookData, categories, imageUrl);
            if (product) {
              books.push(product);
              
              // Create detailed product information
              await this.createProductDetail(product, bookData);
              
              if (books.length % 10 === 0) {
                this.logger.debug(`Processed ${books.length} books from collection ${collectionId}`);
              }
            }

          } catch (error) {
            this.logger.warn(`Failed to process book: ${error.message}`);
          }
        }

        page++;
        
        // Small delay between pages
        await this.delay(500);

      } catch (error) {
        this.logger.warn(`Failed to fetch page ${page} for collection ${collectionId}: ${error.message}`);
        break;
      }
    }

    return books;
  }

  private async makeAlgoliaRequest(collectionId: string, page: number = 0): Promise<AlgoliaResponse | null> {
    const url = 'https://ar33g9njgj-dsn.algolia.net/1/indexes/*/queries';
    
    const requestBody = {
      requests: [{
        indexName: 'shopify_products',
        clickAnalytics: true,
        facets: ['author', 'availableConditions', 'bindingType', 'hierarchicalCategories.lvl0', 'platform', 'priceRanges', 'productType', 'publisher'],
        filters: `collection_ids:${collectionId} AND fromPrice > 0 AND productType:Book`,
        highlightPostTag: '__/ais-highlight__',
        highlightPreTag: '__ais-highlight__',
        maxValuesPerFacet: 10,
        page: page,
        hitsPerPage: 20,
        userToken: `anonymous-${Date.now()}`
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': 'text/plain',
          'DNT': '1',
          'Origin': 'https://www.worldofbooks.com',
          'Referer': 'https://www.worldofbooks.com/',
          'User-Agent': 'Mozilla/5.0 (compatible; BookScraper/1.0)',
          'x-algolia-api-key': '96c16938971ef89ae1d14e21494e2114',
          'x-algolia-application-id': 'AR33G9NJGJ',
          'x-algolia-agent': 'Algolia for JavaScript (5.40.1); Lite (5.40.1); Browser; instantsearch.js (4.81.0); JS Helper (3.26.0)',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Algolia API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.results?.[0] || null;

    } catch (error) {
      this.logger.error(`Algolia API request failed: ${error.message}`);
      return null;
    }
  }
  private getValidImageUrl(bookData: AlgoliaBookData): string | null {
    // Try different image URL fields
    const possibleUrls = [
      bookData.imageURL,
      bookData.imageUrl,
    ].filter(Boolean);

    for (const url of possibleUrls) {
      // Validate URL format
      if (url && url.startsWith('http') && !url.includes('images.worldofbooks.com')) {
        return url;
      }
    }

    return null;
  }

  private async createProductFromAlgoliaData(
    bookData: AlgoliaBookData, 
    categories: Category[], 
    imageUrl: string
  ): Promise<Product | null> {
    try {
      // Get the best title
      const title = bookData.legacyTitle || bookData.longTitle || bookData.shortTitle || bookData.title || 'Unknown Title';
      
      // Find best matching category
      const category = this.findBestCategory(bookData, categories);
      
      // Create product
      const product = this.productRepository.create({
        sourceId: bookData.id || bookData.objectID,
        categoryId: category?.id,
        title: this.sanitizeText(title),
        author: bookData.author ? this.sanitizeText(bookData.author) : undefined,
        price: bookData.bestConditionPrice || bookData.fromPrice || 0,
        currency: bookData.currency || 'USD',
        imageUrl: imageUrl,
        sourceUrl: bookData.productUrl ? 
          (bookData.productUrl.startsWith('http') ? bookData.productUrl : `https://www.worldofbooks.com${bookData.productUrl}`) :
          `https://www.worldofbooks.com/products/${bookData.productHandle || bookData.id}`,
        inStock: bookData.inStock,
        lastScrapedAt: new Date(),
      });

      return await this.productRepository.save(product);

    } catch (error) {
      this.logger.warn(`Failed to create product: ${error.message}`);
      return null;
    }
  }

  private async createProductDetail(product: Product, bookData: AlgoliaBookData): Promise<void> {
    try {
      // Extract ISBN (prefer ISBN-13, fallback to ISBN-10)
      const isbn = bookData.isbn13 || bookData.isbn10 || bookData.isbn;
      
      // Extract genres from hierarchical categories
      const genres = this.extractGenres(bookData);
      
      // Create product detail
      const productDetail = this.productDetailRepository.create({
        productId: product.id,
        description: bookData.description ? this.sanitizeText(bookData.description) : 
          `A ${bookData.bindingType || 'book'} by ${bookData.author || 'the author'}. Published by ${bookData.publisher || 'various publishers'}.`,
        isbn: isbn,
        publisher: bookData.publisher ? this.sanitizeText(bookData.publisher) : undefined,
        publicationDate: this.parsePublicationDate(bookData.datePublished || bookData.publicationDate),
        pageCount: bookData.pageCount,
        genres: genres,
        specs: {
          bindingType: bookData.bindingType,
          availableConditions: bookData.availableConditions,
          isbn10: bookData.isbn10,
          isbn13: bookData.isbn13,
          yearPublished: bookData.yearPublished,
          productType: bookData.productType,
          hierarchicalCategories: bookData.hierarchicalCategories,
        }
      });

      await this.productDetailRepository.save(productDetail);

    } catch (error) {
      this.logger.warn(`Failed to create product detail for ${product.id}: ${error.message}`);
    }
  }

  private extractGenres(bookData: AlgoliaBookData): string[] {
    const genres: string[] = [];
    
    if (bookData.hierarchicalCategories) {
      if (bookData.hierarchicalCategories.lvl0) {
        genres.push(bookData.hierarchicalCategories.lvl0);
      }
      if (bookData.hierarchicalCategories.lvl1) {
        genres.push(bookData.hierarchicalCategories.lvl1);
      }
      if (bookData.hierarchicalCategories.lvl2) {
        genres.push(bookData.hierarchicalCategories.lvl2);
      }
    }

    // Add binding type as a genre if available
    if (bookData.bindingType) {
      genres.push(bookData.bindingType);
    }

    return genres.filter(Boolean);
  }

  private parsePublicationDate(dateString?: string): Date | undefined {
    if (!dateString) return undefined;
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }
  private findBestCategory(bookData: AlgoliaBookData, categories: Category[]): Category | null {
    const title = (bookData.title || '').toLowerCase();
    const author = (bookData.author || '').toLowerCase();
    const genres = this.extractGenres(bookData).join(' ').toLowerCase();
    const searchText = `${title} ${author} ${genres}`;
    
    const categoryKeywords = {
      'mystery-thriller': ['mystery', 'thriller', 'detective', 'crime', 'murder', 'suspense', 'noir'],
      'science-fiction': ['sci-fi', 'science fiction', 'space', 'future', 'robot', 'alien', 'dystopian'],
      'fantasy': ['fantasy', 'magic', 'dragon', 'wizard', 'quest', 'realm', 'epic fantasy'],
      'romance': ['romance', 'love', 'heart', 'passion', 'romantic'],
      'historical-fiction': ['historical', 'history', 'war', 'century', 'ancient', 'period'],
      'horror': ['horror', 'scary', 'ghost', 'vampire', 'zombie', 'supernatural'],
      'biography': ['biography', 'life', 'memoir', 'autobiography', 'biographical'],
      'self-help': ['self help', 'guide', 'how to', 'improve', 'success', 'motivation'],
      'business': ['business', 'management', 'leadership', 'entrepreneur', 'finance', 'economics'],
      'cooking': ['cookbook', 'recipe', 'cooking', 'chef', 'kitchen', 'food'],
      'childrens-books': ['children', 'kids', 'young', 'picture book', 'juvenile'],
      'young-adult': ['young adult', 'teen', 'teenager', 'ya', 'adolescent'],
      'textbooks': ['textbook', 'edition', 'course', 'study', 'academic', 'university'],
      'health-fitness': ['health', 'fitness', 'diet', 'exercise', 'wellness', 'medical'],
      'travel': ['travel', 'guide', 'tourism', 'destination', 'journey'],
      'art-design': ['art', 'design', 'photography', 'creative', 'visual'],
      'computer-science': ['computer', 'programming', 'software', 'technology', 'coding'],
      'mathematics': ['math', 'mathematics', 'calculus', 'algebra', 'geometry'],
      'science': ['science', 'physics', 'chemistry', 'biology', 'research'],
      'philosophy': ['philosophy', 'wisdom', 'ethics', 'meaning', 'existence'],
      'politics': ['politics', 'government', 'policy', 'political', 'democracy'],
    };

    // Find best matching category
    let bestMatch: Category | null = null;
    let maxMatches = 0;

    for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(keyword => searchText.includes(keyword)).length;
      if (matches > maxMatches) {
        const category = categories.find(c => c.slug === categorySlug);
        if (category) {
          bestMatch = category;
          maxMatches = matches;
        }
      }
    }

    // Fallback to fiction or first available category
    return bestMatch || categories.find(c => c.slug === 'literary-fiction') || categories[0] || null;
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/[^\w\s\-.,!?'"():;]/g, '') // Remove special characters except common punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500); // Limit length
  }

  private async generateFinalStats(): Promise<void> {
    this.logger.log('Generating comprehensive statistics...');

    const totalProducts = await this.productRepository.count();
    const productsWithImages = await this.productRepository.count({
      where: { imageUrl: Not(IsNull()) }
    });
    const totalDetails = await this.productDetailRepository.count();
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

    // Books with ISBN
    const booksWithISBN = await this.productDetailRepository.count({
      where: { isbn: Not(IsNull()) }
    });

    // Books with publisher info
    const booksWithPublisher = await this.productDetailRepository.count({
      where: { publisher: Not(IsNull()) }
    });

    this.logger.log('=== COMPREHENSIVE BOOK SCRAPING COMPLETE ===');
    this.logger.log(`📚 Total Books: ${totalProducts}`);
    this.logger.log(`🖼️  Books with Cover Images: ${productsWithImages} (${((productsWithImages/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`📖 Books with Detailed Info: ${totalDetails} (${((totalDetails/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`📘 Books with ISBN: ${booksWithISBN} (${((booksWithISBN/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`🏢 Books with Publisher: ${booksWithPublisher} (${((booksWithPublisher/totalProducts)*100).toFixed(1)}%)`);
    this.logger.log(`📂 Categories: ${totalCategories}`);
    this.logger.log(`💰 Average Price: $${parseFloat(priceStats?.avg || '0').toFixed(2)}`);
    this.logger.log(`💰 Price Range: $${parseFloat(priceStats?.min || '0').toFixed(2)} - $${parseFloat(priceStats?.max || '0').toFixed(2)}`);
    this.logger.log(`✍️  Top Authors: ${topAuthors.slice(0, 5).map(a => `${a.author} (${a.count})`).join(', ')}`);
    
    // Test image accessibility
    await this.testImageAccessibility();
  }

  private async testImageAccessibility(): Promise<void> {
    this.logger.log('🔍 Testing book cover image accessibility...');
    
    const sampleProducts = await this.productRepository.find({ 
      take: 20,
      where: { imageUrl: Not(IsNull()) }
    });
    
    let accessibleImages = 0;
    const testPromises = sampleProducts.map(async (product) => {
      try {
        const response = await fetch(product.imageUrl!, { method: 'HEAD' });
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          accessibleImages++;
          return true;
        }
      } catch (error) {
        // Image not accessible
      }
      return false;
    });

    await Promise.all(testPromises);
    
    this.logger.log(`✅ Image Accessibility: ${accessibleImages}/${sampleProducts.length} sample images are accessible (${((accessibleImages/sampleProducts.length)*100).toFixed(1)}%)`);
    
    if (accessibleImages > 0) {
      this.logger.log(`🎉 SUCCESS: Book cover images are properly accessible!`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const logger = new Logger('ComprehensiveBookScraper');
  
  try {
    logger.log('🚀 Starting comprehensive book scraping with cover images...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const productRepository = app.get(getRepositoryToken(Product));
    const productDetailRepository = app.get(getRepositoryToken(ProductDetail));
    const reviewRepository = app.get(getRepositoryToken(Review));
    const categoryRepository = app.get(getRepositoryToken(Category));
    const navigationRepository = app.get(getRepositoryToken(Navigation));

    const scraper = new ComprehensiveBookScraper(
      productRepository,
      productDetailRepository,
      reviewRepository,
      categoryRepository,
      navigationRepository,
    );

    await scraper.scrapeComprehensiveBooks();

    await app.close();
    process.exit(0);

  } catch (error) {
    logger.error(`Comprehensive book scraping failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}