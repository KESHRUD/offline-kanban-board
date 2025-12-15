

import { User, Speciality } from '../types';

const STORAGE_KEY = 'sup_galilee_auth_user';

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
        // Attempt to load existing user details if strictly logging in without register data
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
             const parsed = JSON.parse(stored);
             if (parsed.username === username) {
                 return parsed;
             }
        }

        user = {
            username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: 'engineer',
            provider: 'local',
            avatarUrl: robotAvatar,
            speciality: speciality || 'prepa',
            xp: 0,
            level: 1,
            rank: 'Novice'
        };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  // Simulates a Registration API Call
  register: async (data: { username: string; email: string; speciality: Speciality }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const robotAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${data.speciality}_${data.username}&backgroundColor=transparent`;

    const newUser: User = {
        username: data.username,
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
  }
};
