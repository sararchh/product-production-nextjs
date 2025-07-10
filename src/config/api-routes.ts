export const API_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    VERIFY: '/auth/verify',
  },
  PRODUCTS: {
    BASE: '/registers/products',
    BY_ID: (id: string) => `/registers/products/${id}`,
    FLAG: '/registers/products/flag',
  },
  PRODUCTIONS: {
    BASE: '/records/productions',
    BY_ID: (id: string) => `/records/productions/${id}`,
    CHART_DATA: '/records/productions/chart-data',
    FLAG: '/records/productions/flag',
  },
} as const;
