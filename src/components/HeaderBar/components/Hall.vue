<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HallToggle from '@/components/HeaderBar/components/HallToggle.vue'
import HallDropDown from '@/components/HeaderBar/components/HallDropDown.vue'

const isDropOpen = ref(false) //下拉開啟狀態

const refHallContent = ref(null)

//開啟下拉
const handleDocumentClick = (e) => {
  if (e.target.closest('.targetHallBox')) {
    isDropOpen.value = !isDropOpen.value
  } else if (!refHallContent.value.contains(e.target)) {
    isDropOpen.value = false
  }
}

const closeDrop = () => {
  isDropOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
<template>
  <div class="flex">
    <div class="hallbox">
      <HallToggle class="targetHallBox" />
      <transition name="slide-up-fade">
        <div class="hallbox__content" ref="refHallContent" v-show="isDropOpen">
          <HallDropDown @update:drop="closeDrop" />
        </div>
      </transition>
    </div>
    <div class="lineUger"></div>
  </div>
</template>
<style lang="scss" scoped>
.hallbox {
  position: relative;
  &__content {
    position: absolute;
    right: 0;
    top: 110%;
    min-width: 270px;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  }
}
</style>
