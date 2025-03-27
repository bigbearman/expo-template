interface AuthSlice {
  isAuthenticated: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

export const createAuthSlice = (set: any): AuthSlice => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}) 