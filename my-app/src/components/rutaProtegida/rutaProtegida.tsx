// pages/protected-page.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store/store';

const ProtectedPage = ({ requiredRole }: { requiredRole: string }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene el rol adecuado
    if (!isAuthenticated || user?.rol !== requiredRole) {
      router.push('/unauthorized'); // Redirige a la página de "No autorizado"
    }
  }, [isAuthenticated, user?.rol, router, requiredRole]);

  if (!isAuthenticated || user?.rol !== requiredRole) {
    return null; // Puedes mostrar un loader mientras redirige
  }

  return (
    <div>
      <h1>Página protegida para {requiredRole}s</h1>
      {/* Contenido solo visible para el rol adecuado */}
    </div>
  );
};

export default ProtectedPage;
