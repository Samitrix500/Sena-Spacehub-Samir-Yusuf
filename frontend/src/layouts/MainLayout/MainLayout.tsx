// layouts/MainLayout/MainLayout.tsx
// Shell visual compartido por todas las páginas autenticadas: sidebar + contenido.
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/NavBar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <NavBar />
      <main className="flex-1 p-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
