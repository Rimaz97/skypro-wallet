<template>
  <div class="select-period-page">
    <div class="page-header">
      <button class="back-btn" @click="goBackToAnalysis">← Анализ расходов</button>
      <h1>Выбор период</h1>
    </div>

    <div class="calendar-wrapper">
      <AppCalendar
        @date-selected="handleDateSelection"
        :selected-start="selectedStartDate"
        :selected-end="selectedEndDate"
      />
    </div>

    <div class="page-actions">
      <button class="apply-btn" @click="applySelectedPeriod" :disabled="!hasSelectedPeriod">
        Показать расходы за период
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppCalendar from '@/components/AppCalendar.vue'

const router = useRouter()
const selectedStartDate = ref(null)
const selectedEndDate = ref(null)

// Загружаем ранее выбранный период при загрузке страницы
import { onMounted } from 'vue'

onMounted(() => {
  const savedPeriod = localStorage.getItem('selectedPeriod')
  if (savedPeriod) {
    const { start, end } = JSON.parse(savedPeriod)
    selectedStartDate.value = new Date(start)
    selectedEndDate.value = new Date(end)
  }
})

const handleDateSelection = (start, end) => {
  selectedStartDate.value = start
  selectedEndDate.value = end
}

const hasSelectedPeriod = computed(() => !!selectedStartDate.value && !!selectedEndDate.value)

const applySelectedPeriod = () => {
  if (selectedStartDate.value && selectedEndDate.value) {
    // Сохраняем выбранный период в localStorage
    const period = {
      start: selectedStartDate.value.toISOString(),
      end: selectedEndDate.value.toISOString(),
    }
    localStorage.setItem('selectedPeriod', JSON.stringify(period))

    // Возвращаемся на страницу анализа
    router.push('/analysis')
  }
}

const goBackToAnalysis = () => {
  router.push('/analysis')
}
</script>

<style scoped>
.select-period-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-direction: column;
}

.page-header h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
}

.back-btn {
  background: none;
  border: none;
  color: rgba(153, 153, 153, 1);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  transition: opacity 0.2s;
}

.back-btn:hover {
  opacity: 0.8;
  color: #6d28d9;
}

.page-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.apply-btn {
  width: 100%;
  padding: 20px;
  background: #6d28d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover:not(:disabled) {
  background: #5b21b6;
}

.apply-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Медиа-запросы */
@media (max-width: 1024px) {
  .select-period-page {
    padding: 24px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .apply-btn {
    padding: 18px;
    font-size: 17px;
  }
}

@media (max-width: 768px) {
  .select-period-page {
    padding: 20px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .apply-btn {
    padding: 16px;
    font-size: 16px;
  }
}

@media (max-width: 425px) {
  .select-period-page {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .back-btn {
    font-size: 14px;
  }

  .apply-btn {
    padding: 14px;
    font-size: 15px;
    border-radius: 6px;
  }
}
</style>
