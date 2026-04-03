<template>
  <div class="layout">
    <AppHeader />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import { authStore } from "@/store/auth";
import { expensesStore } from "@/store/expenses";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isAuthenticated = computed(() => authStore.state.value.isAuthenticated);

onMounted(async () => {
  try {
    await authStore.init();

    if (!isAuthenticated.value) {
      router.push('/signin');
      return;
    }

    const userId = authStore.state.value.user?.id;
    if (!userId) {
      console.error('UserId не определен');
      router.push('/signin');
      return;
    }

    await expensesStore.getExpenses();
  } catch (error) {
    console.error('Ошибка при инициализации:', error);
    router.push('/signin');
  }
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
}

.content {
  flex: 1;
  padding: 20px;
}

@media (max-width: 1024px) {
  .content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 12px;
  }
}

@media (max-width: 425px) {
  .content {
    padding: 8px 0;
  }

  .layout {
    background-color: var(--color-bg-primary);
  }
}
</style>
