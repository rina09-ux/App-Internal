export type PlanTier = 'free' | 'plus' | 'premium';

export type BillingCycle = 'monthly' | 'annually';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  subtitle: string;
  badge?: {
    text: string;
    variant: 'popular' | 'valuable' | 'discount';
  };
  priceMonthly: number;
  priceAnnually: number; // monthly equivalent when billed annually
  features: string[];
}

export interface AddOnItem {
  id: string;
  title: string;
  subtitle: string;
  pricePerUser: number;
  badge?: string;
  iconType: 'ai-gemini' | 'workflow-assistant';
  active: boolean;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Guest';
  avatar: string;
  lastActive: string;
  seatCost: number;
}

export interface WorkspaceTeam {
  id: string;
  name: string;
  membersCount: number;
  tier: string;
  icon: string;
}

export interface WorkspaceIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  iconName: string;
}
