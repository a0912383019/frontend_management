<script setup>
import { computed, ref } from 'vue'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
const props = defineProps({
  hall_name: {
    type: String,
    default: ''
  },
  tag_code: {
    type: String,
    default: ''
  },
  badge_text_class: {
    type: String,
    default: ''
  }
})

const tag_description_dict = ref(
  getSessionStorageEntity('system_config').tags_config[props.hall_name]
)

const get_tag_code = computed(() => {
  return tag_description_dict.value[props.tag_code]
})

const badge_class = computed(() => {
  let badgeClass = 'badge'
  if (get_tag_code.value !== undefined) {
    const tag_type = get_tag_code.value.tag_type
    switch (tag_type) {
      case 1:
      case 5:
        badgeClass += ' badge-custom-green'
        break
      case 3:
        badgeClass += ' badge-custom-blue'
        break
      case 4:
        badgeClass += ' badge-custom-orange'
        break
      case 6:
        badgeClass += ' badge-custom-danger'
        break
      case 8:
        badgeClass += ' badge-custom-sky-blue'
        break
      case 9:
        badgeClass += ' badge-custom-tree-green'
        break
    }
  }
  return (badgeClass += ` ${props.badge_text_class}`)
})
const tagConent = computed(() => {
  return get_tag_code.value.tag_description
})
const tagName = computed(() => {
  return get_tag_code.value.tag_name
})
</script>
<template>
  <el-tooltip effect="dark" :content="tagConent" placement="top" :hide-after="0">
    <div :class="badge_class">
      {{ tagName }}
    </div>
  </el-tooltip>
</template>
<style lang="scss" scoped></style>
