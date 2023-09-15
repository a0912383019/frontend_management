<script setup>
import { computed } from 'vue'
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  itemBgColor: {
    type: String,
    default: ''
  },
  itemShadowColor: {
    type: String,
    default: ''
  },
  cardBgColor: {
    type: String,
    default: ''
  }
})

//在computed中定義css變數，讓scss中可使用
const cssProps = computed(() => {
  return {
    '--item-bg-color': props.itemBgColor,
    '--item-shadow-color': props.itemShadowColor,
    '--card-bg-color': props.cardBgColor
  }
})
</script>
<template>
  <div class="card" :style="cssProps">
    <div class="card__item">
      <div class="card__icon">
        <font-awesome-icon :icon="props.icon" v-if="props.icon" />
      </div>
      <div class="card__title">{{ props.title }}</div>
    </div>
    <div class="card__price">{{ props.price }}</div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 12px 20px 12px 10px;
  border-radius: 5px;
  color: #404040;
  background-color: #dceff2;
  // background-color: lighten(#59b7c8, 35%);
  background-color: var(--card-bg-color);
  &__item {
    position: absolute;
    bottom: 12px;
    left: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 160px;
    height: 70px;
    border-radius: 5px 75px 75px 5px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 2px 2px 0 0 var(--item-shadow-color);
    background-color: var(--item-bg-color);
    color: #fff;
  }
  &__icon {
    font-size: 27px;
    margin-right: 10px;
  }
  &__title {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    font-size: 18px;
    font-weight: 500;
  }
  &__price {
    margin-left: auto;
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
