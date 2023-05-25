<script setup>
import { ref } from 'vue'
import Hall from './components/Hall.vue'
import Account from './components/Account.vue'
import Tag from './components/Tag.vue'

const times = ref(null)
const updateTimes = (data) => {
  times.value = data
  console.log(times.value)
}
</script>
<template>
  <header>
    <ul class="list">
      <li class="list__tag"><Tag :times="times" /></li>
      <li class="list__hall"><Hall @time="updateTimes" /></li>
      <li class="list__account"><Account /></li>
    </ul>
  </header>
</template>
<style lang="scss" scoped>
header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 250px;
  background-color: #171d32;
  border-bottom: 1px solid #dee2e6;
  color: #fff;
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
}
</style>
