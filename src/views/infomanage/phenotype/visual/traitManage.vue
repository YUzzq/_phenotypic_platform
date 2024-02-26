<template>
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>性状管理</span>
      </div>
    </template>
    <div class="big-wrapper" style="margin-top: 10px">
        <div class="echart_wrapper">
          <img src="@/assets/img/11.png" class="bgc-img" style="width: 100%; height: 45vw">
            <div id="traitPanMap" style="width: 100%; height: 45vw"></div>
            <div class="trait-form">
                <el-table
                :data="
                    phenotypeData.slice(
                    (currentpageNum2 - 1) * pageSize2,
                    currentpageNum2 * pageSize2
                    )
                "
                stripe
                style="margin: 10px auto"
                >
                <el-table-column
                    label="序号"
                    width="80px"
                    type="index"
                    :index="indexMethod"
                    align="center"
                />

                <el-table-column
                    align="center"
                    prop="traitName"
                    label="性状名称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.traitName) }}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="fullName"
                    label="全称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.fullName) }}
                    </template>

                </el-table-column>
                <el-table-column
                    prop="abbreviationName"
                    label="缩写"
                    align="center"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.abbreviationName) }}
                    </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注" min-width="180px" align="center">
                    <template #default="scope">
                    {{ formatTableCell(scope.row.remark) }}
                    </template>

                </el-table-column>
                </el-table>

                <el-pagination
                background
                :total="totalPage2"
                :current-page="currentpageNum2"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                />
            </div>
        </div>
    </div>
  </el-card>
</template>

<script setup>
import * as echarts from "echarts";
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { getTree } from "@/api/tree";
import { useRoute } from "vue-router";
import {
  getTraitFormByFileId,
  getallTraitByfileId,
  getTraitBytraitId,
  selectTraitColByFileId,
} from "@/api/data_presentation/trait_management";

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

//route实例
const route = useRoute();

const fileId=ref(route.query.id);

//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数


const phenotypeData = reactive([
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
]);

const data2 = reactive({
  name: "植物性状",
  children: [
    {
      name: "性状一",
      id: "1",
      children: [
        {
          name: "性状1.1",
          id: "2",
        },
        {
          name: "性状1.2",
          id: "3",
        },
      ],
    },
    {
      name: "性状二",
      id: "4",
      children: [
        {
          name: "性状2.1",
          id: "5",
        },
        {
          name: "性状2.2",
          id: "6",
        },
      ],
    },
    {
      name: "性状三",
      id: "7",
      children: [
        {
          name: "性状3.1",
          id: "8",
        },
        {
          name: "性状3.2",
          id: "9",
        },
      ],
    },
    {
      name: "性状四",
      id: "10",
      children: [
        {
          name: "性状4.1",
          id: "11",
        },
        {
          name: "性状4.2",
          id: "12",
        },
      ],
    },
    {
      name: "性状五",
      id: "13",
      children: [
        {
          name: "性状5.1",
          id: "14",
        },
        {
          name: "性状5.2",
          id: "15",
        },
      ],
    },
    {
      name: "性状六",
      id: "16",
      children: [
        {
          name: "性状6.1",
          id: "17",
        },
        {
          name: "性状6.2",
          id: "1",
        },
      ],
    },
  ],
});

const echartData = reactive({
  name: "植物性状",
  children: [
  ],
});

const pieOption = {
    title: {
        text: "文件性状统计",
    },
    series: [
        {
        type: "tree",
        data: [echartData],
        top: "10%",
        bottom: "18%",
        left: "1%",
        layout: "radial",
        symbol: "emptyCircle",
        symbolSize: 7,
        initialTreeDepth: 3,
        animationDurationUpdate: 750,
        zoom: 1,
        emphasis: {
            focus: "descendant",
        },
        expandAndCollapse: false,
        data: [],
        itemStyle: {
            normal: {
            color: "transparent",
            },
        },
        },
    ],
};

const colorByLevel = ["#FF5733", "#FFAB33", "#33FF57", "#33ABFF"];

function assignColorToNodes(node, level) {
  node.itemStyle = {
    color: colorByLevel[level % colorByLevel.length],
  };

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      assignColorToNodes(child, level + 1);
    });
  }
}

function createRingBackground(x, y, innerRadius, outerRadius, color) {
  return {
    type: "circle",
    shape: {
      cx: x,
      cy: y,
      r: outerRadius,
    },
    style: {
      fill: color,
    },
  };
}

