"use client";


import { postSignin, postSignup } from "@/lib/fetchUser";
import { createContext, useEffect, useState } from "react";

interface IUserContextType {
    user: Partial<IUser> | null;
    setUser: (user: Partial<IUser> | null) => void;
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
    signIn: (credentials: ILogin) => Promise<boolean>;
    signUp: (user: Omit<IUser, "uuid">) => Promise<boolean>;
    logOut: () => void;
  }
  interface ILogin {
    email: string,
    password: string
  }  
export enum IStatus{
    pending = 'pending',
    active = 'active',
    canceled = 'canceled'
  }
interface IReservation {
    uuid: string;
    state: IStatus;
    day: Date;
    tableNumber: number;
    guests: number
    startTime:Date;
    user:Partial<IUser>; 
    [key: string]: any;

  }
interface IUser {
    uuid: string;
    fullname: string;
    username: string,
    email: string;
    password: string;
    repeatpassword?: string;
    reservation?: IReservation; 
  }
export const UserContext = createContext<IUserContextType>({
    user: null,
    setUser: () => {},
    isLogged: false,
    setIsLogged: () => {},
    signIn: async () => false,
    signUp: async () => false,
    logOut: () => {},
});

export const UserNormalProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Partial<IUser> | null>(null);
    const [isLogged, setIsLogged] = useState(false);

    const signIn = async (credentials: ILogin) => {
        try {
            const data = await postSignin(credentials);
            const { generateAccessToken, generateRefreshToken, ownerUUID } = data;
    
            if (!generateAccessToken) throw new Error("Access token no disponible");
    
            // Guardar los datos en localStorage
            localStorage.setItem("Acces Token", generateAccessToken);
            localStorage.setItem("Refresh Token", generateRefreshToken);
            localStorage.setItem("user", JSON.stringify(data));
    
            // Log para verificar que se guardaron los datos
            console.log("Tokens guardados en localStorage:", {
                accesToken: generateAccessToken,
                refreshToken: generateRefreshToken,
                user: data
            });
    
            // Actualizar el estado
            setUser(data);
            setIsLogged(true);
            return true;
        } catch (error) {
            console.error("Error en signIn:", error);
            return false;
        }
    };
    
    
    const refreshToken = async () => {
        try {
            const storedRefreshToken = localStorage.getItem("Refresh Token");
            if (!storedRefreshToken) throw new Error("No hay Refresh Token disponible");
    
            // Endpoint para renovar el token
            const response = await fetch("http://localhost:3000/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: storedRefreshToken }),
            });
    
            if (!response.ok) {
                throw new Error("Error al renovar el token");
            }
    
            const data = await response.json();
            const { generateAccessToken, generateRefreshToken } = data;
    
            // Guarda los nuevos tokens
            localStorage.setItem("Acces Token", generateAccessToken);
            localStorage.setItem("Refresh Token", generateRefreshToken);
            setIsLogged(true);
        } catch (err) {
            console.error("Error al renovar el token:", err);
            logOut(); // Opcional: desloguear al usuario si el token no es válido
        }
    };
    
    // Llama a esta función dentro de `useEffect` si el `Access Token` expira
    useEffect(() => {
        const token = localStorage.getItem("Acces Token");
        if (token) {
            refreshToken();
        }
    }, []);
    

    const signUp = async (user: Omit<IUser, "uuid">): Promise<boolean> => {
        try {
            const data = await postSignup(user);
            return !!data.uuid;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

   

    const logOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("Acces Token");
        localStorage.removeItem("Refresh Token");
        localStorage.removeItem("ownerUUID");
        setUser(null);
        setIsLogged(false);
    };

  

    useEffect(() => {
        const token = localStorage.getItem("Acces Token");
        const storedUser = localStorage.getItem("user");

        console.log("Token desde localStorage:", token); // Log para verificar el token
        console.log("Usuario almacenado:", storedUser); // Log para verificar el usuario almacenado

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser); // Configura el estado de `user` si hay un usuario almacenado
            setIsLogged(!!token);
            console.log("Usuario establecido:", parsedUser); // Log para verificar el usuario establecido
        } else {
            setUser(null);
            setIsLogged(false);
        }
    }, []);

    return (
        <UserContext.Provider 
            value={{
                user,
                setUser,
                isLogged,
                setIsLogged,
                signIn,
                signUp,
                logOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};