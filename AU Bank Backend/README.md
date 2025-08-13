# Optimized Sales API with TypeScript

A high-performance RESTful API built with Node.js, Express, and TypeScript for handling sales data without a database. Features intelligent caching, file watching, and optimized data retrieval.

## 🚀 Features

- **Zero Database Dependency**: Reads directly from JSON files
- **Intelligent Caching**: Pre-computed results with automatic cache invalidation
- **File Watching**: Automatic data reload in development mode
- **TypeScript**: Full type safety and better developer experience
- **Optimized Performance**: Minimal memory footprint with fast response times
- **Pagination Support**: Efficient data retrieval with configurable page sizes
- **CORS Enabled**: Ready for React frontend integration
- **Security Middleware**: Helmet.js for enhanced security
- **Compression**: Gzip compression for faster response times

## 📁 Project Structure

```
sales-api/
├── src/
│   ├── types/
│   │   └── Sale.ts              # Type definitions
│   ├── services/
│   │   └── DataService.ts       # Core data handling service
│   ├── routes/
│   │   └── salesRoutes.ts       # API route handlers
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling middleware
│   └── server.ts                # Express server setup
├── data/
│   └── sales.json               # Your sales data file
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```


### 2. Development Mode

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

Base URL: `http://localhost:3001/api/sales`

### 1. Get All States
**Required Task**: Get list of states for dropdown selection

```
GET /api/sales/states
```

**Response:**
```json
{
  "success": true,
  "data": ["Alabama", "Alaska", "Arizona", ...],
  "count": 50
}
```

### 2. Get Date Range for State
**Required Task**: Get min/max dates for a specific state

```
GET /api/sales/date-range/:state
```

**Parameters:**
- `state` (path): State name (e.g., "California")

**Response:**
```json
{
  "success": true,
  "data": {
    "state": "California",
    "minDate": "2016-01-03",
    "maxDate": "2019-12-30"
  }
}
```

### 3. Get Filtered Sales Data
**Bonus Feature**: Advanced filtering with pagination

```
GET /api/sales/data
```

**Query Parameters:**
- `state` (optional): Filter by state name
- `city` (optional): Filter by city (partial match)
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Examples:**
```bash
# Get all sales from California
GET /api/sales/data?state=California

# Get sales from California between specific dates
GET /api/sales/data?state=California&startDate=2017-01-01&endDate=2017-12-31

# Get paginated results
GET /api/sales/data?page=2&limit=25

# Combine filters
GET /api/sales/data?state=Texas&city=Houston&startDate=2018-01-01&page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [...], // Array of sale objects
  "total": 1234,
  "page": 1,
  "limit": 10,
  "totalPages": 124
}
```

### 4. Get Overall Statistics
**Bonus Feature**: Get summary statistics

```
GET /api/sales/stats?state=Alabama&startDate=2014-04-07&endDate=2017-12-25
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRecords": 9994,
    "dateRange": {
      "minDate": "2016-01-03",
      "maxDate": "2019-12-30"
    },
    "totalSales": 19510.64,
    "quantitySold": 256,
    "discountPercentage": 0,
    "totalProfit": 5786.83,
  }
}
```


## ⚡ Performance Optimizations

### 1. Intelligent Caching
- **Pre-computed States**: States are calculated once and cached
- **Date Range Caching**: Min/max dates per state are pre-computed
- **File Modification Tracking**: Data reloads only when file changes

### 2. Memory Management
- **Lazy Loading**: Data loads only when needed
- **Efficient Filtering**: In-memory filtering with minimal iterations
- **Pagination**: Prevents large data transfers

### 3. Response Optimization
- **Gzip Compression**: Reduces response sizes by ~70%
- **Minimal Data Transfer**: Only necessary fields in responses
- **Fast JSON Parsing**: Optimized JSON operations

### 4. Development Features
- **File Watching**: Automatic reload in development
- **Hot Reload**: Changes reflect immediately
- **Error Handling**: Comprehensive error responses

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Custom Data Path

If your JSON file is in a different location:

```typescript
// Modify src/routes/salesRoutes.ts
const dataService = new DataService('path/to/your/sales.json');
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (state not found)
- `500`: Internal Server Error
