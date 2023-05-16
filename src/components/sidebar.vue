<script setup>
import { version } from '../../package.json'
</script>
<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <router-link to="./home/"><img src="@/assets/images/logo.svg" alt="CDP" /></router-link>
    </div>
    <div class="sidebar__content">
      <div class="sidebar__menu">menu</div>
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
  &__logo {
    padding-top: 10px;
    height: 50px;
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
</style>
