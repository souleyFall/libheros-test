import { ref, computed } from 'vue';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// État global
const token = ref<string | null>(localStorage.getItem('token'));
const user = ref<User | null>(null);

// Gérer le token
const setToken = (newToken: string) => {
  token.value = newToken;
  localStorage.setItem('token', newToken);
};

const clearToken = () => {
  token.value = null;
  user.value = null;
  localStorage.removeItem('token');
};

const setUser = (newUser: User) => {
  user.value = newUser;
};

const isAuthenticated = computed(() => !!token.value);

export const useAuth = () => ({
  token,
  user,
  isAuthenticated,
  setToken,
  clearToken,
  setUser,
});
