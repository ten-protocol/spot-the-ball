<template>
  <el-button type="text" size="small" class="border">
    <Sunny
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      @click="toggleDark()"
      v-if="!isDark"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      @click="toggleDark()"
      v-if="isDark"
    />
    <span class="sr-only">Toggle theme</span>
  </el-button>
</template>
  
<script lang="ts" >
import { useDark, useToggle } from '@vueuse/core'

export default {
  name: 'ThemeSwitcher',

  setup() {
    const isDark = useDark()
    const toggleDark = useToggle(isDark)

    return {
      isDark,
      toggleDark
    }
  }
}
</script>
  
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
  