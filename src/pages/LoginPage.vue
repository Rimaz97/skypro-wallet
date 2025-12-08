<template>
  <div class="login-page">
    <main class="login-container">
      <div class="login-wrapper">
        <div class="login-header">
          <h1>Вход</h1>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <input
              v-model="form.email"
              type="email"
              placeholder="Эл. почта"
              class="form-input"
              @input="updateTextColor($event)"
            />
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              type="password"
              placeholder="Пароль"
              class="form-input"
              @input="updateTextColor($event)"
            />
          </div>

          <button
            type="submit"
            class="submit-btn"
            :class="{ active: isFormValid }"
            :disabled="!isFormValid"
          >
            Войти
          </button>

          <div class="register-link">
            Нужно зарегистрироваться?
            <router-link to="/register">Регистрируйтесь здесь</router-link>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return this.form.email && this.form.password;
    },
  },
  methods: {
    handleLogin() {
      this.errors = { email: "", password: "" };

      if (!this.form.email) {
        this.errors.email = "Введите email";
        return;
      }

      if (!this.form.password) {
        this.errors.password = "Введите пароль";
        return;
      }

      console.log("Вход:", this.form);
      this.$router.push("/");
    },
    updateTextColor(event) {
      const input = event.target;
      if (input.value) {
        input.style.color = "var(--text-primary)";
      } else {
        input.style.color = "var(--text-light)";
      }
    },
  },
  mounted() {
    setTimeout(() => {
      const inputs = document.querySelectorAll(".login-form .form-input");
      inputs.forEach((input) => {
        if (!input.value) {
          input.style.color = "var(--text-light)";
        }
      });
    }, 100);
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
}

.login-container {
  max-width: 400px;
  width: 100%;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.login-wrapper {
  padding: 50px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  color: var(--text-primary);
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin: 0;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  transition: all var(--transition-fast);
  background-color: var(--bg-white);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-input::placeholder {
  color: var(--text-light);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: rgba(115, 52, 234, 1);
  color: var(--bg-white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: not-allowed;
  transition: all var(--transition-normal);
  font-family: "Montserrat", sans-serif;
  margin-top: 10px;
}

.submit-btn.active {
  background-color: var(--primary-color);
  cursor: pointer;
}

.submit-btn.active:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}

.register-link {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 20px;
  line-height: 1.5;
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-top: 4px;
}

.register-link a:hover {
  text-decoration: underline;
}

.login-image {
  display: none;
}

.login-container {
  display: flex;
  justify-content: center;
}
</style>
