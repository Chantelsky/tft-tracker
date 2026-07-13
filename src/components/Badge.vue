<script setup lang="ts">
defineProps<{
  variant?: 'accent' | 'success' | 'danger' | 'muted'
}>()

const variantClasses = {
  accent: 'bg-card text-accent-light',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  muted: 'bg-surface text-text-muted',
}
</script>

<template>
  <span
    class="text-xs px-2.5 py-1 rounded-full font-medium"
    :class="variantClasses[variant ?? 'muted']"
  >
    <slot />
  </span>
</template>
