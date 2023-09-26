<script setup></script>
<template>
  <div class="error">
    <font-awesome-icon class="error__icon" icon="exclamation-triangle" />
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
@keyframes is-invalid-animation {
  0% {
    opacity: 1;
    color: #dc3545;
  }
  10% {
    opacity: 1;
    color: #e56e3c;
  }
  20% {
    opacity: 1;
    color: #ff9900;
  }
  30% {
    opacity: 1;
    color: #e56e3c;
  }
  40% {
    opacity: 1;
    color: #dc3545;
  }
  50% {
    opacity: 1;
    color: #e56e3c;
  }
  60% {
    opacity: 1;
    color: #ff9900;
  }
  70% {
    opacity: 1;
    color: #e56e3c;
  }
  80% {
    opacity: 1;
    color: #dc3545;
  }
  90% {
    opacity: 1;
    color: #e56e3c;
  }
  100% {
    opacity: 1;
    color: #ff9900;
  }
}
.error {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #dc3545;
  animation-duration: 2s;
  animation-name: is-invalid-animation;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
  &__icon {
    margin-right: 5px;
  }
}
</style>
