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
    <font-awesome-icon class="search__iconsearch" icon="fa-solid fa-magnifying-glass" />
    <input
      class="search__input"
      type="text"
      :value="props.modelValue"
      @input="handelSearchChange"
    />
    <button
      class="search__icondelete btn-reset"
      @click="handleDelete"
      v-show="props.modelValue !== ''"
    >
      <font-awesome-icon icon="fa-solid fa-xmark" />
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
    border: 1px solid #ced4da;
    border-radius: 0.2rem;
    font-size: 0.875rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
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
    color: #7d818f;
    font-size: 17px;
  }
}
</style>
