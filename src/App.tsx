import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { TicketForm } from './components/TicketForm';
import { AtendentesPanel } from './components/AtendentesPanel';
import { HistoricoTickets } from './components/HistoricoTickets';
import { SolicitacoesPanel } from './components/SolicitacoesPanel';
import { EquipesPanel } from './components/EquipesPanel';

function App() {
  const [currentTeam, setCurrentTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'ticket' | 'atendentes' | 'historico' | 'solicitacoes' | 'equipes'>('ticket');

  useEffect(() => {
    checkTeam();
  }, []);

  const checkTeam = async () => {
    try {
      const team = localStorage.getItem('currentTeam');
      if (team) {
        setCurrentTeam(team);
      }
    } catch (error) {
      console.error('Erro ao verificar equipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const team = localStorage.getItem('currentTeam');
    setCurrentTeam(team);
  };

  const handleLogout = async () => {
    localStorage.removeItem('currentTeam');
    setCurrentTeam(null);
    setCurrentView('ticket');
  };

  const renderCurrentView = () => {
    if (!currentTeam) return null;

    switch (currentView) {
      case 'ticket':
        return <TicketForm currentTeam={currentTeam} />;
      case 'atendentes':
        return currentTeam === 'supervisao' ? <AtendentesPanel /> : <div>Acesso negado</div>;
      case 'historico':
        return <HistoricoTickets />;
      case 'equipes':
        return currentTeam === 'supervisao' ? <EquipesPanel /> : <div>Acesso negado</div>;
      case 'solicitacoes':
        return ['whatsapp', 'supervisao', 'ligacao'].includes(currentTeam) ? <SolicitacoesPanel currentTeam={currentTeam} /> : <div>Acesso negado</div>;
      default:
        return <TicketForm currentTeam={currentTeam} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentTeam) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        currentTeam={currentTeam}
        onLogout={handleLogout}
      />
      <main className="py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;