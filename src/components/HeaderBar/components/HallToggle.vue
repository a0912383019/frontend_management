<script setup>
import { useGlobalStore } from '@/stores/global.js'
const globalStore = useGlobalStore()
</script>
<template>
  <div class="hallToggle">
    <span class="hallToggle__hallicon">
      <font-awesome-icon icon="fa-home" />
    </span>
    <div class="hallToggle__name">
      {{ globalStore.activeHall.hall_name }}({{ globalStore.activeHall.hall_code }})
    </div>
    <div class="hallToggle__dropbox">
      <div class="hallToggle__arrow">
        <font-awesome-icon class="font-size-14" icon="fa-solid fa-angle-down" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.hallToggle {
  position: relative;
  display: flex;
  height: 38px;
  cursor: pointer;
  &__name {
    font-weight: 700;
    padding: 0.375rem 0.75rem;
    background-color: #171d32;
  }
  &__dropbox {
    position: relative;
    right: 0;
    width: 10px;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #171d32;
    font-size: 12px;
    cursor: pointer;
  }
  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transition: all 0.4s;
  }
  &__hallicon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    margin-top: 3px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
