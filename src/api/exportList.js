import axiosGoInstance from './axiosGoInstance.js'
import { mockQueryUserExportList, mockDeleteUserExportList } from '@/api/mock/exportList.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

// 取得匯出報表清單
export const apiQueryUserExportList = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryUserExportList), 300)
    })
  }

  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/export_report/user_export_list', {
    params: { hall_name }
  })
}

// 刪除匯出報表清單
export const apiDeleteUserExportList = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDeleteUserExportList), 300)
    })
  }

  const { hall_name, download_urls } = params
  return axiosGoInstance.post('/api/auth/export_report/delete_user_export_report', {
    hall_name,
    download_urls
  })
}
