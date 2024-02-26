<template>
    <ZeamapCard>
      <template slot="header">
        <Title>第二个chart</Title>
      </template>
      <div id="secondChart"></div>
    </ZeamapCard>
</template>

<script>
import * as vis from "vis-network";
import { DataSet } from "vis-data";
export default {
  data() {
    return {
      nodes: [],
      links: [],
    };
  },
  mounted() {
    this.initData();
    this.initChart();
  },
  methods: {
    initData() {
      // 初始化节点
      let nodeArr = [
        { id: 1, label: "EF17", level: 10, shape: "box", color: "#EE0001" },
        { id: 2, label: "EF42", level: 10, color: "#FEBF5A", shape: "box" },
        { id: 3, label: "ED43", level: 10, color: "#FEBF5A", shape: "box" },
        { id: 4, label: "EE3DT", level: 9, color: "#FEBF5A", shape: "box" },
        { id: 5, label: "ED705", level: 9, color: "#FEBF5A", shape: "box" },
        { id: 6, label: "ED235", level: 8, color: "#FEBF5A", shape: "box" },
        { id: 7, label: "ED235", level: 8, color: "#FEBF5A", shape: "box" },
        { id: 8, label: "ED235", level: 8, color: "#FEBF5A", shape: "box" },
        { id: 9, label: "ED235", level: 8, color: "#FEBF5A", shape: "box" },
      ];
      nodeArr.filter((i) => {
        i.id < 8 && i.id > 1 && (i.color = "#83EC86");
      });

      console.log("🚀 ~ file: 1.html:33 ~ nodeArr.forEach ~ nodeArr:", nodeArr);
      for (let i = 10; i < 60; i++) {
        nodeArr.push({
          id: i,
          label: "EE224",
          color: "#ccc",
          shape: "box",
          level: Math.floor(i / 10),
        });
      }

      this.nodes = nodeArr;

      // 初始化关系线
      const edgesArr = [
        { from: 1, to: 4 },
        { from: 4, to: 6 },
        { from: 2, to: 5 },
        { from: 3, to: 5 },
        { from: 4, to: 6 },
        { from: 4, to: 7 },
        { from: 4, to: 8 },
        { from: 4, to: 9 },
        { from: 5, to: 6 },
        { from: 5, to: 7 },
        { from: 5, to: 8 },
        { from: 5, to: 9 },

        // {from: 3, to: 6},
        // {from: 3, to: 6},
        // {from: 3, to: 6},
      ];
      for (let i = 10; i < 60; i++) {
        edgesArr.push({
          from: 4,
          to: i,
        });
      }
      this.links = edgesArr;
    },
    initChart() {
      const nodes = new DataSet(this.node);
      const links = new DataSet(this.links);
      const container = document.getElementById("secondChart");

      var data = {
        nodes: this.nodes,
        edges: this.links,
      };
      var options = {
        // autoResize:false,
        nodes: {
          font: {
            size: 25,
          },
        },
        physics: {
          enabled: false,
        },
        layout: {
          // randomSeed:6,
          // randomSeed:6,
          hierarchical: {
            nodeSpacing: 150,
            // parentCentralization: false,
            direction: "DU", //层次布局的方向。可选选项为:。简化一下:上-下，下-上，左右，右左。UD, DU, LR, RL
            sortMethod: "directed", //该算法用于根据数据确定节点的级别。可能的选项是:。
            //Hubsize取边缘最多的节点，并将它们放在顶部。在此基础上计算层次结构的其余部分。
            //Directed坚持边的to和from数据。A -> B所以B比A低一级hubsize，有向的
          },
        },
      };

      // initialize your network!
      var network = new vis.Network(container, data, options);
    },
  },
};
</script>

<style scoped>
#secondChart {
  position: relative;
  width: 90%;
  height: 800px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 25px;
}
</style>