import React from 'react';
import { Users, FileText, Home, CheckSquare, LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: 'ticket' | 'atendentes' | 'historico' | 'solicitacoes' | 'equipes';
  onViewChange: (view: 'ticket' | 'atendentes' | 'historico' | 'solicitacoes' | 'equipes') => void;
  currentTeam: string;
  onLogout: () => void;
}

export function Navigation({ currentView, onViewChange, currentTeam, onLogout }: NavigationProps) {
  const getNavItems = () => {
    const baseItems = [
      { id: 'historico' as const, label: 'Histórico', icon: Home },
    ];

    if (currentTeam === 'ligacao') {
      return [
        { id: 'ticket' as const, label: 'Novo Ticket', icon: FileText },
        ...baseItems,
      ];
    }

    if (currentTeam === 'whatsapp') {
      return [
        { id: 'solicitacoes' as const, label: 'Solicitações', icon: CheckSquare },
        ...baseItems,
      ];
    }

    if (currentTeam === 'supervisao') {
      return [
        { id: 'ticket' as const, label: 'Novo Ticket', icon: FileText },
        { id: 'atendentes' as const, label: 'Atendentes', icon: Users },
        { id: 'equipes' as const, label: 'Equipes', icon: Settings },
        { id: 'solicitacoes' as const, label: 'Solicitações', icon: CheckSquare },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const getEquipeColor = (equipe: string) => {
    switch (equipe) {
      case 'supervisao': return 'bg-purple-100 text-purple-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'ligacao': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema de Tickets</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">Equipe: {currentTeam.charAt(0).toUpperCase() + currentTeam.slice(1)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEquipeColor(currentTeam)}`}>
                  {currentTeam.charAt(0).toUpperCase() + currentTeam.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-red-600 hover:text-red-800 hover:bg-red-50 ml-4"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}