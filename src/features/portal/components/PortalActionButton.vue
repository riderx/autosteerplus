<template>
  <k-button
    :component="href ? 'a' : 'button'"
    :href="href"
    :target="href ? target : undefined"
    :rel="href ? rel : undefined"
    :type="href ? undefined : type"
    :disabled="disabled"
    inline
    :clear="variant === 'ghost'"
    :tonal="variant === 'secondary'"
    rounded
    class="portal-action-button"
    :class="variantClass"
  >
    <slot />
  </k-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { kButton } from 'konsta/vue';

const props = withDefaults(defineProps<{
  disabled?: boolean;
  href?: string;
  rel?: string;
  target?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}>(), {
  disabled: false,
  href: undefined,
  rel: 'noreferrer',
  target: '_self',
  type: 'button',
  variant: 'primary',
});

const variantClass = computed(() => {
  if (props.variant === 'danger') {
    return '!bg-[#ff3b30] !text-white !shadow-sm';
  }

  if (props.variant === 'secondary') {
    return '!bg-[rgba(10,96,255,0.10)] !text-[#0a60ff]';
  }

  if (props.variant === 'ghost') {
    return '!text-[#0a60ff]';
  }

  return '!bg-[#0a60ff] !text-white !shadow-sm';
});
</script>
