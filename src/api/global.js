import axiosInstance from './axiosInstance.js'
import { findRootHall } from '@/utils/commonUtils.js'
//存放頁面中有共用的api

//歷程紀錄
export const apiQueryMemberStepDetail = (params) => {
  const { hall_name, member_id, member_step_detail_date } = params
  const url_hall = findRootHall(hall_name).toLowerCase()
  return axiosInstance.post(
    '/api/auth/manage/' + url_hall + '/query_member_step_detail' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      member_step_detail_date
    }
  )
}
