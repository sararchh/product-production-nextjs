import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FormField, Input, Dialog } from "@/shared/components";
import { Production } from "../types";
import { useProducts, Product } from "@/modules/products";

export const productionSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.number().min(0.1, "Quantidade deve ser maior que zero"),
});

export type ProductionFormData = z.infer<typeof productionSchema>;

interface JustificationFormData {
  justification: string;
}

export interface ProductionFormProps {
  production?: Production | null;
  onSubmit: (data: ProductionFormData) => void;
  onSubmitWithJustification: (data: ProductionFormData, justification: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
}

export const ProductionForm: React.FC<ProductionFormProps> = ({
  production,
  onSubmit,
  onSubmitWithJustification,
  isLoading = false,
  isUpdating = false,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [pendingProductionData, setPendingProductionData] = useState<ProductionFormData | null>(null);

  const { data: products } = useProducts();

  const activeProducts = useMemo(() => {
    return products?.filter(product => product.active) || [];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return activeProducts;
    return activeProducts.filter(product => 
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [activeProducts, productSearch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: production ? {
      productId: production.productId,
      quantity: production.quantity,
    } : undefined,
  });

  const {
    register: registerJustification,
    handleSubmit: handleSubmitJustification,
    formState: { errors: justificationErrors },
    reset: resetJustification,
  } = useForm<JustificationFormData>();

  const watchedProductId = watch("productId");
  const watchedQuantity = watch("quantity");

  useEffect(() => {
    if (watchedProductId && watchedQuantity && selectedProduct) {
      const outOfRange = watchedQuantity < selectedProduct.minProduction || 
                        watchedQuantity > selectedProduct.maxProduction;
      setIsOutOfRange(outOfRange);
      
      if (outOfRange) {
        setError("quantity", {
          type: "manual",
          message: `Quantidade deve estar entre ${selectedProduct.minProduction} e ${selectedProduct.maxProduction} m²`
        });
      } else {
        clearErrors("quantity");
      }
    }
  }, [watchedProductId, watchedQuantity, selectedProduct, setError, clearErrors]);

  useEffect(() => {
    if (watchedProductId) {
      const product = activeProducts.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
      if (product && !productSearch) {
        setProductSearch(product.name);
      }
    }
  }, [watchedProductId, activeProducts, productSearch]);

  useEffect(() => {
    if (production && products) {
      const product = products.find(p => p.id === production.productId);
      if (product) {
        setSelectedProduct(product);
        setProductSearch(product.name);
      }
    }
  }, [production, products]);

  const handleProductSelect = useCallback((product: Product) => {
    setValue("productId", product.id);
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductDropdown(false);
  }, [setValue]);

  const handleFormSubmit = useCallback((data: ProductionFormData) => {
    setPendingProductionData(data);
    
    if (isOutOfRange) {
      setShowJustificationDialog(true);
    } else {
      onSubmit(data);
    }
  }, [isOutOfRange, onSubmit]);

  const handleJustificationSubmit = useCallback((data: JustificationFormData) => {
    if (pendingProductionData) {
      onSubmitWithJustification(pendingProductionData, data.justification);
      setShowJustificationDialog(false);
      setPendingProductionData(null);
      resetJustification();
    }
  }, [pendingProductionData, onSubmitWithJustification, resetJustification]);

  const handleCancelJustification = useCallback(() => {
    setShowJustificationDialog(false);
    setPendingProductionData(null);
    resetJustification();
  }, [resetJustification]);

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto *
            </label>
            <Input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProductDropdown(true);
              }}
              onFocus={() => setShowProductDropdown(true)}
              placeholder="Digite para buscar produtos..."
              fullWidth
              error={!!errors.productId}
            />
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
            )}
            {showProductDropdown && filteredProducts.length > 0 && (
              <div className="absolute top-16 left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductSelect(product)}
                    variant="ghost"
                    fullWidth
                    className="text-left p-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 rounded-none justify-start"
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        Produção: {product.minProduction} - {product.maxProduction} m²
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
            <input
              type="hidden"
              {...register("productId")}
            />
          </div>

          <FormField
            label="Produção (m²)"
            name="quantity"
            type="number"
            placeholder="Quantidade produzida"
            register={register}
            error={errors.quantity?.message}
            valueAsNumber
            required
          />
        </div>

        {selectedProduct && (
          <div className="text-sm text-gray-500">
            Intervalo válido para {selectedProduct.name}: {selectedProduct.minProduction} - {selectedProduct.maxProduction} m²
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            type="submit"
            isLoading={isLoading || isUpdating}
            loadingText={isUpdating ? "Atualizando..." : "Salvando..."}
            className="w-full max-w-md"
            size="lg"
          >
            {isUpdating ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>

      <Dialog
        isOpen={showJustificationDialog}
        onClose={handleCancelJustification}
        title="Justificativa Necessária"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A produção informada está fora do padrão. Por favor, informe a justificativa:
          </p>
          <form onSubmit={handleSubmitJustification(handleJustificationSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Justificativa *
              </label>
              <textarea
                {...registerJustification("justification", { required: "Justificativa é obrigatória" })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva o motivo da produção estar fora do padrão..."
              />
              {justificationErrors.justification && (
                <p className="mt-1 text-sm text-red-600">{justificationErrors.justification.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelJustification}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Continuar
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};
