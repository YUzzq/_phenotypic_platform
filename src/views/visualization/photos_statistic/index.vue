<template>
  <div style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    ">

    <div class="photoInfo" draggable="true" @dragstart="moveStart" @dragend="moveEnd" v-show="isShowTest">
      <el-card class="box-card info-card">
        <template #header>
          <span>图片信息</span>
        </template>
        <div class="text item">
          <span class="label">材料名：</span>
          <span class="value">{{ photoInfo.name }}</span>
        </div>
        <div class="text item">
          <span class="label">拍照时间：</span>
          <span class="value">{{ photoInfo.shotTime }}</span>
        </div>
        <div class="text item">
          <span class="label">上传时间：</span>
          <span class="value">{{ photoInfo.createTime }}</span>
        </div>
        <div class="text item">
          <span class="label">上传者：</span>
          <span class="value">{{ photoInfo.createBy }}</span>
        </div>
      </el-card>
    </div>
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-main width="78%" style="padding: 0" class="right-box">
        <div class="phenome-container">
          <!-- 日期选择 -->
          <el-card class="card-container">
            <template #header>
              <div class="card-header">
                <span>日期选择</span>
              </div>
            </template>
            <div class="big-wrapper" style="margin-top: 10px">
              <div class="block">
                <el-date-picker v-model="value2" type="daterange" unlink-panels range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="shortcuts" :size="size"
                  style="margin-right: 20px;" @change="chooseDate" />
              </div>
            </div>
          </el-card>

          <!-- 可视化 -->
          <el-card class="card-container">
            <template #header>
              <div class="card-header">
                <span>可视化</span>
              </div>
            </template>
            <!-- 表型图片统计 -->
            <div class="big-wrapper" style="margin-top: 10px;">
              <v-chart class="chart" :option="option" autoresize v-loading="isLoading1" />
              <v-chart class="chart1" :option="option2" autoresize v-loading="isLoading" style="margin-top:30px" />
            </div>

          </el-card>

          <!-- 图片查询 -->
          <el-card class="card-container ">
            <template #header>
              <div class="card-header ">
                <span>图片查询</span>
              </div>
            </template>
            <!-- 输入查询内容 -->
            <div class="big-wrapper search-container" style="margin: 10px 0px; width:90%">
                <el-input v-model.trim="searchForm.name" prefix-icon="Search" class="chooseNameInput" placeholder="请输入材料名"
                  style="margin: 0 10px;" clearable></el-input>
                <el-input v-model.trim="searchForm.createBy" prefix-icon="Search" class="chooseNameInput" placeholder="请输入上传者"
                  style="margin: 0 10px;" clearable></el-input>
                <el-date-picker v-model="searchForm.shotTime" cell-class-name="chooseDateInput"
                  style="margin: 0 10px;width: 150px; flex:auto" placeholder="请输入图片拍摄日期" clearable
                  value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                <el-date-picker v-model="searchForm.createTime" cell-class-name="chooseDateInput"
                  style="margin: 0 10px;width: 150px; flex:auto" placeholder="请输入图片上传日期" clearable
                  value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                <el-button @click="searchPhoto" :loading="searchLoaing" icon="Search" type="primary">查询</el-button>
                <el-button @click="clearSearch" :loading="resetLoading" icon="Refresh" type="info">重置</el-button>
            </div>

            <!-- 查询后的表格 -->
            <div class="image_box img-list" style="max-height: calc(100vh - 200px);width: 100%;">
              <div class="imgCard_container">
                <el-checkbox-group class="imgCard_container" v-model="checkedPictures" @change="handleSelectionChange">
                  <el-card class="image_item item" :style="{ width: myWidth, height: myHeight }" v-for="(item, index) in imageSrcList.slice(
                    (currentpageNum - 1) * pageSize,
                    currentpageNum * pageSize
                  )" :key="item.pictureId" ref="cardContainer">
                    <div class="wrapper">
                      <div class="imgBox">

                        <el-image @close="photoViewerClose" @switch="switchPhoto"
                          :src="getImageUrlByUrl(item.lessPictureUrl)" @click.self="showPhotoInfo(item)"
                          :preview-src-list="imageSrcList
                            .slice(
                              (currentpageNum - 1) * pageSize,
                              currentpageNum * pageSize
                            )
                            .map((item) => getImageUrlByUrl(item.pictureUrl))
                            " ref="previewImg" :initial-index="index" :style="{ height: imgHeight }" lazy
                          scroll-container>
                          <template #placeholder>
                            <div class="image-slot">
                              Loading<span class="dot">...</span>
                            </div>
                          </template>
                          <template #error>
                            <el-icon>
                              <Picture />
                            </el-icon>
                          </template>
                        </el-image>
                      </div>
                    </div>
                    <div class="detailBox" :style="{ fontSize: fontSize }">
                      <p v-if="item.name">{{ item.name }}</p>
                      <p v-if="!item.name"> 暂无名称</p>
                    </div>


                  </el-card>
                </el-checkbox-group>
              </div>
            </div>


            <!--分页组件-->
            <el-footer class="footer">
              <div class="demo-pagination-block">
                <el-pagination background :current-page="currentpageNum" :page-sizes="[30, 40, 50]" :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper" :total="totalPage" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
              </div>
            </el-footer>

          </el-card>


        </div>


      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, onMounted, getCurrentInstance } from "vue";

