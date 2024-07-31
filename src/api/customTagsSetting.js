import axiosInstance from './axiosInstance'

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
