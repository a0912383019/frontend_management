/***
 * 廳別config
 */
// BBIN
export const hall_config_dict_bbin = {}
hall_config_dict_bbin['esb'] = {
  hall_id: 3820698,
  domain_id: 0,
  hall_code: 'esb',
  hall_name: 'e世博',
  currency_sign: '¥'
}
hall_config_dict_bbin['b9'] = {
  hall_id: 98,
  domain_id: 0,
  hall_code: 'b9',
  hall_name: '博九',
  currency_sign: '¥'
}
// BEGIN TODO:20221223 spanner架構調整，BBIN只先保留部分，其餘註解
// hall_config_dict_bbin['55'] = {hall_id: 3820004, domain_id: 0, hall_code:'55', hall_name: '澳門sands金沙娛樂場', currency_sign: '¥'};
// hall_config_dict_bbin['hh'] = {hall_id: 3819497, domain_id: 0, hall_code:'hh', hall_name: '輝煌國際-银河GALAXY', currency_sign: '¥'};
// hall_config_dict_bbin['jg'] = {hall_id: 281, domain_id: 0, hall_code:'jg', hall_name: '金冠娱乐城-金沙集團sands', currency_sign: '¥'};
// hall_config_dict_bbin['710'] = {hall_id: 3819496, domain_id: 0, hall_code:'710', hall_name: '公海赌船', currency_sign: '¥'};
// hall_config_dict_bbin['bc'] = {hall_id: 3817629, domain_id: 0, hall_code:'bc', hall_name: '奔馳線上娛樂-金沙娛樂城casino sands', currency_sign: '¥'};
// hall_config_dict_bbin['294'] = {hall_id: 10000007, domain_id: 0, hall_code:'294', hall_name: '俄羅斯專享會', currency_sign: '¥'};
// hall_config_dict_bbin['xj'] = {hall_id: 3820420, domain_id: 0, hall_code:'xj', hall_name: '星際娛樂Star World‧Enertain', currency_sign: '¥'};
// hall_config_dict_bbin['349'] = {hall_id: 3820422, domain_id: 0, hall_code:'349', hall_name: '拉斯维加斯Las Vegas World Casino', currency_sign: '¥'};
// END

// XBB
export const hall_config_dict_xbb = {}
hall_config_dict_xbb['178'] = {
  hall_id: 3820325,
  domain_id: 38,
  hall_code: '178',
  hall_name: 'ESBP',
  currency_sign: '¥'
}
hall_config_dict_xbb['vx88'] = {
  hall_id: 3820325,
  domain_id: 70,
  hall_code: 'vx88',
  hall_name: 'VX88',
  currency_sign: '₫'
}
hall_config_dict_xbb['kr'] = {
  hall_id: 3820325,
  domain_id: 82,
  hall_code: 'kr',
  hall_name: 'KR',
  currency_sign: '₩'
}
hall_config_dict_xbb['5151'] = {
  hall_id: 3820325,
  domain_id: 94,
  hall_code: '5151',
  hall_name: '51國際',
  currency_sign: '¥'
}
hall_config_dict_xbb['ma'] = {
  hall_id: 3820325,
  domain_id: 96,
  hall_code: 'ma',
  hall_name: '澳門線上娛樂',
  currency_sign: '¥'
}
hall_config_dict_xbb['halo'] = {
  hall_id: 3820325,
  domain_id: 102,
  hall_code: 'halo',
  hall_name: 'HaloWin',
  currency_sign: '₱'
}

export const hall_config_dict = {}
hall_config_dict['BBIN'] = hall_config_dict_bbin
hall_config_dict['XBB'] = hall_config_dict_xbb

/***
 * 遊戲類別對應
 */
export const lobby_group_description_dict = {}

/***
 * chart.js固定資料背景顏色(rgb)
 */
export const chart_fixed_bgColor = [
  [245, 105, 84],
  [0, 166, 90],
  [243, 156, 18],
  [0, 192, 239],
  [232, 208, 152],
  [60, 141, 188],
  [210, 214, 222],
  [128, 128, 192],
  [102, 204, 204],
  [194, 176, 97],
  [200, 100, 80],
  [51, 51, 102],
  [30, 222, 88],
  [102, 102, 102],
  [111, 22, 222],
  [255, 153, 204],
  [123, 99, 82],
  [255, 0, 204],
  [88, 140, 140],
  [51, 102, 51]
]

// 活躍度表情icon設定
export const iconStep = (step) => {
  switch (step) {
    case 0:
      return {
        icon: 'fa-dizzy',
        color: 'cdp-text-light__slate__gray'
      }
    case 1:
      return {
        icon: 'fa-frown',
        color: 'cdp-text-amethyst'
      }
    case 2:
      return {
        icon: 'fa-face-meh',
        color: 'cdp-text-indian__red'
      }
    case 3:
      return {
        icon: 'fa-smile',
        color: 'cdp-text-forest__green__crayola'
      }
    case 4:
      return {
        icon: 'fa-grin-beam',
        color: 'cdp-text-glaucous'
      }
    case 5:
      return {
        icon: 'fa-grin-stars',
        color: 'cdp-text-cadmium__orange'
      }
  }
}

