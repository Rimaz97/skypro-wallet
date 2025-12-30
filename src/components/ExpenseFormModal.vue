<template>
  <div class="new-expense-modal">
    <h2>Новый расход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Описание <span v-if="errors.description" class="error-star">*</span></label>
        <input
          v-model="formData.description"
          type="text"
          placeholder="Введите описание"
          required
          :class="{
            invalid: errors.description,
            valid: formData.description.trim().length > 0 && !errors.description,
          }"
          @blur="validateField('description')"
        />
      </div>

      <div class="form-group">
        <label>Категория<span v-if="errors.description" class="error-star">*</span></label>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            :class="{ active: formData.category === category.name }"
            @click="formData.category = category.name"
          >
            <img :src="category.icon" alt="" class="category-icon" />
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Дата<span v-if="errors.description" class="error-star">*</span></label>
          <input
            v-model="formData.date"
            type="date"
            required
            placeholder="Введите дату"
            class="date-input"
            :class="{
              invalid: errors.amount,
              valid: formData.amount && !errors.amount,
            }"
            @blur="validateField('date')"
          />
        </div>

        <div class="form-group">
          <label>Сумма<span v-if="errors.description" class="error-star">*</span></label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="1"
            placeholder="Введите сумму"
            required
            :class="{
              invalid: errors.amount,
              valid: formData.amount && !errors.amount,
            }"
            @blur="validateField('amount')"
          />
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="submit-button" :disabled="isDisabled">
        Добавить новый расход
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { expensesStore } from '@/store/expenses'
import { CATEGORIES, CATEGORIES_RU_TO_EN } from '@/constants/categories' // Импортируем из констант
import foodIcon from '@/assets/icons/food.svg'
import carIcon from '@/assets/icons/car.svg'
import houseIcon from '@/assets/icons/house.svg'
import gameIcon from '@/assets/icons/game.svg'
import studyIcon from '@/assets/icons/study.svg'
import messageIcon from '@/assets/icons/message.svg'

const formData = ref({
  description: '',
  category: 'Еда', // Первая категория по умолчанию
  date: '',
  amount: null,
})

const error = ref('')

const errors = ref({
  description: false,
  date: false,
  amount: false,
})

// Маппинг иконок
const iconMapping = {
  food: foodIcon,
  transport: carIcon,
  housing: houseIcon,
  entertainment: gameIcon,
  education: studyIcon,
  other: messageIcon,
}

// Автоматически генерируем категории из констант
const categories = computed(() => {
  return Object.keys(CATEGORIES).map((key) => ({
    name: CATEGORIES[key].ru,
    icon: iconMapping[key],
    key: key,
  }))
})

// Используем готовый маппинг из констант
const categoryMapping = CATEGORIES_RU_TO_EN

const isDisabled = computed(() => {
  return (
    Object.values(errors.value).some((err) => err) ||
    !formData.value.description.trim() ||
    !formData.value.date ||
    !formData.value.amount
  )
})

const validateField = (field) => {
  switch (field) {
    case 'description': {
      const descValue = formData.value.description.trim()
      errors.value.description = !descValue || descValue.length < 4
      break
    }
    case 'amount': {
      const amountValue = formData.value.amount
      errors.value.amount = !amountValue || amountValue <= 0 || isNaN(amountValue)
      break
    }
    case 'date':
      errors.value.date = !formData.value.date
      break
  }
}

const validateForm = () => {
  validateField('description')
  validateField('amount')
  validateField('date')
  return Object.values(errors.value).every((err) => !err)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    error.value = 'Пожалуйста, заполните все обязательные поля корректно'
    return
  }

  try {
    // Используем маппинг из констант
    const categoryKey = categoryMapping[formData.value.category]

    if (!categoryKey) {
      error.value = 'Выберите корректную категорию'
      return
    }

    await expensesStore.addExpense({
      description: formData.value.description.trim(),
      category: categoryKey,
      date: formData.value.date,
      sum: formData.value.amount,
    })

    resetForm()
    error.value = ''
    alert('Расход успешно добавлен!')
  } catch (err) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Произошла ошибка'
    } else {
      error.value = err.message || 'Произошла ошибка при сохранении расхода'
    }
  }
}

