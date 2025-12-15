<template>
  <div class="container">
    <div class="header-section">
      <h1>Мои расходы</h1>
      <!-- Кнопка "Новый расход" для мобильных и планшетов (1024px и ниже) -->
      <div class="mobile-new-expense-btn-container">
        <router-link to="/expenses/new" class="mobile-new-expense-link">
          <span class="mobile-new-expense-text">Новый расход</span>
          <img src="@/assets/icons/vuesax_bold_add-circle.svg" alt="+" class="add-icon" />
        </router-link>
      </div>
    </div>

    <div class="content-wrapper">
      <ExpensesTable />
      <!-- Форма для десктопа (выше 1024px) -->
      <div class="desktop-form">
        <ExpenseFormModal />
      </div>
    </div>
  </div>
</template>

<script setup>
import ExpensesTable from './ExpensesTable.vue'
import ExpenseFormModal from './ExpenseFormModal.vue'
</script>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 32px;
  color: #000000;
  margin-bottom: 0;
  font-weight: 700;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 379px;
  gap: 30px;
  width: 100%;
  box-sizing: border-box;
}

/* Кнопка "Новый расход" для мобильных и планшетов */
.mobile-new-expense-btn-container {
  display: none;
}

.mobile-new-expense-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-direction: row-reverse;
}

.mobile-new-expense-text {
  font-size: 16px;
  color: #000000;
  transition: color 0.2s;
}

.add-icon {
  width: 20px;
  height: 20px;
  transition: filter 0.2s;
  order: 1; /* Иконка справа */
}

.mobile-new-expense-link:hover .mobile-new-expense-text {
  color: rgba(115, 52, 234, 1);
}

.mobile-new-expense-link:hover .add-icon {
  filter: brightness(0) saturate(100%) invert(30%) sepia(90%) saturate(2000%) hue-rotate(245deg)
    brightness(90%) contrast(90%);
}

/* Форма для десктопа */
.desktop-form {
  display: block;
}

/* Медиа-запросы */

/* Планшеты и мобильные (≤1024px) */
@media (max-width: 1024px) {
  .container {
    padding: 24px;
  }

  .header-section {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 28px;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .desktop-form {
    display: none;
  }

  .mobile-new-expense-btn-container {
    display: block;
  }
}

/* Мобильная версия (≤768px) */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  h1 {
    font-size: 26px;
  }
}

/* Мобильная версия (≤425px) - УБИРАЕМ ОТСТУПЫ И ДЕЛАЕМ ОДНИМ ЦЕЛЫМ */
@media (max-width: 425px) {
  .container {
    padding: 0;
    background: transparent;
  }

  .header-section {
    padding: 16px 16px 12px 16px;
    margin-bottom: 0;
    background: white;
  }

  h1 {
    font-size: 24px;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 0;
    background: transparent;
  }

  .mobile-new-expense-text {
    font-size: 14px;
  }

  .add-icon {
    width: 18px;
    height: 18px;
  }
}

/* Ещё меньшие экраны (≤375px) */
@media (max-width: 375px) {
  .header-section {
    padding: 14px 14px 10px 14px;
  }

  h1 {
    font-size: 22px;
  }

  .mobile-new-expense-text {
    font-size: 13px;
  }
}
</style>
