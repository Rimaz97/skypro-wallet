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
  background: var(--color-bg-secondary);
  padding: 20px;
}

form {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px var(--color-shadow);
  box-sizing: border-box;
}

form h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  color: var(--color-text-primary);
}

input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: var(--input-bg);
  color: var(--color-text-primary);
}

input::placeholder {
  color: var(--color-text-tertiary);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-bg-primary);
  box-shadow: 0 0 0 3px var(--color-primary-hover);
}

button[type='submit'] {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
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
  box-shadow: 0 4px 12px var(--color-shadow);
}

.modal__form-group {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.modal__form-group p {
  color: var(--color-text-tertiary);
  font-size: 14px;
  margin-bottom: 8px;
}

.modal__link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.error {
  color: var(--color-danger);
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--color-danger);
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
