<template>
  <div class="register-page">
    <main class="register-container">
      <div class="register-wrapper">
        <div class="register-header">
          <h1>Регистрация</h1>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <input
              v-model="form.firstName"
              placeholder="Имя"
              class="form-input"
              @input="updateTextColor($event)"
            />
          </div>

          <div class="form-group">
            <input
              v-model="form.lastName"
              placeholder="Фамилия"
              class="form-input"
              @input="updateTextColor($event)"
            />
          </div>

          <div class="form-group">
            <input
              v-model="form.email"
              placeholder="Эл. почта"
              type="email"
              class="form-input"
              @input="updateTextColor($event)"
            />
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              placeholder="Пароль"
              type="password"
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
            Зарегистрироваться
          </button>

          <div class="login-link">
            Уже есть аккаунт?
            <router-link to="/login">Войдите здесь</router-link>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.firstName &&
        this.form.lastName &&
        this.form.email &&
        this.form.password
      );
    },
  },
  methods: {
    handleRegister() {
      this.resetErrors();

      let isValid = true;

      if (!this.form.firstName) {
        this.errors.firstName = "Введите имя";
        isValid = false;
      }

      if (!this.form.lastName) {
        this.errors.lastName = "Введите фамилию";
        isValid = false;
      }

      if (!this.form.email) {
        this.errors.email = "Введите email";
        isValid = false;
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = "Введите корректный email";
        isValid = false;
      }

      if (!this.form.password) {
        this.errors.password = "Введите пароль";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Пароль должен быть не менее 6 символов";
        isValid = false;
      }

      if (isValid) {
        console.log("Регистрация:", this.form);
        this.$router.push("/login");
      }
    },
    resetErrors() {
      this.errors = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      };
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
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
      const inputs = document.querySelectorAll(".register-form .form-input");
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
}

.register-container {
  max-width: 400px;
  width: 100%;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.register-wrapper {
  padding: 50px 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h1 {
  color: var(--text-primary);
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
}

.register-form {
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

.login-link {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 20px;
  line-height: 1.5;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-top: 4px;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
