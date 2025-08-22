# SIDEUP E-commerce Task

A modern e-commerce application built with React, Redux Toolkit, and React Query, featuring real-time inventory management and dynamic product categorization.

## Project Overview

This project is a full-featured e-commerce application that demonstrates modern React patterns and state management practices. It includes features like real-time inventory tracking, product categorization, and shopping cart management.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [Core Components](#core-components)
5. [State Management](#state-management)
6. [Routing System](#routing-system)
7. [Getting Started](#getting-started)
   👉 [https://sideup-task-rho.vercel.app/](https://sideup-task-rho.vercel.app/)

## 🚀 Features

- ✅ **Login with email & password**
- ✅ **Redux Toolkit** for global state management
- ✅ **Real-time validation** using `yup` + `react-hook-form`
- ✅ **Authentication persistence** via `localStorage`
- ✅ **GSAP animations** for logo and form transitions
- ✅ **Responsive UI** across all devices
- ✅ **Shadcn UI** components with modern styling
- ✅ **Glassmorphism effect** on inputs
- ✅ **Toasts** for feedback (success/error)
- ✅ **Redirect handling** based on auth state

---

## 🛠️ Tech Stack

| Tool                | Description                         |
| ------------------- | ----------------------------------- |
| **React 19**        | UI Library                          |
| **Vite**            | Fast bundler and dev server         |
| **Redux Toolkit**   | Auth state management               |
| **React Router**    | Routing between login and dashboard |
| **GSAP**            | Advanced animations                 |
| **Shadcn UI**       | Accessible, headless UI components  |
| **Tailwind CSS**    | Utility-first CSS framework         |
| **Lucide Icons**    | Beautiful SVG icons                 |
| **Yup**             | Form validation                     |
| **React Hook Form** | Lightweight form handling           |
| **React Hot Toast** | Clean toast notifications           |

---

## 📁 Project Structure

```bash
project-root/
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── src/                   # Source code
│   ├── assets/            # Static resources (images, icons, etc.)
│   ├── components/        # Reusable React components
│   │   ├── CategoryPage/  # Category-specific components
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── Dashboard/     # Dashboard components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ProductCard.jsx
│   │   └── ui/            # Base UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── select.jsx
│   │       ├── switch.jsx
│   │       └── toast.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.js
│   │   ├── useGetCategories.js
│   │   ├── useGetProducts.js
│   │   ├── useProcessedProducts.js
│   │   └── useDashboardProducts.js
│   ├── layout/            # Layout components
│   │   └── [layout files]
│   ├── lib/              # Utility libraries
│   │   ├── store.js      # Redux store configuration
│   │   └── utils.js      # General utilities
│   ├── pages/            # Page components
│   │   ├── CategoryPage/
│   │   │   └── CategoryPage.jsx
│   │   └── Dashboard/
│   │       └── Dashboard.jsx
│   ├── Routes/           # Routing configuration
│   │   └── [routing files]
│   ├── services/         # API services and HTTP clients
│   │   └── [service files]
│   ├── Store/           # Redux store and slices
│   │   ├── Inventory/
│   │   │   ├── apiSlice.js
│   │   │   ├── inventorySlice.js
│   │   │   └── store.js
│   │   └── [other slices]
│   ├── utils/           # Utility functions
│   │   └── [utility files]
│   ├── App.jsx          # Main App component
│   ├── app.module.css   # App-specific styles
│   ├── index.css        # Global styles
│   ├── main.jsx         # Application entry point
│   └── vite-env.d.ts    # Vite type definitions
├── .eslintrc.js         # ESLint configuration
├── .gitignore          # Git ignore rules
├── babel.config.js     # Babel configuration
├── components.json     # Component configuration
├── index.html          # HTML template
├── jest.config.js      # Jest testing configuration
├── jsconfig.json       # JavaScript project configuration
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Lock file for dependencies
├── postcss.config.js   # PostCSS configuration
├── README.md           # Project documentation
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

### Key Directories Explained:

#### `/src/components/`
- **CategoryPage/**: Components specific to category listing and filtering
- **Dashboard/**: Main dashboard components and layouts  
- **ui/**: Reusable base UI components built with Radix UI and Tailwind CSS

#### `/src/hooks/`
- **useGetProducts**: Fetches and caches product data with React Query
- **useGetCategories**: Manages category data and filtering
- **useProcessedProducts**: Handles product data processing and inventory state
- **useDashboardProducts**: Dashboard-specific product management
- **use-mobile**: Responsive design utility hook

#### `/src/Store/`
- **Inventory/**: Redux slices for inventory management
  - `apiSlice.js`: API interaction layer
  - `inventorySlice.js`: Inventory state management
  - `store.js`: Store configuration

#### `/src/lib/`
- **store.js**: Main Redux store configuration
- **utils.js**: General utility functions and helpers

---

## 📸 Animation Preview

- 🟣 Main logo: slides in from the **right**
- 🟣 Meetus logo: pops in from the **bottom**
- 🟣 Login form: fades and slides **upward**
- 🔁 All animations **trigger on refresh**
- 🌐 Fully **responsive** with login form animation on small screens too

---

## 🔐 Auth Flow

- On login, credentials are submitted via `axios` to backend API.
- If successful:
  - `user`, `token`, and `isEmployee` are stored in `localStorage`.
  - User is redirected to the dashboard.
- If logged out:
  - LocalStorage is cleared.
  - User is sent back to `/login`.
- Navigation logic is guarded based on user presence in `localStorage`.

---

## Technology Stack

- **Core Framework**: React 19.1.0
- **Build Tool**: Vite
- **State Management**:
  - Redux Toolkit for global state
  - React Query for server state
- **UI Components**:
  - Radix UI for accessible components
  - TailwindCSS for styling
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Testing**: Jest & React Testing Library
- **Form Management**: React Hook Form & Yup

## Key Features

- Real-time inventory management
- Dynamic product categorization
- Shopping cart functionality
- Responsive design
- Accessibility-first components
- Performance optimized with React Query caching

## Core Components

### Components Structure

The project uses a modular component architecture:

1. **UI Components** (`/components/ui/`)
   - Reusable, atomic components like buttons, inputs, and cards
   - Built on top of Radix UI primitives
   - Fully accessible and customizable

2. **Category Components** (`/components/CategoryPage/`)
   - Product listing and filtering
   - Category-specific layouts
   - Loading and error states

3. **Dashboard Components** (`/components/Dashboard/`)
   - Main product overview
   - Analytics and statistics
   - Quick actions

### Custom Hooks

Located in `/hooks/`, the project includes several custom hooks:

1. **`useGetProducts`**
   - Fetches product data with React Query
   - Implements caching and stale-time management
   - Handles loading and error states

2. **`useGetCategories`**
   - Manages category data
   - Implements caching for performance
   - Provides category filtering functionality

3. **`useProcessedProducts`**
   - Handles product data processing
   - Manages inventory state
   - Provides stock status calculations

4. **`useDashboardProducts`**
   - Specialized hook for dashboard functionality
   - Handles product pagination and filtering
   - Manages dashboard-specific state

## State Management

### Redux Implementation

The project uses Redux Toolkit for global state management, particularly for:

1. **Inventory Management**
   - Real-time stock tracking
   - Cart state management
   - Purchase history

2. **Caching Strategy**
   - Local storage persistence
   - Optimistic updates
   - Error handling

```javascript
// Key Redux slices:
- inventorySlice: Manages product inventory
- apiSlice: Handles API interactions
```

### React Query Integration

React Query is used for server state management:

- Automatic background refetching
- Cache invalidation
- Optimistic updates
- Prefetching capabilities

## Routing System

The application uses React Router v7 with a hierarchical routing structure:

```javascript
/                     // Dashboard (index route)
├── /category/:categoryName  // Category pages
```

### Route Features:

- Dynamic route parameters
- Nested routing with layouts
- Protected routes when needed
- Breadcrumb navigation

## 📦 Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/task.git
cd task

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Run tests
npm test

# 5. Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
