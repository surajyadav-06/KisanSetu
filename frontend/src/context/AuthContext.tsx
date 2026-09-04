import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  demoAccounts: User[];
}

const DEFAULT_DEMO_USERS: User[] = [
  {
    id: 1,
    full_name: 'Ramesh Patil (Demo Farmer)',
    email: 'farmer@kisansetu.in',
    mobile: '+91 98220 11442',
    role: 'Farmer',
    location: 'Nashik, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 7,
    full_name: 'Taj Hotels & Fresh Mart (Demo Bulk Buyer)',
    email: 'buyer@kisansetu.in',
    mobile: '+91 98200 44556',
    role: 'Bulk Buyer',
    location: 'Nariman Point, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6,
    full_name: 'Sahyadri Farmers Producer Co. (Demo FPO)',
    email: 'fpo@kisansetu.in',
    mobile: '+91 98230 99887',
    role: 'FPO',
    location: 'Nashik Agro Hub',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 8,
    full_name: 'Priya Sharma (Demo Consumer)',
    email: 'consumer@kisansetu.in',
    mobile: '+91 98191 22334',
    role: 'Consumer',
    location: 'Bandra West, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USERS[0]); // Default to Demo Farmer
  const [role, setRole] = useState<UserRole>('Farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<User[]>(DEFAULT_DEMO_USERS);
  const { showToast } = useToast();

  useEffect(() => {
    // Attempt loading demo accounts from API
    authService.getDemoUsers()
      .then((users) => {
        if (users && users.length > 0) {
          setDemoAccounts(users);
        }
      })
      .catch(() => {
        // use fallback demo accounts
      });
  }, []);

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setRole(data.user.role);
      showToast('success', 'Logged in successfully', `Active role: ${data.user.role}`);
    } catch (err: any) {
      // Fallback matching demo user
      const matched = demoAccounts.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUser(matched);
        setRole(matched.role);
        showToast('success', `Signed in as ${matched.full_name}`, `Switched to ${matched.role} workspace.`);
      } else {
        showToast('error', 'Login Failed', 'Please verify your credentials or select a 1-click demo role.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User> & { password?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      setRole(res.user.role);
      showToast('success', 'Account Registered', `Welcome to KisanSetu as a ${res.user.role}!`);
    } catch (err: any) {
      // Client-side fallback registration for demo resilience
      const newUser: User = {
        id: Date.now(),
        full_name: data.full_name || 'New Member',
        email: data.email || 'user@kisansetu.in',
        role: data.role || 'Farmer',
        location: data.location || 'Maharashtra, India',
        mobile: data.mobile || '+91 98000 00000'
      };
      setUser(newUser);
      setRole(newUser.role);
      showToast('success', 'Account Created', `Active role: ${newUser.role}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kisansetu_token');
    showToast('info', 'Logged Out', 'You have been safely signed out.');
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    const targetUser = demoAccounts.find((u) => u.role === targetRole) || {
      id: targetRole === 'Farmer' ? 1 : targetRole === 'Bulk Buyer' ? 7 : targetRole === 'FPO' ? 6 : 8,
      full_name: targetRole === 'Farmer' ? 'Ramesh Patil (Demo Farmer)' : targetRole === 'Bulk Buyer' ? 'Taj Hospitality Group (Bulk Buyer)' : targetRole === 'FPO' ? 'Sahyadri Farmers Co.' : 'Priya Sharma (Consumer)',
      email: `${targetRole.toLowerCase().replace(' ', '')}@kisansetu.in`,
      role: targetRole,
      location: targetRole === 'Farmer' || targetRole === 'FPO' ? 'Nashik, Maharashtra' : 'Mumbai, Maharashtra'
    };
    setUser(targetUser);
    setRole(targetRole);
    showToast('info', `Switched Role to ${targetRole}`, `Now viewing ${targetUser.full_name}'s workspace`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : role,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        demoAccounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
