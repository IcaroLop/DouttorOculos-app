import React from 'react';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <img 
        src="/logos/app/logo_512.png" 
        alt="DouttorOculos" 
        style={{ width: '200px', marginBottom: '2rem' }}
      />
      <h1 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>
        DouttorOculos
      </h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Sistema de Gerenciamento de Óticas
      </p>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.3rem' }}>
          🚀 Ambiente Pronto!
        </h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          A estrutura do projeto está configurada. <br/>
          Próximo passo: implementar componentes React, rotas e integrações com o backend.
        </p>
        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
          <p>✅ React 18+ configurado</p>
          <p>✅ TypeScript ativo</p>
          <p>✅ PWA manifest configurado</p>
          <p>✅ Logos integrados</p>
        </div>
      </div>
    </div>
  );
}

export default App;
