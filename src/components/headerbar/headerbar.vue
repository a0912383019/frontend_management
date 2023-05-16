<script setup>
import account from './components/account.vue'
</script>
<template>
  <header>
    <account />
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
}
</style>
