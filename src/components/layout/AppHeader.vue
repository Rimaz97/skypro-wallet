<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="/icon/Vector.svg" alt="Skypro.Wallet" class="logo-icon" />
      </router-link>

      <nav class="nav">
        <router-link
          to="/"
          :class="['nav-link', { active: $route.path === '/' }]"
        >
          Мои расходы
        </router-link>
        <router-link
          to="/spend-analysis"
          :class="['nav-link', { active: $route.path === '/spend-analysis' }]"
        >
          Анализ расходов
        </router-link>
      </nav>

      <div class="user-menu">
        <router-link to="/login" class="logout-btn" @click="handleLogout">
          Выйти
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  methods: {
    handleLogout() {
      console.log("Выход из системы");
      // Здесь будет логика выхода (очистка токена и т.д.)
    },
  },
};
</script>

<style scoped>
.app-header {
  background-color: var(--bg-white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 20px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-icon {
  height: 32px;
  width: auto;
}

.nav {
  display: flex;
  gap: 40px;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  transition: all var(--transition-normal);
  font-weight: 400; /* Regular для неактивного состояния */
  font-size: 16px;
}

.nav-link:hover {
  color: var(--primary-color);
  font-weight: 600; /* Semibold при наведении */
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 600; /* Semibold для активного состояния */
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 1px;
}

.user-menu {
  display: flex;
  align-items: center;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 16px;
  text-decoration: none;
}

.logout-btn:hover {
  color: var(--primary-color);
  font-weight: 600;
}
</style>
