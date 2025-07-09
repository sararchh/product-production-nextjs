import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FormField } from "@/shared/components";
import { Product } from "../types";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  minProduction: z.number().min(1, "Produção mínima deve ser maior que zero"),
  maxProduction: z.number().min(1, "Produção máxima deve ser maior que zero"),
}).refine(data => data.maxProduction >= data.minProduction, {
  message: "Produção máxima deve ser maior ou igual à mínima",
  path: ["maxProduction"],
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
  isUpdating = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      minProduction: product.minProduction,
      maxProduction: product.maxProduction,
    } : undefined,
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Produto"
            name="name"
            type="text"
            placeholder="Nome do produto"
            register={register}
            error={errors.name?.message}
          />

          <FormField
            label="Produção Min."
            name="minProduction"
            type="number"
            placeholder="Mínima"
            register={register}
            error={errors.minProduction?.message}
            valueAsNumber
          />

          <FormField
            label="Produção Máx."
            name="maxProduction"
            type="number"
            placeholder="Máxima"
            register={register}
            error={errors.maxProduction?.message}
            valueAsNumber
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            isLoading={isLoading || isUpdating}
            loadingText="Salvando..."
            className="w-full max-w-md"
            size="lg"
          >
            {product ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
        >
          ← Voltar para a lista
        </Button>
      </div>
    </div>
  );
};
