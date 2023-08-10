<script setup>
import LoadingAnimation from '@/components/Loading/LoadingAnimation.vue'
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <transition>
    <div class="loading" v-show="props.isLoading">
      <!-- <div class="loading__box"><span></span><span></span><span></span><span></span></div> -->
      <LoadingAnimation />
    </div>
  </transition>
</template>
<style lang="scss" scoped>
@keyframes rotateAni {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(#272d44, 0.7);
  &__box {
    position: relative;
    width: 150px;
    height: 150px;
    animation: rotateAni 0.5s linear infinite;
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      background-color: #fff;
      border: 2px solid #ddd;
      box-shadow: 0 0 20px rgba(#000, 0.1) inset;
      border-radius: 50%;
    }
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(#f65a7e, #f8a233, #fbd91d);
      &:nth-child(1) {
        filter: blur(5px);
      }
      &:nth-child(2) {
        filter: blur(10px);
      }
      &:nth-child(3) {
        filter: blur(25px);
      }
      &:nth-child(4) {
        filter: blur(50px);
      }
    }
  }
}
</style>
