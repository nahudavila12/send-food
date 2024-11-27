'use client'

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
import { toast, ToastContainer } from "react-toastify"; // Importamos toast para mostrar alertas
import 'react-toastify/dist/ReactToastify.css'; // Importamos el archivo de estilos de Toastify
import { useEffect } from "react";

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
  duration:string
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

    try {
      await createProduct(formattedData);
      router.push("/Menu");
    } catch (error) {
      toast.error("Hubo un error al crear el producto.");
    }
  };

  // Manejar errores de react-hook-form con Toastify
  useEffect(() => {
    if (errors.name) {
      toast.error(errors.name.message);
    }
    if (errors.price) {
      toast.error(errors.price.message);
    }
    if (errors.images) {
      toast.error(errors.images[0]?.url?.message);
    }
    if (errors.description) {
      toast.error(errors.description.message);
    }
    if (errors.category) {
      toast.error(errors.category.message);
    }
    if (errors.subcategory) {
      toast.error(errors.subcategory.message);
    }
  }, [errors]);

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    style={{ maxWidth: "500px", margin: "0 auto" }}
    className="space-y-4"
    >
      <ToastContainer/>
      {/* Nombre del producto */}
      <div>
        <Label htmlFor="name">Nombre de Producto</Label>
        <Input
          id="name"
          {...register("name", { required: "Este campo es obligatorio" })}
          placeholder="Ingrese el nombre"
        />
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
      </div>
      <div>
  <Label htmlFor="duration">Duración</Label>
  <Input
    id="duration"
    {...register("duration", { required: "Este campo es obligatorio" })}
    placeholder="Ingrese la duración (en minutos)"
  />
  {errors.duration && (
    <p className="text-red-500">{errors.duration.message}</p>
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
