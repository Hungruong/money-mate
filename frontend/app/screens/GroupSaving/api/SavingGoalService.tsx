import axios from 'axios';
import { SavingGoal, NewSavingGoal } from '../types/SavingGoal';

const API_URL = 'http://localhost:8080/api/saving-goals';

export const getAllSavingGoals = async (): Promise<SavingGoal[]> => {
  const response = await axios.get<SavingGoal[]>(API_URL);
  return response.data;
};

export const createSavingGoal = async (goal: NewSavingGoal): Promise<SavingGoal> => {
  const response = await axios.post<SavingGoal>(API_URL, goal);
  return response.data;
};

export const updateSavingGoal = async (
  goalId: string,
  updatedGoal: Partial<SavingGoal>
): Promise<SavingGoal> => {
  const response = await axios.put<SavingGoal>(`${API_URL}/${goalId}`, updatedGoal);
  return response.data;
};

export const deleteSavingGoal = async (goalId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${goalId}`);
};