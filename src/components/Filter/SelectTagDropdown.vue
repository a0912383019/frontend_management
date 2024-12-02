<script setup>
const props = defineProps({
  modelValue: [String, Number],
  lists: {
    type: Array
  },
  tagTitle: {
    type: String,
    default: ''
  },
  operator: {
    //運算子
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'purple'
  }
})
const emit = defineEmits(['update:tagtext', 'update:modelValue'])
const handleTagAddText = (data) => {
  emit('update:tagtext', { ...data, active: false })
  emit('update:modelValue', data.value)
}
</script>
<template>
  <div class="drop" :class="`drop__${color}`">
    <div v-show="props.operator">
      <div class="drop__title">{{ $t('tags.operator_math') }}</div>
      <div class="drop__item" @click="handleTagAddText({ value: 'OR', label: 'OR' })">OR</div>
    </div>
    <div class="drop__title" v-show="props.tagTitle">{{ props.tagTitle }}</div>
    <div
      class="drop__item"
      :class="{ disabled: item.disabled, [`drop__item__${props.color}`]: true }"
      v-for="(item, index) in props.lists"
      :key="index"
      @click="handleTagAddText(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  z-index: 10;
  width: 160px;
  max-height: 270px;
  overflow-y: auto;
  border-radius: 5px;
  &__purple {
    border: 1px solid rgba(106, 83, 186, 0.3);
  }
  &__blue {
    border: 1px solid rgba(120, 150, 177, 0.3);
  }
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
  &__title {
    position: relative;
    padding: 5px 10px;
    margin: 3px 0;
    font-size: 14px;
    color: #b0b0b0;
    &::after {
      content: '';
      position: absolute;
      left: 10px;
      bottom: 0;
      width: calc(100% - 20px);
      height: 1px;
      background: rgba(195, 197, 202, 0.3);
    }
  }
  &__item {
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &.disabled {
      background-color: #eee;
      pointer-events: none;
    }
    &:hover {
      background: rgba(106, 83, 186, 0.06);
    }
    &__purple {
      &:hover {
        color: $purple;
      }
    }
    &__blue {
      &:hover {
        color: $blue;
      }
    }
  }
}
</style>
