import { createClient } from '@supabase/supabase-js';
import type { Solicitacao, Equipe } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções para atendentes
export const getAtendentes = async () => {
  const { data, error } = await supabase
    .from('atendentes')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const createAtendente = async (nome: string) => {
  const { data, error } = await supabase
    .from('atendentes')
    .insert([{ nome }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAtendente = async (id: string) => {
  const { error } = await supabase
    .from('atendentes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Funções para tickets
export const createTicket = async (ticket: Omit<Ticket, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      atendentes (
        nome
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Funções de autenticação
export const signInWithTeam = async (equipe: string, senha: string) => {
  // Verificar se a equipe e senha estão corretas
  const { data: equipeData, error: equipeError } = await supabase
    .from('equipes')
    .select('*')
    .eq('nome', equipe)
    .eq('senha', senha)
    .eq('ativo', true)
    .single();
  
  if (equipeError || !equipeData) {
    throw new Error('Equipe ou senha incorreta');
  }
  
  return { equipe: equipeData };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Funções para equipes
export const getEquipes = async () => {
  const { data, error } = await supabase
    .from('equipes')
    .select('*')
    .eq('ativo', true)
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const updateEquipeSenha = async (id: string, novaSenha: string) => {
  const { data, error } = await supabase
    .from('equipes')
    .update({ senha: novaSenha })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Funções para solicitações
export const createSolicitacao = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('solicitacoes')
    .insert([{ ticket_id: ticketId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSolicitacoes = async () => {
  const { data, error } = await supabase
    .from('solicitacoes')
    .select(`
      *,
      ticket:tickets(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateSolicitacao = async (
  id: string, 
  status: 'aprovado' | 'rejeitado', 
  equipe: string,
  observacoes?: string,
  link?: string
) => {
  const { data, error } = await supabase
    .from('solicitacoes')
    .update({
      status,
      aprovado_por_equipe: equipe,
      observacoes,
      ...(link && { link }),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};