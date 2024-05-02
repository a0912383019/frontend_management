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

// 刪除匯出報表清單
export const apiDeleteTargetGroups = (params) => {
  const { hall_name, id } = params
  return axiosGoInstance.delete(`/api/auth/target_groups/${id}`, {
    params: { hall_name }
  })
}
