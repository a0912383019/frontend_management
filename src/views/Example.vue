<script setup>
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from 'vue-i18n'

import { GChart } from 'vue-google-charts'

const { t, locale } = useI18n()
watch(locale, (val, oldVal) => {
  console.log(val, oldVal)
  window.localStorage.setItem('languageType', val)
})

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])

//drag
const drag = ref(false)
const dragLists = ref([
  {
    name: 'Kobe'
  },
  {
    name: 'Garnett'
  }
])
const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost'
  }
})

//google login
const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  console.log('Handle the response', response)
}

//highcharts
const chartOptions = {
  series: [
    {
      data: [1, 2, 3] // sample data
    }
  ]
}

//google chart
const googleChartData = [
  ['City', '2010 Population', '2000 Population'],
  ['New York City, NY', 8175000, 8008000],
  ['Los Angeles, CA', 3792000, 3694000],
  ['Chicago, IL', 2695000, 2896000],
  ['Houston, TX', 2099000, 1953000],
  ['Philadelphia, PA', 1526000, 1517000]
]
const googleChartOptions = {
  title: 'Population of Largest U.S. Cities',
  chartArea: { width: '50%' },
  hAxis: {
    title: 'Total Population',
    minValue: 0
  },
  vAxis: {
    title: 'City'
  },
  width: 800,
  height: 600
}
</script>
<template>
  <section class="sectionBox">
    <h2>element plus 測試</h2>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <el-tag>Tag 1</el-tag>
    <el-tag class="ml-2" type="success">Tag 2</el-tag>
    <el-tag class="ml-2" type="info">Tag 3</el-tag>
    <el-tag class="ml-2" type="warning">Tag 4</el-tag>
    <el-tag class="ml-2" type="danger">Tag 5</el-tag>
  </section>
  <section class="sectionBox">
    <h2>sass-loader測試</h2>
    <div class="testText">測試sass變數</div>
  </section>
  <section class="sectionBox">
    <h2>svg-icon測試</h2>
    <div class="arrow">
      <cdp-icon name="arrowDown" />
    </div>
  </section>
  <section class="sectionBox">
    <h2>i18n</h2>
    <select v-model="locale">
      <option>zh-TW</option>
      <option>zh-CN</option>
      <option>en-US</option>
    </select>
    <p>{{ t('date.date_duration') }}</p>
  </section>
  <section class="sectionBox">
    <h2>拖曳</h2>
    <draggable
      class="dragListGroup"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null
      }"
      v-model="dragLists"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      item-key="order"
    >
      <template #item="{ element, index }">
        <div class="dragListItem">
          <div class="no">{{ index + 1 }}</div>
          <div class="name" data-cy="dragListItemName">
            {{ element.name }}
          </div>
        </div>
      </template>
    </draggable>
  </section>
  <section class="sectionBox">
    <h2>Google Login</h2>
    <GoogleLogin :callback="callback" />
  </section>
  <section class="sectionBox">
    <h2>Highcharts</h2>
    <highcharts :options="chartOptions"></highcharts>
  </section>
  <section class="sectionBox">
    <h2>Google Chart</h2>
    <GChart type="ColumnChart" :data="googleChartData" :options="googleChartOptions" />
  </section>
</template>
<style lang="scss" scoped>
.sectionBox {
  h2 {
    font-size: 30px;
    margin-bottom: 15px;
  }
  padding: 20px;
  border-bottom: 1px dashed #000;
}
.testText {
  @include ellipsis;
}
.arrow {
  color: red;
}

.dragListGroup {
  .dragListItem {
    display: flex;
    align-items: center;
    padding: 6px 9px;
    margin-bottom: 10px;
    border-radius: 6px;
    border: 1px solid #dee2e6;
    background-color: #fff;
    transition: background-color 0.5s, border 0.5s;
    cursor: move;
    .no {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      height: 25px;
      margin-right: 10px;
      background-color: #6376a6;
      border-radius: 50%;
      font-size: 14px;
      color: #fff;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      color: skylbue;
    }
    &.ghost {
      // opacity: 0.3;
    }
    &.ghost {
      background-color: #6376a6;
      border-color: #6376a6;
      .no {
        background-color: #fff;
        color: #6376a6;
      }
      .name {
        color: #fff;
      }
    }
  }
}
</style>
