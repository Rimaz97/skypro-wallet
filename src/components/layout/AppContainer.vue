<template>
  <div class="app-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: "AppContainer",
};
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
