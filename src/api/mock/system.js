export const mockGoLogin = {
  data: {
    result: {
      access_token: 'fake',
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

export const mockGoRefresh = {
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

export const mockGetMenusConfig = {
  data: {
    result: [
      {
        item_id: 'home',
        item_name: '首頁',
        svg_icon: 'menuHome',
        url_path: 'home'
      },
      {
        item_id: 'bbin_customer_tag_list',
        item_name: '會員標籤查詢',
        svg_icon: 'menuTag',
        url_path: 'customer-tag-list'
      },
      {
        item_id: 'bbin_manage_analysis',
        item_name: '會員經營分析',
        svg_icon: 'menuManage',
        url_path: 'manage-analysis'
      },
      {
        item_id: 'bbin_vip_commercial_analysis',
        item_name: 'VIP營運分析',
        svg_icon: 'menuVIP',
        url_path: 'vip-commercial-analysis'
      },
      {
        item_id: 'activity_analysis_list',
        item_name: '活動成效分析',
        svg_icon: 'menuActivity',
        url_path: 'activity-analysis-list'
      },
      {
        item_id: 'custom_tags_setting',
        item_name: '自訂標籤設置',
        svg_icon: 'menuLabel',
        url_path: 'custom-tags-setting'
      },
      {
        item_id: 'user_export_report',
        item_name: '匯出報表清單',
        svg_icon: 'menuExport',
        url_path: 'user-export-report'
      },
      {
        item_id: 'admin_user_list',
        item_name: '使用者帳戶管理',
        svg_icon: 'menuUser',
        url_path: 'admin-user-list'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockGetTagsConfig = {
  data: {
    result: [
      {
        tag_code: 10001,
        tag_type: 1,
        tag_name: '愛情課長',
        tag_description: '為愛課金',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true
      },
      {
        tag_code: 10002,
        tag_type: 1,
        tag_name: '無情落葉',
        tag_description: '落葉無情，四海為根',
        tag_category: 1,
        sort_index: 1000002,
        tag_enabled: true
      },
      {
        tag_code: 30007,
        tag_type: 3,
        tag_name: '寫實心理醫生',
        tag_description: '委婉是什麼意思',
        tag_category: 1,
        sort_index: 3000011,
        tag_enabled: true
      },
      {
        tag_code: 30009,
        tag_type: 3,
        tag_name: '干掉的蘋果',
        tag_description: '蘋果健康但也會壞，保握當下',
        tag_category: 1,
        sort_index: 3000012,
        tag_enabled: true
      },
      {
        tag_code: 40011,
        tag_type: 4,
        tag_name: '稀土',
        tag_description: '真是稀客',
        tag_category: 1,
        sort_index: 4000036,
        tag_enabled: false
      },
      {
        tag_code: 40016,
        tag_type: 4,
        tag_name: '萌萌',
        tag_description: '站起來',
        tag_category: 1,
        sort_index: 4000037,
        tag_enabled: false
      },
      {
        tag_code: 40010,
        tag_type: 4,
        tag_name: '電音小河馬',
        tag_description: '夢想當一隻電鰻的河馬',
        tag_category: 1,
        sort_index: 4000038,
        tag_enabled: false
      },
      {
        tag_code: 50001,
        tag_type: 5,
        tag_name: 'iphone的死對頭',
        tag_description: '我不知道是誰',
        tag_category: 1,
        sort_index: 5000100,
        tag_enabled: true
      },
      {
        tag_code: 50002,
        tag_type: 5,
        tag_name: '金鋼狼的骨頭',
        tag_description: '能賣我嗎',
        tag_category: 1,
        sort_index: 5000200,
        tag_enabled: true
      },
      {
        tag_code: 50003,
        tag_type: 5,
        tag_name: '雲上喝可樂',
        tag_description: '雲汽水',
        tag_category: 1,
        sort_index: 5000300,
        tag_enabled: true
      },
      {
        tag_code: 60001,
        tag_type: 6,
        tag_name: 'B群夢想家',
        tag_description: '總想要成為A群',
        tag_category: 1,
        sort_index: 6000004,
        tag_enabled: true
      },
      {
        tag_code: 60002,
        tag_type: 6,
        tag_name: '錢包',
        tag_description: '永遠都空的',
        tag_category: 1,
        sort_index: 6000005,
        tag_enabled: true
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockGetServerTime = {
  data: {
    result: {
      iso_time: '2025-06-23T03:06:06-04:00',
      us_east_time: '2025-06-23 03:06:06'
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}