// 引入echarts
import { use } from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";
import 'echarts/lib/component/dataZoom'

use([
  GridComponent,
  UniversalTransition,
  LineChart,
  BarChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent
]);

provide(THEME_KEY);

const arrName = ref([])
const arrCount = ref([])


//查询图片
let searchForm = reactive({
  name: "",
  shotTime: "", // 拍摄时间
  createTime: "", // 上传时间
  createBy: "" // 上传人
});

// 日期选择
const value2 = ref('')
const startDate = ref('')
const endDate = ref('')

//日期选择的数据
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


import {
  treeCount,
  treeCountDate,
  getAllPicture,
  searchPhotoDetail,
} from "@/api/infomanage/types";

import { getTreeNodeIdsByNode, getImageUrlByUrl } from "@/utils/tree";
import { getTree } from "@/api/tree.js";

//获取视口宽度
const viewWidth = document.documentElement.clientWidth;
console.log(viewWidth);
const chart2Left =35376/viewWidth+'%'
console.log(chart2Left);

//柱状图数据
const option = ref();

// 折线图数据
const seriesArr = ref([])
const nameArr = ref([])
const dateArr = ref([])

//折线图的数据
const option2 = ref({
  title: {
    text: '图片数量变化统计',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: nameArr,
    top: '6%',
    icon: 'circle',
    orient: 'vertical',
    left: '0%',
    bottom: 'bottom',
    type: 'scroll',
    height: '90%',
    show: true,
    selected: {}
  },
  grid: {
    left: chart2Left,
    top: '10%',
    right: '4%',
    bottom: '9%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {},
      //全选/取消全选工具
      myTool1: {
        show: true,
        title: '全选/取消全选',
        icon: 'path://M542.127 8c-277.027 0-502.434 225.407-502.434 502.434s225.371 502.434 502.434 502.434 502.434-225.371 502.434-502.434-225.371-502.434-502.434-502.434zM784.582 427.558l-288.598 291.731c-0.223 0.13-0.406 0.309-0.535 0.524 0.135-0.232 0.135-0.087 0.026-0.014-4.519 3.886-10.065 6.708-16.175 8.006 4.896-0.287 0.769 1.622-3.716 2.559 4.234-1.349-0.426-0.381-5.311-0.377-4.843-0.003-9.531-1-13.795-2.803-5.535-3.328-10.364-7.74-14.155-12.956 4.965 7.769 0.452 3.883-2.896-0.879 5.511 6.135 5.474 5.989 5.401 5.916s-0.219-0.109-0.291-0.219l-141.986-145.823c-6.62-6.539-10.72-15.617-10.72-25.652 0-19.911 16.141-36.052 36.052-36.052 10.394 0 19.761 4.399 26.341 11.436l116.347 119.554 262.783-265.648c6.546-6.666 15.654-10.798 25.727-10.798 19.908 0 36.046 16.138 36.046 36.046 0 9.946-4.028 18.951-10.543 25.473z',
        onclick: function () {
          changeSelected()
        }
      },
      myTool2: {
        show: true,
        title: '展开/收起图例',
        icon: 'path://M729.6 931.2l-416-425.6 416-416c9.6-9.6 9.6-25.6 0-35.2-9.6-9.6-25.6-9.6-35.2 0l-432 435.2c-9.6 9.6-9.6 25.6 0 35.2l432 441.6c9.6 9.6 25.6 9.6 35.2 0C739.2 956.8 739.2 940.8 729.6 931.2z',
        onclick: function () {
          changeUnfold()
        }
      },

    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dateArr
  },
  yAxis: {
    type: 'value',
  },
  series: seriesArr,
  //实现下方拉动的数据
  dataZoom: [
    {
      height: 15, //高度
      type: "slider",
      xAxisIndex: [0], //控制第一个x轴
      left: chart2Left,
      right: '4%',
      bottom: 18, //图表底部距离
      handleSize: 10,//左右2个滑动条的大小
      moveHandleSize: 0,
      borderColor: "#eee", //滑动通道的边框颜色
      fillerColor: '#1F4E3D', //滑动条颜色
      backgroundColor: '#eee',//未选中的滑动条的颜色
      showDataShadow: true,//是否显示数据阴影 默认auto
      rangeMode: ['value', 'value'],
      handleIcon: "arrow",
      handleSize: "80%",
      showDetail: false,
    }
  ],
});

