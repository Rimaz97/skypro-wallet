<template>
  <button
    :class="[
      'base-button',
      {
        disabled: !active,
        loading: loading,
      },
    ]"
    :disabled="!active || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button-loader"></span>
    <span class="button-text">{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    text: String,
    active: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
};
</script>

<style scoped>
.base-button {
  position: relative;
  width: 100%;
  max-width: 343px;
  height: 39px;
  padding: 0 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.base-button:hover:not(.disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button:active:not(.disabled) {
  transform: translateY(0);
}

.base-button.disabled {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button.loading {
  opacity: 0.8;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
