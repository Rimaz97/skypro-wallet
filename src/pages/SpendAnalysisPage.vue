<template>
  <div class="spend-analysis-page">
    <AppHeader />
    <main class="main-content">
      <AppContainer>
        <div class="analysis-wrapper">
          <h1>Анализ расходов</h1>
          <p>Здесь будет график и статистика расходов</p>
          <div class="analysis-placeholder">
            <div class="placeholder-chart">
              <div
                class="chart-bar"
                style="height: 60px; background: #1fa46c"
              ></div>
              <div
                class="chart-bar"
                style="height: 100px; background: #1fa46c"
              ></div>
              <div
                class="chart-bar"
                style="height: 80px; background: #1fa46c"
              ></div>
              <div
                class="chart-bar"
                style="height: 40px; background: #1fa46c"
              ></div>
            </div>
            <div class="placeholder-stats">
              <div class="stat-item">
                <span class="stat-label">Всего потрачено:</span>
                <span class="stat-value">25,000 ₽</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Самые большие расходы:</span>
                <span class="stat-value">Еда</span>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </main>
  </div>
</template>

<script>
import AppHeader from "../components/layout/AppHeader.vue";
import AppContainer from "../components/layout/AppContainer.vue";

export default {
  name: "SpendAnalysisPage",
  components: {
    AppHeader,
    AppContainer,
  },
};
</script>

<style scoped>
.analysis-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 30px 0;
}

.analysis-wrapper {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 30px;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-info h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value {
  color: #1fa46c;
  font-size: 22px;
  font-weight: 700;
}
</style>
