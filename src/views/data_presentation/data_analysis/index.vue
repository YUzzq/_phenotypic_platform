<template>
  <div
    style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    "
  >
  <!-- 地图 -->
    <div class="big_container home" style="margin-top: 10px">
      <!-- 地图 -->
      <el-card class="card-container">
        <div class="big-wrapper" style="margin-top: 10px">
          <div class="map_sys">
            <!-- 城市表格 -->
            <div class="city_form">
              <el-form label-width="100px" :model="cityForm">
                <el-form-item label="城市">
                  <el-input disabled v-model="cityForm.city" />
                </el-form-item>
                <el-form-item label="国家">
                  <el-input disabled v-model="cityForm.country" />
                </el-form-item>
                <el-form-item label="经度">
                  <el-input disabled v-model="cityForm.longitude" />
                </el-form-item>
                <el-form-item label="纬度">
                  <el-input disabled v-model="cityForm.latitude" />
                </el-form-item>
              </el-form>
            </div>
            <!-- 地图 -->
            <div id="chinaMap" style="width: 650px; height: 400px"></div>
          </div>
        </div>
      </el-card>
    </div>
    <el-container
      style="padding: 20px; border: 1px solid #eee"
      :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!--树-->
      <el-aside
        width="20%"
        class="mokuai card shadow"
        style="min-height: calc(100vh - 180px)"
      >
        <el-tree
          ref="tree"
          :data="routesData"
          :props="defaultProps"
          node-key="treeId"
          default-expand-all
          highlight-current
          :current-node-key="1"
          @node-click="rowClick"
          class="permission-tree"
          :check-strictly="true"
          :check-on-click-node="true"
          :expand-on-click-node="false"
        />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0" class="right-box">
        <el-card class="card-container">
          <div
            v-if="fileList.length"
            class="big-wrapper"
            style="margin-top: 10px"
          >
            <div class="form_choose">
              <div class="node-title" style="width: 150px; margin-left: 0px">
                <div class="node-title-content" style="margin: auto 25px">
                  表型文件选择
                </div>
              </div>
              <el-radio-group
                :disabled="histogramLoading === true"
                v-model="declaredDates"
                @change="handleCheckedDatesChange"
              >
                <el-radio
                  :disabled="histogramLoading === true"
                  v-for="date in fileList"
                  :key="date"
                  :label="date"
                  >{{ date.fileName }}</el-radio
                >
              </el-radio-group>
              <el-button @click="chooseForm"> 确定 </el-button>
            </div>
          </div>
          <div v-else>此节点下无文件</div>
        </el-card>

        <div v-show="traitChoosed" class="gene-form">
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <el-table
                ref="multipleTable"
                :data="
                  tableData.slice(
                    (currentpageNum - 1) * pageSize,
                    currentpageNum * pageSize
                  )
                "
                tooltip-effect="dark"
                style="margin: 30px auto"
                class="trait-form-table"
              >
                <el-table-column
                  v-for="column in columns"
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                ></el-table-column>
              </el-table>
              <el-pagination
                background
                :total="totalPage"
                :current-page="currentpageNum"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </div>
        <div v-show="traitChoosed" class="phenome-container">
          <div class="title">
            <div class="node-title">
              <div class="node-title-content">Phenome</div>
            </div>
          </div>
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <div class="echart_wrapper">
                <div id="traitPanMap" style="width: 400px; height: 450px"></div>
                <div class="trait-form">
                  <el-button>Download</el-button>
                  <el-table
                    :data="
                      phenotypeData.slice(
                        (currentpageNum2 - 1) * pageSize2,
                        currentpageNum2 * pageSize2
                      )
                    "
                    stripe
                    style="width: 100%; margin: 50px auto"
                  >
                    <el-table-column prop="traitId" label="trait ID">
                    </el-table-column>
                    <el-table-column prop="traitName" label="trait name">
                    </el-table-column>
                    <el-table-column prop="fullName" label="trait fullName">
                    </el-table-column>
                    <el-table-column prop="remark" label="remark">
                    </el-table-column>
                    <el-table-column
                      prop="abbreviationName"
                      label="abbreviationName"
                    >
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
        </div>

        <!--试验总结-->
        <div class="big_container home" v-show="laboratoryShow">
          <div class="title">
            <div class="node-title">
              <div class="node-title-content">试验总结</div>
            </div>
          </div>
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <!-- 第一部分搜索框 -->
              <el-card class="SearchBox-card">
                <div class="laboratory_top">
                  <div class="search_table">
                    <el-select
                      v-model="traitValue"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="remoteMethod"
                      :loading="reqLoading"
                      @change="Screening(value)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button style="margin-left: 10px" @click="search_trait"
                      >搜索</el-button
                    >
                  </div>
                </div>
                <div class="input-title">
                  e.g. <span>种类一</span> or <span>种类二</span>or
                  <span>种类三</span>
                </div>
              </el-card>
            </div>
          </el-card>
          <el-card class="card-container" v-show = "laboratorFormShow">
            <div class="big-wrapper" style="margin-top: 10px">
              <!--  第二部分表单 -->
              <div class="labotatory_form">
                <el-table
                  ref="multipleTable"
                  :data="tableData2"
                  tooltip-effect="dark"
                  style="width: 90%; margin: 30px auto"
                  class="trait-form-table"
                >
                  <el-table-column
                    prop="triatId"
                    label="性状代码"
                  ></el-table-column>
                  <el-table-column
                    prop="traitName"
                    label="性状名"
                  ></el-table-column>
                  <el-table-column
                    prop="average"
                    label="平均值"
                  ></el-table-column>
                  <el-table-column
                    prop="maxNum"
                    label="最大值"
                  ></el-table-column>
                  <el-table-column
                    prop="minNum"
                    label="最小值"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
  
  <script setup>
