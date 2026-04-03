<template>
  <div class="grid gap-2">
    <button
      type="button"
      class="group relative block w-full overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.14)] bg-white text-left outline-none transition hover:border-[rgba(10,96,255,0.28)] focus-visible:ring-2 focus-visible:ring-[rgba(10,96,255,0.18)]"
      @click="open = true"
    >
      <div
        :class="[
          'relative flex items-center justify-center overflow-hidden',
          previewAspectClass,
        ]"
      >
        <img
          :src="src"
          :alt="alt"
          :class="['h-full w-full transition duration-200 group-hover:scale-[1.01]', previewImageClass]"
          :style="
            previewObjectPosition
              ? { objectPosition: previewObjectPosition }
              : undefined
          "
        />
      </div>
      <span
        v-if="showHint"
        class="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[rgba(17,17,17,0.72)] px-3 py-1 text-[0.74rem] font-medium text-white shadow-sm"
      >
        {{ hintLabel }}
      </span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.78)] p-4 sm:p-6"
        @click="open = false"
      >
        <div class="grid w-full max-w-6xl gap-3" @click.stop>
          <div class="flex justify-end">
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-[0.95rem] font-semibold text-[#111111] shadow-sm"
              @click="open = false"
            >
              Close
            </button>
          </div>
          <div
            class="overflow-hidden rounded-[24px] bg-[rgba(17,17,17,0.94)] p-2 sm:p-4"
          >
            <img
              :src="src"
              :alt="alt"
              class="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    previewAspectClass?: string;
    previewImageClass?: string;
    previewObjectPosition?: string;
    showHint?: boolean;
    hintLabel?: string;
  }>(),
  {
    previewAspectClass: "aspect-[16/10]",
    previewImageClass: "object-cover object-center",
    showHint: true,
    hintLabel: "Tap to enlarge",
  },
);

const open = ref(false);
</script>
