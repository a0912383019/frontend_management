<script setup>
import { watch, computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale: i18nLocale } = useI18n()

const options = ref([
  {
    value: 'en',
    label: 'English',
    active: false
  },
  {
    value: 'zh-TW',
    label: '繁體中文',
    active: true
  },
  {
    value: 'zh-CN',
    label: '简体中文',
    active: false
  }
])

const langLabel = computed(() => {
  switch (i18nLocale.value) {
    case 'zh-TW':
      return '繁體中文'
    case 'zh-CN':
      return '简体中文'
    case 'en':
      return 'English'
    default:
      return '繁體中文'
  }
})
const dropdownLang = ref(null)
const dropdownVisibles = ref(false)

//開啟下拉
const handleDocumentClicks = (e) => {
  if (e.target.closest('.targetDropDowns')) {
    dropdownVisibles.value = !dropdownVisibles.value
  } else if (!dropdownLang.value.contains(e.target)) {
    dropdownVisibles.value = false
  }
}

const changeLang = (lang) => {
  dropdownVisibles.value = false //關閉下拉
  const langIdx = options.value.findIndex((ele) => ele.value === lang)
  options.value.forEach((ele, idx) => {
    options.value[idx].active = false
    if (idx === langIdx) {
      options.value[idx].active = true
    }
  })
  console.log(langIdx)
  i18nLocale.value = lang
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClicks)
})
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClicks)
})

watch(i18nLocale, (newlocale) => {
  //將目前語系存到sessionStorage
  sessionStorage.setItem('languageType', newlocale)
})
</script>
<template>
  <div class="flex">
    <div class="cdp-menu__icon targetDropDowns pointer">
      <cdp-icon style="font-size: 16px" name="lang" />
    </div>
    <div class="pl-10 pt-0 targetDropDowns font-semibold pointer">
      {{ langLabel }}
      <font-awesome-icon
        class="font-size-14 ml-8 mt-12 targetDropDowns pointer"
        icon="fa-solid fa-angle-down"
      />
    </div>
  </div>
  <transition name="slide-up-fade">
    <div class="lang__dropdown" ref="dropdownLang" v-show="dropdownVisibles">
      <button
        v-for="(item, key) in options"
        :class="['btn-reset', { active: item.active }]"
        :key="key"
        @click="changeLang(item.value)"
      >
        <span class="font-semibold">{{ item.label }}</span>
      </button>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  background-color: #171d32;
  box-shadow: 0 0 0 0;
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__suffix-inner > :first-child) {
  margin-left: 0px;
}

.cdp-menu__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  margin-top: 3px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.lang__dropdown {
  position: absolute;
  margin-left: 20px;
  right: 35px;
  top: 90%;
  width: 100px;
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
    &.active {
      background-color: #007bff;
      color: #fff;
    }
  }
}
</style>
