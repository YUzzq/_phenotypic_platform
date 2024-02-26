<template>
  <!-- <div style="
      background: #f6f6f6;
      min-height: 91vh;
      padding: 10px;
      border: 1px solid #f6f6f6;
    ">
    <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
      ">
      关系图
    </div>
    <div style="position: relative">
      <div style="
          background: green;
          height: 3px;
          width: 50px;
          position: absolute;
          left: 10px;
          top: 10px;
        "></div>
      <div style="position: absolute;left: 65px;top: 0px;">父本</div>
      <div style="
          background: red;
          height: 3px;
          width: 50px;
          position: absolute;
          left: 100px;
          top: 10px;
        "></div>
      <div style="position: absolute;left: 155px;top: 0px;">母本</div>
      <div style="float: right">
        <el-button type="primary" @click="screenshotAndSave"><el-icon>
            <Download />
          </el-icon></el-button>
      </div>
      <div id="mynetwork" style="
          width: 100%;
          height: 70vh;
          border: none;
          background: #fff;
          border-radius: 10px;
        "></div>
    </div>
  </div> -->
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>关系图</span>
      </div>
    </template>

    <first-chart></first-chart>
    <second-chart></second-chart>
    <third-chart></third-chart>
    <fourth-chart></fourth-chart>
    <fifth-chart></fifth-chart>
    <sixth-chart></sixth-chart>
    <seventh-chart></seventh-chart>
    <eighth-chart></eighth-chart>
  </el-card>
</template>
<!-- <script setup>
import { getRelations } from "../../../api/material";
import html2canvas from "html2canvas";
import {
  DataSet,
  Network,
} from "vis-network/standalone/umd/vis-network.min.js";
const route = useRoute();
const options = [];

const fetchGraph = () => {
  getRelations(route.query.id).then((res) => {
    console.log(route.query.id)
    let relations = res.data;
    console.log(res.data)
    const nodeArr = [],
      edgeArr = [];
    const uniqueNodes = new Set();

    relations.forEach((relation, index) => {
      if (!uniqueNodes.has(relation.material_id)) {
        nodeArr.push({
          id: relation.material_id,
          label: relation.material_id,
          color: "#f6f6f6",
          shape: "box",
        });
        uniqueNodes.add(relation.material_id);
      }
      if (!uniqueNodes.has(relation.parent)) {
        nodeArr.push({
          id: relation.parent,
          label: relation.parent,
          color: "#f6f6f6",
          shape: "box",
        });
        uniqueNodes.add(relation.parent);
      }
      edgeArr.push({
        from: relation.parent,
        to: relation.material_id,
        color: relation.flag === 1 ? "#EE0001" : "#83EC86",
      });
    });

    var nodes = new DataSet(nodeArr);
    var edges = new DataSet(edgeArr);

    const container = document.getElementById("mynetwork");

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          parentCentralization: false,
          direction: "DU",
          sortMethod: "directed",
          levelSeparation: 50,
        },
      },
    };

    new Network(container, data, options);
  });
};

fetchGraph();
const screenshotAndSave = () => {
  const canvas = document.createElement("canvas");
  let canvasBox = document.getElementById("mynetwork");
  const width = parseInt(window.getComputedStyle(canvasBox).width);
  const height = parseInt(window.getComputedStyle(canvasBox).height);
  canvas.width = width * 4;
  canvas.height = height * 4;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  const options = {
    backgroundColor: null,
    canvas: canvas,
    useCORS: true,
  };
  html2canvas(canvasBox, options).then((canvas) => {
    let dataURL = canvas.toDataURL("image/png");
    downloadImage(dataURL);
  });
};
//下载图片
const downloadImage = (url) => {
  let a = document.createElement("a");
  a.href = url;
  a.download = "首页截图";
  a.click();
};
</script> -->


<script>
import firstChart from "./components/firstChart.vue";
import secondChart from "./components/secondChart.vue";
import thirdChart from "./components/thirdChart.vue";
import fourthChart from "./components/fourthChart.vue";
import fifthChart from "./components/fifthChart.vue";
export default {
  components: {
    firstChart,
    secondChart,
    thirdChart,
    fourthChart,
    fifthChart,
  },
};
</script>
<style scoped>
#mynetwork {
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
}
</style>


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