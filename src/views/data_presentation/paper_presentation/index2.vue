<template>
    <body>
      <el-container>
        <el-main>
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <!--搜索框-style="width: 350px;margin-right: 30px" float:auto-->
              <!-- 第一部分搜索框 -->
              <el-card class="SearchBox-card">
               
                <el-input
                  prefix-icon="el-icon-search"
                  v-model="keyword"
                  @click="searchData"
                  clearable
                  placeholder="搜索表型名称"
                  class="searchtable"
                >
                </el-input>
                <div class="input-title">
                  e.g. <span>种类一</span> or <span>种类二</span>or
                  <span>种类三</span>
                </div>
              </el-card>
  
              <!-- 节点列表 根据父节点查询以下子节点 -->
              <div class="gene-clusters-container">
                <div class="gene-title">
                  <div class="gene-title-content">表型内容</div>
                </div>
                <div class="search-input-container">
                  <div class="search-input">
                    <!-- search:
                    <el-input
                      prefix-icon="el-icon-search"
                      v-model="keyword"
                      @keydown.enter.native="searchData"
                      clearable
                      placeholder="Search..."
                      class="gene-search"
                    >
                    </el-input> -->
                  </div>
                  <div class="search-button">
                    <el-button> export </el-button>
                  </div>
                </div>
                <div class="gene-form">
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    class="gene-form-table"
                  >
                    <!-- <el-table-column type="selection" width="55">
                    </el-table-column> -->
                    <el-table-column
                      prop="TM_1_WHY"
                      label="TM_1_WHY"
                    ></el-table-column>
                    <el-table-column
                      prop="Araport11"
                      label="Araport11"
                    ></el-table-column>
                    <el-table-column
                      prop="A1_WHU"
                      label="A1_WHU"
                    ></el-table-column>
                    <el-table-column
                      prop="A2_BGI"
                      label="A2_BGI"
                    ></el-table-column>
                    <el-table-column
                      prop="A2_CRI"
                      label="A2_CRI"
                    ></el-table-column>
                    <el-table-column
                      prop="A2_HAU"
                      label="A2_HAU"
                    ></el-table-column>
                    <el-table-column
                      prop="A2_WHU"
                      label="A2_WHU"
                    ></el-table-column>
                    <el-table-column prop="ANY"></el-table-column>
                  </el-table>
                </div>
                <!-- 分页
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage1"
                  :page-size="100"
                  layout="total, prev, pager, next"
                  :total="1000"
                >
                </el-pagination> -->
              </div>
  
              <!-- 第三部分图表 -->
              <div class="distribution-container">
                <div class="gene-title">
                  <div class="gene-title-content">
                    表型数据信息统计可视化
                  </div>
                </div>
                <div class="gene-description">
                  <div class="gene-description-content">
                    The cluster you submitted are included in all
                    <span>{{ totalNum }}</span> of the 25 genomes,which is
                    <span>{{ currentPercent }}%</span> of the total number of
                    genomes
                  </div>
                </div>
                <div class="echart_wrapper">
                  <div class="description-form">
                    <el-table :data="tableData2" stripe style="width: 100%">
                      <el-table-column prop="Genome_ID" label="Genome ID">
                      </el-table-column>
                      <el-table-column prop="Genome_group" label="Genome group">
                      </el-table-column>
                      <el-table-column prop="Genome_ID" label="Genome ID">
                      </el-table-column>
                      <el-table-column prop="Genome_group" label="Genome group">
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="description-echart">
                    <div id="pieChart"></div>
                  </div>
                </div>
              </div>
  
              <!-- 第四部分function -->
              <div class="function-clusters-container">
                <div class="gene-title">
                  <div class="gene-title-content">
                    表型字段查询
                  </div>
                </div>
                <div class="search-input-container">
                  <div class="search-input">
                    search:
                    <el-input
                      prefix-icon="el-icon-search"
                      v-model="keyword"
                      @click="searchData"
                      clearable
                      placeholder="Search..."
                      class="gene-search"
                    >
                    </el-input>
                  </div>
                  <div class="search-button">
                    <el-button> export </el-button>
                  </div>
                </div>
                <div class="gene-form">
                  <el-table
                    :data="tableData3"
                    tooltip-effect="dark"
                    style="width: 100%"
                    class="gene-form-table"
                  >
                    <el-table-column
                      prop="Genes_in_TM_1_WHY"
                      label="Genes in TM_1_WHY"
                    ></el-table-column>
                    <el-table-column
                      prop="AtGi"
                      label="Homology of AtGi"
                    ></el-table-column>
                    <el-table-column
                      prop="Symbol"
                      label="Symbol"
                    ></el-table-column>
                    <el-table-column
                      prop="Full_name"
                      label="Full_name"
                    ></el-table-column>
                    <el-table-column
                      prop="Function_discription"
                      label="Function_discription"
                    ></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </body>
  </template>
  
  <script setup>
  import * as echarts from "echarts";
  import { ref, reactive, onMounted } from "vue";
  
  onMounted(() => {
    initHistogram();
  });
  
  const keyword = ref("");
  const tableData = reactive([
    {
      TM_1_WHY: "Ghi_AD4G00086",
      Araport11: "111",
      A1_WHU: "000",
      A2_BGI: "999",
      A2_CRI: "888",
      A2_HAU: "ooo",
      A2_WHU: "ppp",
      ANY: "iii",
    },
    {
      TM_1_WHY: "Ghi_AD4G00086",
      Araport11: "111",
      A1_WHU: "000",
      A2_BGI: "999",
      A2_CRI: "888",
      A2_HAU: "ooo",
      A2_WHU: "ppp",
      ANY: "iii",
    },
    {
      TM_1_WHY: "Ghi_AD4G00086",
      Araport11: "111",
      A1_WHU: "000",
      A2_BGI: "999",
      A2_CRI: "888",
      A2_HAU: "ooo",
      A2_WHU: "ppp",
      ANY: "iii",
    },
    {
      TM_1_WHY: "Ghi_AD4G00086",
      Araport11: "111",
      A1_WHU: "000",
      A2_BGI: "999",
      A2_CRI: "888",
      A2_HAU: "ooo",
      A2_WHU: "ppp",
      ANY: "iii",
    },
  ]);
  const tableData2 = reactive([
    {
      Genome_ID: "A1_WHU",
      Genome_group: "A1",
    },
  ]);
  const tableData3 = reactive([
    {
      Genes_in_TM_1_WHY: "A1_WHU",
      AtGi: "A1_WHU",
      Symbol: "A1",
      Full_name: "djaskhdjk",
      Function_discription: "jdfhgjksdhyksujdfhykjasdfhskhfjksdhfjksdasdasd",
    },
  ]);
  const tableData4 = reactive([
    {
      Genome: "Ghi_AD4G00086",
      Gene: "111",
      Action: "000",
      Chr: "999",
      Start: "888",
      End: "ooo",
    },
  ]);
  const multipleSelection = ref([]);
  const currentPage1 = ref(5);
  const totalNum = ref(20);
  const pieData = ref([
    {
      value: 5,
    },
    {
      value: 20,
    },
  ]);
  const pieName = ref([]);
  
  function initHistogram() {
    let chartDom = document.querySelector("#pieChart");
    let myChart = echarts.init(chartDom);
    let option;
  
    option = {
      legend: {
        // 图例
        data: ["Exclude", "Include"],
        right: "0%",
        top: "30%",
        orient: "vertical",
      },
      series: [
        {
          type: "pie", // type设置为饼图
          label: {
            show: true,
            formatter: "{d} %", // b代表名称，c代表对应值，d代表百分比
          },
          radius: "50%",
          data: [
            {
              name: "Exclude",
              value: 5,
            },
            {
              name: "Include",
              value: 20,
            },
          ],
        },
      ],
    };
  
    option && myChart.setOption(option);
  }
  
  function handleSizeChange(val) {
    console.log(`每页 ${val} 条`);
  }
  function handleCurrentChange(val) {
    console.log(`当前页: ${val}`);
  }
  
  </script>
  
  <style scoped>
  .card-container {
    width: 95%;
    border-radius: 50px;
    margin: auto;
  }
  
  .card-container .SearchBox-card {
    border-radius: 20px;
  }
  
  .big-wrapper {
    width: 90%;
    margin: auto;
  }
  
  .container-wrapper {
    width: 70%;
    margin: auto;
  }
  
  .searchtable {
    margin-bottom: 20px;
  }
  
  .SearchBox-card {
    margin: 20px;
    margin-bottom: 40px;
  }
  
  .input-title {
    color: grey;
    font-size: 12px;
  }
  
  .input-title span {
    color: rgb(78, 151, 211);
  }
  
  /* //第二部分 */
  .gene-clusters-container {
    margin-bottom: 40px;
  }
  .gene-title {
    background-color: rgb(154, 190, 175);
    color: #fff;
    height: 40px;
    width: 100%;
    margin: 10px auto;
  }
  .gene-title-content {
    float: left;
    margin-left: 20px;
    font-size: 16px;
    line-height: 40px;
  }
  
  .search-input-container {
    display: flex;
    justify-content: space-between;
  }
  
  /*改了但感觉没生效 */
  .search-input {
    line-height: 30px;
    display: flex;
  }
  .search-input :deep(.el-input__inner) {
    height: 30px;
  }
  .search-input :deep(.el-input__prefix) {
    height: 30px;
  }
  .search-input :deep(.el-input__icon) {
    height: 30px;
    line-height: 30px;
  }
  
  .search-button :deep(.el-button) {
    height: 30px;
  }
  
  .gene-form-table {
    margin: 30px 0px;
  }
  
  /* //第三部分 */
  .gene-description {
    margin-bottom: 10px;
  }
  
  .gene-description-content {
    float: left;
    color: grey;
    font-size: 12px;
  }
  
  .gene-description-content span {
    color: black;
  }
  
  .description-form {
    margin-bottom: 40px;
  }
  
  .gene-description {
    display: flex;
    flex-direction: row;
  }
  
  .echart_wrapper {
    display: flex;
    justify-content: space-between;
  }
  
  .description-form {
    width: 55%;
  }
  .description-echart {
    width: 45%;
  }
  
  #pieChart {
    width: 100%;
    height: 300px;
    background: #fff;
  }
  
  /* //搜索框和按钮 */
  
  .search-input-container .search-input {
    color: rgb(85, 123, 116);
  }
  
  .search-input-container .search-input .el-input {
    margin-left: 10px;
    border-block-color: rgb(85, 123, 116);
  }
  .search-input-container .el-button {
    background: rgb(85, 123, 116);
    color: #fff;
    line-height: 1;
    align-items: center;
    padding: 0px 20px;
  }
  
  .search-input-container .el-button:focus,
  .el-button:hover .el-button {
    background: rgb(85, 123, 116);
  }
  </style>