//loading
const isLoading1 = ref(false)
const isLoading = ref(false)

const cardContainer = ref(null);

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

// 树控件
const routesData = ref();
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = ref(2);


const tree = ref(null); // 树的dom实例

const form = reactive({
  treeName: "",
  shootEqmt: "",
  shootTime: "",
  procMeth: "",
  keyword: "",
  ip: "",
  remotePicture: "",
  isShow: true,
});

// 图片
const imageSrcList = ref([]);

//图片宽高
const myWidth = ref("9%");
const myHeight = ref("180px");
const imgHeight = ref("170px");
const fontSize = ref("16px");

//分页
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
const pageSize = ref(30);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

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



const photoInfo = reactive({
  name: '',
  createTime: '',
  shotTime: '',
  createBy: ''
})

//图片预览界面显示图片字段信息
const showPhotoInfo = (photo) => {
  photoInfo.name = photo.name
  photoInfo.shotTime = photo.shotTime
  photoInfo.createTime = photo.createTime
  photoInfo.createBy = photo.createBy
  isShowTest.value = true;
}

//信息窗口开始移动
const moveStart = (event) => {
  const target = event.target;
  target.style.visibility = 'hidden';
  const left = target.offsetLeft
  const top = target.offsetTop
  differenceX = event.clientX - left;
  differenceY = event.clientY - top;
  target.style.cursor = 'move';
}

let differenceX = 0;
let differenceY = 0;

//信息窗口结束移动
const moveEnd = (event) => {
  const photoInfo = document.querySelector(".photoInfo");
  const target = event.target;
  target.style.visibility = 'visible';
  //判断是否超出边界
  if (event.clientX - window.innerWidth > 0 || event.clientY - window.innerHeight > 0 || event.clientX < 0 || event.clientY < 0) return
  photoInfo.style.left = event.clientX - differenceX + 'px';
  photoInfo.style.top = event.clientY - differenceY + 'px';
}

const photoViewerClose = () => {
  isShowTest.value = false;
}

const getTreeList = async () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data;
    getPictureNumber()
    chooseDate()
  })
};



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

const handleSizeChange2 = (val) => {
  pageSize2.value = val;
};

const handleCurrentChange2 = (val) => {
  currentpageNum2.value = val;
  localStorage.setItem("currentPageNum2", val);
};

function formatTableCell(value) {
  console.log(value, "jhjhk");
  return value || "-";
}

//树相关
const curFileUrl = ref(""); // 表格日期对应的文件url
// 表格日期
const dates = ref([]);
const fileList = ref([]); // 文件列表


