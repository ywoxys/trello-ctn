import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Phone, DollarSign, Hash, User, Search, Filter, CheckCircle, XCircle, Send, CreditCard, MessageSquare } from 'lucide-react';
import { getTickets, getAtendentes, updateTicketStatus } from '../lib/supabase';
import type { Atendente } from '../types';

interface TicketWithAtendente {
  id: string;
  matricula: string;
  nome: string;
  valor: number;
  qtd_mensalidades: number;
  telefone: string;
  categoria: string;
  subcategoria?: string;
  observacoes?: string;
  enviado: boolean;
  pago: boolean;
  data_envio?: string;
  data_pagamento?: string;
  created_at: string;
  atendentes: {
    nome: string;
  };
}

interface Filters {
  search: string;
  atendente: string;
  enviado: string;
  pago: string;
}

export function HistoricoTickets() {
  const [tickets, setTickets] = useState<TicketWithAtendente[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketWithAtendente[]>([]);
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    atendente: '',
    enviado: '',
    pago: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters]);

  const loadData = async () => {
    try {
      const [ticketsData, atendentesData] = await Promise.all([
        getTickets(),
        getAtendentes()
      ]);
      setTickets(ticketsData as TicketWithAtendente[]);
      setAtendentes(atendentesData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar histórico de tickets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Filtro de busca (nome, matrícula ou número do ticket)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.nome.toLowerCase().includes(searchLower) ||
        ticket.matricula.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por atendente
    if (filters.atendente) {
      filtered = filtered.filter(ticket => ticket.atendentes?.nome === filters.atendente);
    }

    // Filtro por status de envio
    if (filters.enviado !== '') {
      const isEnviado = filters.enviado === 'true';
      filtered = filtered.filter(ticket => ticket.enviado === isEnviado);
    }

    // Filtro por status de pagamento
    if (filters.pago !== '') {
      const isPago = filters.pago === 'true';
      filtered = filtered.filter(ticket => ticket.pago === isPago);
    }

    setFilteredTickets(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      atendente: '',
      enviado: '',
      pago: '',
    });
  };

  const toggleTicketStatus = async (ticketId: string, field: 'enviado' | 'pago', currentValue: boolean) => {
    try {
      const updates: any = { [field]: !currentValue };
      
      if (field === 'enviado') {
        updates.data_envio = !currentValue ? new Date().toISOString() : null;
      } else if (field === 'pago') {
        updates.data_pagamento = !currentValue ? new Date().toISOString() : null;
      }

      await updateTicketStatus(ticketId, updates);
      
      // Atualizar estado local
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, ...updates }
            : ticket
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do ticket');
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <h2 className="text-2xl font-bold text-white">Histórico de Tickets</h2>
          <p className="text-purple-100 mt-1">Visualize e gerencie todos os tickets criados no sistema</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
              >
                Limpar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Busca */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome, matrícula ou número do ticket"
                  />
                </div>
              </div>

              {/* Atendente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atendente
                </label>
                <select
                  value={filters.atendente}
                  onChange={(e) => handleFilterChange('atendente', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Todos</option>
                  {atendentes.map((atendente) => (
                    <option key={atendente.id} value={atendente.nome}>
                      {atendente.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status de Envio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enviado
                </label>
                <select
                  value={filters.enviado}
                  onChange={(e) => handleFilterChange('enviado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="true">Enviados</option>
                  <option value="false">Não enviados</option>
                </select>
              </div>

              {/* Status de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pago
                </label>
                <select
                  value={filters.pago}
                  onChange={(e) => handleFilterChange('pago', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="true">Pagos</option>
                  <option value="false">Não pagos</option>
                </select>
              </div>
            </div>

            {/* Resumo dos filtros */}
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
              <span>Mostrando {filteredTickets.length} de {tickets.length} tickets</span>
              {(filters.search || filters.atendente || filters.enviado || filters.pago) && (
                <span className="text-purple-600">• Filtros ativos</span>
              )}
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {tickets.length === 0 ? 'Nenhum ticket encontrado' : 'Nenhum ticket corresponde aos filtros'}
              </p>
              <p className="text-gray-400 mt-1">
                {tickets.length === 0 ? 'Crie seu primeiro ticket na aba "Novo Ticket"' : 'Tente ajustar os filtros acima'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
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
                      
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ticket.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <User className="w-4 h-4 text-purple-500" />
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

                    {/* Observações */}
                    {ticket.observacoes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Observações:</p>
                            <p className="text-sm text-blue-700">{ticket.observacoes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status e ações */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {/* Status de envio */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleTicketStatus(ticket.id, 'enviado', ticket.enviado)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                              ticket.enviado
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {ticket.enviado ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span>{ticket.enviado ? 'Enviado' : 'Não enviado'}</span>
                          </button>
                          {ticket.enviado && ticket.data_envio && (
                            <span className="text-xs text-gray-500">
                              em {new Date(ticket.data_envio).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>

                        {/* Status de pagamento */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleTicketStatus(ticket.id, 'pago', ticket.pago)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                              ticket.pago
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {ticket.pago ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            <span>{ticket.pago ? 'Pago' : 'Não pago'}</span>
                          </button>
                          {ticket.pago && ticket.data_pagamento && (
                            <span className="text-xs text-gray-500">
                              em {new Date(ticket.data_pagamento).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
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