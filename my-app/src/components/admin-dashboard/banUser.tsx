export const banUser = async (
    userIdentifier: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setError(null);
    setSuccessMessage(null);
  
    try {
      const response = await fetch("http://localhost:3001/user/banUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userIdentifier, 
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al banear el usuario.");
      }
  
      const data = await response.json();
      setSuccessMessage(data.message || "Usuario baneado con éxito.");
    } catch (error: any) {
      setError(error.message || "Ocurrió un error al banear el usuario.");
    }
  };