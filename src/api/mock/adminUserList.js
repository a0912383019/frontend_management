export const mockQueryUserInfo = {
  data: {
    result: {
      id: 249,
      name: 'Family-Lan',
      email: 'lan@mail.net',
      user_type: 9,
      user_status: 0,
      access_hall_name: 'fwt,are,tkb,nno',
      google_picture_url:
        'https://lh3.googleusercontent.com/a/ACg8ocLERxVooBGvI1jWxkiCNh5D8KI06P5TXWh5iEy8_1pdHVPorfk=s96-c',
      login_num: 4269,
      last_login_date: '2025-06-23T05:21:59-04:00',
      created_time: '2023-05-12T05:18:42-04:00',
      updated_time: '2024-10-09T05:48:43-04:00'
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockListUserByAdmin = {
  data: {
    result: [
      {
        id: 2,
        name: 'AI-AIAI',
        email: 'AIAI@ppp.asia',
        user_type: 9,
        user_status: 0,
        access_hall_name: 'tkb,nno',
        google_picture_url: '',
        login_num: 6,
        last_login_date: '2023-02-15 06:12:37',
        created_time: '2023-01-17 03:09:30',
        updated_time: '2024-08-08 22:44:28'
      },
      {
        id: 249,
        name: 'Family-Lan',
        email: 'lan@mail.net',
        user_type: 9,
        user_status: 0,
        access_hall_name: 'fwt,are,tkb,nno',
        google_picture_url:
          'https://lh3.googleusercontent.com/a/ACg8ocLERxVooBGvI1jWxkiCNh5D8KI06P5TXWh5iEy8_1pdHVPorfk=s96-c',
        login_num: 129,
        last_login_date: '2025-06-23T05:21:59-04:00',
        created_time: '2023-05-12T05:18:42-04:00',
        updated_time: '2024-10-09T05:48:43-04:00'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockSimulateUserDataGo = {
  data: {
    result: {
      access_token: 'fake token',
      token_type: 'bearer',
      expires_in: 3600,
      user_id: 291,
      user_name: 'BI-CDP-Family',
      user_type: 9,
      access_hall: 'fwt,are,tkb,nno',
      picture:
        'https://lh3.googleusercontent.com/a/ACg8ocLERxVooBGvI1jWxkiCNh5D8KI06P5TXWh5iEy8_1pdHVPorfk=s96-c'
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUserByAdmin = {
  data: {
    result: {
      id: 249,
      name: 'Family-Lan',
      email: 'lan@mail.net',
      user_type: 9,
      user_status: 0,
      access_hall_name: 'fwt,are,tkb,nno',
      google_picture_url:
        'https://lh3.googleusercontent.com/a/ACg8ocLERxVooBGvI1jWxkiCNh5D8KI06P5TXWh5iEy8_1pdHVPorfk=s96-c',
      login_num: 4269,
      last_login_date: '2025-06-23T05:21:59-04:00',
      created_time: '2023-05-12T05:18:42-04:00',
      updated_time: '2024-10-09T05:48:43-04:00'
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUpdateUserByAdmin = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockDeleteUserByAdmin = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockCreateUserByAdmin = {
  data: {
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}
