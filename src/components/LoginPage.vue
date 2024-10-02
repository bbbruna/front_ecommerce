<template>
  <div class="container mt-5">
    <h2 class="title">Login</h2>
    <p class="text-muted">Conecte-se à sua conta para continuar sua jornada conosco!</p>

    <div v-if="isLoggedIn">
      <p class="text-success">Você já está logado!</p>
      <router-link to="/">Ir para a página inicial</router-link>
    </div>
    
    <form v-else @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          type="text"
          class="form-control"
          v-model="email"
          @blur="validateEmail"
          :class="{ 'is-invalid': emailError }"
        />
        <div class="invalid-feedback">{{ emailError }}</div>
      </div>
      
      <div class="mb-3">
        <label for="password" class="form-label">Senha:</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            v-model="password"
            @blur="validatePassword"
            :class="{ 'is-invalid': passwordError }"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div class="invalid-feedback">{{ passwordError }}</div>
      </div>
      
      <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
        {{ isSubmitting ? 'Entrando...' : 'Login' }}
      </button>
    </form>

    <div v-if="snackbarMessage" class="snackbar show">
      {{ snackbarMessage }}
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService';

export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      isSubmitting: false,
      snackbarMessage: '',
      isLoggedIn: false,
      showPassword: false,
    };
  },
  async created() {
    this.isLoggedIn = await AuthService.isLoggedIn(this.$router); 
    if (this.isLoggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = this.email
        ? regex.test(this.email)
          ? ''
          : 'Email inválido'
        : 'Email é obrigatório';
    },
    validatePassword() {
      this.passwordError = this.password.length >= 6
        ? ''
        : 'A senha deve ter pelo menos 6 caracteres';
    },
    async login() {
      this.validateEmail();
      this.validatePassword();
      this.snackbarMessage = ''; 

      if (!this.emailError && !this.passwordError) {
        this.isSubmitting = true;
        try {
          await AuthService.login(this.email, this.password);
          this.snackbarMessage = 'Login bem-sucedido!';
          this.showSnackbar();
          this.$router.push('/'); 
        } catch (error) {
          this.snackbarMessage = 'Credenciais inválidas. Tente novamente!'; 
          this.showSnackbar();
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    showSnackbar() {
      setTimeout(() => {
        this.snackbarMessage = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff7f50;
  color: white;
  padding: 16px;
  border-radius: 5px;
  visibility: hidden; 
  opacity: 0;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.snackbar.show {
  visibility: visible;
  opacity: 1;
}

.title {
  font-size: 2.5rem;
  color: #ff8c00;
  font-weight: 900;
  margin-bottom: 5px;
}

.text-muted {
  font-size: 1.1rem;
  color: #6e6e6e;
  margin-top: 8px;
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #ff8c00;
  border: none;
  margin-top: 40px;
}

.btn-primary:hover {
  background-color: #ff991c;
  border: none;
}
</style>