//标记点
//请求树的children
const treeChildren = ref([])
//生成柱状图的数据
const barListData = ref([])

//显示控制
const traitChoosed = ref(false);

// 加载
const loading = ref(false);
const histogramLoading = ref(false);
const loadingText = ref("加载中...");
const histogrM3DShow = ref(false);

const previewImg = ref(null);
const viewBigPicture = () => {
  previewImg.value.clickHandler();
};

const isShowTest = ref(false);

const showImageViewer = ref(false);
const url = ref([]);
const showImg = () => {
  //预览大图
  showImageViewer.value = true;
};

const close = () => {
  showImageViewer.value = false;
};

const searchLoaing = ref(false);

//查询图片
async function searchPhoto() {
  searchLoaing.value = true;
  if (searchForm.name === "" && searchForm.shotTime === "" && searchForm.createTime === "" && searchForm.createBy === "") {
    await getAllPicture(treeType.value).then(res => {
      imageSrcList.value = res.data
      $modal.msgSuccess('查询成功！')
      searchLoaing.value = false;
    }).catch(err => {
      searchLoaing.value = false;
      console.log(err);
    })
    totalPage.value = imageSrcList.value.length;
    // pageSize.value = 30;
    if (imageSrcList.length === 0) {
      $modal.msgWarning("当前无图片！");
    }
    return;
  }
  //如果用户输入了有效查询
  await searchPhotoDetail(searchForm.name, searchForm.shotTime, searchForm.createTime, searchForm.createBy).then(res => {
    if (res.code === 200) {
      searchLoaing.value = false;
      if (res.data.length === 0) {
        $modal.msgError('未查询到相关图片!')
        return
      }
      $modal.msgSuccess('查询成功!')
      imageSrcList.value = res.data
      totalPage.value = imageSrcList.value.length;
      // pageSize.value = 30;
    } else {
      searchLoaing.value = false;
      $modal.msgError(res.msg)
    }
  }).catch(err => {
    console.log(err);
  })
};


//点击树节点回调
async function rowClick() {
  // 使用await等待获取完整的图片列表
  await getAllPicture(treeType.value).then(res => {
    imageSrcList.value = res.data
  }).catch(err => {
    console.log(err);
  })
  totalPage.value = imageSrcList.value.length;
  // pageSize.value = 30;
  if (imageSrcList.length === 0) {
    $modal.msgWarning("当前无图片！");
  }
}

const resetLoading = ref(false)

//清空查询图片条件
async function clearSearch() {
  searchForm.name = ""
  searchForm.createTime = ""
  searchForm.shotTime = ""
  searchForm.createBy = ""
  resetLoading.value = true
  //重新获取完整图片列表
  rowClick()
  resetLoading.value = false
  $modal.msgSuccess('清空筛选条件成功！')
  currentpageNum.value = 1; // 将分页页码设置为1
}


const handleCheckAllChange = (val) => {
  if (val) {
    checkedPictures.value = imageSrcList.value.map((item) => item.pictureId);
  } else {
    checkedPictures.value = [];
  }
  isIndeterminate.value = false;
};


// 选择图片项
function handleSelectionChange(selection) {
  if (selection.length === imageSrcList.value.length) {
    selectAll.value = true;
    isIndeterminate.value = false;
  } else if (selection.length > 0) {
    selectAll.value = false;
    isIndeterminate.value = true;
  } else {
    selectAll.value = false;
    isIndeterminate.value = false;
  }
}

//图片预览界面切换图片
const switchPhoto = (index) => {
  const photo = imageSrcList.value[index]
  photoInfo.name = photo.name
  photoInfo.shotTime = photo.shotTime
  photoInfo.createTime = photo.createTime
  photoInfo.createBy = photo.createBy
}


