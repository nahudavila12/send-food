import { IProduct } from "@/interfaces/interfaces";


export async function createProduct(data: IProduct): Promise<IProduct> {
  try {
    const response = await fetch(`https://gestion-restaurant-6wyu.onrender.com/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el producto");
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
}
