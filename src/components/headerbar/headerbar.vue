<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/stores/sidebar.js'
import Tag from '@/components/Headerbar/components/Tag.vue'
import Hall from '@/components/Headerbar/components/Hall.vue'
import Language from '@/components/Headerbar/components/Language.vue'
import Account from '@/components/Headerbar/components/Account.vue'

const sidebarStore = useSidebarStore()
const { isSidebarClose } = storeToRefs(sidebarStore)
const times = ref(null)
const updateTimes = (data) => {
  times.value = data
}
</script>
<template>
  <header :class="{ isClose: isSidebarClose }">
    <button class="m_menu_button" @click="sidebarStore.toggleSidebarOpen">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </button>
    <ul class="list">
      <li class="list__tag"><Tag :times="times" /></li>
      <li class="list__hall"><Hall @time="updateTimes" /></li>
      <li class="list__lang"><Language /></li>
      <li class="list__account"><Account /></li>
    </ul>
  </header>
</template>
<style lang="scss" scoped>
header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 15000;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 250px;
  background-color: #171d32;
  border-bottom: 1px solid #dee2e6;
  color: #fff;
  transition: all 0.3s ease-in-out;
  &.isClose {
    padding-left: 75px;
  }
}
.m_menu_button {
  width: 60px;
  height: 60px;
  font-size: 20px;
  color: #fff;
  border: none;
  background: none;
  cursor: pointer;
}
.list {
  display: flex;
  align-items: center;
  margin-left: auto;
  li {
    list-style: none;
  }
  &__hall {
    margin-right: 10px;
  }
  &__lang {
    width: 110px;
    margin-right: 15px;
  }
}
</style>
