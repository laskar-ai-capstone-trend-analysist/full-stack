# 🚀 Setup Guide - Tokopedia Trends Frontend

## Quick Start Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test API Connection

```bash
npm run health-check
```

## Production Setup

### 1. Build for Production

```bash
npm run build:production
```

### 2. Start Production Server

```bash
npm run start:production
```

### 3. Deploy Check

```bash
npm run deploy:check
```

## Backend Integration

### Prerequisites

- Backend server running on `http://localhost:5000`
- Database properly configured
- All API endpoints available

### API Endpoints Used

- `GET /` - Health check
- `GET /getAllProduct` - Get all products
- `GET /getAllCategory` - Get all categories
- `GET /getAllReview` - Get all reviews
- `GET /getAllProductsByName?name=` - Search products by name
- `GET /getAllProductByCategory?category=` - Filter by category
- `GET /getAllReviewByProduct?product=` - Get product reviews
- `GET /getSentimentByProduct?product=` - Get sentiment analysis

### Testing API Integration

```bash
# Test all endpoints
npm run test:api

# Check API health
npm run health-check
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check if backend is running on port 5000
   - Verify `.env.local` has correct API_URL
   - Run `npm run health-check`

2. **Build Errors**

   - Run `npm run type-check` to check TypeScript errors
   - Run `npm run lint:fix` to fix linting issues

3. **Performance Issues**
   - Open Debug Panel (development only)
   - Check Performance tab for slow operations
   - Monitor API response times

### Debug Tools (Development)

- **Debug Panel**: Bottom-right corner, shows errors and performance
- **API Status**: Top-left corner, shows API connection status
- **Console Logging**: Check browser console for detailed logs

### Environment Variables

| Variable                 | Description          | Default                 |
| ------------------------ | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`    | Backend API URL      | `http://localhost:5000` |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging | `false`                 |
| `NODE_ENV`               | Environment mode     | `development`           |

## Development Workflow

1. **Start Backend Server** (Port 5000)
2. **Start Frontend Dev Server** (`npm run dev`)
3. **Check API Status** (Green indicator = Connected)
4. **Use Debug Panel** for monitoring
5. **Test Features** systematically

## Production Checklist

- [ ] Backend API is accessible
- [ ] Environment variables set correctly
- [ ] Build completed without errors
- [ ] API health check passes
- [ ] All features tested
- [ ] Performance monitoring enabled
