"use client";

import { ProductList } from "@/modules/products/components/ProductList";
import { ProtectedRoute, PageTemplate } from "@/shared/components";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <PageTemplate showSidebar currentPage="products">
        <ProductList />
      </PageTemplate>
    </ProtectedRoute>
  );
}
