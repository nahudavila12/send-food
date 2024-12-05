export const handleGetUsers = async (
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setUsers: React.Dispatch<React.SetStateAction<any[]>>,
  token: string 
) => {
  setError(null);
  setSuccessMessage(null);

  try {
    const response = await fetch(`https://gestion-restaurant-6wyu.onrender.com/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios.");
    }

    const data = await response.json();
    setUsers(data);
    console.log(data);
    setSuccessMessage("Usuarios obtenidos con éxito.");
  } catch (error: any) {
    setError(error.message || "Ocurrió un error al obtener los usuarios.");
  }
};
