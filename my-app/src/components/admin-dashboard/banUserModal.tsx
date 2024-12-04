// components/BanUserModal.tsx
import React, { useState } from "react";
import Modal from "./modal";

interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  banUser: (identifier: string) => void;
  error: string | null;
  successMessage: string | null;
}

const BanUserModal: React.FC<BanUserModalProps> = ({ isOpen, onClose, banUser, error, successMessage }) => {
  const [userIdentifier, setUserIdentifier] = useState("");

  const handleBanUser = () => {
    banUser(userIdentifier);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Banear Usuario">
      <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700 mt-4">
        UUID, Nombre de Usuario o Correo Electrónico
      </label>
      <input
        id="userIdentifier"
        type="text"
        value={userIdentifier}
        onChange={(e) => setUserIdentifier(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Ingresa el identificador del usuario"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cerrar
        </button>
        <button
          onClick={handleBanUser}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Banear Usuario
        </button>
      </div>
    </Modal>
  );
};

export default BanUserModal;
