import axiosGoInstance from './axiosGoInstance.js'

//會員標籤列表
export const apiListMemberTags = (params) => {
  const {
    activated_date,
    ag_name,
    custom_user_list,
    exclude_tag,
    fuzzy_search,
    hall_name,
    length,
    locale,
    records_total,
    search_date,
    search_name,
    search_tag,
    start,
    user_level_id
  } = params
  return axiosGoInstance.post('/api/auth/member/list_member_tags', {
    activated_date,
    ag_name,
    custom_user_list,
    exclude_tag,
    fuzzy_search,
    hall_name,
    length,
    locale,
    records_total,
    search_date,
    search_name,
    search_tag,
    start,
    user_level_id
  })
}

// 進階篩選內的代理帳號及會員層級
export const apiQueryAgNameUserLevel = (params) => {
  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/member/ag_name_user_level', {
    params: {
      hall_name
    }
  })
}

// 匯出報表
export const apiExportMemberList = (params) => {
  const {
    activated_date,
    ag_name,
    average_date,
    average_type,
    current_date,
    custom_user_list,
    exclude_tag,
    fuzzy_search,
    hall_name,
    locale,
    month_average_date,
    platform,
    search_date,
    search_name,
    search_tag,
    user_level_id,
    file_path
  } = params
  return axiosGoInstance.post(
    '/api/auth/member/export_member_list',
    {
      activated_date,
      ag_name,
      average_date,
      average_type,
      current_date,
      custom_user_list,
      exclude_tag,
      fuzzy_search,
      hall_name,
      locale,
      month_average_date,
      platform,
      search_date,
      search_name,
      search_tag,
      user_level_id,
      file_path
    }
  )
}
