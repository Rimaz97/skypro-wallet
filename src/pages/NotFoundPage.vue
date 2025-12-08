<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Страница не найдена</h1>
        <p class="error-description">
          Извините, но страница, которую вы ищете, не существует или была
          перемещена.
        </p>
        <div class="error-actions">
          <router-link to="/" class="home-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 7V13.5C13 13.7761 12.7761 14 12.5 14H10.5C10.2239 14 10 13.7761 10 13.5V10.5C10 10.2239 9.77614 10 9.5 10H6.5C6.22386 10 6 10.2239 6 10.5V13.5C6 13.7761 5.77614 14 5.5 14H3.5C3.22386 14 3 13.7761 3 13.5V7"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M1 8L7.29289 1.70711C7.68342 1.31658 8.31658 1.31658 8.70711 1.70711L15 8"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            Вернуться на главную
          </router-link>
          <button @click="goBack" class="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M15 8H1M1 8L8 15M1 8L8 1"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            Назад
          </button>
        </div>
        <div class="error-image">
          <div class="illustration">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="search-icon">
              <div class="magnifier"></div>
              <div class="handle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f5f6;
}

.not-found-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 40px 20px;
}

.not-found-content {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1fa46c;
  line-height: 1;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
}

.error-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.error-description {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
}

.home-link,
.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
}

.home-link {
  background-color: #1fa46c;
  color: white;
}

.home-link:hover {
  background-color: #188055;
  transform: translateY(-2px);
}

.back-link {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.back-link:hover {
  background-color: #f9f9f9;
  transform: translateY(-2px);
}

.error-image {
  position: relative;
  height: 200px;
  margin-top: 30px;
}

.illustration {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: #f0f7f3;
}

.circle:nth-child(1) {
  width: 80px;
  height: 80px;
  top: 20px;
  left: 20px;
  animation: float 3s ease-in-out infinite;
}

.circle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 60px;
  right: 40px;
  animation: float 3s ease-in-out infinite 0.5s;
}

.circle:nth-child(3) {
  width: 40px;
  height: 40px;
  bottom: 40px;
  left: 70px;
  animation: float 3s ease-in-out infinite 1s;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.magnifier {
  width: 80px;
  height: 80px;
  border: 8px solid #1fa46c;
  border-radius: 50%;
  position: relative;
}

.handle {
  width: 40px;
  height: 8px;
  background-color: #1fa46c;
  position: absolute;
  bottom: -30px;
  right: -20px;
  transform: rotate(45deg);
  border-radius: 4px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
