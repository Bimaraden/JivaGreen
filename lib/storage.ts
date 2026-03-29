
import { Waste, User, UserRole, WasteStatus, WithdrawalRequest } from '../types';
import { MOCK_WASTES, MOCK_USER, MOCK_ADMIN } from '../constants';

const WASTES_KEY = 'bf_wastes';
const USERS_KEY = 'bf_users';
const CURRENT_USER_KEY = 'bf_current_user';
const WITHDRAWALS_KEY = 'bf_withdrawals';

export const storage = {
  getWastes: (): Waste[] => {
    const data = localStorage.getItem(WASTES_KEY);
    return data ? JSON.parse(data) : MOCK_WASTES;
  },
  saveWastes: (wastes: Waste[]) => {
    localStorage.setItem(WASTES_KEY, JSON.stringify(wastes));
  },
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [MOCK_USER, MOCK_ADMIN];
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  },
  getWithdrawals: (): WithdrawalRequest[] => {
    const data = localStorage.getItem(WITHDRAWALS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveWithdrawals: (requests: WithdrawalRequest[]) => {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(requests));
  }
};
