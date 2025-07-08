"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleGoToProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
                  <span className="text-white font-bold text-sm transform -rotate-45">
                    D
                  </span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Olá, {user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
         TODO
        </main>
      </div>
    </ProtectedRoute>
  );
}
