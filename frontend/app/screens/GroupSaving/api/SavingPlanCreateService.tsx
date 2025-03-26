// api/SavingGroupService.ts
import { SavingGroup, CreateGroupRequest } from '../types/SavingGroup';

const API_BASE_URL = 'http://localhost:8084/api/saving-plans';

export class SavingGroupService {
  static async createGroup(groupData: CreateGroupRequest): Promise<SavingGroup> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      throw new Error('Failed to create group');
    }

    return response.json();
  }

  static async getAllGroups(): Promise<SavingGroup[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    return response.json();
  }

  static async deleteGroup(groupId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${groupId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }
  }
}