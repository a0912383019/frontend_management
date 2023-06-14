<script setup>
import { version } from '../../package.json'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/stores/sidebar.js'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const sidebarStore = useSidebarStore()
const { menuLists, isSidebarClose } = storeToRefs(sidebarStore)

const activePath = computed(() => route.path) // 根據路由變化，更新menu高亮項目
</script>
<template>
  <div class="sidebar" :class="{ isClose: isSidebarClose }">
    <div class="sidebar__logo">
      <router-link to="/home"><img src="@/assets/images/logo.svg" alt="CDP" /></router-link>
    </div>
    <div class="sidebar__content">
      <div class="sidebar__menu">
        <el-menu
          :default-active="activePath"
          class="cdp-menu"
          :class="{ isClose: isSidebarClose }"
          :unique-opened="true"
        >
          <template v-for="(item, index) in menuLists" :key="index">
            <el-menu-item :index="`/${item.url_path}`" v-if="item.sub_menu.length === 0">
              <div class="cdp-menu__item">
                <router-link :to="item.url_path">
                  <span class="cdp-menu__icon">
                    <font-awesome-icon :icon="item.nav_icon" />
                  </span>
                  <span class="cdp-menu__title">{{ t(`sidebar.${item.item_id}`) }}</span>
                </router-link>
              </div>
            </el-menu-item>
            <el-sub-menu :index="index.toString()" class="cdp-menu__submenu" v-else>
              <template #title>
                <div class="cdp-menu__item">
                  <a href="javascript:;">
                    <span class="cdp-menu__icon">
                      <font-awesome-icon :icon="item.nav_icon" />
                    </span>
                    <span class="cdp-menu__title">{{ t(`sidebar.${item.item_id}`) }}</span>
                  </a>
                </div>
              </template>
              <template v-for="(subItem, subIndex) in item.sub_menu" :key="subIndex">
                <el-menu-item :index="`${index.toString()}-${subIndex.toString()}`">
                  <div class="cdp-menu__subitem">
                    <router-link :to="item.url_path">
                      <span class="cdp-menu__icon">
                        <font-awesome-icon :icon="item.nav_icon" />
                      </span>
                      <span class="cdp-menu__title">{{ subItem.item_name }}</span>
                    </router-link>
                  </div>
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
        </el-menu>
      </div>
      <div class="sidebar__content__logo">
        <img src="@/assets/images/logo_white.svg" alt="logo-white" />
      </div>
      <div class="sidebar__version">
        <p>Version {{ version }}｜</p>
        <p>Copyright © 2023 All rights reserved.</p>
        <p class="sidebar__version-release">e491fa4</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.cdp-menu {
  .el-sub-menu {
    &__title {
      padding: 0 !important;
      margin: 0;
      height: auto;
      &:hover {
        background-color: transparent;
      }
      .el-icon {
        color: #c2c7d0;
      }
    }
  }
  .el-menu {
    background-color: transparent;
  }
}
</style>
<style lang="scss" scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 500;
  width: 250px;
  height: 100vh;
  background-color: #272d44;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  transition: all 0.3s ease-in-out;
  &.isClose {
    width: 75px;
    .sidebar {
      &__version {
        display: none;
      }
      &__content {
        &__logo {
          display: none;
        }
      }
    }
  }
  &__logo {
    padding-top: 10px;
    height: 50px;
    margin-bottom: 18px;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        display: block;
        width: 66px;
        opacity: 0.8;
      }
    }
  }
  &__content {
    overflow-y: auto;
    max-height: calc(100vh - 60px);
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 30px;
    &__logo {
      display: flex;
      justify-content: center;
      padding-top: 40px;
      margin-bottom: 50px;
      img {
        display: block;
        width: 100%;
        max-width: 200px;
      }
    }
  }
  &__version {
    font-size: 12px;
    font-weight: 500;
    color: rgba(#fff, 0.6);
    &-release {
      display: none;
    }
  }
}

.el-sub-menu {
  &__title {
    padding: 0 !important;
  }
  &.is-opened {
    .cdp-menu {
      &__item {
        a {
          background-color: rgba(#fff, 0.1);
          color: #fff;
        }
      }
    }
  }
}
.cdp-menu {
  border-right: none;
  background-color: transparent;
  &.isClose {
    .cdp-menu {
      &__title {
        opacity: 0;
        position: absolute;
        left: 44px;
      }
      &__icon {
        margin-right: 0;
      }
    }
  }
  &__submenu {
    padding: 0;
  }
  &__item {
    width: 100%;
    a {
      display: flex;
      align-items: center;
      min-height: 40px;
      padding-left: 10px;
      padding-right: 8px;
      color: #c2c7d0;
      border-radius: 5px;
      transition: all 0.3s ease;
      &:hover {
        background-color: rgba(#fff, 0.1);
        color: #fff;
      }
    }
  }
  &__subitem {
    width: 100%;
    padding-left: 35px;
    a {
      display: flex;
      align-items: center;
      min-height: 40px;
      padding-left: 8px;
      padding-right: 8px;
      color: #c2c7d0;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
  }
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 12px;
    background-image: url('@/assets/images/sidebar-icon_bg-active.svg');
    background-size: contain;
    background-repeat: no-repeat;
  }
  &__title {
    line-height: 1;
    transition: all 0.3s ease;
  }
  .el-menu-item {
    padding: 0 !important;
    margin-bottom: 8px;
    height: auto;
    &:hover {
      background-color: transparent;
    }
    &.is-active {
      a {
        background-color: #4f84cf;
        color: #fff;
      }
    }
  }
}
</style>
