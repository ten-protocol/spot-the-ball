<template>
  <el-button type="text" size="small">
    <Sunny
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      @click="setTheme('light')"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      @click="setTheme('dark')"
    />
    <span class="sr-only">Toggle theme</span>
  </el-button>
</template>
  
 
  
  
<script lang="ts" >
import { ref } from 'vue'

export default {
  name: 'ThemeSwitcher',

  setup() {
    const theme = ref('light')

    const setTheme = (value: string) => {
      theme.value = value
      document.documentElement.setAttribute('data-theme', value)
    }

    return {
      theme,
      setTheme
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
  