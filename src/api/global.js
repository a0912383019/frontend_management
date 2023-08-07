import axiosGoInstance from './axiosGoInstance.js'
//存放頁面中有共用的api

//歷程紀錄
export const apiQueryMemberStepDetail = (params) => {
  const { hall_name, user_id, member_step_detail_date } = params
  return axiosGoInstance.get('/api/auth/manage/member_step_detail', {
    params: { hall_name, user_id, member_step_detail_date }
  })
}

// 手動匯入使用者名單(csv檔)
export const apiUploadCsvList = (params) => {
  const { hall_name, csv_type, csv_file } = params
  return axiosGoInstance.post(
    '/api/auth/common/upload_csv_list',
    {
      hall_name,
      csv_type,
      csv_file
    },
    {
      headers: { 'Content-Type': 'multipart/form-data' } //upload_file為binary，須改headers content-type
    }
  )
}