import * as echarts from "echarts";
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { getTree } from "@/api/tree";
import { listFile } from "@/api/infomanage/phenoType";
import {
  getTraitFormByFileId,
  getallTraitByfileId,
  getTraitBytraitId,
  selectTraitColByFileId,
} from "@/api/data_presentation/trait_management";
import {
  getMap,
  getTraitByCity,
  selectTraitByLocation,
} from "@/api/data_presentation/area_management";
import {
  getDataByFormId,
  getLocationByTraitId,
  getMaterialIdByFileId,
  dataAnalysisByMaterilId
} from "@/api/data_presentation/laboratory_management";
import "echarts/map/js/china.js";
import { FIRST_LAST_KEYS } from "element-plus";

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();


//多试验分析相关
const laboratoryShow = ref(false);
const traitValue = ref("");


const tableData2 = reactive([
  {
    traitId: 266,
    traitName: "茎腐病",
    average: 0.0,
    maxNum: 0.0,
    minNum: 0.0,
  }
]);

//用于更新tableData的函数
function updateTableData(data) {
  tableData2.splice(0, tableData2.length, ...data);
}

const traitFileId = ref(1);

const laboratorFormShow = ref(false)

function search_trait() {
  console.log(traitValue.value, "9090");
  const materilId = traitValue.value;
  const id = traitFileId.value
  dataAnalysisByMaterilId(
    id,
    materilId
  )
    .then((res) => {
      laboratorFormShow.value = true;
      updateTableData(res.data);
      console.log(res,'res');
    })
    .catch((err) => {
      console.error(err);
    });
}


//选择框
const value = ref("");
const reqLoading = ref(false);
const options = ref([]);

