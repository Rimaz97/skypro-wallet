<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <h2>{{ isSignUp ? 'Регистрация' : 'Вход' }}</h2>

      <input
        v-if="isSignUp"
        v-model="name"
        placeholder="Имя"
        required
        autocomplete="name"
        :class="{
          invalid: errors.name,
          filled: name.trim() && !errors.name,
        }"
        @blur="validateField('name')"
      />

      <input
        v-model="login"
        placeholder="Логин"
        required
        autocomplete="username"
        :class="{
          invalid: errors.login,
          filled: login.trim() && !errors.login,
        }"
        @blur="validateField('login')"
      />

      <input
        type="password"
        v-model="password"
        :placeholder="isSignUp ? 'Придумайте пароль' : 'Пароль'"
        required
        :autocomplete="isSignUp ? 'new-password' : 'current-password'"
        :class="{
          invalid: errors.password,
          filled: password.trim() && !errors.password,
        }"
        @blur="validateField('password')"
      />

      <button type="submit" :disabled="isDisabled">
        {{ isSignUp ? 'Зарегистрироваться' : 'Войти' }}
        <span v-if="authStore.state.value.isLoading">...</span>
      </button>

      <p v-if="formattedError" class="error" v-html="formattedError"></p>

      <div v-show="!isSignUp" class="modal__form-group">
        <p>Нужно зарегистрироваться?</p>
        <RouterLink to="/signup" class="modal__link" @click="resetForm">
          Регистрируйтесь здесь
        </RouterLink>
      </div>

      <div v-show="isSignUp" class="modal__form-group">
        <p>Уже есть аккаунт?</p>
        <RouterLink to="/signin" class="modal__link" @click="resetForm"> Войдите здесь </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isSignUp: Boolean,
})

const name = ref('')
const login = ref('')
const password = ref('')

const errors = ref({
  name: false,
  login: false,
  password: false,
})

const validateField = (field) => {
  switch (field) {
    case 'name':
      errors.value.name = props.isSignUp && !name.value.trim()
      break
    case 'login':
      errors.value.login = !login.value.trim()
      break
    case 'password':
      errors.value.password = !password.value || password.value.length < 4
      break
  }
}

const validateForm = () => {
  validateField('name')
  validateField('login')
  validateField('password')
  return !Object.values(errors.value).some(Boolean)
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const credentials = {
      login: login.value.trim(),
      password: password.value,
      ...(props.isSignUp && { name: name.value.trim() }),
    }

    const { success } = props.isSignUp
      ? await authStore.register(credentials)
      : await authStore.login(credentials)

    if (success) {
      router.push('/expenses')
      resetForm()
    }
  } catch (error) {
    authStore.state.value.error = { messages: [error.message || 'Произошла ошибка'] }
    password.value = ''
  }
}

const resetForm = () => {
  name.value = ''
  login.value = ''
  password.value = ''
  errors.value = { name: false, login: false, password: false }
}

const formattedError = computed(() => {
  if (!authStore.state.value.error?.messages) return ''
  return authStore.state.value.error.messages.join('<br>')
})

const isDisabled = computed(() => {
  return (
    Object.values(errors.value).some(Boolean) ||
    !login.value.trim() ||
    !password.value.trim() ||
    (props.isSignUp && !name.value.trim())
  )
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

form {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

form h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  color: #1a1a1a;
}

input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #fafafa;
}

input:focus {
  outline: none;
  border-color: #6d28d9;
  background: white;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
}

button[type='submit'] {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

button[type='submit']:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.2);
}

button[type='submit']:active {
  transform: translateY(0);
}

.modal__form-group {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.modal__form-group p {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.modal__link {
  color: #6d28d9;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

/* Медиа-запросы */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }

  form {
    padding: 24px 20px;
    border-radius: 10px;
  }

  form h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  input {
    padding: 12px 14px;
    font-size: 15px;
  }

  button[type='submit'] {
    padding: 14px;
    font-size: 15px;
  }
}

/* Landscape ориентация */
@media (max-height: 600px) and (orientation: landscape) {
  .login-container {
    min-height: auto;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  form {
    max-width: 320px;
  }
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .login-container {
    padding: 14px !important;
  }

  form {
    padding: 20px 16px !important;
    max-width: 100% !important;
  }

  form h2 {
    font-size: 22px !important;
    margin-bottom: 20px !important;
  }

  input {
    font-size: 14px !important;
    padding: 12px !important;
    margin-bottom: 14px !important;
  }

  button[type='submit'] {
    font-size: 14px !important;
    padding: 14px !important;
  }

  .modal__form-group p,
  .modal__form-group a {
    font-size: 12px !important;
  }
}
</style>
