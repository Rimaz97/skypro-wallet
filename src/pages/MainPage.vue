<template>
  <div class="main-page">
    <AppHeader />
    <main class="main-content">
      <AppContainer>
        <div class="page-wrapper">
          <div class="page-header">
            <h1>Мои расходы</h1>
          </div>

          <!-- Таблица расходов -->
          <div class="expenses-table-wrapper">
            <div class="expenses-table">
              <div class="table-header">
                <div class="header-cell">Описание</div>
                <div class="header-cell">Категория</div>
                <div class="header-cell">Дата</div>
                <div class="header-cell">Сумма</div>
                <div class="header-cell">Действия</div>
              </div>

              <div class="table-body">
                <div
                  v-for="expense in expenses"
                  :key="expense.id"
                  class="table-row"
                >
                  <div class="table-cell description">
                    {{ expense.description }}
                  </div>
                  <div class="table-cell">
                    <span :class="['category-badge', expense.category]">
                      {{ getCategoryLabel(expense.category) }}
                    </span>
                  </div>
                  <div class="table-cell">{{ expense.date }}</div>
                  <div class="table-cell amount">
                    {{ expense.amount.toLocaleString() }} ₽
                  </div>
                  <div class="table-cell actions">
                    <button
                      class="action-btn delete-btn"
                      @click="deleteExpense(expense.id)"
                    >
                      <img
                        src="/img/del.svg"
                        alt="Удалить"
                        class="delete-icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Кнопка добавления расхода (внизу) -->
          <div class="add-expense-footer">
            <button class="add-expense-btn" @click="openModal">
              Новый расход
            </button>
          </div>
        </div>
      </AppContainer>
    </main>

    <!-- Модальное окно -->
    <AddSpendModal
      :isOpen="modalOpen"
      @close="closeModal"
      @addExpense="addExpense"
    />
  </div>
</template>

<script>
import AppHeader from "../components/layout/AppHeader.vue";
import AppContainer from "../components/layout/AppContainer.vue";
import AddSpendModal from "../components/modals/AddSpendModal.vue";

