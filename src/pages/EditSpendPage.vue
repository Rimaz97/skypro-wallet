<template>
  <div class="edit-spend-page">
    <AppHeader />
    <main class="main-content">
      <AppContainer>
        <div class="form-wrapper">
          <h1>Редактировать расход</h1>
          <p v-if="loading">Загрузка...</p>
          <form v-else class="spend-form" @submit.prevent="handleSubmit">
            <!-- Такая же форма как в NewSpendPage -->
            <div class="form-group">
              <label>Название</label>
              <BaseInput
                v-model="form.title"
                placeholder="Например: Продукты"
              />
            </div>

            <div class="form-group">
              <label>Сумма (₽)</label>
              <BaseInput v-model="form.amount" placeholder="0" type="number" />
            </div>

            <div class="form-group">
              <label>Категория</label>
              <select v-model="form.category" class="category-select">
                <option value="">Выберите категорию</option>
                <option value="food">Еда</option>
                <option value="transport">Транспорт</option>
                <option value="housing">Жилье</option>
                <option value="joy">Развлечения</option>
                <option value="education">Образование</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div class="form-group">
              <label>Дата</label>
              <BaseInput v-model="form.date" type="date" />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea
                v-model="form.description"
                class="description-textarea"
                placeholder="Необязательное описание"
              ></textarea>
            </div>

            <div class="form-actions">
              <BaseButton text="Сохранить изменения" :active="isFormValid" />
              <BaseButton text="Удалить" :active="true" class="delete-btn" />
              <router-link to="/" class="cancel-link">Отмена</router-link>
            </div>
          </form>
        </div>
      </AppContainer>
    </main>
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppContainer from "@/components/layout/AppContainer.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

export default {
  name: "EditSpendPage",
  components: {
    AppHeader,
    AppContainer,
    BaseInput,
    BaseButton,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      form: {
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.title.trim() &&
        this.form.amount &&
        this.form.category &&
        this.form.date
      );
    },
  },
  mounted() {
    // Здесь будет загрузка данных расхода по ID
    this.loadSpendData();
  },
  methods: {
    loadSpendData() {
      // Заглушка для загрузки данных
      setTimeout(() => {
        this.form = {
          title: "Продукты в супермаркете",
          amount: "2500",
          category: "food",
          date: "2024-01-15",
          description: "Покупки на неделю",
        };
        this.loading = false;
      }, 500);
    },
    handleSubmit() {
      if (this.isFormValid) {
        console.log("Изменения сохранены:", this.form);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.edit-spend-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.form-wrapper {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-wrapper h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.category-select {
  width: 100%;
  max-width: 343px;
  height: 39px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 12px;
  color: black;
  border: 1px solid #999999;
  font-family: "Montserrat", sans-serif;
  background: white;
}

.category-select:focus {
  outline: none;
  border-color: #1fa46c;
}

.description-textarea {
  width: 100%;
  max-width: 343px;
  min-height: 100px;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  color: black;
  border: 1px solid #999999;
  font-family: "Montserrat", sans-serif;
  resize: vertical;
}

.description-textarea:focus {
  outline: none;
  border-color: #1fa46c;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.delete-btn {
  background-color: #f25050 !important;
}

.delete-btn:hover {
  background-color: #d43f3f !important;
}

.cancel-link {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.cancel-link:hover {
  color: #1fa46c;
  text-decoration: underline;
}
</style>
