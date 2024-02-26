<template>
  <div>
    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <span>数量统计&表型分析</span>
        </div>
      </template>
      <div>
        <div class="phenoNum">
          <h1>表型数量： {{ phenotypeNum }}</h1>
        </div>
        <div class="phenoNum">
          <h1>材料数量： {{ materialNum }}</h1>
        </div>
      </div>
      <div id="PieChart" style="width: 100%; height: 500px"></div
    ></el-card>
  </div>
</template>

<script setup>
import request from "@/utils/request";
import * as echarts from "echarts";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  countByType,
  phenotypeAndMaterialNum,
} from "@/api/data_presentation/phenotype_management";

provide(THEME_KEY);

const data1 = ref({});
const newData1 = ref({});

// 获取并处理表型分析数据
function getData() {
  countByType()
    .then((res) => {
      data1.value = res.data;
      newData1.value = Object.entries(data1.value).map(([name, value]) => ({
        value,
        name,
      }));
      showPieChart();
    })
    .catch((error) => {
      console.log(error);
    });
}

// 显示表型分析分析饼状图
function showPieChart() {
  const echartDom = document.getElementById("PieChart");
  echartDom?.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(echartDom);
  const option = {
    title: {
      text: "表型分析",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "表型分析",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: newData1.value,

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart.setOption(option);
}

// route实例
const route = useRoute();

const tableName = ref("");
const phenotypeNum = ref(0);
const materialNum = ref(0);

//获取表型数量、材料数量
function phenoNum() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  phenotypeAndMaterialNum(tableName.value)
    .then((res) => {
      phenotypeNum.value = res.data.phenotypeNum;
      materialNum.value = res.data.materialNum;
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
onMounted(() => {
  getData();
  phenoNum();
});
</script>

<style lang="less" scoped>
.phenoNum {
  color: grey;
  font-size: 12px;
}

#PieChart {
  border-top: 0.5px solid rgba(75, 75, 75, 0.1);
  padding-top: 5px;
}
</style>

// 卡片样式
<style lang="less" scoped>
.card-container {
  border-radius: 50px;
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
    font-size: 16px;
    background: #fafafa !important;
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
