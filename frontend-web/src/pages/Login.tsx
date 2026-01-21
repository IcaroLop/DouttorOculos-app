import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setAuth, selectIsAuthenticated } from '../redux/slices/authSlice';
import { login } from '../services/auth';
import type { LoginPayload } from '../types/auth';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ebf5 100%)',
  padding: '1.5rem',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
  padding: '2rem',
  boxSizing: 'border-box',
};

const logoStyle: React.CSSProperties = {
  width: '120px',
  display: 'block',
  margin: '0 auto 1rem',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#1976d2',
  margin: '0 0 0.25rem',
  fontSize: '1.5rem',
};

const subtitleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#5f6368',
  margin: '0 0 1.5rem',
  fontSize: '0.95rem',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const labelStyle: React.CSSProperties = {
  color: '#444',
  fontWeight: 600,
  fontSize: '0.92rem',
};

const inputStyle: React.CSSProperties = {
  border: '1px solid #dce2ec',
  borderRadius: '10px',
  padding: '0.85rem 1rem',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border 0.2s ease, box-shadow 0.2s ease',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 1rem',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const linkStyle: React.CSSProperties = {
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
};

const hintStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#6b7280',
};

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [form, setForm] = useState<LoginPayload>({
    portal: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedPortal = localStorage.getItem('portal');
    if (savedPortal) {
      setForm((prev) => ({ ...prev, portal: savedPortal }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'portal') {
      localStorage.setItem('portal', value.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.portal || !form.username || !form.password) {
      setError('Preencha portal, usuário e senha.');
      return;
    }

    setLoading(true);
    try {
      const data = await login({ ...form, portal: form.portal.trim() });
      dispatch(
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          portal: form.portal.trim(),
          user: data.user,
        }),
      );
      setSuccess(`Bem-vindo(a), ${data.user.nome}!`);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Não foi possível efetuar login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src="/logos/app/logo_512.png" alt="DouttorOculos" style={logoStyle} />
        <h1 style={titleStyle}>DouttorOculos</h1>
        <p style={subtitleStyle}>Acesse com seu portal, usuário e senha</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={fieldStyle}>
            <label htmlFor="portal" style={labelStyle}>Portal</label>
            <input
              id="portal"
              name="portal"
              type="text"
              placeholder="ex: loja-centro"
              value={form.portal}
              onChange={handleChange}
              style={inputStyle}
            />
            <span style={hintStyle}>Define a ótica e a base de dados que será usada.</span>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="username" style={labelStyle}>Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="ex: admin"
              value={form.username}
              onChange={handleChange}
              style={inputStyle}
              autoComplete="username"
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              autoComplete="current-password"
            />
            <span style={hintStyle}>Admin padrão: senha 123456</span>
          </div>

          {error && (
            <div style={{ color: '#d32f2f', background: '#fdecea', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: '#1b5e20', background: '#e8f5e9', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem' }}>
              {success}
            </div>
          )}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
            Esqueci minha senha?
          </a>
          <p style={hintStyle}>Recurso preparado para enviar e-mail ao Administrador do DouttorOculos.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
