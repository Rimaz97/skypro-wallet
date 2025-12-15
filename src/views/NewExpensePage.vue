<template>
  <div class="new-expense-page">
    <!-- Шапка будет через AppLayout, но проверяем, что она отображается -->
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
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #000000;
  margin-bottom: 12px;
  font-weight: 700;
}

.back-link {
  color: #6d28d9;
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
    padding: 16px 14px !important;
  }

  .page-header h1 {
    font-size: 22px !important;
  }

  .back-link {
    font-size: 13px !important;
  }
}
</style>