export default {
  name: "MainPage",
  components: {
    AppHeader,
    AppContainer,
    AddSpendModal,
  },
  data() {
    return {
      modalOpen: false,
      expenses: [
        {
          id: 1,
          description: "Пятерочка",
          category: "food",
          date: "03.07.2024",
          amount: 3500,
        },
        {
          id: 2,
          description: "Яндекс Такси",
          category: "transport",
          date: "03.07.2024",
          amount: 730,
        },
        {
          id: 3,
          description: "Аптека Вита",
          category: "other",
          date: "03.07.2024",
          amount: 1200,
        },
        {
          id: 4,
          description: "Бургер Кинг",
          category: "food",
          date: "03.07.2024",
          amount: 950,
        },
        {
          id: 5,
          description: "Деливери",
          category: "food",
          date: "02.07.2024",
          amount: 1320,
        },
        {
          id: 6,
          description: "Кофейня №1",
          category: "food",
          date: "02.07.2024",
          amount: 400,
        },
        {
          id: 7,
          description: "Бильярд",
          category: "joy",
          date: "29.06.2024",
          amount: 600,
        },
        {
          id: 8,
          description: "Перекресток",
          category: "food",
          date: "29.06.2024",
          amount: 2360,
        },
        {
          id: 9,
          description: "Лукойл",
          category: "transport",
          date: "29.06.2024",
          amount: 1000,
        },
        {
          id: 10,
          description: "Летуаль",
          category: "other",
          date: "29.06.2024",
          amount: 4300,
        },
        {
          id: 11,
          description: "Яндекс Такси",
          category: "transport",
          date: "28.06.2024",
          amount: 320,
        },
        {
          id: 12,
          description: "Перекресток",
          category: "food",
          date: "28.06.2024",
          amount: 1360,
        },
        {
          id: 13,
          description: "Деливери",
          category: "food",
          date: "28.06.2024",
          amount: 2320,
        },
        {
          id: 14,
          description: "Вкусвилл",
          category: "food",
          date: "27.06.2024",
          amount: 1220,
        },
        {
          id: 15,
          description: "Кофейня №1",
          category: "food",
          date: "27.06.2024",
          amount: 920,
        },
        {
          id: 16,
          description: "Вкусвилл",
          category: "food",
          date: "26.06.2024",
          amount: 840,
        },
        {
          id: 17,
          description: "Кофейня №1",
          category: "food",
          date: "26.06.2024",
          amount: 920,
        },
      ],
      nextId: 18,
    };
  },
  computed: {
    categories() {
      return {
        food: "Еда",
        transport: "Транспорт",
        housing: "Жилье",
        joy: "Развлечения",
        education: "Образование",
        other: "Другое",
      };
    },
  },
  methods: {
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    getCategoryLabel(category) {
      return this.categories[category] || category;
    },
    deleteExpense(id) {
      if (confirm("Вы уверены, что хотите удалить этот расход?")) {
        this.expenses = this.expenses.filter((expense) => expense.id !== id);
      }
    },
    addExpense(newExpense) {
      // Преобразуем дату в формат дд.мм.гггг
      const dateObj = new Date(newExpense.date);
      const formattedDate = `${dateObj
        .getDate()
        .toString()
        .padStart(2, "0")}.${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${dateObj.getFullYear()}`;

      const expense = {
        id: this.nextId++,
        description: newExpense.description,
        category: newExpense.category,
        date: formattedDate,
        amount: parseInt(newExpense.amount),
      };
      this.expenses.unshift(expense);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.main-content {
  flex: 1;
  padding: 24px 0 40px;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.expenses-table-wrapper {
  background: var(--bg-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  width: 100%;
}

.expenses-table {
  width: 100%;
  min-width: 1000px;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1.2fr 100px;
  padding: 16px 24px;
  background-color: var(--bg-gray);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-cell {
  padding: 0 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1.2fr 100px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
  align-items: center;
  min-height: 56px;
}

.table-row:hover {
  background-color: var(--bg-gray);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 0 12px;
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 24px;
  display: flex;
  align-items: center;
}

.table-cell.description {
  font-weight: 500;
}

.table-cell.amount {
  font-weight: 600;
  color: var(--success-color);
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.category-badge.food {
  background-color: rgba(31, 164, 108, 0.1);
  color: var(--success-color);
}

.category-badge.transport {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.category-badge.housing {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.category-badge.joy {
  background-color: rgba(156, 39, 176, 0.1);
  color: var(--primary-color);
}

.category-badge.education {
  background-color: rgba(0, 150, 136, 0.1);
  color: #009688;
}

.category-badge.other {
  background-color: rgba(96, 125, 139, 0.1);
  color: #607d8b;
}

.actions {
  display: flex;
  justify-content: center;
  min-width: 80px;
}

.action-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.action-btn:hover {
  background-color: rgba(156, 39, 176, 0.1);
}

.delete-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.action-btn:hover .delete-icon {
  opacity: 1;
}

.add-expense-footer {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  margin-top: 8px;
}

.add-expense-btn {
  background-color: var(--primary-color);
  color: var(--bg-white);
  border: none;
  border-radius: var(--border-radius);
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: "Montserrat", sans-serif;
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
}

.add-expense-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(156, 39, 176, 0.3);
}

.add-expense-btn:active {
  transform: translateY(0);
}

/* Контейнер для таблицы с горизонтальной прокруткой только на мобильных */
@media (max-width: 1024px) {
  .expenses-table-wrapper {
    overflow-x: auto;
  }

  .expenses-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .expenses-table {
    min-width: 700px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 1fr 80px;
    gap: 12px;
    padding: 16px;
  }

  .table-header {
    display: none;
  }

  .table-cell {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding: 8px 0;
    white-space: normal;
    height: auto;
  }

  .table-cell:last-child {
    border-bottom: none;
    justify-content: center;
  }

  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 12px;
    margin-right: 8px;
  }

  .table-cell:nth-child(1)::before {
    content: "Описание";
  }
  .table-cell:nth-child(2)::before {
    content: "Категория";
  }
  .table-cell:nth-child(3)::before {
    content: "Дата";
  }
  .table-cell:nth-child(4)::before {
    content: "Сумма";
  }
  .table-cell:nth-child(5)::before {
    content: "";
  }

  .add-expense-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }

  .add-expense-btn {
    font-size: 14px;
    padding: 12px 24px;
  }
}
</style>
