<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { CIRCLE_SIZE } from '../lib/utils'
import Web3Service from '../lib/web3service'
import { useGameStore } from '../stores/gameStore'
import { useWalletStore } from '../stores/walletStore'

defineProps<{
  timeLeft: number
  game: string[]
  gameRevealed: boolean
  showPreviousMoves: boolean
  history: { x: number; y: number; win: boolean }[]
}>()

const imageContainer = ref()
const circleSize = CIRCLE_SIZE

const gameStore = useGameStore()
const walletStore = useWalletStore()

const mouse = reactive(useMouseInElement(imageContainer))

const submit = async () => {
  if (mouse.isOutside) {
    return
  }
  gameStore.loading = true
  try {
    if (!walletStore.signer) {
      this.$notify({
        title: 'Not connected with Metamask',
        message: 'Please connect with Metamask to submit your guess',
        type: 'error'
      })
      gameStore.loading = false
      return
    }
    const web3Service = new Web3Service(walletStore.signer)
    const challengeId = await web3Service.getChallengeId()
    const payload = [challengeId, [mouse.elementX, mouse.elementY]]
    const res = await web3Service.submitGuess(...payload)
    if (res) {
      gameStore.showModal('', res)
    }
  } catch (err) {
    console.error('Error submitting guess:', err.message)
  }
  gameStore.loading = false
}
</script>

<template>
  <el-alert
    v-if="timeLeft <= 0"
    title="Time's up!"
    type="info"
    description="The game is over. Please wait for the next game to start."
    show-icon
    class="w-[800px] mx-auto relative overflow-hidden rounded-lg mb-4"
  ></el-alert>

  <el-card class="w-[800px] mx-auto relative overflow-hidden rounded-lg cursor-pointer">
    <img
      :src="game[0]"
      alt="Spot the ball"
      :class="{ 'w-full h-full block': game, 'cursor-not-allowed': gameRevealed || timeLeft <= 0 }"
      ref="imageContainer"
    />
    <div
      v-if="!gameRevealed && game[0] && !gameStore.loading && timeLeft > 0"
      class="absolute border-[4px] border-white rounded-full"
      :style="{
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        top: `${mouse.isOutside ? '50%' : `${mouse.elementY - circleSize / 2}px`}`,
        left: `${mouse.isOutside ? '50%' : `${mouse.elementX - circleSize / 2}px`}`,
        transform: `${mouse.isOutside ? 'translate(-50%,-50%)' : ''}`
      }"
      @click="submit"
    ></div>
    <template v-if="showPreviousMoves && history">
      <div
        v-for="(move, index) in history"
        :key="index"
        class="absolute border-[4px] border-white rounded-full"
        :style="{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          top: `${move.y - circleSize / 2}px`,
          left: `${move.x - circleSize / 2}px`,
          background: move.win === true ? 'hsl(var(--success)' : 'hsl(var(--destructive)'
        }"
      ></div>
    </template>
  </el-card>
</template>