<template>
  <div class="table-container">
    <h2 class="table-title">Таблица расходов</h2>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка расходов...</p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Ошибка загрузки</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadExpenses">Повторить попытку</button>
    </div>

    <!-- Сообщение о пустом списке -->
    <div v-else-if="!isLoading && processedExpenses.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Вы еще не вносили расходы</h3>
    </div>

    <!-- Основной контент (если есть данные) -->
    <div v-else class="expenses-content">
      <!-- Десктопная таблица -->
      <table class="desktop-table">
        <thead>
          <tr>
            <th>Описание</th>
            <th>Категория</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in processedExpenses"
            :key="expense.id"
            :class="{ selected: selectedExpenseId === expense.id }"
            @click="toggleSelectExpense(expense.id)"
          >
            <td>{{ expense.description }}</td>
            <td>{{ expense.translatedCategory }}</td>
            <td>{{ expense.formattedDate }}</td>
            <td>{{ expense.amount.toLocaleString() }} ₽</td>
            <td>
              <img
                src="@/assets/icons/food-del.svg"
                alt="Удалить"
                class="delete-icon"
                @click.stop="handleDeleteExpense(expense.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Мобильный список -->
      <div class="mobile-list">
        <div
          v-for="expense in processedExpenses"
          :key="expense.id"
          class="mobile-expense-item"
          :class="{ selected: selectedExpenseId === expense.id }"
          @click="toggleSelectExpense(expense.id)"
        >
          <div class="mobile-expense-info">
            <div class="mobile-expense-description">{{ expense.description }}</div>
            <div class="mobile-expense-category">{{ expense.translatedCategory }}</div>
            <div class="mobile-expense-date">{{ expense.formattedDate }}</div>
          </div>
          <div class="mobile-expense-amount">{{ expense.amount.toLocaleString() }} ₽</div>
        </div>
      </div>
    </div>

    <!-- Всплывающая кнопка удаления для мобильных -->
    <transition name="slide-up">
      <div v-if="selectedExpenseId" class="mobile-delete-container">
        <button class="mobile-delete-btn" @click="confirmDeleteExpense">Удалить расход</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { expensesStore } from '@/store/expenses'
import { CATEGORIES_EN_TO_RU } from '@/constants/categories' // Импортируем из констант

const selectedExpenseId = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Используем единый источник категорий
const categoryTranslations = CATEGORIES_EN_TO_RU

const formatDate = (isoDate) => {
  try {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }
    return new Date(isoDate).toLocaleDateString('ru-RU', options)
  } catch {
    return isoDate
  }
}

const processedExpenses = computed(() => {
  if (!expensesStore.state.value || !Array.isArray(expensesStore.state.value)) return []

  return [...expensesStore.state.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((expense) => ({
      ...expense,
      translatedCategory: categoryTranslations[expense.category] || expense.category,
      formattedDate: formatDate(expense.date),
    }))
})

const loadExpenses = async () => {
  try {
    isLoading.value = true
    error.value = null
    await expensesStore.getExpenses()
  } catch (err) {
    console.error('Ошибка загрузки расходов:', err)

    // Пользовательское сообщение об ошибке
    if (err.code === 'ERR_NETWORK' || err.message.includes('Network')) {
      error.value = 'Проблемы с подключением к интернету. Проверьте ваше соединение.'
    } else if (err.response?.status === 401) {
      error.value = 'Ошибка авторизации. Пожалуйста, войдите снова.'
    } else {
      error.value = 'Не удалось загрузить расходы. Пожалуйста, попробуйте позже.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadExpenses()
})

// Остальные методы без изменений...
const toggleSelectExpense = (id) => {
  if (window.innerWidth > 1025) return

  if (selectedExpenseId.value === id) {
    selectedExpenseId.value = null
  } else {
    selectedExpenseId.value = id
  }
}

const confirmDeleteExpense = async () => {
  if (!selectedExpenseId.value) return

  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    await handleDeleteExpense(selectedExpenseId.value)
    selectedExpenseId.value = null
  }
}

const handleDeleteExpense = async (id) => {
  try {
    await expensesStore.deleteExpense(id)
  } catch (err) {
    if (err.message === 'Транзакция уже удалена') {
      alert('Эта транзакция уже была удалена')
    } else {
      alert('Произошла ошибка при удалении')
      await loadExpenses() // Перезагружаем список после ошибки
    }
  }
}
</script>

<style scoped>
.table-container {
  flex: 1;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  padding: 24px;
  overflow-x: auto;
  position: relative;
}

.table-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0;
  margin-bottom: 32px;
  color: var(--color-text-primary);
}

.desktop-table{
  width: 100%;
}

.desktop-table thead {
  border-bottom: 1px solid var(--color-border);
}

.desktop-table th {
  padding: 12px 16px;
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.desktop-table td {
  padding: 12px 16px;
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-text-secondary);
}

.desktop-table tr:hover td {
  background: var(--table-row-hover);
}

.desktop-table tr.selected td {
  background: var(--table-row-selected);
  border-left: 3px solid var(--color-primary);
}

.delete-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
  min-width: 20px;
  opacity: 0.6;
  filter: brightness(var(--icon-brightness, 1));
}

.mobile-list {
  display: none;
}

.mobile-expense-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-expense-item.selected {
  background-color: var(--table-row-selected);
  border-left: 3px solid var(--color-primary);
}

.mobile-expense-info {
  flex: 1;
}

.mobile-expense-description {
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.mobile-expense-category {
  display: inline-block;
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}

.mobile-expense-date {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.mobile-expense-amount {
  font-weight: 700;
  font-size: 18px;
  color: var(--color-text-primary);
  white-space: nowrap;
  margin-left: 16px;
}

.mobile-delete-container {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card-bg);
  padding: 12px;
  box-shadow: 0 -2px 10px var(--color-shadow);
  z-index: 100;
  justify-content: center;
}

.mobile-delete-btn {
  width: 100%;
  height: 39px;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-delete-btn:hover {
  background: var(--color-danger-hover);
}

.error-state {
  text-align: center;
  padding: 40px 20px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-danger);
}

.error-state h3 {
  font-size: 20px;
  color: var(--color-danger);
  margin-bottom: 8px;
}

.error-state p {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 2px dashed var(--color-border);
}

.empty-state h3 {
  font-size: 20px;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--color-text-tertiary);
  margin-bottom: 20px;
}

.add-first-expense-btn {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.add-first-expense-btn:hover {
  background: var(--color-primary-hover);
}

@media (max-width: 1025px) {

    .table-container {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
.mobile-list {
  display: block;
}

.desktop-table {
  display: none;
}

.mobile-delete-container{
  display: block;
}
}
@media (max-width: 425px) {


  .mobile-expense-item {
    background: var(--card-bg);
  }
}
</style>
