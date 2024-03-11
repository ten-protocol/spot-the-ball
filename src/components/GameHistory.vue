<template>
  <el-table
    :data="gameHistory"
    :default-sort="{ prop: 'timestamp', order: 'descending' }"
    class="bg-background text-foreground w-full"
  >
    <el-table-column prop="timestamp" label="Time" width="270" align="center" sortable />
    <el-table-column prop="x" label="X Coordinate" width="250" align="center" sortable />
    <el-table-column prop="y" label="Y Coordinate" width="250" align="center" sortable />
  </el-table>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const gameHistory = ref(gameStore.history)

watchEffect(() => {
  gameHistory.value = gameStore.history
})
</script>