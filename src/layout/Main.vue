<script setup>
import { RouterView } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar.js'
import Headerbar from '@/components/HeaderBar/HeaderBar.vue'
import Sidebar from '@/components/sidebar.vue'

const sidebarStore = useSidebarStore()
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
    &.close {
      width: calc(100% - 75px);
    }
  }
}
</style>
