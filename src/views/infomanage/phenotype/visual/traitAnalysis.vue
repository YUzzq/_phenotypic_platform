<template>
  <div>
    <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>性状分析</span>
      </div>
    </template>
    <div style="margin-top: 10px">
      <div class="chooseBox">
        <div>
          <div class="input-title">
            <h1>请选择材料</h1>
          </div>
          <div class="search_table">
            <el-select v-model="traitValue" filterable placeholder="请选择材料id">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button style="margin-left: 20px !important" @click="search_trait" v-loading="searchLoading"
              icon="View" type="primary">查看</el-button>
          </div>
        </div>
        <div>
          <div class="input-title">
            <h1>请选择性状类型</h1>
          </div>
          <div class="search_table">
            <el-select v-model="traitType.id" filterable placeholder="请选择性状类别">
              <el-option v-for="item in traitTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-button style="margin-left: 20px !important" @click="confirmChooseType" icon="Pointer"
              v-loading="chooseLoading" type="primary">选择</el-button>
          </div>
        </div>
      </div>
      <!--  可视图表 -->
      <div class="radarCharts" v-loading="isChartsLoading">
        <div class="echartsTypeChart" style="margin-bottom:50px; width: 100%;height:800px;"></div>
      </div>
      <div class="barCharts">
        <div class="echartsBarDate" style="margin-bottom:50px; width: 100%;height:600px;"></div>
        <div class="echartsBarPercent" style="margin-bottom:50px; width: 100%;height:600px;"></div>
        <div class="echartsBarNum" style="width: 100%;height:600px;"></div>
      </div>
    </div>
  </el-card>
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>材料单一性状分析</span>
      </div>
    </template>
    <div class="chooseBox">
        <div>
          <div class="input-title">
            <h1>请选择性状</h1>
          </div>
          <div class="search_table">
            <el-select v-model="searchTraitId" filterable placeholder="请输入性状名">
              <el-option v-for="item in allTraits" :key="item.traitId" :label="item.traitName" :value="item.traitId" />
            </el-select>
            <el-button style="margin-left: 20px !important" @click="searchTraitByName" v-loading="searchTraitLoading"
              icon="View" type="primary">查看</el-button>
          </div>
        </div>
      </div>
      <div class="echartsBarTrait" style="width: 100%;height:400px;"></div>
  </el-card>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import 'echarts-gl';
import {
  getMaterialIdByFileId,
  dataAnalysisByMaterilId,
  getDataByTraitId
} from "@/api/data_presentation/laboratory_management";
import 'echarts/lib/component/dataZoom'
import { listType } from "@/api/system/type";
const route = useRoute();
const chartsShow = ref(false);
const traitValue = ref("");
const fileId = ref(route.query.id);

//获取可视化数据
const chartsData = reactive([])
const chartsValue = reactive([])
const chartsAverage = reactive([])
const allTraits = reactive([])

//加载
const isChartsLoading = ref('')

//当前选择的性状类别
const traitType = reactive({
  id: -1,
  name:'未分类性状'
})

//形状类别
let traitTypes = reactive([
]);

//性状类别副本
let traitTypesCopy = reactive([

]);

//获取性状类别
const getTraitType = async () => {
  listType(1, 1000)
    .then((res) => {
      console.log(res, 'res111');
      res.rows.forEach((item) => {
        traitTypes.push({
          id: item.traitTypeId,
          name: item.traitTypeName
        })
        traitTypesCopy.push({
          id: item.traitTypeId,
          name: item.traitTypeName
        })

      })
      traitType.id = traitTypes[0].id
      traitType.name = traitTypes[0].name
    })
}

//更新性状类别
const updateTraitTypes = (data) => {
  traitTypesCopy.forEach((item,index) => {
    traitTypes[index]={
      id:item.id,
      name:item.name
    }
  })
}

getTraitType()

watch(traitType.id,(newVal) => {
  nextTick(() => {
    //成功获取数据后，展示可视图表
    isChartsLoading.value = true
    showTypeChart()
    showBarDate()
    showBarPercent()
    showBarNum()
    isChartsLoading.value = false
  })
})