//发送请求返回每个节点下的图片数量
async function getPictureNumber() {
  isLoading1.value = true;
  arrCount.value = []
  arrName.value = []
  await treeCount(routesData.value.children[0].treeId, 0).then(res => {
    for (let key in res.data) {
      let name = key.replace(routesData.value.children[0].treeName,'')
      arrName.value.push(name);
      arrCount.value.push({
        value: res.data[key],
        itemStyle: {
          color: generateColor(),
          barBorderRadius: [5, 5, 0, 0]
        }
      });
    }


    option.value = {
      title: {
        text: '图片数量统计'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '9%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove',
        confine: true //解决浮窗被遮挡问题
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: arrName,
        axisLabel: {
          inside: false,
          textStyle: {

          }
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: arrCount,
          type: 'bar',
          showBackground: true,
          label: {
            show: true,
            position: 'top',
            color: 'black'
          }
        }
      ],
      dataZoom: [
        {
          height: 15, //高度
          type: "slider",
          xAxisIndex: [0], //控制第一个x轴
          left: '4%',
          right: '4%',
          bottom: 18, //图表底部距离
          handleSize: 10,//左右2个滑动条的大小
          moveHandleSize: 0,
          borderColor: "#eee", //滑动通道的边框颜色
          fillerColor: '#1F4E3D', //滑动条颜色
          backgroundColor: '#eee',//未选中的滑动条的颜色
          showDataShadow: true,//是否显示数据阴影 默认auto
          rangeMode: ['value', 'value'],
          handleIcon: "arrow",
          handleSize: "100%",
          showDetail: false,
        }
      ],
    }
  })
    .catch(err => {
      console.log(err);
    })

  isLoading1.value = false;
}

//如果month或day仅有一位，则+1
function changeDate(num) {
  if (num >= 10) {
    return num
  } else {
    return '0' + num
  }
}

//获取从开始日期到结束日期的一个列表
function getDateList() {
  dateArr.value = []
  let theStart = new Date(value2.value[0]) //开始日期
  let theEnd = new Date(value2.value[1])  //结束日期
  while (theStart <= theEnd) {
    let dateStr = theStart.getFullYear() + '-' + changeDate(theStart.getMonth() + 1) + '-' + changeDate(theStart.getDate())
    dateArr.value.push(dateStr)
    theStart = theStart.setDate(theStart.getDate() + 1)
    theStart = new Date(theStart)
  }
}

//改变图例全选/全不选
function changeSelected() {
  let isChooseAll = true;
  nameArr.value.forEach(key => {
    if (!option2.value.legend.selected[key]) isChooseAll = false;
  })
  nameArr.value.forEach(key => {
    if (isChooseAll) option2.value.legend.selected[key] = false;
    else option2.value.legend.selected[key] = true;
  })
  if (!isChooseAll) ElMessage({ message: '已全选！', type: 'success' });
  else ElMessage({ message: '已取消全选！', type: 'success' });
}

// 改变图例展开/折叠
function changeUnfold() {
  if (option2.value.legend.show === true) {
    option2.value.dataZoom[0].left = '4%'
    option2.value.grid.left = '3%'
    option2.value.legend.show = false
    option2.value.toolbox.feature.myTool2.icon = 'path://M761.6 489.6l-432-435.2c-9.6-9.6-25.6-9.6-35.2 0-9.6 9.6-9.6 25.6 0 35.2l416 416-416 425.6c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0l432-441.6C771.2 515.2 771.2 499.2 761.6 489.6z'
  } else {
    option2.value.dataZoom[0].left = chart2Left
    option2.value.grid.left = chart2Left
    option2.value.legend.show = true
    option2.value.toolbox.feature.myTool2.icon = 'path://M729.6 931.2l-416-425.6 416-416c9.6-9.6 9.6-25.6 0-35.2-9.6-9.6-25.6-9.6-35.2 0l-432 435.2c-9.6 9.6-9.6 25.6 0 35.2l432 441.6c9.6 9.6 25.6 9.6 35.2 0C739.2 956.8 739.2 940.8 729.6 931.2z'
  }
}
//随机生成颜色
function generateColor() {
  let color = "";
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  color = `rgb(${r},${g},${b})`;
  return color;
}

//将Date转换为八位字符串的函数
function dateToStr(obj) {
  let year = obj.getFullYear();
  let month = obj.getMonth() + 1;
  let day = obj.getDate();
  month = changeDate(month);
  day = changeDate(day)
  return '' + year + month + day
}

