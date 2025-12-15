<template>
  <div class="container">
    <h1>Анализ расходов</h1>

    <div class="analysis-wrapper">
      <!-- Первая колонка: Период (календарь) -->
      <div class="period-column">
        <div class="period-header">
          <h2>Период</h2>
        </div>
        <div class="calendar-container">
          <AppCalendar
            @date-selected="handleDateSelection"
            :selected-start="selectedStartDate"
            :selected-end="selectedEndDate"
          />
        </div>
      </div>

      <!-- Вторая колонка: График -->
      <div class="chart-column">
        <div class="chart-container">
          <ExpensesChart
            :expenses="chartReadyData"
            :is-loading="isLoading"
            :start-date="formattedStartDate"
            :end-date="formattedEndDate"
            class="chart-component"
          />
        </div>
      </div>
    </div>

    <!-- Кнопка выбора периода для мобильных (≤768px) -->
    <button class="select-period-btn" @click="goToSelectPeriodPage">Выбрать период</button>

    <div v-if="errorMessage" class="error-status">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { expensesStore } from '@/store/expenses'
import ExpensesChart from './ExpensesChart.vue'
import AppCalendar from './AppCalendar.vue'

const router = useRouter()
const selectedStartDate = ref(null)
const selectedEndDate = ref(null)
const isLoading = ref(false)
const errorMessage = ref(null)
const chartReadyData = ref([])

const hasSelectedPeriod = computed(() => !!selectedStartDate.value && !!selectedEndDate.value)

const loadExpenses = async () => {
  try {
    if (!hasSelectedPeriod.value || isLoading.value) return

    isLoading.value = true
    chartReadyData.value = []

    const result = await expensesStore.getPeriodExpenses(
      selectedStartDate.value,
      selectedEndDate.value,
    )

    chartReadyData.value = result.filter((e) => e?.category && typeof e.amount === 'number')
  } catch (error) {
    handleError('Ошибка загрузки', error)
  } finally {
    isLoading.value = false
  }
}

const handleError = (context, error) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    period: {
      start: selectedStartDate.value,
      end: selectedEndDate.value,
    },
  }

  console.error(context, errorDetails)
  errorMessage.value = errorDetails.message
}

const formattedStartDate = computed(
  () =>
    selectedStartDate.value?.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    }) || '',
)

const formattedEndDate = computed(
  () =>
    selectedEndDate.value?.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    }) || '',
)

// Обработчик выбора даты в календаре
const handleDateSelection = (start, end) => {
  selectedStartDate.value = start
  selectedEndDate.value = end
}

// Переход на страницу выбора периода
const goToSelectPeriodPage = () => {
  router.push('/analysis/select-period')
}

// При монтировании проверяем, есть ли выбранный период в URL или локальном хранилище
import { onMounted } from 'vue'

onMounted(() => {
  const savedPeriod = localStorage.getItem('selectedPeriod')
  if (savedPeriod) {
    const { start, end } = JSON.parse(savedPeriod)
    selectedStartDate.value = new Date(start)
    selectedEndDate.value = new Date(end)
  }
})

watch([selectedStartDate, selectedEndDate], ([newStart, newEnd], [oldStart, oldEnd]) => {
  if (newStart?.getTime() !== oldStart?.getTime() || newEnd?.getTime() !== oldEnd?.getTime()) {
    loadExpenses()
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;
}

h1 {
  font-size: 32px;
  color: #000000;
  margin-bottom: 30px;
}

.analysis-wrapper {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Колонка с периодом */
.period-column {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  height: fit-content;
}

.period-header {
  position: absolute;
  top: 32px;
  left: 32px;
  z-index: 10;
}

.period-header h2 {
  width: 101px;
  height: 29px;
  color: #000000;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.calendar-container {
  padding-top: 80px; /* 32px (отступ сверху) + 29px (высота заголовка) + 19px (доп. отступ) */
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
}

/* Колонка с графиком */
.chart-column {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 623.67px;
}

.chart-container {
  margin-bottom: 0;
  height: 100%;
}

.chart-component {
  width: 100%;
  height: 100%;
}

.select-period-btn {
  display: none;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #6d28d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box;
}

.select-period-btn:hover {
  background: #5b21b6;
}

.error-status {
  margin-top: 20px;
  color: #e53e3e;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  background: #fff5f5;
}

/* Медиа-запросы для адаптивности */

/* Планшеты (≤1024px) */
@media (max-width: 1024px) {
  .container {
    padding: 24px;
  }

  h1 {
    font-size: 28px;
  }

  .analysis-wrapper {
    gap: 24px;
  }

  .period-column {
    padding: 24px;
  }

  .chart-column {
    padding: 16px;
  }
}

/* Мобильная версия (≤768px) */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  h1 {
    font-size: 26px;
    margin-bottom: 20px;
  }

  .analysis-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .period-column {
    display: none;
  }

  .select-period-btn {
    display: block;
    padding: 16px;
    font-size: 16px;
  }
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .container {
    padding: 16px;
  }

  h1 {
    font-size: 22px;
    margin-bottom: 24px;
  }

  .analysis-wrapper {
    margin-bottom: 16px;
  }

  .select-period-btn {
    padding: 14px;
    font-size: 15px;
    border-radius: 6px;
  }
}
</style>
