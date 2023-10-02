<script setup>
const props = defineProps({
  tabData: {
    type: Array,
    default() {
      return []
    }
  },
  activeName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const handleTabChange = (data) => {
  emit('update:modelValue', data)
}
</script>
<template>
  <ul class="tabs">
    <li
      v-for="(item, index) in props.tabData"
      :key="index"
      :class="{ active: props.activeName === item.name }"
      @click="handleTabChange(item.name)"
    >
      <div class="tabs__item">
        {{ item.label }}
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.tabs {
  display: flex;
  box-shadow: inset 1px 1px 2px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #eef1f9;
  background-color: #fff;
  border-radius: 5px;
  padding: 0;
  margin: 0;
  font-size: 16px;
  color: #6c757d;
  li {
    position: relative;
    list-style-type: none;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    &:not(:last-child) {
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background-color: rgba(79, 132, 207, 0.6);
      }
    }
    &.active {
      .tabs {
        &__item {
          color: #fff;
          &::before {
            content: '';
            width: calc(100% + 1px);
            height: 100%;
            left: -1px;
            top: 0;
            position: absolute;
            box-sizing: border-box;
            border-radius: 5px;
            box-shadow: 1px 1px 6px 0 rgba(0, 0, 0, 0.3);
            background-color: #4f84cf;
            color: #ffffff;
            z-index: -1;
          }
        }
      }
    }
  }
  &__item {
    cursor: pointer;
    position: relative;
    z-index: 99;
    width: 100%;
    padding: 7px 20px;
    border-radius: 5px;
    min-height: 40px;
    font-size: 16px;
    color: #7d818f;
    text-align: center;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: $blue;
    }
  }
}
</style>
