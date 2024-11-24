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
import { useEffect, useState } from "react";
import Image from "next/image";

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

type CreateProductDTO = {
  name: string;
  price: number;
  images: string; // URL de la imagen
  description: string;
  category: string;
  subcategory: string;
};

export function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductDTO>();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [file]);

  // Subida de la imagen al backend
  const uploadToServer = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/Admin-dashboard/new/api/upload", { // Asegúrate de que la ruta coincida con la configuración de Next.js
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir la imagen");
      const result = await response.json();
      console.log("Respuesta del servidor:", result);
      return result.url; // Obtén la URL devuelta por el servidor (Cloudinary)
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };

  // Envío del formulario
  const onSubmit: SubmitHandler<CreateProductDTO> = async (data) => {
    try {
      let imageUrl = "";
      if (file) {
        const uploadedUrl = await uploadToServer(file);
        if (!uploadedUrl) {
          alert("Error al subir imagen. Intente nuevamente.");
          return;
        }
        imageUrl = uploadedUrl;
      }

      await createProduct({
        ...data,
        images: imageUrl,
      });

      router.push("/Menu");
      router.refresh();
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  // Validación del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(fileType)) {
        alert("Formato de imagen no válido. Usa JPG o PNG.");
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) { // 2 MB
        alert("El tamaño de la imagen debe ser menor a 2MB.");
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <div>
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

        {/* Precio */}
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            {...register("price", {
              required: "Este campo es obligatorio",
              valueAsNumber: true,
            })}
            placeholder="Ingrese el precio"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        {/* Imagen */}
        <div>
          <Label htmlFor="images">Imagen</Label>
          <Input
            id="images"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        {imagePreview && <Image src={imagePreview} alt="Vista Previa" width={150} height={150} />}

        {/* Categoría */}
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            onValueChange={(value) => setValue("category", value)}
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
            onValueChange={(value) => setValue("subcategory", value)}
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
    </div>
  );
}
