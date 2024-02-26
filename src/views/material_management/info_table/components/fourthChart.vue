<template>
  <ZeamapCard>
    <template slot="header">
      <Title>第四个chart</Title>
    </template>
      <div id="fourthChart"></div>
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
        { id: 1, label1: "A121" },
        { id: 2, label1: "A22" },
        { id: 3, label1: "A23" },
        { id: 4, label1: "A124" },
        { id: 5, label1: "A25" },
        { id: 6, label1: "A126" },
        { id: 7, label1: "A17" },
        { id: 8, label1: "A128" },
        { id: 9, label1: "A129" },
        { id: 10, label1: "A1210" },
      ];
      nodeArr.map((i) => {
        i.shape = "box";
        i.image =
          i.id < 6
            ? url({
                label1: i.label1,
                strokeWidth: 40,
                c1: "#316501",
                c2: "#316501",
                c3: "#316501",
                c4: "#316501",
                textBgColor: "#FFBAA5",
              })
            : url({
                label1: i.label1,
                strokeWidth: i.id < 6 ? 20 : 0,
                c1: i.id < 6 ? "#316501" : "#CDCBCE",
                c2: i.id < 6 ? "#316501" : "#CDCBCE",
                c3: i.id < 6 ? "#316501" : "#CDCBCE",
                c4: i.id < 6 ? "#316501" : "#CDCBCE",
                textBgColor: i.id < 6 ? "#FFBAA5" : "#CDCBCE",
              });
        i.shape = "image";
        i.borderwidth = 4;
      });

      console.log("nodeArr:", nodeArr);
      this.nodes = nodeArr;

      // 初始化每一个关系
      this.links = [
        {
          from: 1,
          to: 2,
          color: "#FF0000",
          background: {
            enabled: true,
            color: "#FF0000",
            size: 8,
          },
        },
        {
          from: 1,
          to: 3,
          color: "#FF0000",
          background: {
            enabled: true,
            color: "#FF0000",
            size: 8,
          },
        },
        {
          from: 2,
          to: 4,
          color: "#FF0000",
          background: {
            enabled: true,
            color: "#FF0000",
            size: 8,
          },
        },
        {
          from: 2,
          to: 5,
          color: "#FF0000",
          background: {
            enabled: true,
            color: "#FF0000",
            size: 8,
          },
        },
        {
          from: 3,
          to: 5,
          color: "#FF0000",
          background: {
            enabled: true,
            color: "#FF0000",
            size: 8,
          },
        },
        { from: 2, to: 7 },
        { from: 3, to: 6 },
        { from: 6, to: 7 },
        { from: 6, to: 8 },
        { from: 6, to: 9 },
        { from: 9, to: 10 },
      ];
    },
    initChart() {
      const nodes = new DataSet(this.nodes);

      const edges = new DataSet(this.links);

      const container = document.getElementById("fourthChart");
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        // autoResize:false,
        nodes: {
          borderWidth: 4,
        },
        physics: {
          enabled: false,
        },
        edges: {
          //   shadow: true,
          smooth: true,
          color: "#000",
          background: {
            // enabled: true,
            color: "#000",
          },
          font: "120px arial #ff0000",
        },
        layout: {
          // randomSeed:6,
          hierarchical: {
            nodeSpacing: 150,
            parentCentralization: false,
            nodeSpacingL: 1000, // 自由轴上节点之间的最小距离。这只是用于初始布局。如果启用了物理，那么这里的节点距离就是有效节点距离。
            direction: "DU", //层次布局的方向。可选选项为:。简化一下:上-下，下-上，左右，右左。UD, DU, LR, RL
            sortMethod: "directed", //该算法用于根据数据确定节点的级别。可能的选项是:。
            //Hubsize取边缘最多的节点，并将它们放在顶部。在此基础上计算层次结构的其余部分。
            //Directed坚持边的to和from数据。A -> B所以B比A低一级hubsize，有向的
            levelSeparation: 100, //不同层次之间的距离。
          },
        },
      };
      const network = new vis.Network(container, data, options);
    },
  },
};
</script>

<style scoped>
#fourthChart {
  position: relative;
  width: 90%;
  height: 400px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 25px;
}
</style>
