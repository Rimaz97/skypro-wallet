<template>
  <header class="header">
    <!-- Десктопная версия (≥769px) -->
    <div class="desktop-header">
      <div class="logo">
        <img src="@/assets/icons/wallet-logo.svg" alt="Логотип" />
      </div>

      <nav class="desktop-nav">
        <router-link to="/expenses" class="nav-link" :exact-active-class="'active'">
          Мои расходы
        </router-link>
        <router-link to="/analysis" class="nav-link" :exact-active-class="'active'">
          Анализ расходов
        </router-link>
      </nav>

      <div class="header-controls">
        <button class="theme-toggle" @click="toggleTheme" :title="themeTitle">
          {{ themeIcon }}
        </button>
        <button class="logout-btn" @click="handleLogout" :disabled="isLoggingOut">
          {{ isLoggingOut ? 'Выход...' : 'Выйти' }}
        </button>
      </div>
    </div>

    <!-- Мобильная версия (≤768px) -->
    <div class="mobile-header">
      <div class="logo">
        <img src="@/assets/icons/wallet-logo.svg" alt="Логотип" />
      </div>

      <div class="mobile-page-selector" :class="{ open: isDropdownOpen }">
        <button class="current-page-btn" @click="toggleDropdown">
          <span class="current-page-name">{{ currentPageName }}</span>
          <span class="dropdown-arrow">▼</span>
        </button>

        <div v-if="isDropdownOpen" class="dropdown-menu">
          <div class="dropdown-content">
            <router-link to="/expenses" class="dropdown-item" @click="closeDropdown">
              Мои расходы
            </router-link>
            <router-link to="/analysis" class="dropdown-item" @click="closeDropdown">
              Анализ расходов
            </router-link>
          </div>
        </div>
      </div>

      <div class="mobile-controls">
        <button class="mobile-theme-toggle" @click="toggleTheme" :title="themeTitle">
          {{ themeIcon }}
        </button>
        <button class="mobile-logout-btn" @click="handleLogout" :disabled="isLoggingOut">
          {{ isLoggingOut ? '...' : 'Выйти' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authStore } from '@/store/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggingOut = ref(false)
const isDropdownOpen = ref(false)
const currentTheme = ref('light')

const pageNames = {
  '/expenses': 'Мои расходы',
  '/expenses/new': 'Новый расход',
  '/analysis': 'Анализ расходов',
  '/analysis/select-period': 'Выбор периода',
}

const currentPageName = computed(() => {
  return pageNames[route.path] || 'Мои расходы'
})

const themeIcon = computed(() => {
  return currentTheme.value === 'light' ? '🌙' : '☀️'
})

const themeTitle = computed(() => {
  return currentTheme.value === 'light' ? 'Темная тема' : 'Светлая тема'
})

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await authStore.logout()
    router.replace('/signin')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  } finally {
    isLoggingOut.value = false
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.mobile-page-selector')) {
    closeDropdown()
  }
}

onMounted(() => {
  loadTheme()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  background: var(--card-bg);
  box-shadow: 0 2px 10px var(--color-shadow);
  border-bottom: 1px solid var(--color-border);
}

.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
}

.logo img {
  height: 32px;
  width: auto;
}

.desktop-nav {
  display: flex;
  gap: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover:not(.active) {
  color: var(--color-primary);
  font-weight: 600;
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
}

.theme-toggle:hover {
  background: var(--color-bg-secondary);
  transform: scale(1.1);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.logout-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  position: relative;
}

.current-page-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.2s;
}

.mobile-page-selector.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 20px var(--color-shadow);
  margin-top: 4px;
  overflow: hidden;
  min-width: 200px;
  border: 1px solid var(--color-border);
}

.dropdown-content {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 14px 20px;
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--color-border);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.dropdown-item.router-link-active {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  font-weight: 600;
}

.mobile-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
}

.mobile-theme-toggle:hover {
  background: var(--color-bg-secondary);
}

.mobile-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mobile-logout-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .desktop-header {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  .logo img {
    height: 20px;
  }

  .current-page-name {
    font-size: 14px;
  }

  .dropdown-item {
    font-size: 16px;
    padding: 12px 20px;
  }
}

@media (max-width: 425px) {

  .mobile-header {
    padding: 10px 14px;
  }

  .logo img {
    height: 14px;
  }

  .current-page-name {
    font-size: 12px;
  }

  .dropdown-item {
    font-size: 14px;
    padding: 12px 16px;
  }

  .dropdown-arrow{
    font-size: 10px;
  }

  .mobile-theme-toggle {
    font-size: 16px;
  }

  .mobile-logout-btn {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
