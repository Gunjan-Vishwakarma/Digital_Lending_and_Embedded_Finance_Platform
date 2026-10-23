import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { setAccessToken } from '../../services/api';
import type { User, AuthState, LoginCredentials, RegisterPayload, UserRole } from '../../types/user';

export const DEMO_USERS: Record<UserRole, User> = {
  BORROWER: {
    id: 'usr_borrower_01',
    email: 'borrower@nexfin.io',
    role: 'BORROWER',
    kycStatus: 'VERIFIED',
    firstName: 'Alex',
    lastName: 'Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
  LENDER: {
    id: 'usr_lender_02',
    email: 'lender@nexfin.io',
    role: 'LENDER',
    kycStatus: 'VERIFIED',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
  ADMIN: {
    id: 'usr_admin_03',
    email: 'admin@nexfin.io',
    role: 'ADMIN',
    kycStatus: 'VERIFIED',
    firstName: 'Elena',
    lastName: 'Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
  MERCHANT: {
    id: 'usr_merchant_04',
    email: 'merchant@nexfin.io',
    role: 'MERCHANT',
    kycStatus: 'VERIFIED',
    firstName: 'David',
    lastName: 'Cho',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2026-03-05T14:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
};

// Check if there was a saved session in sessionStorage
const savedUser = sessionStorage.getItem('nexfin_demo_user');
const initialUser: User | null = savedUser ? JSON.parse(savedUser) : DEMO_USERS.BORROWER;

const initialState: AuthState = {
  user: initialUser,
  accessToken: initialUser ? 'demo_jwt_token_sample' : null,
  isAuthenticated: !!initialUser,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error?.message || 'Login failed');
      }
      return response.data;
    } catch {
      // Fallback for demo testing when backend API isn't yet online
      const matchedRole: UserRole =
        credentials.email.includes('admin') ? 'ADMIN' :
        credentials.email.includes('lender') ? 'LENDER' :
        credentials.email.includes('merchant') ? 'MERCHANT' : 'BORROWER';

      const demo = DEMO_USERS[matchedRole];
      const fallbackUser: User = {
        ...demo,
        email: credentials.email,
        firstName: credentials.email.split('@')[0],
      };
      return {
        user: fallbackUser,
        accessToken: 'mock_access_token_' + Date.now(),
        expiresIn: 3600,
      };
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error?.message || 'Registration failed');
      }
      return response.data;
    } catch {
      // Fallback for client testing
      const newUser: User = {
        id: 'usr_' + Date.now(),
        email: payload.email,
        role: payload.role,
        kycStatus: 'VERIFIED',
        firstName: payload.firstName,
        lastName: payload.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        user: newUser,
        accessToken: 'mock_access_token_' + Date.now(),
        expiresIn: 3600,
      };
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      if (!response.success || !response.data) {
        return rejectWithValue('Failed to fetch profile');
      }
      return response.data;
    } catch {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  sessionStorage.removeItem('nexfin_demo_user');
  try {
    await authService.logout();
  } catch {
    // ignore backend errors on logout
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('nexfin_demo_user', JSON.stringify(action.payload));
    },
    loginDemoUser(state, action: PayloadAction<UserRole>) {
      const demoUser = DEMO_USERS[action.payload];
      state.user = demoUser;
      state.accessToken = 'mock_jwt_' + action.payload.toLowerCase();
      state.isAuthenticated = true;
      state.error = null;
      setAccessToken(state.accessToken);
      sessionStorage.setItem('nexfin_demo_user', JSON.stringify(demoUser));
    },
    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('nexfin_demo_user');
      setAccessToken(null);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        sessionStorage.setItem('nexfin_demo_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        sessionStorage.setItem('nexfin_demo_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch profile
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, () => {
        // Keep existing user if already set
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, setUser, loginDemoUser, forceLogout } = authSlice.actions;
export default authSlice.reducer;
