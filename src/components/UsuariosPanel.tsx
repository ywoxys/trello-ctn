import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { getUsuarios, createUsuario, updateUsuario } from '../lib/supabase';
import type { Usuario } from '../types';

export function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    equipe: 'ligacao' as 'whatsapp' | 'supervisao' | 'ligacao',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUsuario = await createUsuario({
        ...formData,
        ativo: true,
      });
      setUsuarios(prev => [...prev, newUsuario]);
      setFormData({ email: '', nome: '', equipe: 'ligacao' });
      setShowForm(false);
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      setError(err.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const toggleUsuarioStatus = async (id: string, ativo: boolean) => {
    try {
      await updateUsuario(id, { ativo: !ativo });
      setUsuarios(prev => 
        prev.map(u => u.id === id ? { ...u, ativo: !ativo } : u)
      );
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError('Erro ao atualizar usuário');
    }
  };

  const getEquipeColor = (equipe: string) => {
    switch (equipe) {
      case 'supervisao': return 'bg-purple-100 text-purple-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'ligacao': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipeLabel = (equipe: string) => {
    switch (equipe) {
      case 'supervisao': return 'Supervisão';
      case 'whatsapp': return 'WhatsApp';
      case 'ligacao': return 'Ligação';
      default: return equipe;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
              <p className="text-purple-100 mt-1">Cadastre e gerencie usuários do sistema</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Usuário</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Equipe *
                    </label>
                    <select
                      value={formData.equipe}
                      onChange={(e) => setFormData(prev => ({ ...prev, equipe: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      required
                    >
                      <option value="ligacao">Ligação</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="supervisao">Supervisão</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Criando...' : 'Criar Usuário'}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Usuários Cadastrados ({usuarios.length})</span>
            </h3>
            
            {usuarios.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum usuário cadastrado</p>
                <p className="text-gray-400 mt-1">Adicione o primeiro usuário acima</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className={`flex items-center justify-between rounded-lg p-4 transition-all duration-200 ${
                      usuario.ativo ? 'bg-gray-50 hover:bg-gray-100' : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        usuario.ativo ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-400'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${usuario.ativo ? 'text-gray-900' : 'text-gray-500'}`}>
                            {usuario.nome}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEquipeColor(usuario.equipe)}`}>
                            {getEquipeLabel(usuario.equipe)}
                          </span>
                          {!usuario.ativo && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${usuario.ativo ? 'text-gray-500' : 'text-gray-400'}`}>
                          {usuario.email}
                        </p>
                        <p className={`text-xs ${usuario.ativo ? 'text-gray-400' : 'text-gray-300'}`}>
                          Cadastrado em {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleUsuarioStatus(usuario.id, usuario.ativo)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        usuario.ativo 
                          ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                      title={usuario.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                    >
                      {usuario.ativo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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