const resetForm = () => {
  formData.value = {
    description: '',
    category: 'Еда',
    date: '',
    amount: null,
  }
  errors.value = {
    description: false,
    date: false,
    amount: false,
  }
}
</script>

<style scoped>
.new-expense-modal {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px var(--color-shadow);
  max-width: 500px;
  width: 379px;
}

.new-expense-modal h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text-primary);
}

.error-star {
  color: var(--color-danger);
  margin-left: 3px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 12px;
  transition: all 0.2s;
  box-sizing: border-box;
  height: 48px;
  font-family: 'Montserrat', sans-serif;
  background-color: var(--input-bg);
  color: var(--color-text-primary);
}

.form-group input::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.submit-button:disabled {
  background: var(--color-text-tertiary);
  cursor: not-allowed;
  opacity: 0.8;
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-hover);
}

.form-group input.valid {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-primary);
}

.form-group input.valid:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-hover);
}

.form-group input.invalid {
  border-color: var(--color-danger);
  background: var(--color-bg-secondary);
  animation: shake 0.4s ease-in-out;
}

.form-group input.invalid:focus {
  box-shadow: 0 0 0 2px var(--color-danger);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-3px);
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
}

.category-card {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 31px;
  min-width: 60px;
  padding: 8px 20px;
  background: var(--color-bg-secondary);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.category-card:hover {
  background: var(--color-bg-tertiary);
}

.category-card:hover .category-icon {
  filter: brightness(var(--icon-brightness));
}

.category-card.active {
  background: var(--table-row-selected);
  border-color: var(--color-primary);
}

.category-card.active .category-icon,
.category-card.active .category-name {
  filter: brightness(var(--icon-brightness));
}

.category-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  transition: color 0.2s;
  filter: brightness(var(--icon-brightness));
}

.category-name {
  font-size: 14px;
  color: var(--color-text-primary);
  white-space: nowrap;
  transition: color 0.2s;
}

.form-row {
  display: block;
}

.error {
  color: var(--color-danger);
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  height: 48px;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

/* Планшеты (до 1024px) */
@media (max-width: 1024px) {
  .new-expense-modal {
    width: 100%;
    max-width: 500px;
  }
}

/* Планшеты маленькие (до 768px) */
@media (max-width: 768px) {
  .new-expense-modal {
    padding: 20px;
  }
}

/* Мобильная версия (≤425px) */
@media (max-width: 425px) {
  .new-expense-modal {
    padding: 16px 14px !important;
    border-radius: 10px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: 0 2px 8px var(--color-shadow) !important;
  }

  .new-expense-modal h2 {
    font-size: 20px !important;
    margin-bottom: 18px !important;
  }

  .form-group label {
    font-size: 13px !important;
    margin-bottom: 6px !important;
  }

  .form-group input {
    font-size: 14px !important;
    padding: 10px 12px !important;
    height: 44px !important;
  }

  .category-grid {
    gap: 4px !important;
  }

  .category-card {
    padding: 8px 12px !important;
    height: 28px !important;
    min-width: 55px !important;
  }

  .category-name {
    font-size: 12px !important;
  }

  .category-icon {
    width: 18px !important;
    height: 18px !important;
  }

  .submit-button {
    font-size: 14px !important;
    padding: 12px !important;
    height: 44px !important;
  }

  .error-star {
    font-size: 12px !important;
  }

  .form-row {
    gap: 12px !important;
  }
}

/* Мобильная версия (≤375px) */
@media (max-width: 375px) {
  .new-expense-modal {
    padding: 14px 12px !important;
  }

  .new-expense-modal h2 {
    font-size: 18px !important;
  }

  .category-card {
    padding: 6px 10px !important;
    min-width: 50px !important;
    height: 26px !important;
  }

  .category-name {
    font-size: 11px !important;
  }

  .category-icon {
    width: 16px !important;
    height: 16px !important;
  }

  .form-group input {
    font-size: 13px !important;
    padding: 8px 10px !important;
    height: 40px !important;
  }

  .submit-button {
    font-size: 13px !important;
    padding: 10px !important;
    height: 40px !important;
  }
}
</style>
