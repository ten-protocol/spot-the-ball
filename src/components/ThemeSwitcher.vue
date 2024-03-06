<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <el-button type="text" size="small">
        <Sunny
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </el-button>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="setTheme('light')">Light</el-dropdown-item>
        <el-dropdown-item @click="setTheme('dark')">Dark</el-dropdown-item>
        <el-dropdown-item @click="setTheme('system')">System</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
  
 
  
  
<script lang="ts" >
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'ThemeSwitcher',

  components: {
    ArrowDown
  },

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
  