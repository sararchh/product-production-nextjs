import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../services/deleteProduct';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteProduct.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    deleteProduct: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
