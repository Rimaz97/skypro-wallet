<template>
  <div class="table-container">
    <h2 class="table-title">Таблица расходов</h2>

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

const selectedExpenseId = ref(null)

const categoryTranslations = {
  food: 'Еда',
  transport: 'Транспорт',
  housing: 'Жилье',
  entertainment: 'Развлечения',
  education: 'Образование',
  other: 'Другое',
}

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
  return [...expensesStore.state.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((expense) => ({
      ...expense,
      translatedCategory: categoryTranslations[expense.category] || expense.category,
      formattedDate: formatDate(expense.date),
    }))
})

onMounted(() => {
  expensesStore.getExpenses()
})

const toggleSelectExpense = (id) => {
  if (window.innerWidth > 425) return // Работает только на 425px и ниже

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
    selectedExpenseId.value = null
  } catch (err) {
    if (err.message === 'Транзакция уже удалена') {
      alert('Эта транзакция уже была удалена')
    } else {
      alert('Произошла ошибка при удалении')
    }
  }
}
</script>

<style scoped>
.table-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-x: auto;
}

.table-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0;
  margin-bottom: 32px;
  color: #000000;
}

/* Десктопная таблица */
.desktop-table {
  width: 100%;
  min-width: 379px;
  border-collapse: collapse;
}

.desktop-table thead {
  border-bottom: 1px solid #e2e8f0;
}

.desktop-table th {
  padding: 12px 16px;
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  color: #999999;
  font-weight: 400;
}

.desktop-table td {
  padding: 12px 16px;
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.desktop-table tr:last-child td {
  border-bottom: none;
}

.desktop-table tr:hover td {
  background: #f9fafb;
}

.desktop-table tr.selected td {
  background: #f8f5ff;
  border-left: 3px solid #6d28d9;
}

.delete-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
  min-width: 20px;
  opacity: 0.6;
}

.delete-icon:hover {
  opacity: 1;
}

.desktop-table th:last-child,
.desktop-table td:last-child {
  width: 40px;
  text-align: center;
  padding-right: 8px;
}

/* Мобильный список */
.mobile-list {
  display: none;
}

.mobile-expense-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-expense-item.selected {
  background-color: #f8f5ff;
  border-left: 3px solid #6d28d9;
}

.mobile-expense-info {
  flex: 1;
}

.mobile-expense-description {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.mobile-expense-category {
  display: inline-block;
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.mobile-expense-date {
  font-size: 14px;
  color: #9ca3af;
}

.mobile-expense-amount {
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
  white-space: nowrap;
  margin-left: 16px;
}

/* Всплывающая кнопка удаления для мобильных */
.mobile-delete-container {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  justify-content: center;
}

.mobile-delete-btn {
  width: 343px;
  height: 39px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-delete-btn:hover {
  background: #b91c1c;
}

/* Анимация для всплывающей кнопки */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Медиа-запросы для 425px и ниже - УБИРАЕМ БОРДЕРЫ И ДЕЛАЕМ ВСЕ ОДНИМ ЦЕЛЫМ */
@media (max-width: 425px) {
  .table-container {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    width: 100%;
  }

  .table-title {
    display: none;
  }

  .mobile-delete-container {
    display: flex;
  }

  .mobile-list { display: block; }

  /* На мобильных убираем иконку удаления из таблицы */
  .desktop-table {
    display: none;
  }

  /* Мобильный список - убираем все границы и фон */
  .mobile-list {
    display: block;
    background: transparent;
  }

  .mobile-expense-item {
    background: white;
    border-bottom: none;
    border-radius: 0;
    padding: 16px;
    margin-bottom: 1px; /* Вместо бордера делаем небольшую полоску */
  }

  .mobile-expense-item.selected {
    background-color: #f8f5ff;
    border-left: 3px solid #6d28d9;
  }

  .mobile-expense-item:last-child {
    margin-bottom: 0;
  }

  /* Делаем карточки более компактными */
  .mobile-expense-description {
    font-size: 14px;
  }

  .mobile-expense-category {
    font-size: 11px;
    padding: 3px 8px;
  }

  .mobile-expense-date {
    font-size: 12px;
  }

  .mobile-expense-amount {
    font-size: 16px;
    margin-left: 8px;
  }

  /* Кнопка удаления */
  .mobile-delete-btn {
    width: calc(100% - 24px);
    max-width: 343px;
  }
}

/* Для десктопа - отключаем выделение строк и клики */
@media (min-width: 426px) {
  .desktop-table tr {
    cursor: default;
  }

  .desktop-table tr:hover td {
    background: #f9fafb;
  }

  .desktop-table td {
    cursor: default;
  }

  /* Убираем возможность выделения строк на десктопе */
  .desktop-table tr {
    pointer-events: none;
  }

  /* Но оставляем иконку удаления кликабельной */
  .delete-icon {
    pointer-events: auto;
  }
}
</style>