//选择日期以后的操作
async function chooseDate() {
  //清空echarts中的data数据
  seriesArr.value = []
  nameArr.value = []
  dateArr.value = []
  isLoading.value = true;
  startDate.value = dateToStr(value2.value[0])
  endDate.value = dateToStr(new Date(value2.value[1].getTime() + 3600 * 1000 * 24))
  getDateList()

  await treeCountDate(routesData.value.children[0].treeId, startDate.value, endDate.value, 1).then(res => {
    //遍历返回的数据列表并加入echarts中data
    for (let key in res.data) {
      let name = key.replace(routesData.value.children[0].treeName,'')
      nameArr.value.push(name)
      Reflect.set(option2.value.legend.selected, name, true);
      seriesArr.value.push({
        name: name,
        type: 'line',
        smooth: true,
        data: res.data[key],
        color: generateColor()
      })
    }

  }).catch(err => {
    console.log(err);
  })
  isLoading.value = false;
}

// const curNode = tree.value.getCurrentNode();

onMounted(async () => {
  value2.value = [new Date(new Date() - 90 * 24 * 3600 * 1000), new Date()]
  await getTreeList();
  rowClick();
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

#traitPanMap {
  height: 450px;
  width: 400px;
}

/* /deep/ #traitPanMap div {
  height: 450px;
  width: 400px;
} */
:deep(#traitPanMap) div {
  height: 450px;
  width: 400px;
}

.phenome-container {
  display: flex;
  flex-direction: column;
  //position: relative;

  .echart_wrapper {
    display: flex;
    flex-direction: column;
    position: relative;

    #traitPanMap {
      width: 100%;
    }

    .trait-form {
      width: 100%;
      margin-top: -50px;
    }
  }

  .bgc-img {
    position: absolute;
    left: 0px;
    top: 0px;
    content: "";
    //display: overflow;
    // background-size: contain;
    // background-repeat: no-repeat;
    // background-position: bottom;
    // box-sizing: border-box;
    width: 60vw;
    width: 100%;
    height: 33vw;
    opacity: 0.2;
    // background-image: linear-gradient(to top, #9be15d 0%, #00e3ae 100%);
  }
}


.echart_wrapper {
  display: flex;
  justify-content: space-between;
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


.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  border-radius: 20px;
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
</style>

<style lang="scss" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: calc(100vh - 190px);

  img {
    width: 100%;
  }
}

.image_item {
  box-sizing: border-box;
  margin: 10px 5px;
}

.img-list {
  padding-left: 1%;
  padding-right: 1%;
  width: 100%;
  position: relative;
  right: 0;
}

.img-list .item {
  cursor: pointer;
}

.image_slot {
  width: 100%;
}
</style>

<style lang="less" scoped>
:deep(.permission-tree) {
  margin: 5px;
  background: #f2fbf7;
  min-width: 98%;
  display: inline-block;
  width: auto;
  overflow: auto;
  margin-right: 0px;
}

:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  color: black;
  padding: 0%;
  height: 20px;
}

:deep(.el-tree-node__expand-icon) {
  color: black;
}

