interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    tableNumberInput: string;
    setTableNumberInput: React.Dispatch<React.SetStateAction<string>>;
    error: string | null;
    successMessage: string | null;
    onAddTable: () => void;
  }
  
  // Componente Modal que maneja la interacción con el usuario para agregar una mesa
  const TableModal: React.FC<TableModalProps> = ({
    isOpen,
    onClose,
    tableNumberInput,
    setTableNumberInput,
    error,
    successMessage,
    onAddTable,
  }) => {
    if (!isOpen) return null; // Si el modal no está abierto, no renderizar nada
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Agregar Mesa</h2>
  
          {/* Mensajes de error o éxito */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
  
          {/* Formulario de agregar mesa */}
          <div className="mb-4">
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
              Número de Mesa
            </label>
            <input
              id="tableNumber"
              type="text"
              value={tableNumberInput}
              onChange={(e) => setTableNumberInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Ej: Mesa 1"
            />
          </div>
  
          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={onAddTable}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              Agregar Mesa
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default TableModal;
  