<template>
  <el-menu
    class="flex items-center justify-between bg-background p-4"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <h1 class="font-bold text-2xl brand-text flex items-center gap-2">
        {{ headerText }}
        <img src="/assets/images/ball.png" alt="Spot the Ball" class="w-8 h-8" />
        <span> - Admin </span>
      </h1>
    </el-menu-item>
    <div class="flex-grow" />
    <ThemeSwitcher />
    <MetaMaskConnectButton />
  </el-menu>
</template>

<script lang="ts">
import { ref } from 'vue'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  components: {
    MetaMaskConnectButton,
    ThemeSwitcher
  },

  setup() {
    const headerText = ref('Spot the Ball')
    const activeIndex = ref('1')
    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }

    return {
      headerText,
      activeIndex,
      handleSelect
    }
  }
}
</script>