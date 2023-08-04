<script setup>
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium'
  },
  color: {
    type: String,
    default: 'default'
  },
  bg: {
    type: Boolean,
    default: true
  }
})

const buttonClass = computed(() => {
  let className = ''
  className += ` button__${props.size}`
  className += ` button__${props.color}`
  if (props.bg === false) className += ` button__nobg`
  return className
})
</script>
<template>
  <button class="btn-reset" :class="buttonClass">
    <font-awesome-icon class="mr-6" :icon="`fa-solid fa-${props.icon}`" v-if="props.icon" />
    {{ props.name }}
  </button>
</template>
<style lang="scss" scoped>
button {
  border-width: 1px;
  border-style: solid;
  color: #fff;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:disabled {
    background-color: #f6f7fa !important;
    border-color: #f6f7fa !important;
    color: #c0ccdf !important;
  }
  &.button {
    &__small {
      padding: 2px 4px;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 3;
    }
    &__medium {
      padding: 5px 8px;
      font-size: 14px;
      line-height: 1.5;
      border-radius: 3px;
      min-width: 100px;
    }
    &__large {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 140px;
      padding: 10px 15px;
      background-color: #56419f;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      &.large-120 {
        min-width: 120px;
        padding-top: 7px;
        padding-bottom: 7px;
      }
    }
    &__default {
      background-color: #5eb7c8;
      border-color: #5eb7c8;
    }
    &__purple {
      background-color: #6a53ba;
      border-color: #6a53ba;
      &-light {
        background-color: #7882a7;
        border-color: #7882a7;
      }
    }
    &__red {
      background-color: #e06672;
      border-color: #e06672;
    }
    &__blue {
      background-color: #4f84cf;
      border-color: #4f84cf;
    }
    &__white {
      background-color: #f4f4f4;
      border-color: #f4f4f4;
    }
    &__green {
      background-color: $green;
      border-color: $green;
    }
    &__gray {
      background-color: #f4f4f4;
      border-color: #f4f4f4;
      color: #8d8d8d;
    }
    &__nobg {
      background-color: transparent;
      &.button {
        &__default {
          color: #5eb7c8;
        }
        &__purple {
          color: #6a53ba;
          &-light {
            color: #7882a7;
          }
        }
        &__red {
          color: #e06672;
        }
        &__blue {
          color: #4f84cf;
        }
        &__white {
          color: #f4f4f4;
        }
        &__green {
          color: $green;
        }
        &__gray {
          color: #8d8d8d;
        }
      }
    }
  }
  &:hover {
    &.button {
      &__default {
        background-color: #4aa5b6;
        border-color: #4aa5b6;
      }
      &__purple {
        background-color: #56419f;
        border-color: #56419f;
        &-light {
          background-color: #646c8b;
          border-color: #646c8b;
        }
      }
      &__red {
        background-color: #c75660;
        border-color: #c75660;
      }
      &__blue {
        background-color: #3a6db5;
        border-color: #3a6db5;
      }
      &__white {
        background-color: #dfdfdf;
        border-color: #dfdfdf;
      }
      &__gray {
        background-color: #dfdfdf;
        border-color: #dfdfdf;
      }
      &__nobg {
        background-color: transparent;
        &.button {
          &__default {
            border-color: #4aa5b6;
            color: #4aa5b6;
          }
          &__purple {
            border-color: #56419f;
            color: #56419f;
            &-light {
              border-color: #646c8b;
              color: #646c8b;
            }
          }
          &__red {
            border-color: #c75660;
            color: #c75660;
          }
          &__blue {
            border-color: #3a6db5;
            color: #3a6db5;
          }
          &__white {
            border-color: #dfdfdf;
            color: #dfdfdf;
          }
          &__gray {
            border-color: #dfdfdf;
            color: #8d8d8d;
          }
        }
      }
    }
  }
}
</style>
