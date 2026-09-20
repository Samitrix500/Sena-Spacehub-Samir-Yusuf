// pages/LoginPage/LoginPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold text-white">SENA SpaceHub</p>
          <p className="text-sm text-white/50 mt-1">Sistema de inventarios y préstamos</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded p-7 flex flex-col gap-4 shadow-lg">
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@sena.edu.co"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-signal-red">{error}</p>}

          <button type="submit" className="btn-primary mt-2" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-xs text-white/40 text-center leading-relaxed">
          <p>Usuarios de prueba (contraseña: 123456)</p>
          <p>admin@sena.edu.co · instructor@sena.edu.co · aprendiz@sena.edu.co</p>
        </div>
      </div>
    </div>
  );
}
