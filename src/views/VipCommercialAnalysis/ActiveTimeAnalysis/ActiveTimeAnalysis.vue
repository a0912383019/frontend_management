<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Filter.vue'
import TimePeople from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/TimePeople.vue'
import Detail from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Detail.vue'

const refTimePeople = ref(null)
const refDetail = ref(null)

const handleCallApi = () => {
  refTimePeople.value.queryActiveTimePeople()
  refDetail.value.apiSuccess = false
  refDetail.value.messageKey = 'clickChartForDetail'
}

const handelCallDetailApi = (data) => {
  refDetail.value.queryActiveTimeDetail({ activeTime: data.point.index })
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <div class="content-box">
      <div class="content-box__left">
        <TimePeople ref="refTimePeople" @update:detail="handelCallDetailApi" />
      </div>
      <div class="content-box__right">
        <Detail ref="refDetail" />
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.content-box {
  display: flex;
  &__left {
    width: 63%;
  }
  &__right {
    width: 37%;
    padding-left: 20px;
  }
  :deep(.cdp-section-in) {
    height: 100%;
  }
}
</style>