//根据性状类型分类数据
let chartsLabelByType = reactive({

})
let chartsValueByType = reactive({

})

//根据性状类型获取平均值
let chartsAverageByType = reactive({

})

//保留两位小数
function myToFixed(data) {
  return data && typeof(data)=='number'?data.toFixed(2):data
}

//判断是否为百分数或者日期
function isPercentOrDate(data) {
  const isDate = new RegExp('^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}$')
  const isPercent = new RegExp('%$')
  const isNum = new RegExp('^[0-9]+(.[0-9]+)?$')
  if (isDate.test(data)) {
    return new Date(data.replace('/', '-')).getTime()
  } else if (isPercent.test(data)) {
    return myToFixed(parseFloat(data))
  }else if(isNum.test(data)){
    return myToFixed(data)
  }else{
    return 0
  }
}


function getChartsValueByType(data) {
  //填充未定义类型  
  traitTypes.push({
      id:null,
      name:'未分类性状'
    })
  traitTypes.forEach((item) => {
    //获得性状类别
    Object.assign(chartsLabelByType, {
      [item.id]: []
    })
    Object.assign(chartsValueByType, {
      [item.id]: []
    })
    Object.assign(chartsAverageByType, {
      [item.id]: []
    })
  })

  //填充数据
  traitTypes.forEach((item) => {
    data.forEach((item2) => {
      if (item.id == item2.traitTypeId) {
        chartsLabelByType[item.id].push({
          name: item2.traitName,
          max: isPercentOrDate(item2.maxNum),
          min: isPercentOrDate(item2.minNum),
        })
         chartsValueByType[item.id].push(isPercentOrDate(item2.value))
         chartsAverageByType[item.id].push(isPercentOrDate(item2.average))
      }
    })
  })
  //删除材料中没有的性状类别
  for(let index =0;index<traitTypes.length;index++){
    if(chartsLabelByType[traitTypes[index].id].length==0){
      console.log(1111222);
      console.log(traitTypes, 'traitTypes1111222');
      traitTypes.splice(index,1)
      traitTypes[0] && (traitType.id = traitTypes[0].id)
      traitTypes[0] && (traitType.name = traitTypes[0].name)
      index--
    }
  }
  //设置默认性状类别
  console.log(traitTypes, 'traitTypes');
  console.log(chartsLabelByType, 'chartsLabelByType');
  console.log(chartsValueByType, 'chartsValueByType');
  console.log(chartsAverageByType, 'chartsAverageByType');
}
//确认选择的性状类别
function confirmChooseType() {
  traitType.name = traitTypes.find((item) => {
    return item.id == traitType.id
  }).name
  nextTick(() => {
    showTypeChart()
  })
}

//根据值格式分类数据
let chartsValueByFormat = reactive({
  date: [],
  dateLabel: [],
  percent: [],
  percentLabel: [],
  num: [],
  numLabel: []
})

let chartsAverageByFormat = reactive({
  date: [],
  percent: [],
  num: []
})
//按格式分类数据和平均值
function getChartsValueByFormat(data) {
  const isDate = new RegExp('^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}$')
  const isPercent = new RegExp('%$')
  const isNum = new RegExp('^[0-9]+(.[0-9]+)?$')
  chartsValueByFormat = {
    date: [],
    dateLabel: [],
    percent: [],
    percentLabel: [],
    num: [],
    numLabel: []
  }
  chartsAverageByFormat = {
    date: [],
    percent: [],
    num: []
  }

  data.forEach((item) => {
    try {
      if (isDate.test(item.value)) {
        chartsValueByFormat.date.push(new Date(item.value.replace('/', '-')).getTime())
        chartsValueByFormat.dateLabel.push(item.traitName)
        chartsAverageByFormat.date.push(new Date(item.average.replace('/', '-')).getTime())
      } else if (isPercent.test(item.value)) {
        chartsValueByFormat.percent.push(myToFixed(parseFloat(item.value)))
        chartsValueByFormat.percentLabel.push(item.traitName)
        chartsAverageByFormat.percent.push(myToFixed(parseFloat(item.average)))
      } else if (isNum.test(item.value)){
        chartsValueByFormat.num.push(myToFixed(item.value))
        chartsValueByFormat.numLabel.push(item.traitName)
        chartsAverageByFormat.num.push(myToFixed(item.average))
      }

    } catch (err) {
      console.log(err);
    }
  })
  console.log(chartsValueByFormat, 'chartsValueByFormat');
  console.log(chartsAverageByFormat, 'chartsAverageByFormat');
}

