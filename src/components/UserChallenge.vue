<!-- <template>
  <el-card
    class="w-[800px] mx-auto cursor-pointer relative overflow-hidden rounded-lg shadow-lg bg-white"
    ref="imageContainer"
  >
    <img
      :src="game[0]"
      alt="Spot the ball"
      :class="{ 'w-full h-full block': game, 'cursor-not-allowed': gameRevealed }"
    />
  </el-card>
</template>

<script>
import { reactive } from 'vue'
import { useMouse, useParentElement } from '@vueuse/core'
// import type { UseMouseEventExtractor } from '@vueuse/core'

export default {
  name: 'UserChallenge',
  props: {
    game: {
      type: Array,
      required: true
    },
    gameRevealed: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const parentEl = useParentElement()

    const extractor = (event) => {
      if (typeof Touch !== 'undefined' && event instanceof Touch) return null
      else return [event.offsetX, event.offsetY]
    }

    const { x, y, sourceType } = reactive(useMouse({ target: parentEl, type: extractor }))
  }
}
</script> -->

<script setup lang="ts">
import { reactive } from 'vue'
import { useMouse, useParentElement } from '@vueuse/core'
import type { UseMouseEventExtractor } from '@vueuse/core'

const parentEl = useParentElement()

const mouseDefault = reactive(useMouse())

const extractor: UseMouseEventExtractor = (event) => {
  if (typeof Touch !== 'undefined' && event instanceof Touch) return null
  else return [event.offsetX, event.offsetY]
}

const mouseWithExtractor = reactive(useMouse({ target: parentEl, type: extractor }))
console.log('🚀 ~ mouseWithExtractor:', mouseWithExtractor)
</script>

<template>
  <p>Basic Usage</p>
  <pre lang="yaml">{{ textDefault }}</pre>
  <p>Extractor Usage</p>
  <pre lang="yaml">{{ textWithExtractor }}</pre>
</template>