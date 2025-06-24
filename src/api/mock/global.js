export const mockQueryMemberStepDetail = {
  data: {
    result: [
      {
        this_day_step: 1,
        data_date: '2025-03-22'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockUploadCsvList = {
  data: {
    result: {
      data: [
        'guest',
        'acash888',
        'dcash888',
        'dqanovia',
        'tom1234',
        '0312novia01',
        '0311novia10',
        'a1337082467',
        'mmm65888',
        'hope07',
        '8220998',
        'qq243887',
        'a15241222274'
      ],
      url: 'https://fake.fake.com/ghrorithm=GOOure=&X-Goog-SignedHeaders=host'
    },
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockQueryMemberRecentWeekLively = {
  data: {
    result: [
      {
        analysis_date: '2025-06-15 ~ 2025-06-21',
        analysis_level: 4,
        avg_action_score: '0.7811'
      },
      {
        analysis_date: '2025-06-08 ~ 2025-06-14',
        analysis_level: 4,
        avg_action_score: '0.8140'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockQueryMemberRecentLively = {
  data: {
    result: [
      {
        action_score: '0.8222',
        data_date: '2025-06-08'
      },
      {
        action_score: '0.8410',
        data_date: '2025-06-09'
      },
      {
        action_score: '0.7844',
        data_date: '2025-06-10'
      },
      {
        action_score: '0.8163',
        data_date: '2025-06-11'
      },
      {
        action_score: '0.7984',
        data_date: '2025-06-12'
      },
      {
        action_score: '0.8190',
        data_date: '2025-06-13'
      },
      {
        action_score: '0.8165',
        data_date: '2025-06-14'
      },
      {
        action_score: '0.8159',
        data_date: '2025-06-15'
      },
      {
        action_score: '0.7813',
        data_date: '2025-06-16'
      },
      {
        action_score: '0.7425',
        data_date: '2025-06-17'
      },
      {
        action_score: '0.8058',
        data_date: '2025-06-18'
      },
      {
        action_score: '0.7383',
        data_date: '2025-06-19'
      },
      {
        action_score: '0.7828',
        data_date: '2025-06-20'
      },
      {
        action_score: '0.8012',
        data_date: '2025-06-21'
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockFinancialWeeks = {
  data: {
    result: [
      {
        month: 6,
        weeks: [
          {
            fin_week: 1,
            week_duration: '2025-06-02 ~ 2025-06-08'
          },
          {
            fin_week: 2,
            week_duration: '2025-06-09 ~ 2025-06-15'
          },
          {
            fin_week: 3,
            week_duration: '2025-06-16 ~ 2025-06-22'
          },
          {
            fin_week: 4,
            week_duration: '2025-06-23 ~ 2025-06-29'
          },
          {
            fin_week: 5,
            week_duration: '2025-06-30 ~ 2025-07-06'
          }
        ]
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}

export const mockRelease = `[ServiceName] prod-cdp-family-v2 \n [Build-Time] 0611_1506 \n [CommitID] 50567c8f
[Docker-Image] asia-docker.pkg.dev/gcp-fake-004/bi-cdp/cdp_family:prod-internal_0611_1506
`

export const mockHalls = {
  data: {
    result: [
      {
        name: '飛兒',
        login_code: 'fwt',
        hall_id: 1
      },
      {
        name: '惡夢',
        login_code: 'are',
        hall_id: 6
      },
      {
        name: '土肯搏',
        login_code: 'tkb',
        hall_id: 6
      },
      {
        name: 'N不',
        login_code: 'nno',
        hall_id: 6
      }
    ],
    status: {
      return_code: '0000',
      message: 'success'
    }
  }
}