function addRingBackground(node, level, centerX, centerY, radius) {
  const color = colorByLevel[level % colorByLevel.length];

  if (node.children && node.children.length > 0) {
    const outerRadius = radius;

    const ringBackground = createRingBackground(
      centerX,
      centerY,
      0,
      outerRadius,
      color
    );

    node.itemStyle.graphic = node.itemStyle.graphic || [];
    node.itemStyle.graphic.push(ringBackground);

    node.children.forEach((child) => {
      addRingBackground(child, level + 1, centerX, centerY, radius + 40);
    });
  }
}

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); // 表格数据

const handleSizeChange2 = (val) => {
  pageSize2.value = val;
};

const handleCurrentChange2 = (val) => {
  currentpageNum2.value = val;
  localStorage.setItem("currentPageNum2", val);
};

function formatTableCell(value) {
  return value || "-"; 
}


//显示控制
const traitChoosed = ref(false);


//用于更新phentypeData的函数
function updatePhenotypeData(data) {
  phenotypeData.splice(0, phenotypeData.length, ...data);
  createTreeData(phenotypeData);
}

const traitTableLoading = ref(false);

//请求性状信息
function chooseForm() {
  if(!fileId.value) return;
  traitTableLoading.value = true;
  const traitFileId = fileId.value;

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  traitChoosed.value = true;
  getTraitFormByFileId({
    fileId: traitFileId,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      const tableDataValue = [];
      const columnsValue = [];
      totalPage.value = res.total;
      if (res.total > 0) {
        const firstItem = res.list[0];

        // 生成表头
        Object.keys(firstItem).forEach((key) => {
          const trait = firstItem[key];
          const traitKey = Object.keys(trait)[0];
          const traitName = trait[traitKey].traitName;
          columnsValue.push({ label: traitName, prop: traitKey });
        });

        // 生成表格数据
        res.list.forEach((array) => {
          const rowData = {};
          array.forEach((trait) => {
            const traitKey = Object.keys(trait)[0];
            const traitValue = trait[traitKey].traitValue;
            rowData[traitKey] = traitValue;
          });
          tableDataValue.push(rowData);
        });
      }

      columns.value = columnsValue;
      tableData.value = tableDataValue;

      traitChoosed.value = true;
      traitTableLoading.value = false;

      /* initHistogram(); */
    })
    .catch((err) => {
      traitTableLoading.value = false;
      console.error(err);
    });

  selectTraitColByFileId(traitFileId)
    .then((res) => {
      if (res.code === 200) {
        totalPage2.value = res.data.length;
        updatePhenotypeData(res.data);
        assignColorToNodes(echartData, 0);
        addRingBackground(echartData, 0, 0, 0, 60);
        pieOption.series[0].data.push(echartData);
        initHistogram();
      }
    })
    .catch((err) => {
      console.error(err);
    });

}


//将请求到的形状信息转换为树形结构
function createTreeData(data) {
    console.log(data,'data');
  //获取性状类型
  echartData.children = [];
  let traitType = [];
  data.forEach((item) => {
    let isExist = false;
    for(let i=0;i<traitType.length;i++){
      if(traitType[i].id == item.traitTypeId){
        isExist = true;
        break;
      }
    }
    if(!isExist){
      if(item.traitTypeId ==null){
        traitType.push({
          name: "未定义性状类别",
          id: null
        })
      }else
      traitType.push({
        name: item.traitTypeName,
        id: item.traitTypeId
      })
    }
  })
  console.log(traitType,'traitType');
  //创建树形结构
  traitType.forEach((item) => {
    let node={
      name: item.name,
      id: item.id,
      children: []
    }
    node.children=data.filter((item2) => item2.traitTypeId === item.id).map((item3) => {
      return {
        name: item3.traitName,
        id: item3.traitTypeId,
        children: null
      }
    });
    echartData.children.push(node);
  })
  console.log(echartData,'echartData');
}

