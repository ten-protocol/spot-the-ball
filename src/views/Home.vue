<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <div class="flex flex-wrap justify-between items-center gap-4">
          <el-card style="max-width: 480px" class="bg-background text-foreground border">
            <div class="flex items-center justify-between">
              <div class="-ml-6">
                <img src="/assets/images/encrypted-ethereum-logo.png" alt="Ethereum Logo" />
              </div>
              <div class="flex flex-col items-center">
                <p>ETH Balance (Total pool)</p>
                <h1 class="font-bold text-4xl brand-text">
                  {{ isUserConnected ? prizePool + 'ETH' : '-' }}
                </h1>
                <p class="text-12 text-center">
                  {{
                    isUserConnected
                      ? etherPrice + ' USD/1 ETH'
                      : 'Connect wallet to view total pool'
                  }}
                </p>
              </div>
            </div>
          </el-card>
          <div class="flex flex-col items-center gap-4">
            <el-card style="width: 280px" class="bg-background">
              <div class="flex items-center justify-between">
                <div class="flex flex-col items-center text-foreground">
                  <template v-if="isUserConnected">
                    <h1 class="font-bold text-4xl">
                      <el-countdown :value="Date.now() + 1000 * timeLeft" class="text-forground" />
                    </h1>
                    <small class="text-12">Time Remaining</small>
                  </template>
                  <template v-else>
                    <h1 class="font-bold text-4xl brand-text">-</h1>
                    <small class="text-12">Connect wallet to view countdown</small>
                  </template>
                </div>
                <div class="-mr-6 -mt-6 ml-3">
                  <img src="/assets/images/checking-data.png" alt="Checking Data" />
                </div>
              </div>
            </el-card>

            <div class="flex items-center gap-2 text-sm pt-2">
              <input
                type="checkbox"
                @change="showPreviousMoves"
                :disabled="!gameActive"
                :class="{ 'cursor-not-allowed': !gameActive }"
              />
              <label class="font-bold">Previous moves</label>
            </div>
          </div>
        </div>

        <Game />
        <UserGameData />

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
import UserGameData from '../components/UserGameData.vue'
import { useGameStore } from '../stores/gameStore'

export default {
  name: 'Home',
  components: {
    Game,
    Header,
    UserGameData
  },
  setup() {
    const gameStore = useGameStore()
    const prizePool = ref(gameStore.game?.[3])
    const timeLeft = ref(gameStore.timeLeft)
    const etherPrice = ref(gameStore.etherPrice)
    const gameActive = ref(false)
    const isUserConnected = ref(gameStore.isUserConnected)

    const showPreviousMoves = (event: Event) => {
      gameStore.showPreviousMoves = (event.target as HTMLInputElement).checked
    }

    watchEffect(() => {
      prizePool.value = formatEther(gameStore.game?.[3] || 0)
      timeLeft.value = gameStore.timeLeft
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