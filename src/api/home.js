import axiosGoInstance from './axiosGoInstance.js'
import {
  mockQuerySmallBoxData,
  mockQuerySmartMessNote,
  mockReadSmartMessNote,
  mockQueryLatestLifeCycleSummary,
  mockQueryLivelyChangeOverview,
  mockQueryLivelyChangeDetail
} from '@/api/mock/home.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

//首頁
//貨量/損益/優惠獎金/實動人數
export const apiQuerySmallBoxData = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQuerySmallBoxData), 300)
    })
  }

  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/home/small_box_data', {
    params: {
      hall_name,
      search_date
    }
  })
}

//訊息通知
export const apiQuerySmartMessNote = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQuerySmartMessNote), 300)
    })
  }

  const { hall_name, kind, search_date, locale } = params
  return axiosGoInstance.get('/api/auth/home/smart_message_notification', {
    params: {
      hall_name,
      kind,
      search_date,
      locale
    }
  })
}

//訊息通知已讀
export const apiReadSmartMessNote = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReadSmartMessNote), 300)
    })
  }

  const { hall_name, message_id } = params
  return axiosGoInstance.put('/api/auth/home/smart_message_notification', {
    hall_name,
    message_id
  })
}

//會員生命週期人數佔比
export const apiQueryLatestLifeCycleSummary = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLatestLifeCycleSummary), 300)
    })
  }

  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/home/latest_life_cycle_summary', {
    params: {
      hall_name,
      search_date
    }
  })
}

//會員活躍度變化統計
export const apiQueryLivelyChangeOverview = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLivelyChangeOverview), 300)
    })
  }

  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/vip/lively_change_overview', {
    params: {
      hall_name,
      search_date
    }
  })
}

//會員活躍度變化明細
export const apiQueryLivelyChangeDetail = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLivelyChangeDetail), 300)
    })
  }

  const { hall_name, search_date, analysis_level, compare_level } = params
  return axiosGoInstance.get('/api/auth/vip/lively_change_detail', {
    params: {
      hall_name,
      search_date,
      analysis_level,
      compare_level
    }
  })
}
