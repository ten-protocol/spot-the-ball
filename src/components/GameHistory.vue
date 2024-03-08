<template>
  <el-table
    :data="gameHistory"
    :default-sort="{ prop: 'timestamp', order: 'descending' }"
    class="w-full"
  >
    <el-table-column prop="timestamp" label="Time" width="180" sortable class="cursor-pointer" />
    <el-table-column prop="x" label="X Coordinate" width="180" />
    <el-table-column prop="y" label="Y Coordinate" width="180" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { TableV2SortOrder } from 'element-plus'
import type { SortBy } from 'element-plus'

const gameStore = useGameStore()

const gameHistory = ref(gameStore.history)

watchEffect(() => {
  gameHistory.value = gameStore.history
})
</script>