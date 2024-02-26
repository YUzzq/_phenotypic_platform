<template>
  <div>
    <!-- <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
        ">
        基因型数据可视化 
        </div>

        <h1>{{ id }} {{ tableName }}</h1>
    <div id="main" style="width: 1200px;height: 850px;margin-left: 5%"></div> -->

    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <span>染色体密度图</span>
        </div>
      </template>

      <div
        class="echart"
        id="chr"
        style="width: 100%; height: 450px;"
      ></div>
    </el-card>
  </div>



  
</template>

<!-- <script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
const id=route.query.id
const tableName=route.query.tableName

function initGenoView(){
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    // prettier-ignore
    const hours = [
        '12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a', '10a', '11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'
    ];
    // prettier-ignore
    const days = [
        'Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    ];
    // prettier-ignore
    const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
        .map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });
    option = {
    tooltip: {
        position: 'top'
    },
    grid: {
        height: '50%',
        top: '10%'
    },
    xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
        show: true
        }
    },
    yAxis: {
        type: 'category',
        data: days,
        splitArea: {
        show: true
        }
    },
    visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
    },
    series: [
        {
        name: 'Punch Card',
        type: 'heatmap',
        data: data,
        label: {
            show: true
        },
        emphasis: {
            itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
        }
    ]
    };

    option && myChart.setOption(option);

}

onMounted(() => {
    initGenoView();
});
</script> -->


<script>
import * as echarts from "echarts";
import{
  test
}from "@/api/tree";
//let data =[];
export default {
  name: "Chart",
  data() {
    return {
      xData: Array.from({ length: 6000 }, (_, index) => index + 1),
      myChartStyle: { float: "left", width: "100%", height: "400px" }, //图表样式
      maxNum: 0,
    };
  },
  mounted() {
    this.initTem();
  },
  methods: {
    initTem() {
      // 模拟数据。改成自己数据时删掉
      let data=[];
      const tableName = this.$route.query.tableName;
      console.log(tableName);
      test(tableName).then((res) => {
        data = res.data;

        console.log(data,"iii");
        const that = this;
        data = data.map(function (item) {
          that.maxNum = Math.max(that.maxNum, item[2]);
          return [item[1], item[0] - 1, item[2] || "-"];
        });

        let ySum = data[data.length - 1][1] + 1;
        let yData =[];
        for(let i = 1;i<=ySum;i++)
        {
          yData.push("chr" + i.toString().padStart(2, '0'));
        }
        console.log(yData);


        const option = {
          title: {
            text: this.chartHotname,
          },
          xAxis: {
            type: "category",
            nameLocation: "middle",
            nameGap: 30,

            splitArea: {
              show: false,
            },
            axisTick: {
              show: true,
            },
            axisLine: {
              show: true,
            },
          },
          yAxis: {
            type: "category",
            data: yData,
            axisLine: {
              show: true,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ffff",
                width: 5,
              },
            },
          },
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              let res =
                "Variation Density<br>" +
                params.data[0] +
                "Mb: " +
                params.data[2];
              return res;
            },
            // position: 'top'
          },
          visualMap: {
            min: 1, //1,//365,
            max: this.maxNum, //13313,//78178,
            calculable: true,
            // orient: 'horizontal',
            left: "right",
            text: ["High", "Low"],
            // bottom: '5%',
            inRange: {
              color: ["#0d6e11", "#feff08", "#d01c10"],
            },
          },
          series: [
            {
              type: "heatmap",
              // data: this.chartHotData,
              data: data,
              label: {
                normal: {
                  show: false,
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              zlevel: -1,
            },
          ],
          dataZoom: [
            {
              startValue: "0",
            },
            {
              type: "inside",
            },
          ],
        };
        const myChartHot = echarts.init(document.getElementById("chr"));
        myChartHot.setOption(option);
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          myChartHot.resize();
        });

      });
    },
  },
};
</script>

<!-- 卡片样式 -->
<style lang="less" scoped>
 .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-card__header) {
  background: #9abeaf;
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

.card-container{
  border-radius: 20px;
  width: 95%;
  margin: auto;
  margin-top: 30px;
}
</style>