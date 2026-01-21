import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout, selectAuth } from '../redux/slices/authSlice';
function Dashboard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, portal } = useAppSelector(selectAuth);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/', { replace: true });
    };
    return (_jsxs("div", { style: { padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { color: '#1976d2', marginBottom: '0.5rem' }, children: "Dashboard" }), _jsxs("p", { style: { color: '#555' }, children: ["Bem-vindo(a)", user ? `, ${user.nome}` : '', "!"] }), _jsxs("p", { style: { color: '#777' }, children: ["Portal ativo: ", portal || 'N/D'] })] }), _jsx("button", { onClick: handleLogout, style: {
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #d32f2f',
                            background: '#fff',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }, children: "Sair" })] }), _jsx("div", { style: { marginTop: '1.5rem', color: '#999' }, children: _jsx("p", { children: "Em breve: resumo de vendas, estoque, receitas e tarefas." }) })] }));
}
export default Dashboard;
