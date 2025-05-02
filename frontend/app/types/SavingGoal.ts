export interface SavingGoal {
    goalId: string;
    planId: string;
    title: string;
    amount: number;
    deadline: string; // or use Date if you'll convert it
    ruleDescription: string;
  }
  
  export interface NewSavingGoal {
    planId: string;
    title: string;
    amount: number;
    deadline: string;
    ruleDescription: string;
  }