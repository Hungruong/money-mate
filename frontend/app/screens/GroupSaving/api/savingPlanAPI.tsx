import axios from 'axios';
import { SavingPlan } from '../types';

const API_URL = 'http://localhost:8080/api/saving-plans';

export const getSavingPlans = async (): Promise<SavingPlan[]> => {
    const response = await axios.get<SavingPlan[]>(API_URL);
    return response.data;
};

export const createSavingPlan = async (plan: SavingPlan): Promise<SavingPlan> => {
    const response = await axios.post<SavingPlan>(API_URL, plan);
    return response.data;
};

export const getSavingPlanById = async (id: string): Promise<SavingPlan> => {
    const response = await axios.get<SavingPlan>(`${API_URL}/${id}`);
    return response.data;
};

export const deleteSavingPlan = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};