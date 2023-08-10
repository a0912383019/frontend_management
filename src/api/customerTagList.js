import axiosInstance from './axiosInstance.js'

//會員總覽
export const apiListMemberTags = (params) => {
  const {
    hall_name,
    activated_date_hide,
    search_date_hide,
    ag_name,
    user_level_id,
    search_name,
    fuzzy_search,
    search_tag_hide,
    exclude_tag_hide,
    use_custom_list,
    recordsTotal_hide,
    refresh_recordsTotal_hide,
    draw,
    start,
    length
  } = params
  return axiosInstance.post('/api/auth/member/bbin/list_member_tags' + sessionStorage.from_page, {
    hall_name,
    activated_date_hide,
    search_date_hide,
    ag_name,
    user_level_id,
    search_name,
    fuzzy_search,
    search_tag_hide,
    exclude_tag_hide,
    use_custom_list,
    recordsTotal_hide,
    refresh_recordsTotal_hide,
    draw,
    start,
    length
  })
}
