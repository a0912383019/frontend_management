import axiosGoInstance from './axiosGoInstance.js'

// 取得目標族群分析列表
export const apiQueryTargetGroups = (params) => {
  const { hall_name, target_group_name } = params
  return axiosGoInstance.get('/api/auth/target_groups', {
    params: { hall_name, target_group_name }
  })
}

// 取得目標族群詳細資料
export const apiQueryTargetGroupsWithId = (params) => {
  const { hall_name, target_id } = params
  return axiosGoInstance.get(`/api/auth/target_groups/${target_id}`, {
    params: { hall_name }
  })
}

// 新增目標族群
export const apiAddTargetGroups = (params) => {
  const { hall_name, custom_tags, is_open, target_group_name } = params
  return axiosGoInstance.post('/api/auth/target_groups', {
    hall_name,
    custom_tags,
    is_open,
    target_group_name
  })
}

// 刪除目標族群
export const apiDeleteTargetGroups = (params) => {
  const { hall_name, id } = params
  return axiosGoInstance.delete(`/api/auth/target_groups/${id}`, {
    params: { hall_name }
  })
}

// 取得目標族群每日貨量&損益
export const apiQueryBetAmountAndPayoff = (params) => {
  const { hall_name, id, search_date } = params
  return axiosGoInstance.get(`/api/auth/target_groups/${id}/betAmount_and_payoff`, {
    params: { hall_name, search_date }
  })
}

// 取得目標族群總人數
export const apiQueryTotalPeople = (params) => {
  const { hall_name, id } = params
  return axiosGoInstance.get(`/api/auth/target_groups/${id}/total_people`, {
    params: { hall_name }
  })
}

// 取得目標族群總人數
export const apiQueryActivePeople = (params) => {
  const { hall_name, id, search_date } = params
  return axiosGoInstance.get(`/api/auth/target_groups/${id}/active_people`, {
    params: { hall_name, search_date }
  })
}

// 取得目標族群總人數
export const apiQueryDepositPeople = (params) => {
  const { hall_name, id, search_date } = params
  return axiosGoInstance.get(`/api/auth/target_groups/${id}/deposit_people`, {
    params: { hall_name, search_date }
  })
}
