<script setup>
import { ref } from 'vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const { user_name, user_picture } = JSON.parse(sessionStorage.user_info)

const dropdownMenu = ref(null)
const dropdownVisible = ref(false)

//開啟下拉
const handleToggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

// const handleDocumentClick = (e) => {
//   console.log(!dropdownVisible.value, e.target, !dropdownMenu.value.contains(e.target))
//   if (!dropdownVisible.value && !dropdownMenu.value.contains(e.target)) {
//     dropdownVisible.value = false
//     console.log('asd')
//   }
// }

// onMounted(() => {
//   document.addEventListener('click', handleDocumentClick)
// })
// onBeforeUnmount(() => {
//   document.removeEventListener('click', handleDocumentClick)
// })
</script>
<template>
  <div class="accountbox">
    <div class="accountbox__img" @click="handleToggleDropdown">
      <img :src="user_picture" alt="" />
    </div>
    <div class="accountbox__rightbox">
      <div class="accountbox__name" @click="handleToggleDropdown">
        {{ user_name }}
        <font-awesome-icon class="accountbox__icon" icon="fa-solid fa-angle-down" />
      </div>
      <transition name="slide-up-fade">
        <div class="accountbox__dropdown" ref="dropdownMenu" v-show="dropdownVisible">
          <button class="btn-reset" @click="systemStore.storeLogout">
            {{ $t('nav.log_out') }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.accountbox {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 20px;
  color: #fff;
  &__img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
    }
  }
  &__rightbox {
    position: relative;
    cursor: pointer;
  }
  &__name {
    cursor: pointer;
    padding-left: 10px;
  }
  &__icon {
    margin-left: 15px;
    font-size: 14px;
  }
  &__dropdown {
    position: absolute;
    top: 140%;
    width: 110px;
    border: 1px solid #edf2fa;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background-color: #fff;
    font-size: 14px;
    a,
    button {
      display: block;
      width: 100%;
      padding: 10px 12px;
      color: #444;
      font-weight: 500;
      text-align: left;
      transition: all 0.5s;
      &:hover {
        color: #4f84cf;
        background-color: rgba(79, 132, 207, 0.1);
      }
    }
  }
}
</style>