// /**
//  * 活躍度表情icon設定
//  */
// export const lively_icon_config = {}
// lively_icon_config[0] =
//   '<span><i class="far fa-dizzy fa-2x cdp-text-light__slate__gray"></i></span>'
// lively_icon_config[1] = '<span><i class="far fa-frown fa-2x cdp-text-amethyst"></i></span>'
// lively_icon_config[2] = '<span><i class="far fa-meh fa-2x cdp-text-indian__red"></i></span>'
// lively_icon_config[3] =
//   '<span><i class="far fa-smile fa-2x cdp-text-forest__green__crayola"></i></span>'
// lively_icon_config[4] = '<span><i class="far fa-grin-beam fa-2x cdp-text-glaucous"></i></span>'
// lively_icon_config[5] =
//   '<span><i class="far fa-grin-stars fa-2x cdp-text-cadmium__orange"></i></span>'

/**
 * RFM + NAPL階段設定
 */
export const RFM_NAPL_step_config = {}
RFM_NAPL_step_config[null] = {
  step_name: '',
  step_description: '',
  step_color: [128, 128, 192],
  step_icon: '',
  step_dot: ''
}
RFM_NAPL_step_config['0'] = {
  step_name: '',
  step_description: '',
  step_color: [128, 128, 192],
  step_icon: '',
  step_dot: ''
}
RFM_NAPL_step_config['1'] = {
  step_name: '',
  step_description: '',
  step_color: [232, 70, 94],
  step_icon: '<i class="fas fa-running mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-paradisepink ml__6"></span>',
  step_vue_icon: 'fa-solid fa-person-running',
  step_vue_dot_color: 'cdp-bg-paradisepink'
}
RFM_NAPL_step_config['2'] = {
  step_name: '',
  step_description: '',
  step_color: [19, 91, 134],
  step_icon: '<i class="fas fa-baby mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-lapislazuli ml__6"></span>',
  step_vue_icon: 'fa-solid fa-baby',
  step_vue_dot_color: 'cdp-bg-lapislazuli'
}
RFM_NAPL_step_config['3'] = {
  step_name: '',
  step_description: '',
  step_color: [249, 180, 12],
  step_icon: '<i class="fas fa-skating mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-selectiveyellow ml__6"></span>',
  step_vue_icon: 'fa-solid fa-person-skating',
  step_vue_dot_color: 'cdp-bg-selectiveyellow'
}
RFM_NAPL_step_config['4'] = {
  step_name: '',
  step_description: '',
  step_color: [243, 109, 48],
  step_icon: '<i class="fas fa-hiking mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-orangered ml__6"></span>',
  step_vue_icon: 'fa-solid fa-person-hiking',
  step_vue_dot_color: 'cdp-bg-orangered'
}
RFM_NAPL_step_config['5'] = {
  step_name: '',
  step_description: '',
  step_color: [146, 41, 67],
  step_icon: '<i class="fas fa-wheelchair mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-redviolet ml__6"></span>',
  step_vue_icon: 'fa-solid fa-wheelchair',
  step_vue_dot_color: 'cdp-bg-redviolet'
}
RFM_NAPL_step_config['6'] = {
  step_name: '',
  step_description: '',
  step_color: [62, 150, 169],
  step_icon: '<i class="fas fa-procedures mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-bluemunsell ml__6"></span>',
  step_vue_icon: 'fa-solid fa-bed-pulse',
  step_vue_dot_color: 'cdp-bg-bluemunsell'
}
RFM_NAPL_step_config['7'] = {
  step_name: '',
  step_description: '',
  step_color: [148, 195, 199],
  step_icon: '<i class="fas fa-skull-crossbones mr__6"></i>',
  step_dot: '<span class="cdp-sm-dots cdp-bg-opal ml__6"></span>',
  step_vue_icon: 'fa-solid fa-skull-crossbones',
  step_vue_dot_color: 'cdp-bg-opal'
}

// /**
//  * 訊息通知種類
//  */
// export const smart_message_notification_config = {}
// smart_message_notification_config['0'] = {
//   kind_name: 'all_msg',
//   kind_description: '',
//   kind_icon: ''
// }
// smart_message_notification_config['1'] = {
//   kind_name: 'vip_msg',
//   kind_description: '',
//   kind_icon: '<span class="text-success"><i class="fab fa-vimeo-v mr-1"></i></span>'
// }
// smart_message_notification_config['2'] = {
//   kind_name: 'alarm_msg',
//   kind_description: '',
//   kind_icon: '<span class="text-warning"><i class="fas fa-exclamation-circle mr-1"></i></span>'
// }
// smart_message_notification_config['3'] = {
//   kind_name: 'observe_msg',
//   kind_description: '',
//   kind_icon: '<span class="text-secondary"><i class="fas fa-broadcast-tower mr-1"></i></span>'
// }
// smart_message_notification_config['4'] = {
//   kind_name: 'game_msg',
//   kind_description: '',
//   kind_icon: '<span class="text-orange"><i class="fas fa-dice mr-1"></i></span>'
// }

/**
 * 使用者config
 */
export const user_type_dict = {}
export const general_user = 0 // 一般使用者
export const advanced_user = 1 // 進階使用者
export const hall_admin = 8 // 遊戲廳管理員
export const system_admin = 9 // 系統管理員

export const user_status_dict = {}
export const user_config = {}
user_config['type'] = user_type_dict
user_config['status'] = user_status_dict

/**
 * 系統各類參數設定
 */
export const list_tags_visible_num = 12 // 列表顯示的標籤數量
export const custom_tags_limit = 10 // 自訂標籤組合設定組數上限
export const logout_counter_min = 15 // token倒數提醒時間(分)
export const logout_counter_sec = 1 // token倒數提醒時間(秒)
