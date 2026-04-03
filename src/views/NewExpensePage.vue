<template>
  <div class="new-expense-page">
    <div class="page-header">
      <h1>Новый расход</h1>
      <router-link to="/expenses" class="back-link"> ← Назад к расходам </router-link>
    </div>
    <ExpenseFormModal />
  </div>
</template>

<script setup>
import ExpenseFormModal from '@/components/ExpenseFormModal.vue'
</script>

<style scoped>
.new-expense-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--color-bg-primary);
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: var(--color-text-primary);
  margin-bottom: 12px;
  font-weight: 700;
}

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .new-expense-page {
    padding: 16px !important;
    min-height: calc(100vh - 60px);
    justify-content: flex-start;
  }

  .page-header {
    margin-bottom: 20px !important;
  }

  .page-header h1 {
    font-size: 22px !important;
    margin-bottom: 8px !important;
  }

  .back-link {
    font-size: 13px !important;
  }
}

/* Мобильная версия (≤375px) */
@media (max-width: 375px) {
  .new-expense-page {
    padding: 14px !important;
  }

  .page-header h1 {
    font-size: 20px !important;
  }
}
</style>
