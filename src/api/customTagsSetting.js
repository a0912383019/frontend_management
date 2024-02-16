import axiosInstance from './axiosInstance'

export const apiListCustomTagsSetting = (params) => {
  const { hall_name } = params
  return axiosInstance.post('/api/auth/custom_tags/list_custom_tags_setting', {
    hall_name
  })
}
