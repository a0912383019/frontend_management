<script setup>
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
      <div class="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
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

  .lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-default div {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }
  .lds-default div:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
  }
  .lds-default div:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
  }
  .lds-default div:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
  }
  .lds-default div:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
  }
  .lds-default div:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
  }
  .lds-default div:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
  }
  .lds-default div:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
  }
  .lds-default div:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
  }
  .lds-default div:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
  }
  .lds-default div:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
  }
  .lds-default div:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
  }
  .lds-default div:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
  }
  @keyframes lds-default {
    0%,
    20%,
    80%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
}
</style>
