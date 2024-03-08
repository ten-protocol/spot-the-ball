
<template>
  <div class="max-w-[1300px] mx-auto w-full p-6">
    <template v-if="game?.[0] && !gameRevealed">
      <UserChallenge
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
import Web3Service from '../lib/web3service'
import { useMessageStore } from '../stores/messageStore'
import { useWalletStore } from '../stores/walletStore'
import EmptyState from './EmptyState.vue'
import UserChallenge from './UserChallenge.vue'

const gameStore = useGameStore()

const game = ref()
const gameActive = ref(gameStore.isGameActive)
const gameRevealed = ref(gameStore.isGameRevealed)
const submitDisabled = ref(false)
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
})
</script>