function remoteMethod(query) {
  if (query !== "") {
    reqLoading.value = true;
    setTimeout(() => {
      reqLoading.value = false;
      //输入关键词后显示的列表
      options.value = listSet.value.filter((item) => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    }, 200);
  } else {
    options.value = [];
  }
}

const states = ref(["110", "110", "120", "900", "800", "700"]);

const listSet = computed(() => {
  return states.value.map((item) => {
    return { value: item, label: item };
  });
});

watch(states, () => {
  // Update the listSet when states change
  listSet.value = states.value.map((item) => {
    return { value: item, label: item };
  });
});

//城市
const cityForm = ref({
  city: "",
  country: "",
  longitude: "",
  latitude: "",
});


//获得地图信息
function getMaps() {
  getMap().then((res) => {
    console.log(res, "jjj");
    if (res.code === 200) {
      const mapData = MapOption.series[0].data;
      res.data.forEach((item) => {
        const { count, location } = item;
        const mapItem = mapData.find((dataItem) => dataItem.name === location);
        if (mapItem) {
          mapItem.value = count;
        }
      });
    }
    console.log(MapOption.series[0].data);
    initCharts();
  });
}


//地图数据
const MapOption = {
  series: [
    {
      type: "map",
      map: "china",
      layoutCenter: ["40%", "50%"], // 地图布局中心点
      layoutSize: 270,
      label: {
        show: FIRST_LAST_KEYS,
        color: "#ffffff",
        fontSize: 10,
      },
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#24dafe",
      },
      roam: false,
      zoom: 1.7, // 初始缩放级别
      scaleLimit: { min: 1, max: 5 }, // 设置缩放范围
      emphasis: {
        label: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
        },
        itemStyle: {
          areaColor: "none",
          borderColor: "#ff",
          borderWidth: 2,
        },
      },
      data: [
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "上海", value: 0 },
        { name: "重庆", value: 0 },
        { name: "河北", value: 0 },
        { name: "河南", value: 0 },
        { name: "云南", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "湖南", value: 0 },
        { name: "安徽", value: 0 },
        { name: "山东", value: 0 },
        { name: "新疆", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "江西", value: 0 },
        { name: "湖北", value: 0 },
        { name: "广西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "陕西", value: 0 },
        { name: "吉林", value: 0 },
        { name: "福建", value: 0 },
        { name: "贵州", value: 0 },
        { name: "广东", value: 0 },
        { name: "青海", value: 0 },
        { name: "西藏", value: 0 },
        { name: "四川", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "海南", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 },
      ],
    },
  ],
  visualMap: [
    {
      type: "piecewise",
      show: false,
      pieces: [
        { min: 0, max: 0 },
        { min: 0, max: 9999 },
      ],
      textStyle: {
        color: "#828994",
      },
      itemWidth: 64, // 每个图元的宽度
      itemHeight: 12,
      top: "top",
      right: "0",
      inRange: {
        borderRadius: 4,
        color: ["#70b4ff", "rgb(105, 171, 218)"],
      },
    },
  ],
  tooltip: {
    trigger: "item", //数据项图形触发
    backgroundColor: "#fff",
    borderWidth: 0,
    formatter: "地区：{b}<br/>数据：{c}",
  },
  toolbox: {
    show: false,
    orient: "vertical",
    left: "right",
    bottom: "0",
    feature: {
      restore: {},
      saveAsImage: {},
    },
  },
};

