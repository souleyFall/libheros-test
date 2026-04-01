<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authAPI } from '../services/api';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const emailConfirm = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');
const loading = ref(false);

const validateForm = (): boolean => {
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs obligatoires';
    return false;
  }

  if (email.value !== emailConfirm.value) {
    error.value = 'Les emails ne correspondent pas';
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return false;
  }

  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères';
    return false;
  }

  return true;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authAPI.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    router.push('/login');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>LibHeros - Créer un compte</h1>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              placeholder="Votre prénom"
            />
          </div>

          <div class="form-group">
            <label for="lastName">Nom</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="votre@email.com"
          />
        </div>

        <div class="form-group">
          <label for="emailConfirm">Confirmer l'email</label>
          <input
            id="emailConfirm"
            v-model="emailConfirm"
            type="email"
            placeholder="Confirmer votre email"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Votre mot de passe"
          />
        </div>

        <div class="form-group">
          <label for="passwordConfirm">Confirmer le mot de passe</label>
          <input
            id="passwordConfirm"
            v-model="passwordConfirm"
            type="password"
            placeholder="Confirmer votre mot de passe"
          />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Création du compte...' : 'Créer un compte' }}
        </button>
      </form>

      <p class="login-link">
        Vous avez déjà un compte?
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #e53e3e;
  background: #fff5f5;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
