export enum UserRole {
  STUDENT = 'Student',
  PROFESSOR = 'Professor',
  RESEARCHER = 'Researcher',
  ASPIRING = 'Aspiring Researcher'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  institution: string;
  interests: string[];
  avatar: string;
  bio: string;
  collaboratorScore: number;
  socialLinks?: {
    linkedin?: string;
    googleScholar?: string;
    orcid?: string;
    website?: string;
  };
}

export interface ResearchPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  videoUrl?: string; // Simulated video placeholder
  description: string;
  tags: string[];
  likes: number;
}

export interface Opportunity {
  id: string;
  title: string;
  institution: string;
  type: 'Grant' | 'Job' | 'Collaboration';
  deadline: string;
  amount?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MATCH = 'MATCH',
  FEED = 'FEED',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE = 'PROFILE',
  AI_ASSISTANT = 'AI_ASSISTANT',
}