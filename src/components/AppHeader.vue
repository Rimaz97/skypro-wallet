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
        <!-- Убираем "Новый расход" из десктопного меню -->
        <router-link to="/analysis" class="nav-link" :exact-active-class="'active'">
          Анализ расходов
        </router-link>
      </nav>

      <button class="logout-btn" @click="handleLogout" :disabled="isLoggingOut">
        {{ isLoggingOut ? 'Выход...' : 'Выйти' }}
      </button>
    </div>

    <!-- Мобильная версия (≤768px) -->
    <div class="mobile-header">
      <div class="logo">
        <img src="@/assets/icons/wallet-logo.svg" alt="Логотип" />
      </div>

      <!-- Выпадающее меню с текущей страницей -->
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

      <button class="mobile-logout-btn" @click="handleLogout" :disabled="isLoggingOut">
        {{ isLoggingOut ? '...' : 'Выйти' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="logoutError" class="error-message">
        {{ logoutError }}
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authStore } from '@/store/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggingOut = ref(false)
const logoutError = ref(null)
const isDropdownOpen = ref(false)

// Названия страниц для отображения в выпадающем меню
const pageNames = {
  '/expenses': 'Мои расходы',
  '/expenses/new': 'Новый расход',
  '/analysis': 'Анализ расходов',
  '/analysis/select-period': 'Выбор периода',
  '/signin': 'Вход',
  '/signup': 'Регистрация',
}

// Получаем название текущей страницы
const currentPageName = computed(() => {
  return pageNames[route.path] || 'Мои расходы'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    logoutError.value = null

    await authStore.logout()

    if (route.path !== '/signin') {
      router.replace('/signin').catch(() => {
        window.location.href = '/signin'
      })
    }
  } catch (error) {
    console.error('Ошибка при выходе:', error)
    logoutError.value = 'Не удалось выйти. Попробуйте ещё раз.'
    setTimeout(() => {
      logoutError.value = null
    }, 5000)
  } finally {
    isLoggingOut.value = false
  }
}

// Закрываем меню при клике вне его
const handleClickOutside = (event) => {
  if (!event.target.closest('.mobile-page-selector')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Десктопная версия - видна на 769px и выше */
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
  color: #000000;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover:not(.active) {
  color: #6d28d9;
  font-weight: 600;
}

.nav-link.active {
  color: #6d28d9;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: #6d28d9;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.logout-btn:hover {
  background: #f5f5f5;
  color: #6d28d9;
}

/* Мобильная версия - видна только до 768px включительно */
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
  color: #000000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.current-page-btn:hover {
  background: #f5f5f5;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  overflow: hidden;
  min-width: 200px;
}

.dropdown-content {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 14px 20px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8f5ff;
  color: #6d28d9;
}

.dropdown-item.router-link-active {
  background: #f8f5ff;
  color: #6d28d9;
  font-weight: 600;
}

.mobile-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mobile-logout-btn:hover {
  background: #f5f5f5;
  color: #6d28d9;
}

/* Медиа-запросы */

/* Планшеты (769px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .desktop-header {
    padding: 16px 32px;
  }

  .desktop-nav {
    gap: 30px;
  }
}

/* Мобильная версия (≤768px) */
@media (max-width: 768px) {
  .desktop-header {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  .logo img {
    height: 22px;
  }

  .current-page-name {
    font-size: 16px;
  }

  .dropdown-item {
    font-size: 16px;
    padding: 12px 20px;
  }

  .mobile-logout-btn {
    font-size: 14px;
    padding: 8px 12px;
  }
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .mobile-header {
    padding: 10px 14px;
  }

  .logo img {
    height: 20px;
  }

  .current-page-name {
    font-size: 14px;
  }

  .dropdown-item {
    font-size: 14px;
    padding: 12px 16px;
  }

  .mobile-logout-btn {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* Ещё меньшие экраны (≤375px) */
@media (max-width: 376px) {
  .mobile-header {
    padding: 8px 12px;
  }

  .logo img {
    height: 16px;
  }

  .current-page-btn {
    padding: 6px 10px;
  }

  .current-page-name {
    font-size: 13px;
  }

  .dropdown-item {
    font-size: 13px;
    padding: 10px 14px;
  }
}
</style>
