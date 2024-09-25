import axiosGoInstance from './axiosGoInstance.js'

// 取得自訂標籤列表
export const apiListCustomTagsSetting = (params) => {
  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/member_custom_tags', {
    params: { hall_name }
  })
}

// 修改自訂標籤啟用停用狀態
export const apiUpdateTagConfig = (params) => {
  const { hall_name, tag_code, enabled } = params
  return axiosGoInstance.put(`/api/auth/member_custom_tags/${tag_code}`, {
    hall_name,
    enabled
  })
}

// 修改自訂標籤說明
export const apiUpdateTagDescription = (params) => {
  const { hall_name, tag_code, description } = params
  return axiosGoInstance.put(`/api/auth/member_custom_tags/${tag_code}`, {
    hall_name,
    description
  })
}

// 取得自訂標籤歷程紀錄
export const apiCustomTagsHistory = (params) => {
  const { hall_name, tag_code, length, start } = params
  return axiosGoInstance.get(`/api/auth/member_custom_tags/${tag_code}/logs`, {
    params: { hall_name, length, start }
  })
}

export const apiDownloadHistoryFile = (params) => {
  const { hall_name, tag_code, file_name } = params
  return axiosGoInstance.get(`/api/auth/member_custom_tags/${tag_code}/logs/download_link`, {
    params: { hall_name, file_name }
  })
}

export const apiUploadCustomTagsList = (params) => {
  const { hall_name, tag_code, upload_users_file } = params
  return axiosGoInstance.put(
    `/api/auth/member_custom_tags/${tag_code}/upload_users`,
    {
      hall_name,
      upload_users_file
    },
    {
      headers: { 'Content-Type': 'multipart/form-data' } //upload_file為binary，須改headers content-type
    }
  )
}

// 刪除自訂標籤
export const apiDeleteCustomTags = (params) => {
  const { hall_name, tag_code } = params
  return axiosGoInstance.delete(`/api/auth/member_custom_tags/${tag_code}`, {
    params: { hall_name }
  })
}
