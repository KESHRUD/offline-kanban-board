

import type { User, Speciality } from '../types';

const STORAGE_KEY = 'sup_galilee_auth_user';
const USERS_REGISTRY_KEY = 'sup_galilee_users_registry';

// Helper to get all registered users
const getUsersRegistry = (): Record<string, User> => {
  const stored = localStorage.getItem(USERS_REGISTRY_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Helper to save a user to the registry
const saveUserToRegistry = (user: User) => {
  const registry = getUsersRegistry();
  registry[user.username.toLowerCase()] = user;
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
};

// Helper to get a user from the registry by username
const getUserFromRegistry = (username: string): User | null => {
  const registry = getUsersRegistry();
  return registry[username.toLowerCase()] || null;
};

export const authService = {
  // Simulates a Login API Call
  login: async (username: string, provider: 'google' | 'local' = 'local', speciality?: Speciality): Promise<User> => {
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let user: User;
    
    const seed = username.toLowerCase().trim();
    // Use speciality to influence avatar style if possible, or just seed
    const avatarSeed = speciality ? `${speciality}_${seed}` : seed;
    const robotAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=transparent`;
    
    if (provider === 'google') {
        user = {
            username: 'google_user',
            name: 'Étudiant Sup Galilée',
            role: 'engineer',
            avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=supgalilee_student&backgroundColor=transparent', 
            provider: 'google',
            speciality: 'info', // Default for google demo
            xp: 0,
            level: 1,
            rank: 'Novice'
        };
    } else {
        // Check if user already exists in registry (returning user)
        const existingUser = getUserFromRegistry(username);
        
        if (existingUser) {
            // User found! Load their existing session
            user = existingUser;
        } else {
            // New user - create new account
            user = {
                username: username.toLowerCase().trim(),
                name: username.charAt(0).toUpperCase() + username.slice(1),
                role: 'engineer',
                provider: 'local',
                avatarUrl: robotAvatar,
                speciality: speciality || 'prepa',
                xp: 0,
                level: 1,
                rank: 'Novice'
            };
            // Save to registry for future logins
            saveUserToRegistry(user);
        }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  // Simulates a Registration API Call
  register: async (data: { username: string; email: string; speciality: Speciality }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const normalizedUsername = data.username.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = getUserFromRegistry(normalizedUsername);
    if (existingUser) {
      // User already exists - just log them in with their existing data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
      return existingUser;
    }

    const robotAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${data.speciality}_${normalizedUsername}&backgroundColor=transparent`;

    const newUser: User = {
        username: normalizedUsername,
        name: data.username.charAt(0).toUpperCase() + data.username.slice(1),
        email: data.email,
        role: 'engineer',
        speciality: data.speciality,
        provider: 'local',
        avatarUrl: robotAvatar,
        xp: 0,
        level: 1,
        rank: 'Novice'
    };

    // Save to registry for future logins
    saveUserToRegistry(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    // Only remove current session, NOT the user from registry
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Check if a username exists in the registry
  userExists: (username: string): boolean => {
    return getUserFromRegistry(username) !== null;
  },

  updateXp: async (amount: number): Promise<User | null> => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const user = JSON.parse(stored) as User;
      const newXp = (user.xp || 0) + amount;
      const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
      
      let newRank = 'Novice';
      if (newLevel >= 2) newRank = 'Adept';
      if (newLevel >= 5) newRank = 'Engineer';
      if (newLevel >= 10) newRank = 'Senior';
      if (newLevel >= 20) newRank = 'Legend';

      const updatedUser = { ...user, xp: newXp, level: newLevel, rank: newRank };
      
      // Update both current session and registry
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      saveUserToRegistry(updatedUser);
      
      return updatedUser;
  }
};
