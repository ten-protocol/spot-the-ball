<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CIRCLE_SIZE } from '../lib/utils'
import { useMouse, useMouseInElement } from '@vueuse/core'
import { ElNotification } from 'element-plus'

interface FileWithPreview extends File {
  preview?: string
}

defineProps({
  challenge: Object,
  removeChallenge: Function,
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits()

const fileInput = ref<HTMLInputElement | null>(null)
const imageContainer = ref()
const errorMessage = ref('')
const selectCoordinates = ref(false)
const selectedFiles = ref<FileWithPreview[]>([])
const position = ref({ x1: 0, x2: 0, y1: 0, y2: 0 })
const center = ref({ x: 0, y: 0 })

const mouse = reactive(useMouseInElement(imageContainer))

const browseFiles = () => {
  fileInput?.value?.click()
}

const handleFileChange = () => {
  const files = fileInput?.value?.files
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const fileContents = e.target.result
        //@ts-ignore
        file.preview = URL.createObjectURL(file)
        const base64Contents = btoa(fileContents)
        //@ts-ignore
        file.contents = base64Contents
        selectedFiles.value.push(file)
      }

      reader.readAsBinaryString(file)
    }
  }
  emit('fileChange', selectedFiles.value)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as FileWithPreview
      // set preview image URL
      file.preview = URL.createObjectURL(file)
      selectedFiles.value.push(file)
    }
  }
}

const handleClick = () => {
  if (mouse.isOutside) {
    return
  }

  position.value.x1 = mouse.elementX - CIRCLE_SIZE / 2
  position.value.x2 = position.value.x1 + CIRCLE_SIZE
  position.value.y1 = mouse.elementY - CIRCLE_SIZE / 2
  position.value.y2 = position.value.y1 + CIRCLE_SIZE
  center.value.x = position.value.x1 + CIRCLE_SIZE / 2
  center.value.y = position.value.y1 + CIRCLE_SIZE / 2

  if (
    position.value.x1 < 0 ||
    position.value.y1 < 0 ||
    position.value.x2 > mouse.elementWidth ||
    position.value.y2 > mouse.elementHeight
  ) {
    errorMessage.value = "Can't place the circle outside the image. Please select a valid position"
    return
  }

  emit('positionChange', position.value)
  emit('centerChange', center.value)
}
</script>

<template>
  <details class="bg-gray-100 rounded-lg p-4">
    <summary class="cursor-pointer">Challenge {{ index + 1 }}</summary>

    <div class="flex justify-end">
      <button
        @click="index > 1 ? emit('remove') : (selectedFiles = [])"
        class="text-red-900 font-bold underline cursor-pointer"
      >
        Remove
      </button>
    </div>
    <div class="w-full flex py-20 justify-center">
      <div class="max-w-[800px] h-fit w-full">
        <div
          class="flex flex-col justify-center items-center gap-4 mb-4"
          v-if="selectedFiles.length < 2"
        >
          <h2 class="text-2xl font-bold">Please</h2>
          <p>Upload the private image first then upload the public image</p>
        </div>
        <div
          @dragover.prevent="handleDragOver"
          @drop.prevent="handleDrop"
          class="p-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-100"
          v-if="selectedFiles.length < 2"
        >
          <div class="input">
            <div
              v-if="!selectedFiles.length"
              class="flex justify-center items-center flex-col gap-4"
            >
              <img src="../assets/cloud-upload.png" alt="" width="40" height="40" />
              <p class="font-bold">Drop or Select Private File</p>
              <small class="font-bold">
                File should be in .jpg, .jpeg or .png format and less than 1MB</small
              >
              <p class="text-sm">
                Drop private file here or click
                <span @click="browseFiles" class="text-green-900 font-bold underline cursor-pointer"
                  >browse</span
                >
                to upload from your machine
              </p>
            </div>
            <div v-else class="flex justify-center items-center flex-col gap-4">
              <img src="../assets/cloud-upload.png" alt="" width="40" height="40" />
              <p class="text-sm">
                <span @click="browseFiles" class="text-green-900 font-bold underline cursor-pointer"
                  >Add public image</span
                >
              </p>
            </div>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileChange"
              accept=".jpg, .png, .jpeg"
              size="1048576"
            />
          </div>
        </div>

        <div class="w-full mt-4 flex flex-col gap-4" v-if="selectedFiles[0]">
          <el-alert :title="errorMessage" type="error" class="font-bold" v-if="errorMessage" />
          <el-card class="w-[800px] mx-auto relative overflow-hidden rounded-lg cursor-grab">
            <div ref="imageContainer">
              <img
                :src="selectedFiles[0].preview"
                alt="Spot the ball"
                class="w-full h-full block"
              />
            </div>
            <div
              class="absolute border-[4px] border-white rounded-full"
              :style="{
                width: `${CIRCLE_SIZE}px`,
                height: `${CIRCLE_SIZE}px`,
                top: `${mouse.isOutside ? '50%' : `${mouse.elementY - CIRCLE_SIZE / 2}px`}`,
                left: `${mouse.isOutside ? '50%' : `${mouse.elementX - CIRCLE_SIZE / 2}px`}`,
                transform: `${mouse.isOutside ? 'translate(-50%,-50%)' : ''}`
              }"
              @click="handleClick"
            ></div>
          </el-card>
        </div>
      </div>
    </div>
  </details>
</template>
