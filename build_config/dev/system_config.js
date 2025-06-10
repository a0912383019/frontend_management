export const build_env_config = 'dev'

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

export const latest_chart_color = [
  [241, 78, 78],
  [0, 192, 236],
  [69, 137, 166],
  [251, 201, 201],
  [209, 214, 222],
  [200, 200, 240],
  [255, 107, 0],
  [235, 214, 173],
  [255, 172, 112],
  [12, 197, 195],
  [179, 219, 67],
  [248, 224, 0],
  [54, 147, 255],
  [196, 137, 201],
  [166, 212, 179],
  [187, 109, 17],
  [233, 94, 144],
  [157, 151, 151],
  [115, 114, 200],
  [48, 165, 60]
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
  step_color: [232, 70, 94],
  step_vue_icon: 'fa-solid fa-person-running',
  step_vue_dot_color: 'cdp-bg-paradisepink'
}
RFM_NAPL_step_config['2'] = {
  step_name: '',
  step_color: [19, 91, 134],
  step_vue_icon: 'fa-solid fa-baby',
  step_vue_dot_color: 'cdp-bg-lapislazuli'
}
RFM_NAPL_step_config['3'] = {
  step_name: '',
  step_color: [249, 180, 12],
  step_vue_icon: 'fa-solid fa-person-skating',
  step_vue_dot_color: 'cdp-bg-selectiveyellow'
}
RFM_NAPL_step_config['4'] = {
  step_name: '',
  step_color: [243, 109, 48],
  step_vue_icon: 'fa-solid fa-person-hiking',
  step_vue_dot_color: 'cdp-bg-orangered'
}
RFM_NAPL_step_config['5'] = {
  step_name: '',
  step_color: [146, 41, 67],
  step_vue_icon: 'fa-solid fa-wheelchair',
  step_vue_dot_color: 'cdp-bg-redviolet'
}
RFM_NAPL_step_config['6'] = {
  step_name: '',
  step_color: [62, 150, 169],
  step_vue_icon: 'fa-solid fa-bed-pulse',
  step_vue_dot_color: 'cdp-bg-bluemunsell'
}
RFM_NAPL_step_config['7'] = {
  step_name: '',
  step_color: [148, 195, 199],
  step_vue_icon: 'fa-solid fa-skull-crossbones',
  step_vue_dot_color: 'cdp-bg-opal'
}

/**
 * 使用者config
 */
export const user_type_dict = {}
export const user_types = {
  general_user: 0, // 一般使用者
  advanced_user: 1, // 進階使用者
  hall_admin: 8, // 遊戲廳管理員
  system_admin: 9, // 系統管理員
  gm_user: -1 // GM
}

export const user_status_dict = {}
export const user_config = {}
user_config['type'] = user_type_dict
user_config['status'] = user_status_dict

/**
 * 系統各類參數設定
 */
export const list_tags_visible_num = 12 // 列表顯示的標籤數量
export const custom_tags_limit = 10 // 自訂標籤組合設定組數上限
export const logout_counter_min = 10 // token倒數提醒時間(分)
export const logout_counter_sec = 1 // token倒數提醒時間(秒)
