<template>
  <div class="base-input-wrapper">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :class="{ 'has-error': error }"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: String,
    placeholder: String,
    type: {
      type: String,
      default: "text",
    },
    error: String,
    disabled: Boolean,
  },
  emits: ["update:modelValue", "focus", "blur"],
};
</script>

<style scoped>
.base-input-wrapper {
  width: 100%;
  max-width: 343px;
}

input {
  width: 100%;
  height: 39px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  background-color: var(--bg-white);
  transition: all var(--transition-fast);
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(31, 164, 108, 0.1);
}

input::placeholder {
  color: var(--text-light);
}

input.has-error {
  border-color: var(--danger-color);
}

input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(242, 80, 80, 0.1);
}

input:disabled {
  background-color: var(--bg-gray);
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 4px;
  color: var(--danger-color);
  font-size: 12px;
  font-weight: 500;
}
</style>
