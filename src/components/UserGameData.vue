<template>
  <div class="flex justify-center w-[800px] mx-auto">
    <el-tabs type="border-card" class="w-full">
      <el-tab-pane label="History">
        <GameHistory />
      </el-tab-pane>
      <el-tab-pane label="Previous Wins">
        <PreviousWins />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script>
import GameHistory from './GameHistory.vue'
import PreviousWins from './PreviousWins.vue'

export default {
  components: {
    GameHistory,
    PreviousWins
  }
}
</script>
  