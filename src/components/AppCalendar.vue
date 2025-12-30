<template>
    <div class="calendar-wrapper">
      <div class="calendar-header">
        <div
          v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
          :key="day"
          class="day-header"
        >
          {{ day }}
        </div>
      </div>

      <div class="calendar-scroll">
        <div
          v-for="(monthGroup, index) in groupedDates"
          :key="index"
          class="month-group"
          :class="{ 'current-month': isCurrentMonth(monthGroup) }"
        >
          <div class="month-header">
            {{ formatMonth(monthGroup.month, monthGroup.year) }}
          </div>

          <div class="month-days">
            <div
              v-for="(date, di) in monthGroup.dates"
              :key="di"
              class="day-cell"
              :class="{
                empty: !date,
                selected: isDateSelected(date),
                'in-range': isDateInRange(date),
                'single-day': isSingleDay && isDateSelected(date),
              }"
              @click="date && selectDate(date)"
            >
              {{ date ? date.getDate() : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  selectedStart: Date,
  selectedEnd: Date,
})

const emit = defineEmits(['date-selected'])

const startDate = ref(null)
const endDate = ref(null)

const normalizeDate = (date) =>
  date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null

const selectDate = (clickedDate) => {
  const normalized = normalizeDate(clickedDate)
  if (!normalized) return

  if (!startDate.value) {
    startDate.value = normalized
  } else if (!endDate.value) {
    if (normalized.getTime() === startDate.value.getTime()) {
      resetSelection()
    } else {
      endDate.value = normalized
      if (endDate.value < startDate.value) {
        ;[startDate.value, endDate.value] = [endDate.value, startDate.value]

        console.log('[Calendar] Dates swapped:', formatLogRange())
      }
      if (!validatePeriod(startDate.value, endDate.value)) {
        console.warn('Некорректный период')
        resetSelection()
      }
    }
  } else {
    resetSelection()
    startDate.value = normalized
  }

  emitSelection()
}

const resetSelection = () => {
  startDate.value = null
  endDate.value = null
}

const validatePeriod = (start, end) => {
  if (!start || !end) return true
  const maxPeriod = 365 * 24 * 60 * 60 * 1000 // 1 год
  return end - start <= maxPeriod
}

const formatLogDate = (date) => (date ? date.toLocaleDateString('ru-RU') : 'null')

const formatLogRange = () => `${formatLogDate(startDate.value)} — ${formatLogDate(endDate.value)}`

const emitSelection = () => {
  emit('date-selected', startDate.value, endDate.value)
}

const isSingleDay = computed(() => startDate.value?.getTime() === endDate.value?.getTime())

const isDateSelected = (date) =>
  date &&
  ((startDate.value && date.getTime() === startDate.value.getTime()) ||
    (endDate.value && date.getTime() === endDate.value.getTime()))

const isDateInRange = (date) =>
  date && startDate.value && endDate.value && date > startDate.value && date < endDate.value

const groupedDates = computed(() => {
  const result = []
  const now = new Date()

  let current = new Date(now.getFullYear(), now.getMonth() - 12, 1)

  for (let i = 0; i < 37; i++) {
    result.push({
      month: current.getMonth(),
      year: current.getFullYear(),
      dates: generateMonthDates(current),
    })
    current.setMonth(current.getMonth() + 1)
  }

  return result
})

const isCurrentMonth = (monthGroup) => {
  const now = new Date()
  return monthGroup.month === now.getMonth() && monthGroup.year === now.getFullYear()
}

onMounted(() => {
  nextTick(() => {
    const currentMonthIndex = groupedDates.value.findIndex(isCurrentMonth)
    const monthElements = document.querySelectorAll('.month-group')
    if (monthElements[currentMonthIndex]) {
      monthElements[currentMonthIndex].scrollIntoView({
        behavior: 'auto',
        block: 'start',
      })
    }
  })
})

function generateMonthDates(monthDate) {
  const dates = []
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDay = (firstDay.getDay() + 6) % 7
  for (let i = 0; i < startDay; i++) dates.push(null)

  for (let d = 1; d <= lastDay.getDate(); d++) {
    dates.push(new Date(year, month, d))
  }

  return dates
}

const formatMonth = (monthIndex, year) => {
  const monthName = new Date(year, monthIndex).toLocaleString('ru-RU', {
    month: 'long',
  })
  return `${monthName[0].toUpperCase()}${monthName.slice(1)} ${year}`
}

watch(
  () => [props.selectedStart, props.selectedEnd],
  ([newStart, newEnd]) => {
    startDate.value = normalizeDate(newStart)
    endDate.value = normalizeDate(newEnd)
  },
  { immediate: true },
)
</script>

<style scoped>
.calendar-container {
  flex: 0 0 400px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
}

.calendar-wrapper {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  height: 500px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: var(--card-bg);
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid var(--color-border);
}

.calendar-scroll {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.month-group {
  padding: 0 8px;
}

.month-header {
  padding: 16px 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--card-bg);
  top: 40px;
  z-index: 1;
  box-shadow: 0 2px 4px -2px var(--color-shadow);
}

.month-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding-bottom: 12px;
}

.day-header {
  text-align: center;
  font-size: 12px;
  color: var(--color-text-tertiary);
  padding: 8px;
  width: 36px;
  margin: 0 auto;
}

.day-cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 2px auto;
  background: transparent;
  color: var(--color-text-primary);
}

.day-cell:not(.current-month) {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.day-cell:hover:not(.empty) {
  background: var(--table-row-hover);
}

.day-cell.selected {
  background: var(--table-row-selected);
  color: var(--color-primary);
  font-weight: 500;
  transform: scale(1.1);
  box-shadow: 0 2px 6px var(--color-shadow);
}

.day-cell.in-range {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  transform: scale(1.05);
}

.day-cell.empty {
  visibility: hidden;
  pointer-events: none;
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .calendar-container {
    width: 100%;
    flex: 0 0 auto;
  }

  .calendar-wrapper {
    height: 400px;
  }

  .month-header {
    padding: 12px 4px;
    font-size: 14px;
  }

  .day-cell {
    width: 32px;
    height: 32px;
    font-size: 13px;
    margin: 1px auto;
  }

  .day-header {
    font-size: 11px;
    padding: 6px;
    width: 32px;
  }
}
</style>
