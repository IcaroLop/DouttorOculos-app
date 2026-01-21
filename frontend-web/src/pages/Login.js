import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setAuth, selectIsAuthenticated } from '../redux/slices/authSlice';
import { login } from '../services/auth';
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ebf5 100%)',
    padding: '1.5rem',
};
const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    padding: '2rem',
    boxSizing: 'border-box',
};
const logoStyle = {
    width: '120px',
    display: 'block',
    margin: '0 auto 1rem',
};
const titleStyle = {
    textAlign: 'center',
    color: '#1976d2',
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
};
const subtitleStyle = {
    textAlign: 'center',
    color: '#5f6368',
    margin: '0 0 1.5rem',
    fontSize: '0.95rem',
};
const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
};
const labelStyle = {
    color: '#444',
    fontWeight: 600,
    fontSize: '0.92rem',
};
const inputStyle = {
    border: '1px solid #dce2ec',
    borderRadius: '10px',
    padding: '0.85rem 1rem',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.2s ease, box-shadow 0.2s ease',
};
const buttonStyle = {
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
const linkStyle = {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
};
const hintStyle = {
    fontSize: '0.85rem',
    color: '#6b7280',
};
function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [form, setForm] = useState({
        portal: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        const savedPortal = localStorage.getItem('portal');
        if (savedPortal) {
            setForm((prev) => ({ ...prev, portal: savedPortal }));
        }
    }, []);
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, location.state, navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === 'portal') {
            localStorage.setItem('portal', value.trim());
        }
    };
    const handleSubmit = async (e) => {
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
            dispatch(setAuth({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken ?? null,
                portal: form.portal.trim(),
                user: data.user,
            }));
            setSuccess(`Bem-vindo(a), ${data.user.nome}!`);
            navigate('/dashboard', { replace: true });
        }
        catch (err) {
            const message = err?.response?.data?.message || 'Não foi possível efetuar login.';
            setError(message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: containerStyle, children: _jsxs("div", { style: cardStyle, children: [_jsx("img", { src: "/logos/app/logo_512.png", alt: "DouttorOculos", style: logoStyle }), _jsx("h1", { style: titleStyle, children: "DouttorOculos" }), _jsx("p", { style: subtitleStyle, children: "Acesse com seu portal, usu\u00E1rio e senha" }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { style: fieldStyle, children: [_jsx("label", { htmlFor: "portal", style: labelStyle, children: "Portal" }), _jsx("input", { id: "portal", name: "portal", type: "text", placeholder: "ex: loja-centro", value: form.portal, onChange: handleChange, style: inputStyle }), _jsx("span", { style: hintStyle, children: "Define a \u00F3tica e a base de dados que ser\u00E1 usada." })] }), _jsxs("div", { style: fieldStyle, children: [_jsx("label", { htmlFor: "username", style: labelStyle, children: "Usu\u00E1rio" }), _jsx("input", { id: "username", name: "username", type: "text", placeholder: "ex: admin", value: form.username, onChange: handleChange, style: inputStyle, autoComplete: "username" })] }), _jsxs("div", { style: fieldStyle, children: [_jsx("label", { htmlFor: "password", style: labelStyle, children: "Senha" }), _jsx("input", { id: "password", name: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", value: form.password, onChange: handleChange, style: inputStyle, autoComplete: "current-password" }), _jsx("span", { style: hintStyle, children: "Admin padr\u00E3o: senha 123456" })] }), error && (_jsx("div", { style: { color: '#d32f2f', background: '#fdecea', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem' }, children: error })), success && (_jsx("div", { style: { color: '#1b5e20', background: '#e8f5e9', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem' }, children: success })), _jsx("button", { type: "submit", style: buttonStyle, disabled: loading, children: loading ? 'Entrando...' : 'Entrar' })] }), _jsxs("div", { style: { marginTop: '1rem', textAlign: 'center' }, children: [_jsx("a", { href: "#", style: linkStyle, onClick: (e) => e.preventDefault(), children: "Esqueci minha senha?" }), _jsx("p", { style: hintStyle, children: "Recurso preparado para enviar e-mail ao Administrador do DouttorOculos." })] })] }) }));
}
export default Login;
