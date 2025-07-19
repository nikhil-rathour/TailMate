import { auth } from '../config/firebase';

// Get the current user's auth token
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }
  
  return user.getIdToken();
};

// Create authenticated fetch request
export const authFetch = async (url, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    return fetch(url, authOptions);
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
};