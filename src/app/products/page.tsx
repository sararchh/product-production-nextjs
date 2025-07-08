'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useProducts, useCreateProduct, useUpdateProductFlag } from '@/modules/products';
import { useAuthContext } from '@/modules/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const { user, logout } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  
  const { data: products, isLoading, error } = useProducts();
  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProductFlag, isLoading: isUpdating } = useUpdateProductFlag();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = useCallback(async (data: ProductFormData) => {
    try {
      await createProduct(data);
      toast.success('Produto criado com sucesso!');
      reset();
      setShowForm(false);
    } catch {
      toast.error('Erro ao criar produto');
    }
  }, [createProduct, reset]);

  const toggleProductStatus = useCallback(async (id: string, active: boolean) => {
    try {
      await updateProductFlag({ id, active: !active });
      toast.success(`Produto ${!active ? 'ativado' : 'desativado'} com sucesso!`);
    } catch {
      toast.error('Erro ao alterar status do produto');
    }
  }, [updateProductFlag]);

  const handleGoToDashboard = useCallback(() => {
    window.location.href = '/dashboard';
  }, []);

  const handleToggleForm = useCallback(() => {
    setShowForm(prev => !prev);
  }, []);

  return (
    <ProtectedRoute>
      TODO 
    </ProtectedRoute>
  );
}
