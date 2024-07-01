<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Overview from '@/views/ActivityAnalysisList/components/Overview.vue'
import AddButton from '@/components/Button/AddButton.vue'
import AddDialog from '@/views/ActivityAnalysisList/AddActivity.vue'
import Filter from '@/views/ActivityAnalysisList/Filter.vue'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { apiImportActivity } from '@/api'
import { ElNotification } from 'element-plus'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()

const { t } = useI18n()

<<<<<<< HEAD
const dialogVisible = ref(false)

=======
>>>>>>> origin/originmain
//tabs列表
const openAddDialog = () => {
}
  dialogVisible.value = false
}

const addSuccess = (data) => {
  queryImportActivity(data, 2)
  activityStore.activityAddChange = Date.now()
}

// function_id 1:使用者上傳名單 2:活動成效名單(整筆) 3:活動成效名單(單筆)
const queryImportActivity = async (data, functionId) => {
  try {
    const result = await apiImportActivity({
      hall_name: activeHall.hall_code,
      activity_id: data.activity_id,
      activity_detail_id: data.activity_detail_id,
      function_id: functionId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      // nothing to do
    } else {
      ElNotification({
        title: t('msg.import_failed'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.import_failed'),
        type: 'error'
      })
    }
  }
=======
  console.log('add')
>>>>>>> origin/originmain
}

onUnmounted(() => {
  activityStore.initFilter()
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle class="mb-20" icon="menuActivity" :title="$t('sidebar.activity_analysis_list')" />
    <el-row :gutter="20" class="mb-20">
      <el-col :span="15">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="9">
        <div v-if="currentTabs === 'Overview'" class="flex items-center justify-end">
          <AddButton
            class="mr-10"
            :name="$t('activity_analysis.add_activity')"
            @click="openAddDialog"
          />
          <Filter />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </section>
<<<<<<< HEAD
  <AddDialog v-model="dialogVisible" @closeDialog="closeDialog" @addSuccess="addSuccess" />
=======
>>>>>>> origin/originmain
</template>
