//Dialog：會員明細資料
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

const { date_range_picker_config_7 } = useDateStore()

export const useDialogMemberDetailStore = defineStore(
  'dialogMemberDetail',
  () => {
    //會員生命週期-會員明細Dialog日期區間
    const dialogMemberDetailRangeDate = ref(
      formatDateDuration(
        dayjs(date_range_picker_config_7['startDate']).format('YYYY-MM-DD') +
          '~' +
          dayjs(date_range_picker_config_7['endDate']).format('YYYY-MM-DD')
      )
    )

    const memberData = reactive({}) //會員明細點擊會員名稱後，存放該會員資料

    const nowTag = ref('')

    const timeStamp = ref('')

    return {
      dialogMemberDetailRangeDate,
      memberData,
      nowTag,
      timeStamp
    }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['memberData']
    }
  }
)
