<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <div class="flex justify-between items-center gap-4">
          <el-card style="max-width: 480px" class="flex flex-col items-center justify-center">
            <p>ETH Balance (Total pool)</p>
            <h1 class="font-bold text-4xl brand-text">
              {{ isUserConnected ? prizePool : '-' }} ETH
            </h1>
            <p class="text-12 text-center">
              {{ isUserConnected ? etherPrice + '/1 USD' : 'Connect Wallet to View Total Pool' }}
            </p>
          </el-card>
          <div>
            <el-card style="max-width: 480px" class="flex flex-col items-center justify-center">
              <template v-if="isUserConnected">
                <h1 class="font-bold text-4xl">
                  <el-countdown :value="timeLeft" />
                </h1>
                <small class="text-12">Time Remaining</small>
              </template>
              <template v-else>
                <h1 class="font-bold text-4xl brand-text">-</h1>
                <small class="text-10">Connect Wallet to View Count Down</small>
              </template>
            </el-card>

            <div class="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                @change="showPreviousMoves"
                :disabled="!gameActive"
                :class="{ 'cursor-not-allowed': !gameActive }"
              />
              <label>Previous moves</label>
            </div>
          </div>
        </div>

        <Game />
        <History />

        <!-- adding admin link to navigate to admin page b'cos using gh-pages w/ SPAs doesn't work well -->
        <router-link to="/admin" class="fixed bottom-4 right-4">
          <span
            class="w-2 h-2 bg-gray-800 hidden rounded-full flex items-center justify-center"
          ></span>
        </router-link>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect } from 'vue'
import { formatEther } from 'ethers/lib/utils'
import Game from '../components/Game.vue'
import Header from '../components/Header.vue'
import History from '../components/History.vue'
import { useGameStore } from '../stores/gameStore'

export default {
  name: 'Home',
  components: {
    Game,
    Header,
    History
  },
  setup() {
    const gameStore = useGameStore()
    const prizePool = ref(gameStore.game?.[3])
    const timeLeft = ref(Date.now() + 1000 * gameStore.timeLeft)
    const etherPrice = ref(gameStore.etherPrice)
    const gameActive = ref(false)
    const isUserConnected = ref(gameStore.isUserConnected)

    const showPreviousMoves = (event: Event) => {
      gameStore.showPreviousMoves = (event.target as HTMLInputElement).checked
    }

    watchEffect(() => {
      prizePool.value = formatEther(gameStore.game?.[3] || 0)
      gameActive.value = gameStore.isGameActive
      isUserConnected.value = gameStore.isUserConnected
      etherPrice.value = gameStore.etherPrice
    })

    return {
      prizePool,
      timeLeft,
      gameActive,
      isUserConnected,
      showPreviousMoves,
      etherPrice
    }
  }
}
</script>

<style lang="scss" scoped>
</style>