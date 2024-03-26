<template>
  <div class="overflow-x-auto">
    <div class="relative mt-4 w-[800px] mx-auto">
      <el-empty description=" " image="/assets/images/meeting-landscape.png" image-size="800" />

      <!-- Dark transparent cover -->
      <div class="absolute inset-0 bg-black opacity-70"></div>

      <div class="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 p-6">
        <template v-if="!isUserConnected">
          <el-card style="max-width: 350px" class="bg-background text-foreground border">
            <div class="flex flex-col items-center">
              <h4>Authenticate Account</h4>
              <p class="text-12 text-center">
                Authenticate your account to view challenges and make guesses using the link:
                <el-link
                  href="https://testnet.ten.xyz/"
                  target="_blank"
                  type="primary"
                  class="w-40"
                >
                  https://testnet.ten.xyz<el-icon class="el-icon--right"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"
                      ></path></svg
                  ></el-icon>
                </el-link>
              </p>
            </div>
          </el-card>
        </template>
        <div class="flex flex-col items-center">
          <p class="font-bold">No challenge available</p>
          <!-- <p class="font-bold">Please connect your wallet</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'

export default {
  name: 'EmptyState',

  setup() {
    const gameStore = useGameStore()
    const isUserConnected = ref(gameStore.isUserConnected)

    watchEffect(() => {
      isUserConnected.value = gameStore.isUserConnected
    })

    return {
      isUserConnected
    }
  }
}
</script>