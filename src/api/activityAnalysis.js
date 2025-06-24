import axiosGoInstance from './axiosGoInstance.js'
import {
  mockQueryTotalProfit,
  mockQueryTotalReal,
  mockQueryTotalCommissionable,
  mockQueryGrowthGapProfit,
  mockQueryGrowthGapReal,
  mockQueryGrowthGapCommissionable,
  mockQueryGrowthRateProfit,
  mockQueryGrowthRateReal,
  mockQueryGrowthRateCommissionable,
  mockQueryListActivity,
  mockDeleteActivity,
  mockQueryPromotionList,
  mockAddActivity,
  mockModifyActivity,
  mockActivityInfo,
  mockQueryActivityCompareOverview,
  mockQueryActivityTagsRank,
  mockQueryActivityCommissionableGrowthSpanTags,
  mockQueryActivityMemberParticipation,
  mockQueryActivityCommissionableGrowthSpan,
  mockQueryActivityCompareDetail,
  mockQueryMemberStepChanges
} from '@/api/mock/activityAnalysis.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

// 匯出名單
export const apiExportActivityGrowthReport = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward, locale } = params
  return axiosGoInstance.get('/api/auth/activity/export_growth_report', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward, locale }
  })
}

// 總和-淨利
export const apiQueryTotalProfit = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryTotalProfit), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 總和-實動人數
export const apiQueryTotalReal = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryTotalReal), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 總和-有效投注
export const apiQueryTotalCommissionable = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryTotalCommissionable), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額-淨利
export const apiQueryGrowthGapProfit = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthGapProfit), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額-實動人數
export const apiQueryGrowthGapReal = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthGapReal), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額-有效投注
export const apiQueryGrowthGapCommissionable = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthGapCommissionable), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率-淨利
export const apiQueryGrowthRateProfit = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthRateProfit), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率-實動人數
export const apiQueryGrowthRateReal = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthRateReal), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率-有效投注
export const apiQueryGrowthRateCommissionable = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGrowthRateCommissionable), 300)
    })
  }

  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 主活動列表
export const apiQueryListActivity = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryListActivity), 300)
    })
  }

  const { hall_name, activity_name } = params
  return axiosGoInstance.get('/api/auth/activity', {
    params: { hall_name, activity_name }
  })
}

// 刪除主活動
export const apiDeleteActivity = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDeleteActivity), 300)
    })
  }

  const { hall_name, id } = params
  return axiosGoInstance.delete(`/api/auth/activity/${id}`, {
    params: { hall_name }
  })
}

// 下拉優惠列表
export const apiQueryPromotionList = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryPromotionList), 300)
    })
  }

  const { hall_name, start_date, end_date } = params
  return axiosGoInstance.get('/api/auth/activity/promotions', {
    params: { hall_name, start_date, end_date }
  })
}

// 新增活動
export const apiAddActivity = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAddActivity), 300)
    })
  }

  const { hall_name, name, description, purpose, details } = params
  return axiosGoInstance.post('/api/auth/activity', {
    hall_name,
    name,
    description,
    purpose,
    details
  })
}

// 新增活動
export const apiModifyActivity = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockModifyActivity), 300)
    })
  }

  const { hall_name, id, name, description, purpose, details } = params
  return axiosGoInstance.put(`/api/auth/activity/${id}`, {
    hall_name,
    name,
    description,
    purpose,
    details
  })
}

// 主活動基本資訊
export const apiActivityInfo = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockActivityInfo), 300)
    })
  }

  const { hall_name, activity_id } = params
  return axiosGoInstance.get(`/api/auth/activity/${activity_id}`, {
    params: { hall_name }
  })
}

// 業績分析與占比與人數分析
export const apiQueryActivityCompareOverview = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityCompareOverview), 300)
    })
  }

  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/compare_overview`, {
    params: { hall_name, is_reward }
  })
}

// 子活動分析-標籤統計-各標籤人數
export const apiQueryActivityTagsRank = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityTagsRank), 300)
    })
  }

  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/tags_rank`, {
    params: { hall_name, is_reward }
  })
}

// 子活動分析-標籤統計-有效投注成長率區間各標籤人數
export const apiQueryActivityCommissionableGrowthSpanTags = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityCommissionableGrowthSpanTags), 300)
    })
  }

  const { hall_name, is_reward, id } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/commissionable_growth_span_tags`, {
    params: {
      hall_name,
      is_reward,
      id
    }
  })
}

// 子活動分析-有效投注統計-會員參與率
export const apiQueryActivityMemberParticipation = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityMemberParticipation), 300)
    })
  }

  const { hall_name, id, is_reward, threshold } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/member_participation`, {
    params: { hall_name, is_reward, threshold }
  })
}

// 子活動分析-有效投注統計-區間人數
export const apiQueryActivityCommissionableGrowthSpan = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityCommissionableGrowthSpan), 300)
    })
  }

  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/commissionable_growth_span`, {
    params: { hall_name, is_reward }
  })
}

// 子活動分析-詳細名單
export const apiQueryActivityCompareDetail = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryActivityCompareDetail), 300)
    })
  }

  const { hall_name, id, is_reward, search_name, length, start, sort, order } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/compare_detail`, {
    params: { hall_name, is_reward, search_name, length, start, sort, order }
  })
}

// 子活動分析-詳細名單(匯出)
export const apiExportActivityCompareDetail = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300)
    })
  }

  const { hall_name, id, is_reward, locale, search_name } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/export_compare_detail`, {
    params: {
      hall_name,
      is_reward,
      locale,
      search_name
    }
  })
}

// 子活動分析-歷程統計
export const apiQueryMemberStepChanges = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberStepChanges), 300)
    })
  }

  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/member_step_changes`, {
    params: { hall_name, is_reward }
  })
}
