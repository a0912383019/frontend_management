<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const handelSearchChange = (val) => {
  emit('update:modelValue', val.target.value)
}

const handleDelete = () => {
  emit('update:modelValue', '')
}
</script>
<template>
  <div class="search">
    <input
      class="search__input"
      type="text"
      :value="props.modelValue"
      @input="handelSearchChange"
    />
    <font-awesome-icon
      v-if="props.modelValue === ''"
      class="search__iconsearch"
      icon="fa-magnifying-glass"
    />
    <button class="search__icondelete btn-reset" @click="handleDelete" v-else>
      <font-awesome-icon icon="fa-xmark" />
    </button>
  </div>
</template>
<style lang="scss" scoped>
.search {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #7d818f;
  &__iconsearch {
    margin-right: 10px;
  }
  &__input {
    width: 150px;
    height: 30px;
    padding-left: 10px;
    padding-right: 30px;
    background-color: #fff;
    border: 1px solid rgba(79, 132, 207, 0.3);
    border-radius: 0.3rem;
    font-size: 0.875rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
    &:hover, &:focus {
      border: 1px solid rgba(79, 132, 207, 0.7);
      ~ .search__iconsearch {
        color: rgba(79, 132, 207, 0.7);
      }
    }
  }
  &__icondelete {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
    color: rgba(79, 132, 207, 0.8);
    font-size: 17px;
  }
  &__iconsearch {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 100%;
    color: rgba(79, 132, 207, 0.3);
  }
}
</style>
