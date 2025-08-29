import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Loader2 } from 'lucide-react';
import { getAtendentes, createAtendente, deleteAtendente } from '../lib/supabase';
import type { Atendente } from '../types';

export function AtendentesPanel() {
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [newAtendenteName, setNewAtendenteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAtendentes();
  }, []);

  const loadAtendentes = async () => {
    try {
      const data = await getAtendentes();
      setAtendentes(data);
    } catch (err) {
      console.error('Erro ao carregar atendentes:', err);
      setError('Erro ao carregar atendentes');
    }
  };

  const handleAddAtendente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAtendenteName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const newAtendente = await createAtendente(newAtendenteName.trim());
      setAtendentes(prev => [...prev, newAtendente]);
      setNewAtendenteName('');
    } catch (err) {
      console.error('Erro ao criar atendente:', err);
      setError('Erro ao criar atendente');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAtendente = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este atendente?')) return;

    try {
      await deleteAtendente(id);
      setAtendentes(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar atendente:', err);
      setError('Erro ao deletar atendente');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
          <h2 className="text-2xl font-bold text-white">Gerenciar Atendentes</h2>
          <p className="text-green-100 mt-1">Cadastre e gerencie os atendentes do sistema</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              {error}
            </div>
          )}

          {/* Formulário para adicionar atendente */}
          <form onSubmit={handleAddAtendente} className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newAtendenteName}
                  onChange={(e) => setNewAtendenteName(e.target.value)}
                  placeholder="Nome do atendente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{loading ? 'Adicionando...' : 'Adicionar'}</span>
              </button>
            </div>
          </form>

          {/* Lista de atendentes */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Atendentes Cadastrados ({atendentes.length})</span>
            </h3>
            
            {atendentes.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum atendente cadastrado</p>
                <p className="text-gray-400 mt-1">Adicione o primeiro atendente acima</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {atendentes.map((atendente) => (
                  <div
                    key={atendente.id}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{atendente.nome}</h4>
                        <p className="text-sm text-gray-500">
                          Cadastrado em {new Date(atendente.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAtendente(atendente.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                      title="Excluir atendente"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}