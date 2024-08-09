import axiosGoInstance from './axiosGoInstance.js'

// 取得匯出報表清單
export const apiQueryUserExportList = (params) => {
  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/export_report/user_export_list', {
    params: { hall_name }
  })
}

// 刪除匯出報表清單
export const apiDeleteUserExportList = (params) => {
  const { hall_name, download_urls } = params
  return axiosGoInstance.post('/api/auth/export_report/delete_user_export_report', {
    hall_name,
    download_urls
  })
}
