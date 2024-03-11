<template>
  <el-table
    :data="previousWins"
    :default-sort="{ prop: 'name', order: 'descending' }"
    class="bg-background text-foreground w-full"
  >
    <el-table-column
      prop="name"
      label="Name"
      width="200"
      sortable
      class="cursor-pointer"
      align="center"
    />
    <el-table-column label="Top Guesses(Address, Distance)" align="center">
      <template #default="scope">
        <div>
          <div v-for="(guess, index) in scope.row.topGuessesArray" :key="index">
            <span>{{ guess[0].slice(0, 6) }}...{{ guess[0].slice(-4) }}</span
            >,
            <span>{{ guess[1] }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="Action" width="200">
      <template #default="scope">
        <el-button
          primary
          size="small"
          @click="convertImageToBase64(scope.row.privateImageURL)"
          class="cursor-pointer"
        >
          Preview
          <View />
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- // modal image`` -->
  <div
    id="imagePreview"
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="imagePreview"
  >
    <div class="bg-background dark:border-2 p-8 rounded-lg relative w-3/4">
      <el-icon
        class="-top-4 -right-4 cursor-pointer bg-background dark:border-2 rounded-full"
        @click="closeImageModal"
        style="position: absolute; width: 40px; height: 40px"
      >
        <Close class="text-foreground" />
      </el-icon>
      <img :src="imagePreview" alt="winning image" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const previousWins = ref(gameStore.previousWins)
const imagePreview = ref()

watchEffect(() => {
  previousWins.value = gameStore.previousWins
})

const convertImageToBase64 = async (imageURL) => {
  try {
    gameStore.loading = true
    const response = await fetch(imageURL)
    const blob = await response.blob()
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      imagePreview.value = reader.result
      location.href = '#imagePreview'
    }
  } catch (error) {
    console.error(error)
  } finally {
    gameStore.loading = false
  }
}

const closeImageModal = () => {
  history.pushState('', document.title, window.location.pathname + window.location.search)
  imagePreview.value = ''
}
</script>

