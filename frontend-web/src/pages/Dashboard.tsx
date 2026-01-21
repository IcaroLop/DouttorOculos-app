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

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: '#555' }}>Bem-vindo(a){user ? `, ${user.nome}` : ''}!</p>
          <p style={{ color: '#777' }}>Portal ativo: {portal || 'N/D'}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d32f2f',
            background: '#fff',
            color: '#d32f2f',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Sair
        </button>
      </div>
      <div style={{ marginTop: '1.5rem', color: '#999' }}>
        <p>Em breve: resumo de vendas, estoque, receitas e tarefas.</p>
      </div>
    </div>
  );
}

export default Dashboard;
