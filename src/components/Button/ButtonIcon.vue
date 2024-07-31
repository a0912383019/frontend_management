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
  isSvg: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium'
  },
  color: {
    type: String,
    default: 'default'
  },
  hoverShadow: {
    type: Boolean,
    default: false
  },
  bg: {
    type: Boolean,
    default: true
  }
})

const buttonClass = computed(() => {
  let className = ''
  className += `button__${props.size} `
  className += `button__${props.color}`
  if (props.hoverShadow) className += ` button__hoverShadow`
  if (props.bg === false) className += ` button__nobg`
  return className
})
</script>
<template>
  <button class="btn-reset" :class="buttonClass">
    <template v-if="props.isSvg">
      <cdp-icon :name="props.icon" />
    </template>
    <template v-else>
      <font-awesome-icon class="mr-6" :icon="`fa-${props.icon}`" v-if="props.icon" />
    </template>
    <span v-if="props.name !== ''" class="ml-6">
      {{ props.name }}
    </span>
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
    background-color: $disabled !important;
    border-color: $disabled !important;
    color: #fff !important;
  }
  &.button {
    &__small {
      padding: 2px 4px;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 5px;
      min-height: 30px;
    }
    &__medium {
      padding: 6px 8px;
      font-size: 13px;
      line-height: 1.2;
      border-radius: 5px;
      min-width: 120px;
      min-height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    &__long {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      width: 100%;
      border-radius: 5px;
      min-height: 40px;
      padding: 9px 15px;
    }
    &__large {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 140px;
      padding: 9px 15px;
      background-color: #56419f;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      min-height: 40px;
      &.large-120 {
        min-width: 120px;
        padding-top: 7px;
        padding-bottom: 7px;
        min-height: 36px;
      }
    }
    &__default {
      background-color: $turquoise;
      border-color: $turquoise;
    }
    &__purple {
      background-color: $purple;
      border-color: $purple;
      &-light {
        background-color: #7882a7;
        border-color: #7882a7;
      }
    }
    &__red {
      background-color: $red;
      border-color: $red;
    }
    &__blue {
      background-color: $blue;
      border-color: $blue;
    }
    &__slateblue {
      background-color: $slateblue;
      border-color: $slateblue;
    }
    &__white {
      background-color: #f4f4f4;
      border-color: #f4f4f4;
    }
    &__green {
      background-color: $dark-green;
      border-color: $dark-green;
    }
    &__gray {
      background-color: #f4f4f4;
      border-color: #f4f4f4;
      color: #8d8d8d;
    }
    &__nobg {
      background-color: #fff !important;
      &.button {
        &__default {
          color: $turquoise;
        }
        &__purple {
          color: $purple;
          &-light {
            color: #7882a7;
          }
        }
        &__red {
          color: $red;
        }
        &__blue {
          color: $blue;
        }
        &__white {
          color: #f4f4f4;
        }
        &__green {
          color: $dark-green;
        }
        &__gray {
          color: #8d8d8d;
        }
      }
    }
    &__hoverShadow {
      &:hover {
        &.button {
          &__default {
            box-shadow: 3px 3px 0px 0px $turquoise-hover;
          }
          &__purple {
            box-shadow: 3px 3px 0px 0px $purple-hover;
            &-light {
              box-shadow: 3px 3px 0px 0px #646c8b;
            }
          }
          &__red {
            box-shadow: 3px 3px 0px 0px $red-hover;
          }
          &__blue {
            box-shadow: 3px 3px 0px 0px $blue-hover;
          }
          &__white {
            box-shadow: 3px 3px 0px 0px #dfdfdf;
          }
          &__gray {
            box-shadow: 3px 3px 0px 0px #dfdfdf;
          }
        }
      }
    }
  }
  &:hover {
    &.button {
      &__default {
        background-color: $turquoise-hover;
        border-color: $turquoise-hover;
      }
      &__purple {
        background-color: $purple-hover;
        border-color: $purple-hover;
        &-light {
          background-color: #646c8b;
          border-color: #646c8b;
        }
      }
      &__red {
        background-color: $red-hover;
        border-color: $red-hover;
      }
      &__blue {
        background-color: $blue-hover;
        border-color: $blue-hover;
      }
      &__white {
        background-color: #dfdfdf;
        border-color: #dfdfdf;
      }
      &__gray {
        background-color: #dfdfdf;
        border-color: #dfdfdf;
      }
    }
  }
}
</style>
