export const mockListCustomTagsSetting = {
  data: {
    result: [
      {
        row_count: 720,
        status: 2,
        tag_code: 10001,
        updated_time: '2025-05-22 22:46:34'
      },
      {
        row_count: 7,
        status: 1,
        tag_code: 10002,
        updated_time: '2024-12-13 04:19:45'
      },
      {
        row_count: 4,
        status: 1,
        tag_code: 30007,
        updated_time: '2024-10-22 06:28:49'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUpdateTagConfig = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUpdateTagDescription = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockCustomTagsHistory = {
  data: {
    result: {
      data: [
        {
          file_name: '20250401074029_307.csv',
          file_path: 'deded',
          add_count: 0,
          remove_count: 5,
          status: 2,
          member_id: 307,
          member_name: 'meowmow',
          updated_time: '2025-05-22 22:46:34'
        },
        {
          file_name: '20250320083324_307.csv',
          file_path: 'uplo50320/',
          add_count: 5,
          remove_count: 0,
          status: 1,
          member_id: 307,
          member_name: 'meowmow',
          updated_time: '2025-03-20 04:35:14'
        },
        {
          file_name: '20241231165606_249.csv',
          file_path: 'uploa231/',
          add_count: null,
          remove_count: null,
          status: 2,
          member_id: 249,
          member_name: 'meowmow',
          updated_time: '2024-12-31 05:00:06'
        }
      ],
      records_total: 24
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockDownloadHistoryFile = {
  data: {
    result: 'zzzzzz',
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUploadCustomTagsList = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockDeleteCustomTags = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}
