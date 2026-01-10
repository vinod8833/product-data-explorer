#!/bin/bash

# Navigate to backend directory
cd backend

# Install dependencies
npm ci

# Build the application
npm run build

# Run database migrations
npm run migration:run

# Start the application
npm run start:prod