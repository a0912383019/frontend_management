<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar.js'
import Headerbar from '@/components/HeaderBar/HeaderBar.vue'
import Sidebar from '@/components/SideBar.vue'

const sidebarStore = useSidebarStore()

// gotop按鈕顯示狀態
const isGotopShow = ref(false)

// window scroll
const handleScroll = () => {
  let top = window.scrollY
  if (top > 30) {
    isGotopShow.value = true
  } else {
    isGotopShow.value = false
  }
}

// scroll to top
const handleGotop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div class="mainArea">
    <Headerbar />
    <Sidebar />
    <div class="mainArea__rightbox" :class="{ close: sidebarStore.isSidebarClose }">
      <div class="mainArea__container">
        <RouterView />
      </div>
    </div>
    <transition>
      <button class="mainArea__gotop" v-show="isGotopShow" @click="handleGotop">
        <img src="@/assets/images/goTop.svg" alt="" />
      </button>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.mainArea {
  position: relative;
  display: flex;
  background-color: #f4f6f9;
  min-height: 100vh;
  overflow: hidden;
  &__rightbox {
    width: calc(100% - 250px);
    margin-left: auto;
    padding: 80px 20px 20px;
    transition: all 0.2s ease-in;
    &.close {
      width: calc(100% - 92px);
    }
  }
  &__gotop {
    position: fixed;
    right: 50px;
    bottom: 50px;
    border: none;
    background: none;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