async function fetchData(pageNumber, pageSize) {
  try {
    traitTableLoading.value = true;
    const traitFileId = fileId.value;

    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });

    traitChoosed.value = true;

    getTraitFormByFileId({
      fileId: traitFileId,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
      .then((res) => {
        const tableDataValue = [];
        const columnsValue = [];
        totalPage.value = res.total;
        if (res.total > 0) {
          const firstItem = res.list[0];

          // 生成表头
          Object.keys(firstItem).forEach((key) => {
            const trait = firstItem[key];
            const traitKey = Object.keys(trait)[0];
            const traitName = trait[traitKey].traitName;
            columnsValue.push({ label: traitName, prop: traitKey });
          });

          // 生成表格数据
          res.list.forEach((array) => {
            const rowData = {};
            array.forEach((trait) => {
              const traitKey = Object.keys(trait)[0];
              const traitValue = trait[traitKey].traitValue;
              rowData[traitKey] = traitValue;
            });
            tableDataValue.push(rowData);
          });
        }

        columns.value = columnsValue;
        tableData.value = tableDataValue;

        traitChoosed.value = true;
        traitTableLoading.value = false;

        /* initHistogram(); */
      })
      .catch((err) => {
        traitTableLoading.value = false;
        console.error(err);
      });
  } catch (error) {
  
    traitTableLoading.value = false;
    console.error("获取数据时出错：", error);
  }
}


function buildTree(node) {
  if (!node.chidren) {
    return {
      name: node.name,
      id: node.id.toString(),
      children: null,
    };
  }
  return {
    name: node.name,
    id: node.id.toString(),
    children: node.chidren.map((child) => buildTree(child)),
  };
}

function isLeafNode(node) {
  return !node.children || node.children.length === 0;
}

// 递归查找父节点ID
function findParentNodeId(nodeId, treeData) {
  for (let i = 0; i < treeData.length; i++) {
    const current = treeData[i];
    if (current.children) {
      for (let j = 0; j < current.children.length; j++) {
        if (current.children[j].id === nodeId) {
          return current.id; // 返回父节点ID
        } else {
          const foundId = findParentNodeId(nodeId, current.children);
          if (foundId) return foundId;
        }
      }
    }
  }
  return null;
}

function initHistogram() {
  let chartDoms = document.querySelector("#traitPanMap");
  chartDoms?.removeAttribute("_echarts_instance_")
  let myChart = echarts.init(chartDoms);
  myChart.on("click", (params) => {
    if (params.data && params.data.name !== "植物性状") {
      const isLeaf = isLeafNode(params.data);
      const chartData = pieOption.series[0].data; 
      const typeIdToSend = isLeaf
        ? findParentNodeId(params.data.id, chartData)
        : params.data.id;

      getTraitBytraitId(typeIdToSend)
        .then((res) => {

          if (!isLeaf) {
            totalPage2.value = res.data.length;
            updatePhenotypeData(res.data);
          } else {
            const leafName = params.data.name;
            const filteredData = res.data.filter(
              (item) => item && item.traitName === leafName
            );

            totalPage2.value = filteredData.length;
            updatePhenotypeData(filteredData);
          }
        })
        .catch((err) => {
          $modal.msg("该性状未被定义");
        });

      // 展开所有子节点
      expandNode(params.data, myChart);
    }
  });
  pieOption && myChart.setOption(pieOption);
}

function expandNode(node, chart) {
  if (node.children) {
    node.children.forEach((child) => {
      chart.dispatchAction({
        type: "expandAndCollapse",
        nodeId: child.id,
        expand: true,
      });
      expandNode(child, chart); 
    });
  }
}


onMounted(() => {
  initHistogram();
  chooseForm()
});
</script>

<style lang="less" scoped>
.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* 所有标签 */


  .echart_wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
    .bgc-img{
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.3;
    }
    .trait-form {
      width: 100%;
      margin-top: -50px;
    }
  }



.card-container {
  width: 95%;
  border-radius: 50px;
}

.card-container .SearchBox-card {
  border-radius: 20px;
}

.big-wrapper {
  width: 100%;
}


.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  border-radius: 20px;
}

:deep(.el-table__header){
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;

  th{
    font-weight: 800;
    //color: 909399;
    font-size: 16PX;
    background: #FAFAFA !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}
.mokuai {
  margin-bottom: 0;
  background-color: rgb(183, 202, 189);
}

.right-box {
  margin-left: 20px;
}

.form_choose {
  display: flex;
  flex-direction: column;

  .el-radio-group {
    margin: 20px 0;
  }

  .el-button {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

canvas{
  margin: 0 auto;
}
</style>


<!-- 卡片样式 -->

<style lang="less" scoped>

.card-container{
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
