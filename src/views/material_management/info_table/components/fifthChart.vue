<template>
  <ZeamapCard>
    <template slot="header">
      <Title>第五个chart</Title>
    </template>
      <div id="fifthChart"></div>
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
      // 初始化每一个节点
      let colors = [
        "#FDFE01",
        "#FE7C7A",
        "#FDFE01",
        "#FF0000",
        "#00FFFE",
        "#FD7D01",
        "#0201FE",
        "#0201FE",
        "#027EFD",
        "#ffffff",
      ];
      const svg = (
        label1,
        c1,
        c2,
        c3,
        c4,
        stroke1,
        stroke2,
        strokeWidth,
        textBgColor
      ) => {
        return (
          '<svg  xmlns="http://www.w3.org/2000/svg" width="400" height="200"  stroke="#970404">' +
          '<foreignObject x="0" y="0" width="100%" height="100%" stroke-width="10" >' +
          `<div xmlns="http://www.w3.org/1999/xhtml" style="background-color:${textBgColor};height:100%;line-height:100px;color:#010002;  font-size:95px;text-align:center;border:1px solid #000" >` +
          "<span >" +
          ` ${label1}</span>` +
          "</div>" +
          "</foreignObject>" +
          `<rect x="0" y="100" width="25%" height="50%" fill="${c1}" stroke="${stroke2}" ></rect>` +
          `<rect x="100" y="100" width="25%" height="50%" fill="${c2}" stroke="${stroke2}" ></rect>` +
          `<rect x="200" y="100" width="25%" height="50%" fill="${c3}" stroke="${stroke2}" ></rect>` +
          `<rect x="300" y="100" width="25%" height="50%" fill="${c4}" stroke="${stroke2}"></rect>` +
          `<rect x="0" y="0" width="100%" height="100%" fill="transparent"  stroke="red"  stroke-width="${strokeWidth}"></rect>` +
          "</svg>"
        );
      };

      const url = ({
        label1,
        c1 = "#CDCBCE",
        c2 = "#CDCBCE",
        c3 = "#CDCBCE",
        c4 = "#CDCBCE",
        stroke1 = "#CDCBCE",
        stroke2 = "#CDCBCE",
        strokeWidth = 0,
        textBgColor = "#CDCBCE",
      }) => {
        return (
          "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            svg(
              label1,
              c1,
              c2,
              c3,
              c4,
              stroke1,
              stroke2,
              strokeWidth,
              textBgColor
            )
          )
        );
      };

      let nodeArr = [
        { id: 1, label: "KA1", color: "#DAD5D0" },
        { id: 2, label: "KA2", color: "#DAD5D0" },
        { id: 3, label: "KA3", color: "#DAD5D0" },
        { id: 4, label: "KA4", color: "#DAD5D0" },
        { id: 5, label: "KA5", color: "#DAD5D0" },
        { id: 6, label: "KA6", color: "#DAD5D0" },
        { id: 7, label: "KA7", color: "#DAD5D0" },
        { id: 8, label: "KA8", color: "#DAD5D0" },
        { id: 9, label: "KA9", color: "#DAD5D0" },
        { id: 10, label: "KA10", color: "#00FE00" },
        { id: 11, label: "KA11", color: "#FD0000" },
        { id: 12, label: "KA12", color: "#FD0000" },
        { id: 13, label: "KA13", color: "#FD0000" },
        { id: 14, label: "KA14", color: "#FD0000" },
        { id: 17, label: "KA17", color: "#00FE00" },
        { id: 18, label: "KA18", color: "#00FE00" },
      ];

      console.log("nodeArr:", nodeArr);
      this.nodes = nodeArr;

      // 初始化每一个关系
      this.links = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 7 },
        { from: 2, to: 5 },
        { from: 3, to: 5 },
        { from: 3, to: 6 },
        { from: 6, to: 7 },
        { from: 6, to: 8 },
        { from: 6, to: 9 },
        { from: 4, to: 11 },
        { from: 4, to: 12 },
        { from: 5, to: 13 },
        { from: 5, to: 14 },
        { from: 7, to: 17 },
        { from: 7, to: 17 },
        { from: 8, to: 18 },
        { from: 8, to: 18 },
        { from: 9, to: 10 },
      ];
    },
    initChart() {
      const nodes = new DataSet(this.nodes);

      const edges = new DataSet(this.links);

      const container = document.getElementById("fifthChart");
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        // autoResize:false,
        nodes: {
          borderWidth: 0,
          shape: "box",
        },
        edges: {
          arrows: "to",
        },
        physics: {
          enabled: false,
        },
        layout: {
          // randomSeed:6,
          hierarchical: {
            parentCentralization: false,
            direction: "UD", //层次布局的方向。可选选项为:。简化一下:上-下，下-上，左右，右左。UD, DU, LR, RL
            sortMethod: "directed", //该算法用于根据数据确定节点的级别。可能的选项是:。
            //Hubsize取边缘最多的节点，并将它们放在顶部。在此基础上计算层次结构的其余部分。
            //Directed坚持边的to和from数据。A -> B所以B比A低一级hubsize，有向的
            levelSeparation: 50, //不同层次之间的距离。
          },
        },
      };
      const network = new vis.Network(container, data, options);
    },
  },
};
</script>

<style scoped>
#fifthChart {
  position: relative;
  width: 90%;
  height: 400px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 25px;
}
</style>
