<script setup></script>
<template>
  <el-tooltip effect="dark" placement="right">
    <template #content>
      <div class="page-customtag-type">
        <div class="page-customtag-type__item red">{{ $t('tags.type_6') }}</div>
        <div class="page-customtag-type__item blue">{{ $t('tags.type_3') }}</div>
        <div class="page-customtag-type__item orange">{{ $t('tags.type_4') }}</div>
        <div class="page-customtag-type__item green">{{ $t('tags.type_1') }}</div>
        <div class="page-customtag-type__item tree-green">{{ $t('tags.type_9') }}</div>
      </div>
    </template>
    <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
  </el-tooltip>
</template>
<style lang="scss" scoped>
.page-customtag-type {
  font-size: 14px;
  &__item {
    display: flex;
    align-items: center;
    margin-top: 2px;
    margin-bottom: 2px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      margin-right: 6px;
      border-radius: 50%;
    }
    &.green {
      &::before {
        background-color: $green;
      }
    }
    &.red {
      &::before {
        background-color: $red;
      }
    }
    &.blue {
      &::before {
        background-color: $blue;
      }
    }
    &.orange {
      &::before {
        background-color: $orange;
      }
    }
    &.tree-green {
      &::before {
        background-color: $tree-green;
      }
    }
  }
}
</style>
