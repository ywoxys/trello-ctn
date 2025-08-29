import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Phone, DollarSign, Hash, User } from 'lucide-react';
import { getTickets } from '../lib/supabase';

interface TicketWithAtendente {
  id: string;
  matricula: string;
  nome: string;
  valor: number;
  qtd_mensalidades: number;
  telefone: string;
  categoria: string;
  created_at: string;
  atendentes: {
    nome: string;
  };
}

export function HistoricoTickets() {
  const [tickets, setTickets] = useState<TicketWithAtendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data as TicketWithAtendente[]);
    } catch (err) {
      console.error('Erro ao carregar tickets:', err);
      setError('Erro ao carregar histórico de tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <h2 className="text-2xl font-bold text-white">Histórico de Tickets</h2>
          <p className="text-purple-100 mt-1">Visualize todos os tickets criados no sistema</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              {error}
            </div>
          )}

          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum ticket encontrado</p>
              <p className="text-gray-400 mt-1">Crie seu primeiro ticket na aba "Novo Ticket"</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Total de Tickets: {tickets.length}</span>
                </h3>
              </div>

              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {ticket.categoria}
                            {ticket.subcategoria && (
                              <span className="ml-1 text-xs">
                                ({ticket.subcategoria === 'endereco' ? 'Endereço' : 'Comprovantes'})
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500 text-sm">
                            #{ticket.id.slice(-8)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <FileText className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">{ticket.atendentes?.nome}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Hash className="w-4 h-4 text-indigo-500" />
                            <span>{ticket.matricula}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-700">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{ticket.nome}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-700">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>R$ {ticket.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{ticket.qtd_mensalidades}x</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Phone className="w-4 h-4 text-orange-500" />
                            <span>{ticket.telefone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ticket.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}