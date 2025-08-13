# AU Bank MERN Dashboard Assignment

This repository contains the full-stack **MERN** assignment for AU Bank.  
The project includes a **ReactJS frontend** and a **NodeJS + Express backend**, both implemented with modern best practices.

---

## 📁 Folder Structure

AU Bank Project/
├─ AU Bank Frontend/ # ReactJS dashboard app
├─ AU Bank Backend/ # NodeJS + Express REST API
└─ README.md # This file


---

## 🛠 Tech Stack

**Frontend:**
- ReactJS (with Vite)
- TypeScript
- TailwindCSS
- shadcn/ui (for granular UI control)
- Charting: ECharts (echarts-for-react)

**Backend:**
- NodeJS + Express
- TypeScript
- REST API serving sales data from JSON
- Optimized with caching, file watching, and compression

---

## 📝 Assignment Instructions

**UI Tasks:**

**Required:**
1. Create a dashboard based on the Figma design.  
2. State selection dropdown: Fetch states from backend API (Backend Task 1). Default first state selected.  
3. Time selection dropdowns: "From" and "To" bound to min and max order dates for selected state.

**Bonus:**
- Fetch data based on selections.  
- Expand/collapse left navigation bar.  
- Light/Dark theme toggle.  
- Responsive layout for various device widths.  
- Use TypeScript in React app.

**Backend Tasks:**

**Required:**
1. API to provide the list of states.  
2. API to provide min and max dates for a selected state.

**Bonus:**
- Implement backend in TypeScript.

---

## 🚀 Backend Features

- **Zero Database Dependency:** Reads directly from `sales.json`.  
- **Intelligent Caching:** Pre-computed results with automatic cache invalidation.  
- **File Watching:** Auto reload of data in development mode.  
- **TypeScript:** Full type safety for better developer experience.  
- **Optimized Performance:** Minimal memory footprint, fast response times.  
- **Pagination Support:** Efficient data retrieval with configurable page sizes.  
- **CORS Enabled:** Ready for React frontend integration.  
- **Security Middleware:** Helmet.js for enhanced security.  
- **Compression:** Gzip compression for faster response times.  

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/au-bank-mern.git
cd "AU Bank Project"
```

### 2. Install dependencies

#### Backend:

```bash
cd AU\ Bank\ Backend
npm install
```

#### Frontend:

```bash
cd ../AU\ Bank\ Frontend
npm install
```


### 3. Run the project

#### Backend:

```bash
npm run dev
```

#### Frontend:

```bash
npm run dev
```

- The frontend will run on http://localhost:5173 (Vite default)
- The backend API will run on http://localhost:3001 

## 🧩 Notes
- Use the state and date selection dropdowns to filter sales data on the dashboard.
- The project is fully functional without a database, using only sales.json as the data source.
- Follow best practices for TypeScript, TailwindCSS, and API optimization.

## 🔗 References

React: https://reactjs.org/

Vite: https://vitejs.dev/

TailwindCSS: https://tailwindcss.com/

shadcn/ui: https://ui.shadcn.com/

ECharts React: https://www.npmjs.com/package/echarts-for-react

Express: https://expressjs.com/

NodeJS: https://nodejs.org/

## 📦 License
This project is submitted as an assignment for AU Bank and is for educational purposes only.
