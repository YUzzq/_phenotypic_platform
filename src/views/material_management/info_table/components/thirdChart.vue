<template>
  <ZeamapCard>
    <template slot="header">
      <Title>第三个chart</Title>
    </template>
      <div id="thirdChart"></div>
      <!-- <div class="balnk" style="height: 500px"></div> -->
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" stroke-width="1" stroke="#B1B1B1">
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="background-color:#CDCBCE;height:100%;line-height:100px;color:#474A47;  font-size:95px;text-align:center;border:1px solid #000">
            <span style="color:#4C4750;">
              EE26
            </span>
          </div>
        </foreignObject>
        <rect x="0" y="10" width="25%" height="50%" fill="#0E02EE"></rect>
        <rect x="10" y="10" width="25%" height="50%" fill="#F3030D"></rect>
        <rect x="20" y="10" width="25%" height="50%" fill="#00FF02"></rect>
        <rect x="30" y="10" width="25%" height="50%" fill="#14F2F6"></rect>
      </svg> -->
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
      const svg = () => {
        return (
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" stroke-width="1" stroke="#B1B1B1">' +
          '<foreignObject x="0" y="0" width="100%" height="100%">' +
          '<div xmlns="http://www.w3.org/1999/xhtml" style="background-color:#CDCBCE;height:100%;line-height:100px;color:#010002;  font-size:95px;text-align:center;border:1px solid #000" >' +
          "<span >" +
          " EE26</span>" +
          "</div>" +
          "</foreignObject>" +
          `<rect x="0" y="100" width="25%" height="50%" fill="${
            colors[Math.floor(Math.random() * colors.length)]
          }"  ></rect>` +
          '<rect x="100" y="100" width="25%" height="50%" fill="#CDCBCE" stroke="#CDCBCE"  ></rect>' +
          '<rect x="200" y="100" width="25%" height="50%" fill="#CDCBCE" stroke="#CDCBCE" ></rect>' +
          '<rect x="300" y="100" width="25%" height="50%" fill="#CDCBCE" stroke="#CDCBCE"></rect>' +
          "</svg>"
        );
      };
      const url = () => {
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg());
      };

      let nodeArr = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ];
      nodeArr.map((i) => {
        i.shape = "box";
        i.image = url();
        i.shape = "image";
      });

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
        { from: 9, to: 10 },
      ];
    },
    initChart() {
      const nodes = new DataSet(this.nodes);

      const edges = new DataSet(this.links);

      const container = document.getElementById("thirdChart");
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        physics: {
          enabled: false,
        },
        edges: {
          color: "#000",
        },
        layout: {
          hierarchical: {
            // enabled:false,
            nodeSpacing: 150,
            parentCentralization: false,
            nodeSpacingL: 1000,
            direction: "DU",
            sortMethod: "directed",
            levelSeparation: 100,
          },
        },
      };
      const network = new vis.Network(container, data, options);
    },
  },
};
</script>

<style scoped>
#thirdChart {
  position: relative;
  width: 90%;
  height: 400px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 25px;
}
</style>
