export interface Atendente {
  id: string;
  nome: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  atendente_id: string;
  matricula: string;
  nome: string;
  valor: number;
  qtd_mensalidades: number;
  telefone: string;
  categoria: 'Link' | 'Pix' | 'Outros assuntos';
  subcategoria?: 'endereco' | 'comprovantes';
  created_at: string;
}

export interface TicketFormData {
  atendente_id: string;
  matricula: string;
  nome: string;
  valor: string;
  qtd_mensalidades: string;
  telefone: string;
  categoria: 'Link' | 'Pix' | 'Outros assuntos';
  subcategoria?: 'endereco' | 'comprovantes';
}

export interface Equipe {
  id: string;
  nome: 'whatsapp' | 'supervisao' | 'ligacao';
  senha: string;
  ativo: boolean;
  created_at: string;
}

export interface Solicitacao {
  id: string;
  ticket_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  aprovado_por_equipe?: string;
  observacoes?: string;
  link?: string;
  created_at: string;
  updated_at: string;
  ticket?: Ticket;
}