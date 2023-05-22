<script setup>
import { RouterView } from 'vue-router'
import Headerbar from '@/components/Headerbar/Headerbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>
<template>
  <div class="mainArea">
    <Headerbar />
    <Sidebar />
    <div class="mainArea__rightbox">
      <RouterView />
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
    padding: 20px;
  }
}
</style>
