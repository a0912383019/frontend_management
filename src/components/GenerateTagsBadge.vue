<script setup>
import { ref, computed } from 'vue'
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
const badge_class = ref('badge')
const tag_description_dict = getSessionStorageEntity('system_config').tags_config[props.hall_name]
const get_tag_code = tag_description_dict[props.tag_code]
if (get_tag_code !== undefined) {
  const tag_type = get_tag_code.tag_type
  switch (tag_type) {
    case 1:
      badge_class.value += ' badge-custom-green'
      break
    case 2:
      badge_class.value += ' badge-custom-green'
      break
    case 3:
      badge_class.value += ' badge-custom-blue'
      break
    case 4:
      badge_class.value += ' badge-custom-yellow'
      break
    case 5:
      badge_class.value += ' badge-custom-danger'
      break
    case 6:
      badge_class.value += ' badge-custom-danger'
      break
  }
  badge_class.value += ` ${props.badge_text_class}`
}

const tagName = computed(() => {
  return tag_description_dict[props.tag_code].tag_name
})
</script>
<template>
  <el-tooltip
    effect="dark"
    :content="tag_description_dict[props.tag_code].tag_description"
    placement="top"
    :hide-after="0"
  >
    <div :class="badge_class">
      {{ tagName }}
    </div>
  </el-tooltip>
</template>
<style lang="scss" scoped></style>