let provinceData = {
  北京: {
    city: "北京",
    country: "中国",
    longitude: "116.4074",
    latitude: "39.9042",
  },
  天津: {
    city: "天津",
    country: "中国",
    longitude: "117.2008",
    latitude: "39.0840",
  },
  河北: {
    city: "河北",
    country: "中国",
    longitude: "114.5025",
    latitude: "38.0455",
  },
  山西: {
    city: "山西",
    country: "中国",
    longitude: "112.5489",
    latitude: "37.8706",
  },
  内蒙古: {
    city: "内蒙古",
    country: "中国",
    longitude: "111.7510",
    latitude: "40.8415",
  },
  辽宁: {
    city: "辽宁",
    country: "中国",
    longitude: "123.4315",
    latitude: "41.8057",
  },
  吉林: {
    city: "吉林",
    country: "中国",
    longitude: "125.3235",
    latitude: "43.8171",
  },
  黑龙江: {
    city: "黑龙江",
    country: "中国",
    longitude: "126.5350",
    latitude: "45.8038",
  },
  上海: {
    city: "上海",
    country: "中国",
    longitude: "121.4737",
    latitude: "31.2304",
  },
  江苏: {
    city: "江苏",
    country: "中国",
    longitude: "118.7969",
    latitude: "32.0603",
  },
  浙江: {
    city: "浙江",
    country: "中国",
    longitude: "120.1551",
    latitude: "30.2741",
  },
  安徽: {
    city: "安徽",
    country: "中国",
    longitude: "117.2857",
    latitude: "31.8616",
  },
  福建: {
    city: "福建",
    country: "中国",
    longitude: "119.2965",
    latitude: "26.0745",
  },
  江西: {
    city: "江西",
    country: "中国",
    longitude: "115.8169",
    latitude: "28.6366",
  },
  山东: {
    city: "山东",
    country: "中国",
    longitude: "117.0009",
    latitude: "36.6753",
  },
  河南: {
    city: "河南",
    country: "中国",
    longitude: "113.6654",
    latitude: "34.7570",
  },
  湖北: {
    city: "湖北",
    country: "中国",
    longitude: "114.2986",
    latitude: "30.5951",
  },
  湖南: {
    city: "湖南",
    country: "中国",
    longitude: "112.9823",
    latitude: "28.1941",
  },
  广东: {
    city: "广东",
    country: "中国",
    longitude: "113.2644",
    latitude: "23.1291",
  },
  广西: {
    city: "广西",
    country: "中国",
    longitude: "108.3275",
    latitude: "22.8152",
  },
  海南: {
    city: "海南",
    country: "中国",
    longitude: "110.3492",
    latitude: "20.0174",
  },
  重庆: {
    city: "重庆",
    country: "中国",
    longitude: "106.5516",
    latitude: "29.5630",
  },
  四川: {
    city: "四川",
    country: "中国",
    longitude: "104.0758",
    latitude: "30.6519",
  },
  贵州: {
    city: "贵州",
    country: "中国",
    longitude: "106.7072",
    latitude: "26.5982",
  },
  云南: {
    city: "云南",
    country: "中国",
    longitude: "102.7123",
    latitude: "25.0406",
  },
  西藏: {
    city: "西藏",
    country: "中国",
    longitude: "91.1172",
    latitude: "29.6469",
  },
  陕西: {
    city: "陕西",
    country: "中国",
    longitude: "108.9542",
    latitude: "34.2655",
  },
  甘肃: {
    city: "甘肃",
    country: "中国",
    longitude: "103.8263",
    latitude: "36.0594",
  },
  青海: {
    city: "青海",
    country: "中国",
    longitude: "101.7801",
    latitude: "36.6209",
  },
  宁夏: {
    city: "宁夏",
    country: "中国",
    longitude: "106.2782",
    latitude: "38.4664",
  },
  新疆: {
    city: "新疆",
    country: "中国",
    longitude: "87.6177",
    latitude: "43.7928",
  },
  台湾: {
    city: "台湾",
    country: "中国",
    longitude: "120.9605",
    latitude: "23.6978",
  },
  香港: {
    city: "香港",
    country: "中国",
    longitude: "114.1694",
    latitude: "22.3193",
  },
  澳门: {
    city: "澳门",
    country: "中国",
    longitude: "113.5491",
    latitude: "22.1987",
  },
};

function initCharts() {
  let chinaMap = document.querySelector("#chinaMap");
  let mapcharts = echarts.init(chinaMap);
  MapOption && mapcharts.setOption(MapOption);

  // 地图点击事件处理
  mapcharts.on("click", (params) => {
    let selectedProvince = params.name;

    if (provinceData[selectedProvince]) {
      Object.assign(cityForm.value, provinceData[selectedProvince]);
    } else {
      Object.assign(cityForm.value, {
        city: "",
        country: "",
        longitude: "",
        latitude: "",
      });
    }
  });

  // 窗口大小调整事件处理
  window.addEventListener("resize", () => {
    mapcharts.resize();
  });
}


//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数

const tableLoading2 = ref(false);

const handleSizeChange2 = (val) => {
  pageSize2.value = val;
};

const handleCurrentChange2 = (val) => {
  currentpageNum2.value = val;
  localStorage.setItem("currentPageNum2", val);
};

//树相关
const curFileUrl = ref(""); // 表格日期对应的文件url
// 表格日期
const dates = ref([]);
const fileList = ref([]); // 文件列表

//显示控制
const traitChoosed = ref(false);

// 加载
const loading = ref(false);
const histogramLoading = ref(false);
const loadingText = ref("加载中...");
const histogrM3DShow = ref(false);

// 请求文件列表
function getList() {
  listFile({
    treeId: tree.value.getCurrentNode().treeId,
  })
    .then((res) => {
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.fileStatus === 1,
      }));
      total.value = res.total;
    })
    .catch((err) => {
      //console.log(fileList);
    });
}

// 获取表格日期
function getTableDate() {
  return Object.keys(tableData.value[0]);
}

// 多选框
const declaredDates = ref(null);
function handleCheckedDatesChange(val) {
  console.log(val.fileId, "opop");
}

