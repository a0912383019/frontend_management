<script setup>
import { RouterView } from 'vue-router'
import { useGlobalStore } from '@/stores/global.js'
import Loading from '@/components/Loading.vue'

const stores = useGlobalStore()
</script>

<template>
  <RouterView />
  <Loading :isLoading="stores.isLoading" />
</template>
