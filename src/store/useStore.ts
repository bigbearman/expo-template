import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define interfaces first
interface User {
  id: string
  name: string
  email: string
}

interface ApiResponse {
  data: User
}

// Define a simple mock API service
// In a real app, you would import this from your services directory
const apiService = {
  getUser: async (id: string): Promise<ApiResponse> => {
    // This would be a real API call in production
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            name: 'John Doe',
            email: 'john@example.com'
          }
        });
      }, 1000);
    });
  }
};

// Định nghĩa interface cho state
export interface AppState {
  // Auth state
  isAuthenticated: boolean
  user: User | null
  // Auth actions
  login: (userData: User) => void
  logout: () => void
  
  // Theme state
  theme: 'light' | 'dark' | 'system'
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  isLoading: boolean
  error: string | null
  fetchUser: (id: string) => Promise<void>
}

// Also export the User interface
export type { User };

// Tạo store với persist middleware để lưu state vào AsyncStorage
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      theme: 'system',
      isLoading: false,
      error: null,

      // Actions
      login: (userData) => set({ 
        isAuthenticated: true, 
        user: userData 
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        user: null 
      }),
      setTheme: (theme) => set({ theme }),
      fetchUser: async (id) => {
        try {
          set({ isLoading: true, error: null })
          const response = await apiService.getUser(id)
          set({ user: response.data, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      }
    }),
    {
      name: 'app-storage', // tên unique cho storage
      storage: createJSONStorage(() => AsyncStorage),
      // Chọn những state cần persist
      partialize: (state) => ({ 
        user: state.user,
        theme: state.theme,
      }),
    }
  )
) 