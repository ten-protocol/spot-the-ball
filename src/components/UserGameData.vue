<template>
  <div class="overflow-x-auto">
    <div class="flex justify-center w-[800px] mx-auto">
      <el-tabs type="card" class="bg-background text-foreground w-full">
        <el-tab-pane label="History" class="bg-background text-foreground border">
          <GameHistory />
        </el-tab-pane>
        <el-tab-pane label="Previous Wins" class="bg-background text-foreground border">
          <PreviousWins />
        </el-tab-pane>
      </el-tabs>
    </div>
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
  