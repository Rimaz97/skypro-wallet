<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Новый расход</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <label class="section-label">
            Описание<span class="required-star">*</span>
          </label>
          <input
            v-model="form.description"
            type="text"
            placeholder="Введите описание"
            class="form-input"
            @input="updateTextColor($event)"
          />
        </div>

        <div class="form-section">
          <label class="section-label">
            Категория<span class="required-star">*</span>
          </label>
          <div class="category-options">
            <label
              v-for="category in categories"
              :key="category.value"
              :class="[
                'category-option',
                { active: form.category === category.value },
              ]"
              @click="form.category = category.value"
            >
              <img
                :src="category.icon"
                :alt="category.label"
                class="category-icon"
              />
              <span class="category-name">{{ category.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">
            Дата<span class="required-star">*</span>
          </label>
          <input
            v-model="form.date"
            type="date"
            class="form-input"
            @input="updateTextColor($event)"
          />
        </div>

        <div class="form-section">
          <label class="section-label">
            Сумма<span class="required-star">*</span>
          </label>
          <div class="amount-input-wrapper">
            <input
              v-model="form.amount"
              type="number"
              placeholder="Введите сумму"
              class="form-input amount-input"
              @input="updateTextColor($event)"
            />
            <span class="currency">₽</span>
          </div>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :class="{ active: isFormValid }"
          :disabled="!isFormValid"
        >
          Новый расход
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddSpendModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    return {
      categories: [
        { value: "food", label: "Еда", icon: "/img/bag.svg" },
        { value: "transport", label: "Транспорт", icon: "/img/car.svg" },
        { value: "housing", label: "Жилье", icon: "/img/house.svg" },
        { value: "joy", label: "Развлечения", icon: "/img/gameboy.svg" },
        { value: "education", label: "Образование", icon: "/img/teacher.svg" },
        { value: "other", label: "Другое", icon: "/img/message-text.svg" },
      ],
      form: {
        description: "",
        category: "",
        date: formattedDate,
        amount: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.description &&
        this.form.category &&
        this.form.date &&
        this.form.amount
      );
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleSubmit() {
      if (this.isFormValid) {
        this.$emit("addExpense", { ...this.form });
        this.resetForm();
      }
    },
    resetForm() {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      this.form = {
        description: "",
        category: "",
        date: formattedDate,
        amount: "",
      };
    },
    updateTextColor(event) {
      const input = event.target;
      if (input.value) {
        input.style.color = "var(--text-primary)";
      } else {
        input.style.color = "var(--text-light)";
      }
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
        setTimeout(() => {
          const inputs = document.querySelectorAll(".modal-form .form-input");
          inputs.forEach((input) => {
            if (!input.value) {
              input.style.color = "var(--text-light)";
            }
          });
        }, 100);
      } else {
        document.body.style.overflow = "auto";
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.close-btn:hover {
  background-color: var(--bg-gray);
  color: var(--text-primary);
}

.modal-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.required-star {
  color: var(--danger-color);
  margin-left: 2px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  transition: all var(--transition-fast);
  color: var(--text-light);
  background-color: var(--bg-white);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.form-input::placeholder {
  color: var(--text-light);
}

.category-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 14px;
  user-select: none;
  background-color: var(--bg-white);
}

.category-option:hover {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.category-option.active {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.category-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-name {
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
}

.amount-input-wrapper {
  position: relative;
}

.currency {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #ccc;
  color: var(--bg-white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: not-allowed;
  transition: all var(--transition-normal);
  font-family: "Montserrat", sans-serif;
  margin-top: 8px;
}

.submit-btn.active {
  background-color: var(--primary-color);
  cursor: pointer;
}

.submit-btn.active:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .category-options {
    grid-template-columns: 1fr;
  }

  .category-option {
    padding: 10px 12px;
  }

  .category-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
</style>
