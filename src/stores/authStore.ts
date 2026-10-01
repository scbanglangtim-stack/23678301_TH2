import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  phoneNumber: string | null;
  login: (phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  phoneNumber: null,

  login: (phone: string) => {
    const stamp = examStamp();
    const mockToken = `ktxgo-${STUDENT.mssv}-${stamp}`;
    set({
      token: mockToken,
      phoneNumber: phone,
    });
  },

  logout: () => {
    set({
      token: null,
      phoneNumber: null,
    });
  },
}));