//用于更新phentypeData的函数
function updatePhenotypeData(data) {
  phenotypeData.splice(0, phenotypeData.length, ...data);
}

//请求性状信息
function chooseForm() {
  traitFileId.value = declaredDates.value.fileId;
  traitChoosed.value = true;
  getTraitFormByFileId(traitFileId.value)
    .then((res) => {
      console.log(res, "bnbn");
      const tableDataValue = [];
      const columnsValue = [];
      totalPage.value = res.data.length;

      if (res.data.length > 0) {
        const firstItem = res.data[0];

        // 生成表头
        Object.keys(firstItem).forEach((key) => {
          const trait = firstItem[key];
          const traitKey = Object.keys(trait)[0];
          const traitName = trait[traitKey].traitName;
          columnsValue.push({ label: traitName, prop: traitKey });
        });

        // 生成表格数据
        res.data.forEach((array) => {
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

      initHistogram();
    })
    .catch((err) => {
      console.error(err);
    });

  selectTraitColByFileId(traitFileId.value)
    .then((res) => {
      if (res.code === 200) {
        totalPage2.value = res.data.length;
        updatePhenotypeData(res.data);
        console.log(phenotypeData, "klkl");
      }
    })
    .catch((err) => {
      console.error(err);
    });

  getallTraitByfileId(traitFileId.value)
    .then((res) => {
      /* console.log(res.data, "hhhh");
        const backendDict = {};
  
        for (const item of res.data) {
          backendDict[item.id] = {
            name: item.name,
            id:item.id,
            children: item.children,
          };
        }
  
        for (const item of res.data) {
          const parentId = item.id;
          if (item.children) {
            for (const child of item.children) {
              backendDict[parentId].children.push({
                name: child.name,
                id: child.id,
                children: child.children,
              });
            }
          }
        }
        console.log(data.value, "jjjj"); */
      traitChoosed.value = true;
      data.children = res.data;
      console.log(data, "jjjj");
      initHistogram();
    })
    .catch((err) => {
      console.error(err);
    });

    getDataByFormId(traitFileId.value)
    .then((res) => {
      laboratoryShow.value = true;
    })
    .catch((err) => {
      console.error(err);
    });

    getMaterialIdByFileId(traitFileId.value).then((res)=>{     
      states.value = res.data;
    }).catch((err) =>{
      console.error(err)
    })
}

// 树控件
const routesData = ref([]);
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = 4;
const tree = ref(null); // 树的dom实例

const getTreeList = () => {
  //调用getTree接口
  getTree(treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    nextTick(() => {
      //getCurrentNode	返回当前被选中节点的数据 (如果没有则返回 null)
      if (!tree.value.getCurrentNode())
        //setCurrentKey	通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key  属性
        tree.value.setCurrentKey(routesData.value[0]?.treeId);
      rowClick(tree.value.getCurrentNode());
    });
  });
};

function rowClick(nodeObj) {
  histogrM3DShow.value = false;
  loading.value = true;
  histogramLoading.value = false;
  traitChoosed.value = false;
  getList();
}

function getDates(dateArr) {
  dates.value = dateArr;
}

/*表格数据 */
/* const tableData = ref([
    {
      traitId: "001",
      traitName: "性状一",
      shortName: "性状1",
      min: 0,
      max: 10,
      A2_HAU: "精度1",
      A2_WHU: "单位1",
      type: "类型1",
      order: 1,
    },
    {
      traitId: "002",
      traitName: "性状二",
      shortName: "性状2",
      min: 5,
      max: 15,
      A2_HAU: "精度2",
      A2_WHU: "单位2",
      type: "类型2",
      order: 2,
    },
    {
      traitId: "001",
      traitName: "性状一",
      shortName: "性状1",
      min: 0,
      max: 10,
      A2_HAU: "精度1",
      A2_WHU: "单位1",
      type: "类型1",
      order: 1,
    },
    {
      traitId: "002",
      traitName: "性状二",
      shortName: "性状2",
      min: 5,
      max: 15,
      A2_HAU: "精度2",
      A2_WHU: "单位2",
      type: "类型2",
      order: 2,
    },
    {
      traitId: "001",
      traitName: "性状一",
      shortName: "性状1",
      min: 0,
      max: 10,
      A2_HAU: "精度1",
      A2_WHU: "单位1",
      type: "类型1",
      order: 1,
    },
    {
      traitId: "002",
      traitName: "性状二",
      shortName: "性状2",
      min: 5,
      max: 15,
      A2_HAU: "精度2",
      A2_WHU: "单位2",
      type: "类型2",
      order: 2,
    },
  ]);
   */

/* const tableData = ref({
    msg: "操作成功",
    code: 200,
    data: [
      [
        {
          trait_id_0: {
            traitName: "含水量",
            fullName: null,
            traitId: "259",
            remark: null,
            abbreviationName: null,
            traitValue: "34.48",
          },
        },
        {
          trait_id_1: {
            traitName: "亩产",
            fullName: null,
            traitId: "260",
            remark: null,
            abbreviationName: null,
            traitValue: "741.200314",
          },
        },
        {
          trait_id_2: {
            traitName: "小区籽粒鲜重",
            fullName: null,
            traitId: "261",
            remark: null,
            abbreviationName: null,
            traitValue: "13.3409386",
          },
        },
        {
          trait_id_3: {
            traitName: "倒伏率",
            fullName: null,
            traitId: "262",
            remark: null,
            abbreviationName: null,
            traitValue: "0.0",
          },
        },
        {
          trait_id_4: {
            traitName: "倒折率",
            fullName: null,
            traitId: "263",
            remark: null,
            abbreviationName: null,
            traitValue: "3.2",
          },
        },
        {
          phenotypeId: "1",
        },
      ],
      [
        {
          trait_id_0: {
            traitName: "含水量",
            fullName: null,
            traitId: "259",
            remark: null,
            abbreviationName: null,
            traitValue: "31.91",
          },
        },
        {
          trait_id_1: {
            traitName: "亩产",
            fullName: null,
            traitId: "260",
            remark: null,
            abbreviationName: null,
            traitValue: "447.3578319",
          },
        },
        {
          trait_id_2: {
            traitName: "小区籽粒鲜重",
            fullName: null,
            traitId: "261",
            remark: null,
            abbreviationName: null,
            traitValue: "8.05203837",
          },
        },
        {
          trait_id_3: {
            traitName: "倒伏率",
            fullName: null,
            traitId: "262",
            remark: null,
            abbreviationName: null,
            traitValue: "0.0",
          },
        },
        {
          trait_id_4: {
            traitName: "倒折率",
            fullName: null,
            traitId: "263",
            remark: null,
            abbreviationName: null,
            traitValue: "0.0",
          },
        },
        {
          phenotypeId: "2",
        },
      ],
    ],
  });
   */

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

const data = reactive({
  name: "植物性状",
  children: [
    {
      name: "性状一",
      id: "1",
      children: [
        {
          name: "性状1.1",
          id: "2",
          children: null,
        },
        {
          name: "性状1.2",
          id: "3",
          children: null,
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

const pieOption = {
  /* title: {
      text: "性状图",
    }, */
  tooltip: {
    trigger: "item",
    triggerOn: "mousemove",
  },
  series: [
    {
      type: "tree",
      data: [data],
      top: "18%",
      bottom: "14%",
      left: "15%",
      layout: "radial",
      symbol: "emptyCircle",
      symbolSize: 7,
      /* initialTreeDepth: 3, */
      animationDurationUpdate: 750,
      zoom: 0.9, // 初始缩放级别
      emphasis: {
        focus: "descendant",
      },
    },
  ],
};

// 获取分支数据的函数
function getBranchData(branchName) {
  // 根据分支名称从后端或其他数据源获取对应的数据
  // 这里仅作示例，返回一个假数据
  return [
    {
      trait_ID: "001",
      trait_name: "Trait 1",
      trait_cname: "性状1",
      unit: "cm",
      class: "Class 1",
      subclass: "Subclass 1",
      record_number: 10,
    },
    {
      trait_ID: "001",
      trait_name: "Trait 1",
      trait_cname: "性状1",
      unit: "cm",
      class: "Class 1",
      subclass: "Subclass 1",
      record_number: 10,
    },
    {
      trait_ID: "001",
      trait_name: "Trait 1",
      trait_cname: "性状1",
      unit: "cm",
      class: "Class 1",
      subclass: "Subclass 1",
      record_number: 10,
    },
    {
      trait_ID: "001",
      trait_name: "Trait 1",
      trait_cname: "性状1",
      unit: "cm",
      class: "Class 1",
      subclass: "Subclass 1",
      record_number: 10,
    },
    // 其他分支数据...
  ];
}

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); // 表格数据

function initHistogram() {
  let chartDoms = document.querySelector("#traitPanMap");
  let myChart = echarts.init(chartDoms);
  pieOption && myChart.setOption(pieOption);

  // 点击事件处理函数
  myChart.on("click", (params) => {
    if (params.data && params.data.id) {
      const typeId = params.data.id;
      /* const branchData = getBranchData(nodeId); */
      getTraitBytraitId(typeId).then((res) => {
        console.log(res, "klklk");
        if (res.code === 200) {
          totalPage2.value = res.data.length;
          updatePhenotypeData(res.data);
        }
      });

      // 展开所有子节点
      expandNode(params.data);
    }
  });
}

function expandNode(node) {
  if (node.children) {
    node.children.forEach((child) => {
      myChart.dispatchAction({
        type: "expandAndCollapse",
        nodeId: child.id,
        expand: true,
      });
      expandNode(child);
    });
  }
}

onMounted(() => {
  initHistogram();
  getTreeList();
  initCharts();
  getMaps();
});
</script>
  
  <style lang="less">
//地图
.card-container {
  width: 97%;
  border-radius: 50px;
  margin: auto;
  margin-top: 10px;

  :deep(.el-card__body) {
    padding: 15px 20px 20px 20px !important;
  }
}

.big-wrapper {
  width: 95%;
  margin: auto;
}

.area_top {
  display: flex;
  flex-direction: row;
  margin: 20px auto;
  justify-content: space-between;

  .search_table {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    float: right;
  }
}

.map_sys {
  display: flex;

  .city_form {
    width: 40%;
  }
}


/* 所有标签 */
.title {
  width: 95%;
  margin: auto;
}
.node-title {
  background-color: rgb(154, 190, 175);
  color: #fff;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  margin: 10px auto;
}
.node-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 50px;
}

#traitPanMap {
  height: 450px;
  width: 400px;
}

/deep/ #traitPanMap div {
  height: 450px;
  width: 400px;
}

.phenome-container {
  display: flex;
  flex-direction: column;

  .echart_wrapper {
    display: flex;

    #traitPanMap {
      width: 40%;
      margin-left: -40px;
    }

    .trait-form {
      width: 60%;
    }
  }
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
.gene-form-table {
  margin: 30px 0px;
}

.card-container {
  width: 95%;
  border-radius: 50px;
  margin: 10px auto;
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

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-tree) {
  background-color: #fff;
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: #fff !important;
}

.right-box {
  margin-left: 20px;
}

.mokuai {
  margin-bottom: 0;
  background-color: #fff;
}

.right-box {
  margin-left: 20px;
}

.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
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

//试验总结
/* 所有标签 */
.title {
  width: 95%;
  margin: auto;
}
.node-title {
  background-color: rgb(154, 190, 175);
  color: #fff;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  margin: 10px auto;
}
.node-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 50px;
}

.search_table {
  display: flex;
  margin: 20px;
  margin-left: 50px;
}

.card-container {
  width: 95%;
  border-radius: 50px;
  margin: 20px auto;
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
  margin-left: 50px;
  color: grey;
  font-size: 12px;
}

.input-title span {
  color: rgb(78, 151, 211);
}

/* 所有标签 */
.title {
  width: 95%;
  margin: auto;
}

.node-title {
  background-color: rgb(154, 190, 175);
  color: #fff;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  margin: 10px auto;
}
.node-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 50px;
}

#traitPanMap {
  height: 450px;
  width: 400px;
}

/deep/ #traitPanMap div {
  height: 450px;
  width: 400px;
}

.phenome-container {
  display: flex;
  flex-direction: column;

  .echart_wrapper {
    display: flex;

    #traitPanMap {
      width: 40%;
      margin-left: -40px;
    }

    .trait-form {
      width: 60%;
    }
  }
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
.gene-form-table {
  margin: 30px 0px;
}

</style>
  
  
  