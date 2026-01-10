# Railway Production Deployment Guide

## Overview
This guide sets up a full production deployment on Railway with:
- NestJS Backend Service
- PostgreSQL Database (already configured)
- Redis Service (optional)
- Proper environment variables and networking

## Deployment Steps

### 1. Backend Service Deployment

**Option A: Deploy from Backend Directory (Recommended)**
1. In Railway Dashboard:
   - Create new service
   - Connect to GitHub repository
   - Set **Root Directory** to `backend`
   - Deploy

**Option B: Deploy from Root with Configuration**
1. Ensure the backend/railway.toml and backend/nixpacks.toml are properly configured
2. Deploy the entire repository
3. Railway will use the backend-specific configurations

### 2. Database Setup (Already Done)
- PostgreSQL service is already configured
- Connection string: `postgresql://postgres:PKzoOzvUtjJgxIzKpOoXALIIAfLuHWls@centerbeam.proxy.rlwy.net:13082/railway`

### 3. Redis Setup (Optional)
If your app uses Redis:
1. Add Redis service in Railway
2. Get the Redis connection URL
3. Add to environment variables:
   ```
   REDIS_URL=redis://default:password@host:port
   ```

### 4. Environment Variables
The following are configured in backend/railway.toml:
- `DATABASE_URL` - PostgreSQL connection
- `NODE_ENV=production`
- `PORT=3001`
- All other production settings

### 5. Custom Domain (Optional)
1. In Railway service settings
2. Add custom domain
3. Update CORS_ORIGIN in environment variables

## Verification Steps

### Health Check
- Endpoint: `https://your-service.railway.app/health`
- Should return: `{"status":"ok","timestamp":"...","uptime":...}`

### API Documentation
- Endpoint: `https://your-service.railway.app/api/docs`
- Swagger UI should be accessible

### Database Connection
- Check logs for successful database connection
- Verify migrations ran successfully

## Troubleshooting

### Build Issues
1. Ensure Node.js 20 is specified in .nvmrc
2. Check package.json engines field
3. Verify nixpacks.toml configuration

### Runtime Issues
1. Check Railway logs for errors
2. Verify environment variables are set
3. Ensure database is accessible

### Migration Issues
1. Check if migrations ran in startup logs
2. Manually run migrations if needed:
   ```bash
   npm run migration:run
   ```

## Production Checklist

- [ ] Backend service deployed and healthy
- [ ] Database connected and migrations run
- [ ] Environment variables configured
- [ ] Health check endpoint working
- [ ] API documentation accessible
- [ ] CORS configured for frontend domain
- [ ] Logs are clean and informative
- [ ] Performance monitoring enabled

## Next Steps

1. Deploy frontend to Vercel/Netlify
2. Update frontend API URL to point to Railway backend
3. Configure custom domains
4. Set up monitoring and alerts
5. Configure CI/CD pipeline