//获取雷达图的展示标签数据
function getChartsData(data) {
  data.forEach((item) => {
    chartsData.push({
      name: item.traitName,
      max: Math.ceil(item.maxNum),
      min: Math.floor(item.minNum),
    })
  })
}

//获取数据的值
function getChartsValue(data) {
  data.forEach((item) => {
    chartsValue.push(item.value)
  })
}

//获取数据的平均值
function getChartsAverage(data) {
  data.forEach((item) => {
    chartsAverage.push(item.average)
  })
}

//用于获取表格标签
function getAllTraits(data) {
  data.forEach((item) => {
    allTraits.push({
      traitId: item.triatId,
      traitName: item.traitName,
    })
  })
  searchTraitId.value = allTraits[0].traitId
}

//用与将时间戳转换为日期格式
function formatDate(date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}/${month}/${day}`
}
//显示typeChart雷达图
function showTypeChart() {
  const echartDom = document.querySelector('.echartsTypeChart')
  echartDom?.removeAttribute("_echarts_instance_")
  const myChart = echarts.init(echartDom)
  const typeChart = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let showStr = params.name+'<br/>'
        params.value.forEach((item, index) => {
          const timestampRegex = /^\d{10,13}$/
          timestampRegex.test(item)?item = formatDate(item):item = myToFixed(item)
          showStr += typeChart.radar.indicator[index].name + ' : ' + item + '<br/>'
        })
        return showStr
      }
    },
    title: {
      text: traitType.name,
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#777'
      }
    },
    legend: {
      data: [traitValue.value,'平均值'],
      top: 'bottom',
      left: 'left',
      itemHeight: 4,
      itemWidth: 36,
    },
    radar: {
      indicator: chartsLabelByType[traitType.id],
      splitArea: {
        show: false
      },
      axisLabel: {
        show: true,
        showMinLabel: false,
        fontSize: 12,
        color:(a,b)=>{
          return b%2==0?'#333':'#999'
        },
        formatter: function (value) {
          const timestampRegex = /^\d{10,13}$/
          if (timestampRegex.test(value)) {
            return formatDate(value)
          } else {
            return myToFixed(value)
          }
        }
      },
      axisLine: {
        show: false,
      }
    },
    color: ['#4472C4','#FD8734'],
    series: [
      {
        type: 'radar',
        data: [
          {
            value: chartsValueByType[traitType.id],
            name: traitValue.value
          },
          {
            value: chartsAverageByType[traitType.id],
            name: '平均值'
          }
        ]
      }
    ]
  };
  // typeChart.dataZoom = slider
  myChart.setOption(typeChart);
}
//图表滚动条配置项
const slider = [
  {
    height: 15, //高度
    type: "slider",
    xAxisIndex: [0], //控制第一个x轴
    left: '4%',
    right: '4%',
    bottom: 18, //图表底部距离
    handleSize: 10,//左右2个滑动条的大小
    moveHandleSize: 0,
    borderColor: "#eee", //滑动通道的边框颜色
    fillerColor: '#1F4E3D', //滑动条颜色
    backgroundColor: '#eee',//未选中的滑动条的颜色
    showDataShadow: true,//是否显示数据阴影 默认auto
    rangeMode: ['value', 'value'],
    handleIcon: "arrow",
    handleSize: "100%",
    showDetail: false,
  }
]
//图表悬停提示配置项
const tips = {
  trigger: 'item',
  axisPointer: {
    type: 'shadow'
  },
  backgroundColor: '#fff', // 悬浮框背景色
  borderColor: '#000', // 悬浮框边框颜色
  borderWidth: 1, // 悬浮框边框宽度
  textStyle: { // 悬浮框文字样式
    color: '#000',
    fontSize: 12
  },
}

//显示按日期展示的柱状图
function showBarDate() {
  const echartDom = document.querySelector('.echartsBarDate')
  if (chartsValueByFormat.date.length == 0) {
    echartDom.style.display = 'none'
    return
  } else {
    echartDom.style.display = 'block'
  }
  echartDom?.removeAttribute("_echarts_instance_")
  const maxDate = Math.max(...chartsValueByFormat.date,...chartsAverageByFormat.date)
  const minDate = Math.min(...chartsValueByFormat.date,...chartsAverageByFormat.date)
  const myChart = echarts.init(echartDom)
  const barDate = {
    tooltip: tips,
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
      },
      data: chartsValueByFormat.dateLabel
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return formatDate(value)
        }
      },
      max: maxDate,
      min: minDate===maxDate?minDate-24*3600*1000:minDate
    },
    title: {
      text: '日期类性状',
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#777'
      }
    },
    legend: {
      data: [traitValue.value, '平均值'],
      left: 'right',
      top: 'top',
      itemHeight: 25,
      itemWidth: 25,
    },
    series: [
      {
        name: traitValue.value,
        data: chartsValueByFormat.date,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top',
          formatter: function (value) {
            return formatDate(value.value)
          }
        },
        color: '#4472C4'
      },
      {
        name: '平均值',
        data: chartsAverageByFormat.date,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top',
          formatter: function (value) {
            return formatDate(value.value)
          }
        },
        color: '#ED7D31'
      }
    ]
  };
  barDate.tooltip.formatter = (params) => {
    return params.name + '<br/>' + params.seriesName + ' : ' + formatDate(params.value);
  }
  if (chartsValueByFormat.date.length > 5) {
    barDate.dataZoom = slider
  }
  myChart.setOption(barDate);
}

//显示按百分比显示的柱状图
function showBarPercent() {
  const echartDom = document.querySelector('.echartsBarPercent')
  if (chartsValueByFormat.percent.length == 0) {
    echartDom.style.display = 'none'
    return
  } else {
    echartDom.style.display = 'block'
  }
  echartDom?.removeAttribute("_echarts_instance_")
  const maxPercent = Math.max(...chartsValueByFormat.percent,...chartsAverageByFormat.percent)
  const minPercent = Math.min(...chartsValueByFormat.percent,...chartsAverageByFormat.percent)
  const myChart = echarts.init(echartDom)
  const barPercent = {
    tooltip: tips,
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        formatter: function (value) {
          return value + '(%)'
        }
      },
      data: chartsValueByFormat.percentLabel
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return value + '%'
        }
      },
      max: maxPercent,
      min: minPercent===maxPercent?0:minPercent
    },
    title: {
      text: '百分率类性状',
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#777'
      }
    },
    legend: {
      data: [traitValue.value, '平均值'],
      left: 'right',
      top: 'top',
      itemHeight: 25,
      itemWidth: 25,
    },
    series: [
      {
        name: traitValue.value,
        data: chartsValueByFormat.percent,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top'
        },
        color: '#4472C4'
      },
      {
        name: '平均值',
        data: chartsAverageByFormat.percent,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top'
        },
        color: '#ED7D31'
      }
    ]
  };
  barPercent.tooltip.formatter = (params) => {
    return params.name + '<br/>' + params.seriesName + ' : ' + params.value + '%';
  }
  if (chartsValueByFormat.percent.length > 5) {
    barPercent.dataZoom = slider
  }
  myChart.setOption(barPercent);
}

//显示按数值显示的柱状图
function showBarNum() {
  const echartDom = document.querySelector('.echartsBarNum')
  if (chartsValueByFormat.num.length == 0) {
    echartDom.style.display = 'none'
    return
  } else {
    echartDom.style.display = 'block'
  }
  const maxNum = Math.max(...chartsValueByFormat.num,...chartsAverageByFormat.num)
  const minNum = Math.min(...chartsValueByFormat.num,...chartsAverageByFormat.num)
  echartDom?.removeAttribute("_echarts_instance_")
  const myChart = echarts.init(echartDom)
  const barNum = {
    tooltip: tips,
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
      },
      data: chartsValueByFormat.numLabel,
    },
    yAxis: {
      type: 'value',
      max: maxNum,
      min: minNum===maxNum?0:minNum
    },
    title: {
      text: '数值类性状',
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#777'
      }
    },
    legend: {
      data: [traitValue.value, '平均值'],
      left: 'right',
      top: 'top',
      itemHeight: 25,
      itemWidth: 25,
    },
    series: [
      {
        name: traitValue.value,
        data: chartsValueByFormat.num,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top'
        },
        color: '#4472C4',
      },
      {
        name: '平均值',
        data: chartsAverageByFormat.num,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top'
        },
        color: '#ED7D31',
      }
    ]
  };
  barNum.tooltip.formatter = (params) => {
    return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
  }
  if (chartsValueByFormat.num.length > 5) {
    barNum.dataZoom = slider
  }
  myChart.setOption(barNum);
}


const tableData = reactive([
  {
    traitId: 266,
    traitName: "茎腐病",
    average: 0.0,
    maxNum: 0.0,
    minNum: 0.0,
  },
]);

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

watch(tableData, (newVal) => {
  if (newVal.length) {
    updateTraitTypes()
    getChartsData(newVal)
    getChartsValue(newVal)
    getAllTraits(newVal)
    getChartsAverage(newVal)
    getChartsValueByType(newVal)
    getChartsValueByFormat(newVal)
    searchTraitByName()
    nextTick(() => {
      //成功获取数据后，展示可视图表
      showTypeChart()
      showBarDate()
      showBarPercent()
      showBarNum()
      isChartsLoading.value = false
    })
  }
})


const traitFileId = ref(1);
const ChartsLoading = ref(false);

const chooseLoading = ref(false);

//请求性状信息
function chooseForm() {
  if (!fileId.value) return
  isChartsLoading.value = true;
  ChartsLoading.value = true;
  chartsShow.value = true;
  laboratorSearchShow.value = true;
  chooseLoading.value = true;
  traitFileId.value = fileId.value;
  laboratorFormShow.value = false;
  //查询性状信息
  getMaterialIdByFileId(traitFileId.value)
    .then((res) => {
      chartsShow.value = true;
      ChartsLoading.value = false;
      chooseLoading.value = false;
      $modal.msgSuccess("选择成功！");
      states.value = res.data;
      options.value = states.value.map((item) => {
        return { value: item, label: item };
      });
      traitValue.value = options.value[0].value;
      const materilId = traitValue.value;
      const id = traitFileId.value;
      dataAnalysisByMaterilId(id, materilId)
        .then((res) => {
          searchLoading.value = false;
          laboratorFormShow.value = true;
          updateTableData(res.data);
          searchLoading.value = false;
          $modal.msgSuccess("搜索成功！");
          console.log(res, "tableDataRes");
        })
        .catch((err) => {
          console.error(err);
          searchLoading.value = false;
        });
    })
    .catch((err) => {
      console.error(err);
      ChartsLoading.value = false;
      chooseLoading.value = false;
    });
  ChartsLoading.value = false;
  chooseLoading.value = false;
}
//搜索材料
function search_trait() {
  searchLoading.value = true;
  console.log(traitValue.value, "9090");
  const materilId = traitValue.value;
  const id = traitFileId.value;
  dataAnalysisByMaterilId(id, materilId)
    .then((res) => {
      searchLoading.value = false;
      laboratorFormShow.value = true;

      updateTableData(res.data);
      searchLoading.value = false;
      $modal.msgSuccess("搜索成功！");
      console.log(res, "res");
    })
    .catch((err) => {
      console.error(err);
      searchLoading.value = false;
    });
}
const laboratorFormShow = ref(false);
const laboratorSearchShow = ref(true);
const searchLoading = ref(false);
const allTraitValue = ref({
  label:[],
  value:[]
});

//用于更新allTraitValue的函数
function updateAllTraitValue(data) {
  allTraitValue.value.label = data.map((item) => item.materialId)
  allTraitValue.value.value = data.map((item) => isPercentOrDate(item.traitValue))
}

//根据性状名搜索
const searchTraitId = ref('')
const searchTraitLoading = ref(false)

function searchTraitByName() {
  searchTraitLoading.value = true
  const traitId = searchTraitId.value
  const id = traitFileId.value
  getDataByTraitId(id, traitId)
    .then((res) => {
      if(res.code==200){
        searchTraitLoading.value = false
        updateAllTraitValue(res.data)
        $modal.msgSuccess("搜索成功！");
        console.log(res, "res");
        showBarTrait()
      }else{
        searchTraitLoading.value = false
        $modal.msgError("搜索失败！");
      }
    })
    .catch((err) => {
      $modal.msgError("搜索失败！");
      console.log(err);
      searchTraitLoading.value = false
    });
}

//获取当前显示的性状类别名
function getTraitTypeName() {
  return allTraits.find((item) => {
    return item.traitId == searchTraitId.value
  }).traitName
}

//显示按性状名展示的柱状图
function showBarTrait() {
  const echartDom = document.querySelector('.echartsBarTrait')
  if (allTraitValue.value.value.length == 0) {
    echartDom.style.display = 'none'
    return
  } else {
    echartDom.style.display = 'block'
  }
  echartDom?.removeAttribute("_echarts_instance_")
  const maxNum = Math.max(...allTraitValue.value.value)
  const minNum = Math.min(...allTraitValue.value.value)
  const myChart = echarts.init(echartDom)
  const barTrait = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const timestampRegex = /^\d{10,13}$/
        let value = params.value
        if(timestampRegex.test(params.value)){
          value = formatDate(params.value)
        }
        return params.name + '<br/>' + params.seriesName + ' : ' + value;
      }
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
      },
      data: allTraitValue.value.label,
    },
    yAxis: {
      type: 'value',
      max: maxNum,
      min: minNum===maxNum?0:minNum,
      axisLabel: {
        formatter: function (value) {
          const timestampRegex = /^\d{10,13}$/
          if(timestampRegex.test(value)){
            return formatDate(value)
          }else{
            return myToFixed(value)
          }
        }
      },
    },
    title: {
      text: getTraitTypeName(),
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#777'
      }
    },
    legend: {
      data: [getTraitTypeName()],
      left: 'right',
      top: 'top',
      itemHeight: 25,
      itemWidth: 25,
    },
    series: [
      {
        name: getTraitTypeName(),
        data: allTraitValue.value.value,
        type: 'bar',
        showBackground: true,
        label:{
          show:true,
          position:'top',
          formatter: function (value) {
            const timestampRegex = /^\d{10,13}$/
            if(timestampRegex.test(value.value)){
              return formatDate(value.value)
            }else{
              return myToFixed(value.value)
            }
          }
        },
        color: '#4472C4',
      }
    ]
  };
  if (allTraitValue.value.value.length > 5) {
    barTrait.dataZoom = slider
  }
  myChart.setOption(barTrait);
}


// vue实例
const {
  proxy: { $modal },
} = getCurrentInstance();

//选择框
const options = ref([]);

const states = ref(["110", "110", "120", "900", "800", "700"]);


onMounted( () => {
  chooseForm();
});
</script>

<style scoped lang="less">
.chooseBox{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 80%;
    margin-bottom: 30px;
    .input-title {
      color: grey;
      font-size: 12px;
  }
}
.canvas{
  margin: 0 auto;
}
</style>

<!-- 卡片样式 -->

<style lang="less" scoped>

.card-container{
  border-radius: 50px;
  margin-bottom: 50px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  background: #1F4E3D;
  height: 60px !important;
  display: flex;
  vertical-align: middle;
  padding-left: 50px !important;

  span {
    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}

:deep(.el-table__header) {
  border-bottom: 1px solid black;
  border-top: 1px solid #ebeef5;

  th {
    font-weight: 800;
    font-size: 16PX;
    background: #FAFAFA !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
  }
}

.chooseType {
  margin-left: 50px;
  margin-bottom: 20px;

  span {
    margin-right: 20px;
    font-weight: 600;
    font-size: 20px;
    color: #606266;
  }
}
</style>