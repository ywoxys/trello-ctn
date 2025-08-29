import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { getEquipes, updateEquipeSenha } from '../lib/supabase';
import type { Equipe } from '../types';

export function EquipesPanel() {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [senhas, setSenhas] = useState<{ [key: string]: string }>({});
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadEquipes();
  }, []);

  const loadEquipes = async () => {
    try {
      const data = await getEquipes();
      setEquipes(data);
      // Inicializar senhas com valores atuais
      const senhasIniciais: { [key: string]: string } = {};
      data.forEach(equipe => {
        senhasIniciais[equipe.id] = equipe.senha;
      });
      setSenhas(senhasIniciais);
    } catch (err) {
      console.error('Erro ao carregar equipes:', err);
      setError('Erro ao carregar equipes');
    }
  };

  const handleSaveSenha = async (equipeId: string) => {
    setSaving(prev => ({ ...prev, [equipeId]: true }));
    setError('');

    try {
      await updateEquipeSenha(equipeId, senhas[equipeId]);
      setEquipes(prev => 
        prev.map(e => e.id === equipeId ? { ...e, senha: senhas[equipeId] } : e)
      );
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError('Erro ao atualizar senha da equipe');
    } finally {
      setSaving(prev => ({ ...prev, [equipeId]: false }));
    }
  };

  const togglePasswordVisibility = (equipeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [equipeId]: !prev[equipeId]
    }));
  };

  const getEquipeColor = (nome: string) => {
    switch (nome) {
      case 'supervisao': return 'bg-purple-100 text-purple-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'ligacao': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipeLabel = (nome: string) => {
    switch (nome) {
      case 'supervisao': return 'Supervisão';
      case 'whatsapp': return 'WhatsApp';
      case 'ligacao': return 'Ligação';
      default: return nome;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white">Gerenciar Equipes</h2>
          <p className="text-indigo-100 mt-1">Configure as senhas de acesso das equipes</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configurações de Acesso</span>
            </h3>
            
            <div className="grid gap-4">
              {equipes.map((equipe) => (
                <div
                  key={equipe.id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEquipeColor(equipe.nome)}`}>
                        {getEquipeLabel(equipe.nome)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Senha de Acesso
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[equipe.id] ? 'text' : 'password'}
                          value={senhas[equipe.id] || ''}
                          onChange={(e) => setSenhas(prev => ({ ...prev, [equipe.id]: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Digite a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(equipe.id)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords[equipe.id] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => handleSaveSenha(equipe.id)}
                        disabled={saving[equipe.id] || senhas[equipe.id] === equipe.senha}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving[equipe.id] ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        <span>{saving[equipe.id] ? 'Salvando...' : 'Salvar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}