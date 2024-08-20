import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

export const apiListCustomTagsSetting = (params) => {
  const { hall_name } = params
  return axiosInstance.post('/api/auth/custom_tags/list_custom_tags_setting', {
    hall_name
  })
}

export const apiUpdateTagConfig = (params) => {
  const { hall_name, tag_code, tag_enabled } = params
  return axiosInstance.post('/api/auth/custom_tags/update_tag_config', {
    hall_name,
    tag_code,
    tag_enabled
  })
}

export const apiUpdateTagDescription = (params) => {
  const { hall_name, tag_code, tag_description } = params
  return axiosInstance.post('/api/auth/custom_tags/update_tag_config', {
    hall_name,
    tag_code,
    tag_description
  })
}

export const apiCustomTagsHistory = (params) => {
  const { hall_name, tag_code, length, start } = params
  return axiosGoInstance.get(`/api/auth/member_custom_tags/${tag_code}/logs`, {
    params: { hall_name, length, start }
  })
}

export const apiDownloadHistoryFile = (params) => {
  const { hall_name, tag_code, file_name } = params
  return axiosInstance.post('/api/auth/custom_tags/download_history_file', {
    hall_name,
    tag_code,
    file_name
  })
}

export const apiUploadCustomTagsList = (params) => {
  const { hall_name, tag_code, upload_file } = params

  const formData = new FormData()
  formData.append('hall_name', hall_name)
  formData.append('tag_code', tag_code)
  formData.append('upload_file', upload_file)

  return axiosInstance.post('/api/auth/custom_tags/upload_custom_tags_list', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } //upload_file為binary，須改headers content-type
  })
}

export const apiDeleteCustomTags = (params) => {
  const { hall_name, tag_code } = params
  return axiosInstance.post('/api/auth/custom_tags/delete_custom_tags', {
    hall_name,
    tag_code
  })
}
