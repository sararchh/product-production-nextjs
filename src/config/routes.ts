export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: '/dashboard',
  PRODUCTS: {
    LIST: '/products',
    NEW: '/products/new',
    EDIT: (id: string) => `/products/${id}/edit`,
    VIEW: (id: string) => `/products/${id}`,
  },
  PRODUCTIONS: {
    LIST: '/productions',
    NEW: '/productions/new',
    EDIT: (id: string) => `/productions/${id}/edit`,
    VIEW: (id: string) => `/productions/${id}`,
  },
} as const;
