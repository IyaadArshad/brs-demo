export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  pending?: boolean;
  error?: boolean;
}

export interface Command {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  command: string;
  disabled?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
