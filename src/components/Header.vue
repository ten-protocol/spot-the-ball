<template>
  <el-menu
    :default-active="activeIndex"
    class="flex items-center justify-between p-4 bg-background"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <h1 class="font-bold text-2xl brand-text flex items-center gap-2">
        {{ headerText }}
        <img src="/assets/images/ball.png" alt="Spot the Ball" class="w-8 h-8" />
      </h1>
    </el-menu-item>
    <div class="flex-grow" />
    <ThemeSwitcher />
    <MetaMaskConnectButton />
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

const headerText = ref('Spot the Ball')
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