.element-plus-tree {
  //padding: 100px;

  :deep(.el-tree) {

    /* ---- ---- ---- ---- ^（节点对齐）---- ---- ---- ---- */
    .el-tree-node {

      /* ^ 所有节点 */
      i.el-tree-node__expand-icon {
        padding: 6px;

        &::before {
          font-family: element-ui-icons;
          font-style: normal;
          //content: "\e6d9";
          //color: #000000;
          border: 1px solid #606266;
          border-radius: 2px;
        }

        // svg {
        //   display: true; // 隐藏所有节点的 svg 图标
        // }
      }

      /* / 所有节点 */

      /* ^ 已展开的父节点 */
      i.el-tree-node__expand-icon.expanded {
        //transform: rotate(0deg); // 取消旋转
        //-webkit-transform: rotate(0deg); // 取消旋转

        &::before {
          font-family: element-ui-icons;
          font-style: normal;
          //content: "\e6d8";
          //color: #000000;
          border: 1px solid #606266;
          border-radius: 2px;
        }
      }

      /* / 已展开的父节点 */

      /* ^ 叶子节点 */
      i.el-tree-node__expand-icon.is-leaf {
        &::before {
          display: none;
        }
      }

      /* / 叶子节点 */

      /* ^ 复选框 */
      .el-checkbox {
        margin: 0 7px 0 2px;

        .el-checkbox__inner {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          border: 1px solid #bbb;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border: 1px solid #5e7ce0;
        }
      }

      /* / 复选框 */

      .el-tree-node__content {
        small {
          font-size: 13px;
        }
      }
    }

    /* ---- ---- ---- ---- /（节点对齐）---- ---- ---- ---- */

    /* ---- ---- ---- ---- ^（文字高亮）---- ---- ---- ---- */
    .el-tree-node.is-current {
      .el-tree-node__content {
        small {
          color: #5e7ce0;
        }
      }

      .el-tree-node__children {
        small {
          color: unset;
        }
      }
    }

    /* ---- ---- ---- ---- /（文字高亮）---- ---- ---- ---- */

    /* ---- ---- ---- ---- ^（新增辅助线）---- ---- ---- ---- */
    /* ^ 树节点 */
    .el-tree-node {
      position: relative;
      width: auto;
      // width: max-content; // 显示文字宽度
      padding-left: 13px;

      &::before {
        width: 1px;
        height: 100%;
        content: "";
        position: absolute;
        top: -38px;
        bottom: 0;
        left: 0;
        right: auto;
        border-width: 1px;
        border-left: 1px solid #b8b9bb;
      }

      &::after {
        width: 13px;
        height: 13px;
        content: "";
        position: absolute;
        z-index: 0;
        left: 0;
        right: auto;
        top: 12px;
        bottom: auto;
        border-width: 1px;
        border-top: 1px solid #b8b9bb;
      }

      .el-tree-node__content {
        position: relative;
        z-index: 1;
        //color: #000;
        padding-left: 0 !important;

        /* ^ 复选框 */
        .el-checkbox {
          margin: 0 10px 0 5.5px;
        }

        /* / 复选框 */
      }

      .el-tree-node__children {
        padding-left: 12px;
      }

      &:last-child::before {
        height: 50px;
      }
    }

    /* / 树节点 */

    /* ^ 第一层节点 */
    >.el-tree-node {
      padding-left: 0;

      &::before {
        border-left: none;
      }

      &::after {
        border-top: none;
      }
    }

    /* / 第一层节点 */

    /* ^ 叶子节点 */
    i.el-tree-node__expand-icon.is-leaf {
      display: none;
    }

    /* / 叶子节点 */

    /* ^ 设置子节点左外边距 */
    .el-tree-node__content:has(.is-leaf) {
      // color: #00ffff;
      margin-left: 12px !important;

      .el-tree-node__label {
        //font-size: 8px;
      }

      //background-color: red;
    }

    /* / 设置子节点左外边距 */
    /* ---- ---- ---- ---- /（新增辅助线）---- ---- ---- ---- */
  }
}

:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  color: black;
  padding: 0%;
  height: 20px;
}

:deep(.el-tree-node__label) {
  font-size: 13px !important;
  padding-left: 5px;
  padding-right: 5px;
}

//一级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  font-weight: 600;
  color: #80a492;
  height: 28px !important;

  .el-tree-node__label {
    font-size: 18px !important;
    font-family: "PingFang SC";
  }
}

//二级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 500;
  color: #99bcac;
  height: 26px !important;

  .el-tree-node__label {
    font-size: 16px !important;
  }
}

//三级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 400;
  height: 23px !important;

  .el-tree-node__label {
    font-size: 14px !important;
  }
}

