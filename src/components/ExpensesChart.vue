<template>
  <div class="chart-container">
    <div class="chart-title">
      <h2>{{ formattedTotal }} ₽</h2>
      <p>Расходы за {{ periodLabel }}</p>
    </div>
    <div class="chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Chart from 'chart.js/auto'
import { CATEGORIES_EN_TO_RU } from '@/constants/categories'

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Образование', 'Другое'],
  },
  expenses: {
    type: Array,
    default: () => [],
  },
  startDate: String,
  endDate: String,
  isLoading: {
    type: Boolean,
    default: false,
  },
})

// Используем единый источник категорий из констант
const normalizedCategories = CATEGORIES_EN_TO_RU

const chartCanvas = ref(null)
let chartInstance = null

const chartData = computed(() => {
  const data = Array.from({ length: props.categories.length }, () => 0)

  props.expenses.forEach(({ category, amount }) => {
    const russianCategory = normalizedCategories[category] || 'Другое'
    const index = props.categories.indexOf(russianCategory)
    if (index !== -1) data[index] += Number(amount) || 0
  })

  return data
})

const formattedTotal = computed(() => {
  const total = chartData.value.reduce((acc, val) => acc + val, 0)
  return new Intl.NumberFormat('ru-RU').format(total)
})

const periodLabel = computed(() => {
  if (props.startDate && props.endDate) {
    if (props.startDate === props.endDate) {
      return props.startDate
    }
    return `${props.startDate} — ${props.endDate}`
  }
  return 'период не выбран'
})

// Цвета для категорий
const categoryColors = [
  '#D9B6FF', // Еда
  '#FFB53D', // Транспорт
  '#6EE4FE', // Жилье
  '#B0AEFF', // Развлечения
  '#FFB9B8', // Образование
  '#e17055', // Другое
]

Chart.register(ChartDataLabels)

const initChart = () => {
  if (chartInstance) chartInstance.destroy()

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.categories,
      datasets: [
        {
          label: 'Расходы по категориям',
          data: chartData.value,
          backgroundColor: categoryColors,
          borderColor: '#ffffff',
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: props.expenses.length > 0 && !props.isLoading,
          callbacks: {
            label: (context) => {
              const value = context.raw || 0
              return `${value.toLocaleString('ru-RU')} ₽`
            },
          },
        },
        datalabels: {
          display: props.expenses.length > 0 && !props.isLoading,
          color: '#000000',
          anchor: 'end',
          align: 'top',
          formatter: (value) =>
            value > 0 ? new Intl.NumberFormat('ru-RU').format(value) + ' ₽' : '',
          font: {
            weight: '600',
            size: 16,
          },
        },
      },
      scales: {
        y: {
          display: false,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          beginAtZero: true,
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#000000',
            font: {
              weight: '500',
              size: 14,
            },
            maxRotation: 0,
          },
        },
      },
      layout: {
        padding: {
          top: 40,
          bottom: 20,
          left: 10,
          right: 10,
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
    },
    plugins: [ChartDataLabels],
  })
}

onMounted(() => {
  initChart()
})

// Обновляем график при изменении данных
watch(
  [chartData, periodLabel, () => props.isLoading],
  () => {
    if (!chartInstance) return

    // Обновляем данные
    chartInstance.data.datasets[0].data = chartData.value

    // Включаем/выключаем подписи и тултипы в зависимости от наличия данных и загрузки
    chartInstance.options.plugins.datalabels.display = props.expenses.length > 0 && !props.isLoading
    chartInstance.options.plugins.tooltip.enabled = props.expenses.length > 0 && !props.isLoading

    chartInstance.update()
  },
  { deep: true },
)

// Очищаем график при уничтожении компонента
import { onUnmounted } from 'vue'

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  flex: 1;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  padding: 20px;
  width: 100%;
  height: 623.67px;
  position: relative;
}

::v-deep(.chartjs-datalabel) {
  transform: translateY(-8px);
  text-shadow: 0 1px 2px var(--color-shadow);
  color: var(--color-text-primary) !important;
}

.chart-title {
  margin-bottom: 20px;
}

.chart-title h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.chart-title p {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.chart {
  height: 480px;
  position: relative;
}

.chart canvas {
  width: 100%;
  height: 100%;
}

/* Состояние отсутствия данных для темной темы */
[data-theme='dark'] ::v-deep(.chartjs-datalabel) {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .chart-container {
    padding: 14px !important;
    height: 450px;
    border-radius: 8px;
  }

  .chart-title h2 {
    font-size: 20px !important;
  }

  .chart-title p {
    font-size: 12px !important;
  }

  .chart {
    height: calc(100% - 50px);
  }

  ::v-deep(.chartjs-datalabel) {
    font-size: 10px !important;
  }
}

/* Мобильная версия (≤375px) */
@media (max-width: 375px) {
  .chart-container {
    height: 400px;
    padding: 12px !important;
  }

  .chart-title h2 {
    font-size: 18px !important;
  }

  .chart-title p {
    font-size: 11px !important;
  }
}
</style>
