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

// // 刪除匯出報表清單
// export const apiDeleteUserExportList = (params) => {
//   const { hall_name, download_urls } = params
//   return axiosGoInstance.post(
//     '/api/auth/export_report/delete_user_export_report',
//     {
//       hall_name,
//       download_urls
//     }
//   )
// }
