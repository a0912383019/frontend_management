<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSystemStore } from '@/stores/system'
import DailogMemberAccount from '@/components/Dialog/DailogMemberAccount/DailogMemberAccount.vue'

const systemStore = useSystemStore()

const { user_name, picture } = JSON.parse(sessionStorage.user_info)

const dropdownMenu = ref(null)
const dropdownVisible = ref(false)

const accountVisible = ref(false)

//開啟下拉
const handleDocumentClick = (e) => {
  if (e.target.closest('.targetDropDown')) {
    dropdownVisible.value = !dropdownVisible.value
  } else if (!dropdownMenu.value.contains(e.target)) {
    dropdownVisible.value = false
  }
}

const showPersonalAccount = () => {
  accountVisible.value = true
  dropdownVisible.value = false
}

const closePersonalAccount = () => {
  accountVisible.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
<template>
  <div class="flex">
    <div class="accountbox">
      <div class="accountbox__img targetDropDown">
        <img :src="picture" alt="" />
      </div>
      <div class="accountbox__rightbox">
        <div class="accountbox__name targetDropDown font-semibold">
          {{ user_name }}
          <font-awesome-icon class="font-size-14 ml-8" icon="fa-solid fa-angle-down" />
        </div>
        <transition name="slide-up-fade">
          <div class="accountbox__dropdown" ref="dropdownMenu" v-show="dropdownVisible">
            <button class="btn-reset border-bottom" @click="showPersonalAccount">
              {{ $t('sidebar.user_detail_info') }}
            </button>
            <button class="btn-reset" @click="systemStore.storeLogout">
              {{ $t('nav.log_out') }}
            </button>
          </div>
        </transition>
      </div>
    </div>
    <div class="lineUger"></div>
  </div>
  <DailogMemberAccount
    v-model="accountVisible"
    :memberName="user_name"
    @closeDialog="closePersonalAccount"
  ></DailogMemberAccount>
</template>
<style lang="scss" scoped>
.accountbox {
  display: flex;
  align-items: center;
  margin-left: auto;
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
    right: 0;
    top: 140%;
    width: 140px;
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
    .border-bottom {
      border-bottom: 1px solid #e9ecef;
    }
  }
}
</style>
