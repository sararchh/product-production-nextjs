import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services/updateProduct';
import { ProductRequest } from '../types';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductRequest }) => 
      updateProduct.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    updateProduct: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
