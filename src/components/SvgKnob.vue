<script setup>
import { computed } from 'vue'
const props = defineProps({
  percent: {
    type: Number,
    default: 0
  },
  text: {
    type: String,
    default: ''
  }
})
const radius = 100
const circumference = computed(() => 2 * Math.PI * radius)
const end = computed(() => circumference.value * (props.percent / 100))
</script>
<template>
  <div class="knob">
    <div class="knob__svg">
      <svg width="65" height="65" viewBox="0 0 228 228">
        <circle
          id="circleBg"
          stroke-linecap="butt"
          cx="114"
          cy="114"
          r="100"
          fill="none"
          stroke-width="28"
          stroke="#eee"
        />
        <circle
          id="circle"
          stroke-linecap="butt"
          cx="114"
          cy="114"
          r="100"
          fill="none"
          stroke-width="28"
          stroke="#3c8dbc"
          transform="rotate(-90, 114, 114)"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :stroke-dashoffset="circumference - end"
        />
      </svg>
      <div class="knob__percent">{{ props.percent }}</div>
    </div>
    <div class="knob__text">
      {{ props.text }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
svg circle {
  transition: all 0.5s ease-in-out;
}
.knob {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  &__svg {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 100%;
  }
  &__percent {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3c8dbc;
    font-weight: 700;
    font-size: 15px;
  }
  &__text {
    padding-top: 5px;
    font-size: 16px;
    color: #3c8dbc;
  }
}
</style>
