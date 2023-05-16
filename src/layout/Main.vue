<script setup>
import { RouterView } from 'vue-router'
import headerbar from '@/components/headerbar/headerbar.vue'
import sidebar from '@/components/sidebar.vue'
</script>
<template>
  <div class="mainArea">
    <headerbar />
    <sidebar />
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
