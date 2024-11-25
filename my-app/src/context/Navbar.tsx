"use client";





import { createContext, useState } from "react";

interface INavbarContextType {
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
    closeDropdown: () => void;
  }

export const NavbarContext = createContext<INavbarContextType>({
    isDropdownOpen: false,
    toggleDropdown: () => {},
    closeDropdown: () => {},
  });

  export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);
  
    return (
      <NavbarContext.Provider value={{ isDropdownOpen, toggleDropdown, closeDropdown }}>
        {children}
      </NavbarContext.Provider>
    );
  };