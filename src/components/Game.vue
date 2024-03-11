
<template>
  <div class="max-w-[1300px] mx-auto w-full p-6">
    <template v-if="game?.[0] && !gameRevealed">
      <UserChallenge
        :timeLeft="timeLeft"
        :game="game"
        :gameRevealed="gameRevealed"
        :showPreviousMoves="showPreviousMoves"
        :history="HISTORY"
      />
    </template>
    <template v-else>
      <EmptyState />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'
import EmptyState from './EmptyState.vue'
import UserChallenge from './UserChallenge.vue'

const gameStore = useGameStore()

const game = ref()
const timeLeft = ref(gameStore.timeLeft)
const gameActive = ref(gameStore.isGameActive)
const gameRevealed = ref(gameStore.isGameRevealed)
const isUserConnected = ref(gameStore.isUserConnected)
const HISTORY = ref(gameStore.history)
const showPreviousMoves = ref(gameStore.showPreviousMoves)

watchEffect(() => {
  game.value = gameStore.game
  HISTORY.value = gameStore.history
  showPreviousMoves.value = gameStore.showPreviousMoves
  gameRevealed.value = gameStore.isGameRevealed
  gameActive.value = gameStore.isGameActive
  isUserConnected.value = gameStore.isUserConnected
  timeLeft.value = gameStore.timeLeft
})
</script>
