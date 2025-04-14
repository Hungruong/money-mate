// types.ts
export interface SavingPlan {
    planId: string;  // UUID as string in TypeScript
    planType: 'Individual' | 'Group';  // Enumerated type
    userId: string;   // UUID as string
    name: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;  // ISO date string (e.g., "2025-03-25")
    endDate: string;    // ISO date string
    createdAt: string;  // ISO timestamp
}

export interface CreatePlanRequest {
    planType: 'Individual' | 'Group';
    userId: string;
    name: string;
    targetAmount: number;
    startDate: string;
    endDate: string;
}

export interface UpdatePlanRequest {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    endDate?: string;
}