// 设置高亮颜色
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(rgb(#4f6f46), 0.3) !important;

  .el-tree-node__label {
    color: #4f6f46;
  }

  .el-tree-node__expand-icon {
    color: #4f6f46;
  }
}

:deep(.el-tree-node__content:hover) {
  color: #4f6f46;
  background-color: rgba(168, 191, 143, 0.3);

  .el-tree-node__expand-icon {
    color: #4f6f46;
  }
}

.mokuai {
  margin-bottom: 0;
  background-color: #f2fbf7;
  padding: 0% !important;
}

//表型类型
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


:deep(.el-button) {
  margin: 0% !important;
  margin-right: 20px !important;
}

.mytable {
  background-color: #eeeeee;
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
}
</style>

<!-- 卡片样式 -->
<style lang="less" scoped>
.info-card {
  border: none;

  :deep(.el-card__header) {
    border-radius: 0;
  }
}


.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
}

:deep(.el-card__header) {
  background: #1F4E3D;
  height: 60px !important;
  display: flex;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
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
  border-top: 1px solid #EBEEF5;

  th {
    font-weight: 800;
    //color: 909399;
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

.chart {
  height: 500px;
  // background-color: #bfa;
}

.chart1 {
  height: 600px;
}

.chart3 {
  height: 500px;
}

.search-container{
  display: flex;
}

.chooseNameInput,
.chooseDateInput {
  width: 150px;
  flex: 0.8 0.8 auto;
}

//图片列表样式
.imgCard_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}


.imgBox {
  position: relative;
}

.wrapper {
  position: relative;
}


.photoDialog {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: auto;

  .leftBox,
  .rightBox {
    width: 50%;
  }
}

//图片详细信息
.detailBox {
  display: flex;
  position: absolute;
  justify-content: center;
  align-content: center;
  bottom: 0;
  left: 0;
  height: 20%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all ease 0.6s;
  opacity: 0;

  p {
    margin: 0;
    color: #fff;
    text-align: center;
    line-height: 220%;
  }
}

.image_item:hover .detailBox {
  opacity: 1;
}


.footer {
  margin-left: 20px;
  height: fit-content;
  padding: 0%;
}

.buttonsBox {
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  left: 105%;
  z-index: 999;
  transition: all 0.1s ease-in-out;
  overflow: hidden;

  .delete_button,
  .edit_button {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 10px;
    background-color: transparent;
    width: 40px;
    height: 40px;

    .el-icon {
      font-size: 18px;
      transition: all 0.2s ease-in-out;
    }

    span {
      font-size: 12px;
      color: #555;
      width: 100%;
      transition: all 0.2s ease-in-out;
    }
  }

  .delete_button:hover {

    span,
    .el-icon {
      color: #F56C6C;
    }
  }

  .edit_button:hover {

    span,
    .el-icon {
      color: #409EFF;
    }
  }
}

.photoDialog {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: auto;

  .leftBox,
  .rightBox {
    width: 50%;
  }
}

.photoInfo {
  position: fixed;
  top: 50px;
  left: 50px;
  z-index: 9999;
  width: 350px;

  .item {
    margin: 15px;
  }

  .label {
    font-weight: 600;
    color: #333;
  }

  .value {
    font-size: 16px;
    color: #555;
  }

}

.imgBox .el-checkbox {
  position: absolute;
  top: 5px; // 设置具体位置
  left: 10px; // 设置具体位置
}

:deep(.el-image) {
  text-align: center;
  font-size: 40px;
}

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-form-item__label) {
  width: 110px;
}

:deep(.el-tree) {
  background-color: rgb(183, 202, 189);
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #fff !important;
}

:deep(.el-card) {
  position: relative;
  overflow: visible;
}

:deep(.el-card__body) {
  padding: 8px 8px 8px 8px !important;
  object-fit: fill;
}

.image_item:hover .buttonsBox {
  width: 40px;
  height: 80px;
}

.imgCard_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.icon-star {
  color: black;
  margin: 0 5px;
}

.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 1;
  right: 0;
  bottom: 0;
  width: 200px;
  //background: url(@/assets/img/tree/tree.png) no-repeat center center / cover;
  opacity: 0.2;
  z-index: 999;
  pointer-events: none;
}

.u-main .el-tag+.el-tag {
  margin-left: 10px;
}

.u-main .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.u-main .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.u-main .el-form-item {
  margin: 60px 0;
}

.u-main .el-form-item__label {
  font-size: 20px;
}
</style>