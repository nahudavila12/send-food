"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import { createProduct } from "@/lib/products.api";
import { useRouter } from "next/navigation";

export enum IProductCategory {
  PlatosPrincipales = "Platos Principales",
  Pasteleria = "Pastelería",
  Postres = "Postres",
  Tragos = "Tragos",
}

export enum IProductSubcategory {
  Mediterranea = "Mediterranea",
  Oriental = "Oriental",
  Occidental = "Occidental",
  LatinoAmericano = "LatinoAmericano",
  Indio = "Indio",
  Tropical = "Tropical",
  Bebidas = "Bebidas",
}

const categories = [
  IProductCategory.PlatosPrincipales,
  IProductCategory.Pasteleria,
  IProductCategory.Postres,
  IProductCategory.Tragos,
];

const subcategories = [
  IProductSubcategory.Mediterranea,
  IProductSubcategory.Oriental,
  IProductSubcategory.Occidental,
  IProductSubcategory.LatinoAmericano,
  IProductSubcategory.Indio,
  IProductSubcategory.Tropical,
  IProductSubcategory.Bebidas,
];

export type CreateProduct = {
  name: string;
  price: number;
  images: { url: string }[]; // Array para enviar como espera el backend.
  description: string;
  category: IProductCategory;
  subcategory: IProductSubcategory;
};

export function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProduct>();
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateProduct> = async (data) => {
    const formattedData = {
      ...data,
      images: [{ url: data.images[0]?.url || "" }], // Convertimos la imagen única en un array.
    };

    await createProduct(formattedData);
    router.push("/Menu");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: "500px", margin: "0 auto" }}
      className="space-y-4"
    >
      {/* Nombre del producto */}
      <div>
        <Label htmlFor="name">Nombre de Producto</Label>
        <Input
          id="name"
          {...register("name", { required: "Este campo es obligatorio" })}
          placeholder="Ingrese el nombre"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Precio */}
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          {...register("price", {
            required: "Este campo es obligatorio",
            valueAsNumber: true,
            min: 0.01,
          })}
          placeholder="Ingrese el precio"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      {/* Imagen */}
      <div>
        <Label htmlFor="images">Imagen (URL)</Label>
        <Input
          id="images"
          type="url"
          {...register("images.0.url", { required: "Este campo es obligatorio" })}
          placeholder="Ingrese la URL de la imagen"
        />
        {errors.images && (
          <p className="text-red-500">{errors.images[0]?.url?.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          {...register("description", { required: "Este campo es obligatorio" })}
          placeholder="Ingrese la descripción"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select
          onValueChange={(value) => setValue("category", value as IProductCategory)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Subcategoría */}
      <div>
        <Label htmlFor="subcategory">Subcategoría</Label>
        <Select
          onValueChange={(value) => setValue("subcategory", value as IProductSubcategory)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una subcategoría" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory} value={subcategory}>
                {subcategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subcategory && (
          <p className="text-red-500">{errors.subcategory.message}</p>
        )}
      </div>

      {/* Botón de envío */}
      <Button
        className={buttonVariants({ variant: "outline", size: "lg" })}
        type="submit"
      >
        Crear Producto
      </Button>
    </form>
  );
}