<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tagsList = computed(() => {
  return [
    {
      color: 'red',
      name: t('tags.type_6')
    },
    {
      color: 'green',
      name: t('tags.type_1')
    },
    {
      color: 'blue',
      name: t('tags.type_3')
    },
    {
      color: 'tree-green',
      name: t('tags.type_9')
    },
    {
      color: 'orange',
      name: t('tags.type_4')
    },
    {
      color: 'sky-blue',
      name: t('tags.type_8')
    }
  ]
})
</script>
<template>
  <el-tooltip effect="dark" placement="right">
    <template #content>
      <div class="page-customtag-type flex flex-wrap justify-between">
        <template v-for="item in tagsList" :key="item.color">
          <div class="page-customtag-type__item" :class="item.color">{{ item.name }}</div>
        </template>
      </div>
    </template>
    <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
  </el-tooltip>
</template>
<style lang="scss" scoped>
.page-customtag-type {
  width: 175px;
  word-break: break-all;
  font-size: 14px;
  &__item {
    display: flex;
    align-items: center;
    width: 48%;
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
    &.sky-blue {
      &::before {
        background-color: $sky-blue;
      }
    }
  }
}
</style>
