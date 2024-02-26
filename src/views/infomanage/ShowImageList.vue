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
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)" v-loading="loading"
      :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- 树 -->
      <el-aside width="20%" class="mokuai card shadow element-plus-tree"
        style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" :default-expand-all="true"
          highlight-current :current-node-key="1" @node-click="rowClick" @treeNodeChanged="handleTreeNodeChanged"
          class="permission-tree" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="false">
        </el-tree>
      </el-aside>

      <!-- //右边的盒子 -->
      <el-container>
        <el-main width="78%" style="padding: 0; margin-left: 10px;" class="right-box">
          <!-- 操作部分 -->
          <div style="width: 100%;">
            <el-button type="primary" class="my-button" style="margin: 10px" @click.prevent="addChildNode"
              v-hasPermi="['system:node:add']">
              添加子节点</el-button>
            <el-button type="danger" class="my-button" style="margin: 10px" @click.prevent="deleteNode"
              v-hasPermi="['system:node:remove']">删除节点</el-button>
            <el-button type="info" class="my-button" style="margin: 10px" @click.prevent="updateChildNode"
              v-hasPermi="['system:node:update']">修改节点</el-button>
            <!-- 可能要做隐藏 -->
            <template v-if="tree && tree.getCurrentNode()?.children.length === 0">
              <el-button type="primary" class="my-button" style="margin: 10px" @click.prevent="addImage"
                v-hasPermi="['system:image:add']">添加图片</el-button>
              <el-button type="primary" class="my-button" style="margin: 10px" @click.prevent="addNodeMsg"
                v-hasPermi="['system:image:add']">节点详细信息</el-button>
              <el-button type="info" class="my-button" style="margin: 10px" :loading="downloadLoading"
                @click.prevent="downloadPython" v-hasPermi="['system:image:add']">下载远程连接文件</el-button>
              <el-button type="primary" class="my-button" style="margin: 0 10px" @click.prevent="autoUploadDialog"
                v-hasPermi="['system:image:add']">图片自动上传</el-button>
            </template>
            <br />
            当前节点状态：
            <el-switch v-hasPermi="['system:node:update']" v-model="nodeIsShow" @change="switchChange()" />
          </div>
          <template v-if="tree && tree.getCurrentNode()?.children.length == 0">
          <!-- 搜索部分 -->
          <div class="search-container">
              <el-input clearable v-model.trim="searchForm.name" prefix-icon="Search"
                style="margin-right:5px;" class="chooseNameInput" placeholder="图片名"></el-input>
              <el-input clearable v-model.trim="searchForm.createBy" prefix-icon="Search"
                style="margin-right:5px;" class="chooseNameInput" placeholder="上传者"></el-input>
              <el-date-picker v-model="searchForm.time" style="margin-right:5px; width:150px; flex:auto" class="chooseDateInput"
                placeholder="拍摄日期" value-format="YYYY-MM-DD"></el-date-picker>
              <el-date-picker v-model="searchForm.createTime" style="margin-right:5px; width:150px; flex:auto" class="chooseDateInput"
                placeholder="上传日期" value-format="YYYY-MM-DD"></el-date-picker>
              <el-button :loading="searchLoading" @click="searchPhoto" icon="Search" type="primary">查询</el-button>
              <el-button :loading="resetLoading" @click="resetSearchForm" icon="Refresh" type="info">重置</el-button>
            </div>
              <el-button type="danger" style="margin: 0 10px" @click="deleteSelectedImages" :loading="buttonLoading"
                v-hasPermi="['system:image:remove']" class="my-button">删除选中图片</el-button>
              <el-button type="primary" style="margin: 0 10px" @click="downloadSelectedImages"
                class="my-button">下载选中图片</el-button>
              <el-button type="warning" style="margin: 0 10px" @click="editCheckedPhotoInfo"
                class="my-button">编辑选中图片</el-button>
              <el-button type="info" style="margin: 0 10px" @click="photoAnalyze" class="my-button">分析选中图片</el-button>
              <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                size="large" class="my-button">
                <p>全选该节点所有图片</p>
              </el-checkbox>
          </template>
          <!-- 内容部分 -->
          <!-- 如果为非叶子节点 -->
          <div v-if="tree && tree.getCurrentNode()?.children.length !== 0"
            style="max-height: calc(100vh - 290px); font-size: 20px;">
            <span style="font-weight: bold;">描述信息：</span>{{ form.keyword ? form.keyword : '描述信息为空!' }}
            <br />
            <!-- 选择日期组件 -->
            <div style="margin-top:10px">
              <span style="font-weight: bold;">日期选择：</span>
              <el-date-picker v-model="value2" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" :shortcuts="shortcuts" :size="size" style="margin-right: 20px;"
                @change="chooseDate" />
            </div>
            <el-card class="card-container" style="margin-top:10px;">
              <template #header>
                <div class="card-header">
                  <span>表型图片统计</span>
                </div>
              </template>
              <!-- 表型图片统计 -->
              <div class="big-wrapper" style="margin-top: 10px;">
                <v-chart class="chart" :option="option" autoresize v-loading="isLoading" />
                <v-chart class="chart2" :option="option2" autoresize v-loading="isLoading2" />
              </div>
            </el-card>
          </div>

          <div v-if="imageSrcList.length === 0 && tree && tree.getCurrentNode()?.children.length === 0"
            style="max-height: calc(100vh - 290px);font-size: 20px;">
            暂无图片！
          </div>
          <div class="image_box img-list" v-if="tree && tree.getCurrentNode()?.children.length === 0"
            style="max-height: calc(100vh - 320px);width: 100%;overflow-x: hidden;">
            <div class="imgCard_container">
              <el-checkbox-group class="imgCard_container" v-model="checkedPictures" @change="handleSelectionChange">
                <el-card class="image_item item" :style="{ width: myWidth, height: myHeight }" v-for="(item, index) in imageSrcList.slice(
                  (currentpageNum - 1) * pageSize,
                  currentpageNum * pageSize
                )" :key="item.pictureId" ref="cardContainer">
                  <div class="wrapper">
                    <div class="imgBox">
                      <el-checkbox size="large" :key="item.pictureId" v-model="checkedPictures"
                        :label="item.pictureId"></el-checkbox>
                      <el-image @close="photoViewerClose" @switch="switchPhoto"
                        :src="getImageUrlByUrl(item.lessPictureUrl)" @click.self="showPhotoInfo(item)" :preview-src-list="imageSrcList
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
                  <div class="buttonsBox">
                    <button class="edit_button" size="large" @click="handleEditImage(item)">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      <span>编辑</span>
                    </button>
                    <button class="delete_button" size="large" @click="deleteImage(item.pictureId, item.pictureUrl)"
                      v-hasPermi="['system:image:remove']">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      <span>删除</span>
                    </button>
                  </div>

                </el-card>
              </el-checkbox-group>
            </div>
          </div>

        </el-main>

        <!--分页组件-->
        <el-footer class="footer" v-if="tree && tree.getCurrentNode()?.children.length === 0">
          <div class="demo-pagination-block">
            <el-pagination 
              background 
              :current-page="currentpageNum" 
              :page-sizes="[24, 32, 40]" 
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" 
              :total="totalPage" 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </el-footer>
      </el-container>


    </el-container>
    <!-- 新增节点对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" center draggable width="30%">
      <el-form ref="dataForm" :model="form" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="节点新名称：" prop="treeName">
          <el-input v-model="form.treeName" placeholder="输入节点新名称" />
        </el-form-item>
        <el-form-item label="是否公开：" prop="isShow">
          <el-switch v-model="form.isShow" />
        </el-form-item>
        <el-form-item label="信息描述：" prop="keyword">
          <el-input v-model="form.keyword" placeholder="输入图片描述信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="
            dialogStatus === 'create' ? createData() : updateData()
            ">
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改节点详细信息对话框 -->
    <el-dialog title="节点图片详细信息" v-model="msgDialogVisible" center draggable width="30%">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="110px">
        <el-form-item label="拍摄设备：">
          <el-input v-model="form.shootEqmt" placeholder="输入拍摄设备名称" />
        </el-form-item>
        <el-form-item label="拍摄时间：">
          <el-date-picker v-model="form.shootTime" type="datetime" placeholder="选择一个日期" />
        </el-form-item>
        <el-form-item label="处理方式：">
          <el-input v-model="form.procMeth" placeholder="输入处理方式" />
        </el-form-item>
        <el-form-item label="关键字（用逗号分隔）：">
          <el-input v-model="form.keyword" placeholder="输入关键字" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="saveNodeDetailsButton">
            保存
          </el-button>
          <el-button @click="msgDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加与编辑图片对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="imageDialog" center draggable max-width="50%">
      <div class="photoDialog">
        <div class="leftBox">
          <el-upload :file-list="fileList" class="upload-demo" ref="upload" :accept="acceptType()"
            list-type="picture-card" :action="uploadUrl" :auto-upload="false"
            :headers="{ Authorization: 'Bearer ' + getToken() }" :before-upload="handleBeforeUpload" :limit="photo.limit"
            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" :on-error="uploadImageError"
            :on-success="uploadImageSuccess" :on-change="handleUploadFile" :multiple="true">
            <el-button type="primary">Click to upload</el-button>

            <template #tip>
              <div class="el-upload__tip">请上传图片<span
                  v-if="dialogStatus === 'updataPhoto'">或压缩包</span><br />图片请按格式（材料名_拍摄日期）命名，如：<br />基因型_2023-09-01
                23.26.02.png</div>
            </template>

            <!-- 自定义进度条 -->
            <template #custom-progress="{ file }">
              <div class="custom-progress">
                <div class="progress-bar" :style="{ width: file.percent + '%' }"></div>
                <div class="progress-text">{{ file.percent }}%</div>
              </div>
            </template>
          </el-upload>
          <div class="dialog-footer">
            <el-button type="primary" :loading="submitButtonLoading"
              @click.passive="dialogStatus === 'updataPhoto' ? checkImageName() : confirmEditPhoto()">
              {{ dialogStatus === 'updataPhoto' ? '添加' : '修改' }}
            </el-button>
            <el-button @click="suspendSubmitImage">取消</el-button>
          </div>
        </div>
        <div class="rightBox" v-if="dialogStatus === 'editPhoto'">
          <el-form ref="dataForm" :model="editPhotoInfo" :rules="photoRules" label-position="left" label-width="110px">
            <el-form-item label="图片新名称：" prop="name">
              <el-input clearable v-model="editPhotoInfo.name" placeholder="请输入图片新名称" />
            </el-form-item>
            <el-form-item label="新拍摄日期：" prop="shotTime">
              <el-date-picker format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" clearable
                v-model="editPhotoInfo.shotTime" placeholder="请输入新的拍摄日期" type="datetime" prop="treeName" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input clearable v-model="editPhotoInfo.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 图片自动上传对话框 -->
    <el-dialog title="图片自动上传" v-model="autoDialog" center draggable width="30%">
      <el-form ref="dataForm2" :model="form" :rules="autoRules" label-position="left" label-width="110px">
        <el-form-item label="IP地址：" prop="ip">
          <el-input v-model="form.ip" placeholder="输入IP地址" />
        </el-form-item>
        <el-form-item label="图片目录：" prop="remotePicture">
          <el-input v-model="form.remotePicture" placeholder="输入图片目录" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="autoUpload">
            保存
          </el-button>
          <el-button @click="autoDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="showImageList">
import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  toRaw
} from "vue";
import { getTreeNodeIdsByNode, getImageUrlByUrl } from "@/utils/tree";
import { getTree, addNode, updateNode, deleteNodes, pictureCount } from "@/api/tree.js";
import { getToken } from "@/utils/auth";
import {
  getImagesBynodeId,
  deleteImageByIdAndUrl,
  updateByIp,
  downloadImage,
  treeCountDate,
  treeCount
} from "@/api/infomanage/types";
import zipLogo from "@/assets/zip/zip.webp";
import { parseTime } from "@/utils/param";
import JSZip, { file } from "jszip";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";

const router = useRouter();

// 引入echarts
import { use } from "echarts/core";
import 'echarts/lib/component/dataZoom'
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
import axios from "axios";
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


// 日期选择相关
// 日期选择
const value2 = ref('')
const startDate = ref('')
const endDate = ref('')

// 判断当前节点在树中的排位 第一层为2 第二层为1 第三层为0 
function treeIdRank() {
  let index = -1;
  let theArr = tree.value.getCurrentNode()?.children ? toRaw(tree.value.getCurrentNode()?.children) : null;
  while (theArr.length) {
    index++;
    theArr = theArr[0]?.children;
  };
  return index;
}


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
    option2.value.dataZoom[0].left = '3%'
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
function dateToStr(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = changeDate(month);
  day = changeDate(day)
  return '' + year + month + day
}

//获取视口宽度
const viewWidth = document.documentElement.clientWidth;
const chart2Left =29480/viewWidth+'%'

//选择日期以后的操作
async function chooseDate() {
  //清空echarts中的data数据
  seriesArr.value = []
  nameArr.value = []
  dateArr.value = []
  tmpArr.value = []
  isLoading2.value = true;
  option2.value = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: nameArr,
      top: '6%',
      icon: 'circle',
      orient: 'vertical',
      left: '0%',
      top: 'center',
      type: 'scroll',
      height: '90%',
      show: true,
      selected: {}
    },
    grid: {
      left: chart2Left,
      top: '10%',
      right: '3%',
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
    ]
  }
  startDate.value = dateToStr(value2.value[0])
  endDate.value = dateToStr(new Date(value2.value[1].getTime() + 3600 * 1000 * 24))
  getDateList()
  await treeCountDate(tree.value.getCurrentNode().treeId, startDate.value, endDate.value, 1, treeIdRank()).then(res => {
    //遍历返回的数据列表并加入echarts中data
    for (let key in res.data) {
      let name = key.replace(tree.value.getCurrentNode().treeName,'').trimStart()
      nameArr.value.push(name)
      // Reflect.set(option2.value.legend.selected, key, true);
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
  isLoading2.value = false;
}

const props = defineProps({
  treeType: {
    type: Number,
    default: 2,
  },
});

//允许的格式
const acceptType = () => {
  let type = '.jpg,.png'
  dialogStatus.value === 'updataPhoto' ? type += ',.bmp,.webp,.jpeg,.zip,.rar' : ''
  return type;
}

const cardContainer = ref(null);

const loadingDialogVisible = ref(false);

// vue实例
const {
  proxy: { $download },
} = getCurrentInstance();

const valueFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSX"; // 时间格式

// vue实例
const {
  proxy: { $modal },
} = getCurrentInstance();

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");

//可视化加载
const isLoading = ref(true);
const isLoading2 = ref(false);

// 图片
const imageSrcList = ref([]);

//用于更新imageSrcList
const imageSrcListCopy = ref([]);
const updateImageSrcList = async () => {
  const curNode = tree.value.getCurrentNode();
  imageSrcList.value = await getImagesBynodeId(curNode.treeId);
  imageSrcListCopy.value = imageSrcList.value;
  resetPage();
};


//图片宽高
const myWidth = ref("23%");
const myHeight = ref("180px");
const imgHeight = ref("170px");
const fontSize = ref("16px");

//分页
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
const pageSize = ref(24);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
//替换图片
const handleExceed = (files, fileList) => {
  fileList[0].name = files[0].name
  fileList[0].raw = files[0]
  fileList[0].uid = files[0].uid
  fileList[0].url = URL.createObjectURL(files[0]);
};


//树
function handleTreeNodeChanged() {
  currentpageNum.value = 1; // 将当前页码设置为1
}


const imageList = [
  {
    pictureId: 1,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
  {
    pictureId: 2,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
];

const buttonLoading = ref(false);
const autoUploadLoading = ref(false);

//多选删除图片
const selectAll = ref(false);
const isIndeterminate = ref(true);
const checkedPictures = ref([]);

const handleCheckAllChange = (val) => {
  if (val) {
    checkedPictures.value = imageSrcList.value.map((item) => item.pictureId);
  } else {
    checkedPictures.value = [];
  }
  isIndeterminate.value = false;
};

//请求图片数量
async function getPictureData() {
  isLoading.value = true
  arrCount.value = []
  arrName.value = []

  if (tree && tree.value.getCurrentNode()?.children) {
    await treeCount(tree.value.getCurrentNode().treeId, 0).then(res => {
      for(let key in res.data){
        let name = key.replace(tree.value.getCurrentNode().treeName,'').trimStart()
        arrName.value.push(name);
        arrCount.value.push({
          value: res.data[key],
          itemStyle: {
            color: generateColor(),
            barBorderRadius: [5, 5, 0, 0]
          }
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }
  isLoading.value = false;
}


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


// 下载选中的图片到文件夹
async function downloadSelectedImages() {
  if (checkedPictures.value.length == 0) {
    $modal.msg("您没有选择图片！");
  } else {
    $modal
      .confirm("是否下载选中的图片?")
      .then(async () => {
        loadingDialogVisible.value = true;
        const zip = new JSZip();
        const imageFolder = zip.folder("images");
        const downloadPromises = checkedPictures.value.map(async (pictureId) => {
          try {
            const { blob, imageName } = await downloadImage(pictureId);
            imageFolder.file(imageName, blob);
          } catch (error) {
            loadingDialogVisible.value = false;
            console.error(`下载图片失败: ${error}`);
            $modal.msgError("下载选中图片失败");
          }
        })
        Promise.all(downloadPromises).then(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "images.zip");
            loadingDialogVisible.value = false;
            $modal.msgSuccess("下载选中图片成功");
          }).catch((err) => {
            console.log(err)
            loadingDialogVisible.value = false;
            $modal.msgError("生成压缩包失败");
          })
        }).catch((err) => {
          console.log(err)
          loadingDialogVisible.value = false;
          console.error('Error downloading images:', err);
          $modal.msgError("下载选中图片失败");
        });
      })
  }
}


// 全选状态的判定
async function deleteSelectedImages() {
  if (checkedPictures.value.length == 0) {
    $modal.msg("您没有选择图片！");
  } else {
    $modal
      .confirm("是否删除该图片?")
      .then(async () => {
        buttonLoading.value = true;
        const curNode = tree.value.getCurrentNode();

        const deletePromises = checkedPictures.value.map((pictureId) => {
          // 找到对应的图片 URL
          const pictureUrl = imageSrcList.value.find(
            (item) => item.pictureId === pictureId
          ).pictureUrl;

          // 调用删除接口
          return deleteImageByIdAndUrl(pictureId, pictureUrl).catch((error) => {
            console.error(`删除图片失败: ${error}`);
            $modal.msgError("删除选中图片失败");
          });
        });

        try {
          // 等待所有删除操作完成
          await Promise.all(deletePromises);

          // 删除成功
          $modal.msgSuccess("删除选中图片成功");
          rowClick(curNode);
        } catch (error) {
          // 如果有任何一个删除操作失败，都会进入这里
          $modal.msgError("删除选中图片失败");
        } finally {
          // 无论成功或失败，最后都要停止 loading
          buttonLoading.value = false;
          checkedPictures.value = [];

        }
      })
      .catch(() => {
        buttonLoading.value = false;
      });
  }
}
//删除图片
function deleteImage(pictureId, pictureUrl) {
  buttonLoading.value = true;
  $modal
    .confirm("是否删除该图片?")
    .then(() => {
      const curNode = tree.value.getCurrentNode();
      const savedPageNum = localStorage.getItem("currentPageNum");
      deleteImageByIdAndUrl(pictureId, pictureUrl).then(
        () => {
          $modal.msgSuccess("删除图片成功");
          currentpageNum.value = savedPageNum ? parseInt(savedPageNum) : 1;
          rowClick(curNode);
          buttonLoading.value = false;
        },
        () => {
          $modal.msgError("删除图片失败");
          buttonLoading.value = false;
        }
      );
    })
    .catch(() => {
      buttonLoading.value = false;
    });
}

//图片对话框的配置信息
const photo = reactive({
  limit: 1,
})

// 打开添加图片对话框
function addImage(imageUrl) {
  photo.limit = 20;
  fileList.value = [];
  dialogStatus.value = "updataPhoto";
  imageDialog.value = true;
}

//编辑选中图片
function editCheckedPhotoInfo() {
  if (checkedPictures.value.length == 0) {
    $modal.msg("您没有选择图片！");
  } else if (checkedPictures.value.length > 1) {
    $modal.msg("您只能选择一张图片进行编辑！");
  } else {
    const checkedPicture = imageSrcList.value.find(
      (item) => item.pictureId === checkedPictures.value[0]
    );
    handleEditImage(checkedPicture);
  }
}

//选中图片跳转至图片分析
function photoAnalyze() {
  if (checkedPictures.value.length == 0) {
    $modal.msg("您没有选择图片！");
    return
  }

  const queryName = []

  checkedPictures.value.forEach(id => {
    imageSrcList.value.forEach(item => {
      if (id === item.pictureId) queryName.push(item.name ? item.name : '未命名');
    })
  })
  sessionStorage.setItem("isfromRouter", true);
  router.push({
    path: "/pictureAnalysis",
    query: { id: checkedPictures.value, name: queryName},
    meta: { keepAlive: true }
  });
}


//打开编辑图片对话框
function handleEditImage(item) {
  photo.limit = 1
  fileList.value = []
  dialogStatus.value = "editPhoto";
  imageDialog.value = true;
  editPhotoInfo.treeId = item.treeId;
  editPhotoInfo.pictureId = item.pictureId;
  editPhotoInfo.name = item.name;
  editPhotoInfo.shotTime = item.shotTime;
  editPhotoInfo.remark = item.remark;
}
const isShowTest = ref(false);

const photoInfo = reactive({
  name: '',
  shotTime: '',
  createTime: '',
  createBy: ''
})

const editPhotoInfo = reactive({
  name: '',
  shotTime: '',
  remark: '',
  treeId: '',
  pictureId: ''
})

//图片预览界面显示图片字段信息
const showPhotoInfo = (photo) => {
  photoInfo.name = photo.name
  photoInfo.shotTime = photo.shotTime
  photoInfo.createTime = photo.createTime
  photoInfo.createBy = photo.createBy
  isShowTest.value = true;
}

const photoViewerClose = () => {
  isShowTest.value = false;
}

//图片预览界面切换图片
const switchPhoto = (index) => {
  const photo = imageSrcList.value[index]
  photoInfo.name = photo.name
  photoInfo.shotTime = photo.shotTime
  photoInfo.createTime = photo.createTime
  photoInfo.createBy = photo.createBy
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

const downloadLoading = ref(false);
let downloadTimer = null;

async function downloadPython() {
  if (downloadLoading.value) {
    return; // Prevent multiple downloads while in progress
  }

  downloadLoading.value = true;
  $modal.msg("正在下载中，请稍后");

  try {
    await $download.resource(
      "C:\\Users\\Administrator\\Desktop\\tabletype\\main.exe"
    );

    // Download completed successfully, start the timer
    downloadTimer = setTimeout(() => {
      downloadLoading.value = false;
      clearTimeout(downloadTimer);
    }, 10000); // 10 seconds
  } catch (error) {
    console.log(error);
    // Handle the error, e.g., show an error message to the user for download failure
    downloadLoading.value = false;
  }
}

// 添加图片对话框
const imageDialog = ref(false);

//自动上传对话框
const autoDialog = ref(false);

const fileList = ref([]);

// 提交添加图片
const upload = ref(null);
const uploadUrl = ref("");

//图片详细信息
const showDetails = ref(false);

const submitButtonLoading = ref(false);

const flushDetail = ref(false);

//图片上传与编辑表单校验规则
const photoRules = reactive({
  name: [{ required: true, message: "请输入图片新名称", trigger: "blur" }],
  shotTime: [{ required: true, message: "请输入新的拍摄日期", trigger: "blur" }],
  remark: [{ required: false, message: "请输入备注", trigger: "blur" }],
});

//校验方法
const isFormat =(file)=>{
  const dateReg = /^.+_\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}\..+$/
  const onlydateReg = /^.+_\d{4}-\d{2}-\d{2}\..+$/
  if (!dateReg.test(file.name) && !onlydateReg.test(file.name)) {
    isRightName.value = false
    console.log(123);
  } else if (dateReg.test(file.name)) {
    //检查年月日时分秒是否合法
    let date = file.name.split('_')
    date = date[date.length - 1].split(' ')
    const dateArr = date[0].split('-')
    const timeArr = date[1].split('.')
    if (dateArr[0] < 0 || dateArr[0] > 9999 || dateArr[1] < 0 || dateArr[1] > 12 || dateArr[2] < 0 || dateArr[2] > 31 || timeArr[0] < 0 || timeArr[0] > 23 || timeArr[1] < 0 || timeArr[1] > 59 || timeArr[2] < 0 || timeArr[2] > 59) {
      isRightName.value = false
      console.log(123);
    }
  } else if (onlydateReg.test(file.name)) {
    //检查年月日是否合法
    let date = file.name.split('_')
    date = date[date.length - 1]
    const dateArr = date[0].split('-')
    if (dateArr[0] < 0 || dateArr[0] > 9999 || dateArr[1] < 0 || dateArr[1] > 12 || dateArr[2] < 0 || dateArr[2] > 31) {
      isRightName.value = false
      console.log(123);
    }
  }
}

let isRightName = ref(true)

//上传图片校验图片命名格式
const checkImageName = () => {
  //检查上传的图片名称格式是否规范
  isRightName.value=true
  //提取压缩文件
  const zipFile = fileList.value.filter(file =>{
    return file.name.endsWith('.zip')
  })
  //提取普通文件
  const normalFile = fileList.value.filter(file =>{
    return !file.name.endsWith('.zip')
  })
  new Promise((resolve, reject)=>{
    try {
      normalFile.forEach((file) => {
        isFormat(file)
      })
      if(zipFile.length === 0) resolve()
      zipFile.forEach(async (file,index) => {
        const zip = new JSZip();
        zip.loadAsync(file.raw).then((zip) => {
          zip.forEach((relativePath, zipEntry) => {
            isFormat(zipEntry)
          })
          resolve()
        })
      })
    } catch (err) {
      isRightName.value = false
    }
  }).then(()=>{
    console.log(222);
    if (!isRightName.value) {
      $modal.confirm("存在图片名称格式不规范，这可能导致后续无法正常查询该图片，是否继续上传？").then(async () => {
        await submitImage()
      }).catch(() => {
        return
      })
      return
    } else {
      submitImage()
    }
  })
};

//自定义编辑上传方法
const fileUpload = async () => {
  submitButtonLoading.value = true;
  //新建表单项
  const formData = new FormData();
  //将文件添加到表单项中
  fileList.value.forEach((file) => {
    formData.append("file", file.raw);
  });
  axios.post(uploadUrl.value, formData, {
    headers: {
      Authorization: 'Bearer ' + getToken(),
    }
  })
    .then(res => {
      //将图片的状态设置为成功
      fileList.value.forEach((file) => {
        file.status = "success";
      });
      uploadImageSuccess(res.data)

    })
    .catch(err => {
      uploadImageError(err.data)
    })
}

//确认编辑图片
const confirmEditPhoto = async () => {
  //填充默认值
  //检查表单项是否填写完整
  if (!editPhotoInfo.name || !editPhotoInfo.shotTime) {
    $modal.msgError('请填写完整信息')
    return
  }
  uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
    }/system/picture/modify?treeId=${tree.value.getCurrentNode().treeId
    }&pictureId=${editPhotoInfo.pictureId
    }&name=${editPhotoInfo.name
    }&shotTime=${editPhotoInfo.shotTime
    }&remark=${editPhotoInfo.remark
    }`;
  try {
    await nextTick();

    await fileUpload()

    await nextTick();
  } catch (error) {
    console.error("编辑失败: ", error);
  } finally {
  }
}

//提交上传
const submitImage = async () => {
  submitButtonLoading.value = true;
  uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
    }/system/picture/upload?isShow=1&treeId=${tree.value.getCurrentNode().treeId
    }`;
  try {
    await nextTick();

    await upload.value.submit();

    await nextTick();

    // addImage();
  } catch (error) {
    console.error("上传错误: ", error);
  } finally {
    submitButtonLoading.value = false;
  }
};

//控制图片上传进度
const uploadPercentage = ref(0);
const percent = ref(0);
const fileUploadHandler = (event, file, fileList) => {
  fileList.forEach((f) => {
    const percent = ref(0); // 创建一个进度值的响应式变量
    const interval = setInterval(() => {
      // 模拟文件上传进度增加
      percent.value += 2;

      if (percent.value >= 98) {
        clearInterval(interval); // 进度达到98%，停止增加
      }
    }, 100);
  });
};

const suspendSubmitImage = (file) => {
  nextTick(async () => {
    await upload.value.abort();
    handleRemove(file);
    $modal.msg("已取消图片提交！");
  });

  imageDialog.value = false;
};

//文件上传回调
const handleUploadFile = (file) => {
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  if (fileType === "zip") {
    flushDetail.value = true;
    var ImgOne = document.getElementsByClassName(
      "el-upload-list__item-thumbnail"
    );
    setTimeout(() => {
      for (let i = 0; i < ImgOne.length; i++) {
        const fileType2 = fileList.value[i].name.substring(
          fileList.value[i].name.lastIndexOf(".") + 1
        );
        if (fileType2 === "zip") {
          ImgOne[i].src = zipLogo;
        } else if (fileType2 === "rar") {
          ImgOne[i].src = zipLogo;
        }
      }
    }, 500);
  } else if (fileType === "rar") {
    flushDetail.value = true;
    var ImgOne = document.getElementsByClassName(
      "el-upload-list__item-thumbnail"
    );
    setTimeout(() => {
      for (let i = 0; i < ImgOne.length; i++) {
        const fileType2 = fileList.value[i].name.substring(
          fileList.value[i].name.lastIndexOf(".") + 1
        );
        if (fileType2 === "zip") {
          ImgOne[i].src = zipLogo;
        } else if (fileType2 === "rar") {
          ImgOne[i].src = zipLogo;
        }
      }
    }, 500);
  }
};

const uploadFilesList = ref();
const imageLists = ref({});
//图片上传前触发
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const whiteList = [
    "png",
    "PNG",
    "jpg",
    "JPG",
    "jpeg",
    "JPEG",
    "bmp",
    "BMP",
    "webp",
    "WEBP",
    "zip",
    "ZIP",
    "rar",
    "RAR",
  ];
  if (whiteList.indexOf(fileType) === -1) {
    $modal.msgError(
      "只能上传图片或压缩包格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  file.percent = 0;
  return true;
};



//图片上传成功回调
async function uploadImageSuccess(res) {
  if (res.code === 500) {
    $modal.msgError(res.msg);
    return
  } else {
    $modal.msgSuccess(res.msg);
    checkedPictures.value = [];
  }
  if (fileList.value.every((it) => it.status == "success")) {
    const uploadedImagesCount = fileList.value.length;
    fileList.value = [];
    updateImageSrcList()
    imageDialog.value = false;
    const curNode = tree.value.getCurrentNode();
    setTimeout(async () => {
      await rowClick(curNode);
    }, 1000);
  } else {
  }
  submitButtonLoading.value = false
}

//图片上传失败回调
function uploadImageError() {
  $modal.msgError("添加/修改图片失败");
  checkedPictures.value = [];
  submitButtonLoading.value = false
}

const previewImg = ref(null);
const viewBigPicture = () => {
  previewImg.value.clickHandler();
};

//查询图片
let searchForm = reactive({
  name: "",
  time: "",
  createBy: "",
  createTime: "",
});

const resetLoading = ref(false);

//重置查询表单
const resetSearchForm = async () => {
  resetLoading.value = true;
  searchForm.name = "";
  searchForm.time = "";
  searchForm.createBy = "";
  searchForm.createTime = "";
  updateImageSrcList()
  $modal.msgSuccess("已重置");
  resetLoading.value = false;
};

//重置分页
const resetPage = () => {
  currentpageNum.value = 1;
  totalPage.value = imageSrcList.value.length;
};

const searchLoading = ref(false);

//查询图片
const searchPhoto = async () => {
  //检查查询项是否全为空，是则查询节点下所有图片
  searchLoading.value = true;
  if (!searchForm.name && !searchForm.time && !searchForm.createBy && !searchForm.createTime) {
    imageSrcList.value = imageSrcListCopy.value
    resetPage()
    $modal.msgSuccess('查询成功')
    searchLoading.value = false;
    return
  }
  imageSrcList.value = imageSrcListCopy.value.filter((photo) => {
    return (photo.name ? photo.name.includes(searchForm.name===null?"":searchForm.name) : !searchForm.name) &&
      (photo.shotTime ? photo.shotTime.includes(searchForm.time===null?"":searchForm.time) : !searchForm.time) &&
      (photo.createBy ? photo.createBy.includes(searchForm.createBy===null?"":searchForm.createBy) : !searchForm.createBy) &&
      (photo.createTime ? photo.createTime.includes(searchForm.createTime===null?"":searchForm.createTime) : !searchForm.createTime)
  })
  if (imageSrcList.value.length === 0) {
    $modal.msgWarning('未查询到相关图片')
    searchLoading.value = false;
    return
  }
  $modal.msgSuccess('查询成功')
  searchLoading.value = false;
  resetPage()
}

const showImageViewer = ref(false);
const url = ref([]);
const showImg = () => {
  //预览大图
  showImageViewer.value = true;
};
const close = () => {
  showImageViewer.value = false;
};

//图片自动上传
function autoUploadDialog() {
  autoDialog.value = true;
}

const dataForm2 = ref(null);

//自动上传点击事件
function autoUpload() {
  autoUploadLoading.value = true;
  dataForm2.value.validate((valid) => {
    if (valid) {
      const curNode = tree.value.getCurrentNode();
      updateByIp(form.ip, form.remotePicture, curNode.treeId).then(
        () => {
          $modal.msgSuccess("开启自动上传成功");
          rowClick(curNode);
          autoDialog.value = false;
          autoUploadLoading.value = false;
        },
        () => {
          autoUploadLoading.value = false;
          $modal.msgError("开启自动上传失败");
        },
        (autoUploadLoading.value = false)
      );
    }
  });
}

const sizeMap = reactive({
  4: {
    myWidth: "43%",
    myHeight: "250px",
    imgHeight: "230px",
    fontSize: "24px",
  },
  8: {
    myWidth: "23%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  12: {
    myWidth: "23%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  24: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  32: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  40: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
});

watch(pageSize, () => {
  const size = sizeMap[pageSize.value];
  if (size) {
    myWidth.value = size.myWidth;
    myHeight.value = size.myHeight;
    imgHeight.value = size.imgHeight;
    fontSize.value = size.fontSize;
  }
});

onMounted(() => {
  if (pageSize.value === 4) {
    myWidth.value = "43%";
    myHeight.value = "250px";
    fontSize.value = "24px";
  } else if (pageSize.value === 12) {
    myWidth.value = "23%";
    myHeight.value = "180x";
    fontSize.value = "16px";
  } else if (pageSize.value === 24) {
    myWidth.value = "11%";
    myHeight.value = "180x";
    fontSize.value = "16px";
  }

  const savedPageNum = localStorage.getItem("currentPageNum");
  currentpageNum.value = savedPageNum ? parseInt(savedPageNum) : 1;
});

//可视化相关变量初始
const option = ref();
const arrName = ref([]);
const arrCount = ref([[10, 20]]);

// 折线图相关变量初始化
const seriesArr = ref([])
const nameArr = ref([])
const dateArr = ref([])
const tmpArr = ref([])

//给可视化设置配置项
option.value = {
  xAxis: {
    type: 'category',
    data: arrName
  },
  yAxis: {
    type: 'value'
  },
  tooltip: {
    trigger: 'axis',
    triggerOn: 'mousemove',
    confine: false//解决浮窗被遮挡问题
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    {
      data: arrCount,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
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

//折线图的数据
const option2 = ref();

// 对话框
const dialogFormVisible = ref(false);
const msgDialogVisible = ref(false);
const dialogStatus = ref("create");
const textMap = {
  create: "添加节点",
  update: "修改节点",
  updataPhoto: "上传图片",
  editPhoto: "编辑图片",
};

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

// 重置表单
function resetForm() {
  form.treeName = "";
  form.isShow = true;
  form.keyword = ""
}

// 对话框表单
const dataForm = ref(null);

const rules = reactive({
  treeName: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
  isShow: [{ required: true, message: "请选择", trigger: "blur" }],
  keyword: [{ required: true, message: "请输入描述信息", trigger: "blur" }]
});

const validateIP = (rule, value, callback) => {
  var regIP =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  var regLocalhost = /^localhost(:\d{1,5})?$/;
  if (value === "") {
    callback(new Error("请输入IP地址"));
  } else if (!regIP.test(value) && !regLocalhost.test(value)) {
    callback(new Error("请输入正确的IP地址"));
  } else {
    callback();
  }
};

const validateDirectory = (rule, value, callback) => {
  var reg = /^[a-zA-Z]:(\\|\/)[^\/\:\*\?\"\<\>\|\n]*$/; // 只允许使用有效的文件路径字符串，不允许使用特殊字符
  if (value === "") {
    callback(new Error("请输入图片目录"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的文件目录"));
  } else {
    callback();
  }
};

const autoRules = reactive({
  ip: [
    {
      required: true,
      validator: validateIP,
      trigger: "blur",
    },
  ],
  remotePicture: [
    {
      required: true,
      validator: validateDirectory,
      trigger: "blur",
    },
  ],
});

//添加节点
function createData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      const id = tree.value.getCurrentNode()
        ? tree.value.getCurrentNode().treeId
        : 0;
      addNode({
        isShow: form.isShow ? 1 : 0,
        treeName: form.treeName,
        parentId: id,
        treeType: props.treeType,
        keyword: form.keyword
      }).then(
        (res) => {
          $modal.msgSuccess("添加节点成功");
          getTreeList();
        },
        (error) => {
          $modal.msgError("添加节点失败");
        }
      );
      dialogFormVisible.value = false;
    }
  });
}

//更新节点状态
function updateData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: form.isShow ? 1 : 0,
        treeName: form.treeName,
        treeId: tree.value.getCurrentNode().treeId,
        keyword: form.keyword
      }).then(
        () => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        () => {
          $modal.msgError("修改失败");
          getTreeList();
        }
      );
      dialogFormVisible.value = false;
    }
  });
}

//节点详细信息
function saveNodeDetailsButton() {
  dataForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: form.isShow ? 1 : 0,
        treeId: tree.value.getCurrentNode().treeId,
        treeName: form.treeName,
        shootEqmt: form.shootEqmt,
        shootTime: parseTime(form.shootTime),
        procMeth: form.procMeth,
        keyword: form.keyword,
      }).then(
        (res) => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        (error) => {
          $modal.msgError("修改失败");
          getTreeList();
        }
      );
      msgDialogVisible.value = false;
    }
  });
}

const nodeIsShow = ref(true);
//更新节点状态
const switchChange = () => {
  updateNode({
    //尝试改改
    isShow: nodeIsShow.value ? 1 : 0,
    treeName: form.treeName,
    treeId: tree.value.getCurrentNode().treeId,
    keyword: form.keyword
  }).then(
    () => {
      $modal.msgSuccess("修改成功");
      getTreeList();
    },
    () => {
      $modal.msgError("修改失败");
      getTreeList();
    }
  );
};

// 树控件
const routesData = ref([]);

const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);


const getTreeList = () => {
  getTree(props.treeType, 0, 1).then((res) => {
    routesData.value = res.data?.children;
    const firstLeafNodeParent = findFirstLeafNode(routesData.value);

    if (firstLeafNodeParent) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          rowClick(firstLeafNodeParent);
        }
      });
    }
  });
};

// 递归查找第一个叶子节点的父节点的函数
function findFirstLeafNodeParent(nodes, parentNode = null) {
  for (const node of nodes) {
    if (!node?.children || node?.children.length === 0) {
      // 如果当前节点是叶子节点，返回其父节点
      return parentNode;
    } else {
      const firstLeafParent = findFirstLeafNodeParent(node?.children, node);
      if (firstLeafParent) {
        return firstLeafParent;
      }
    }
  }
  return null;
}

// 递归查找第一个叶子节点的函数
function findFirstLeafNode(nodes) {
  for (const node of nodes) {
    if (!node?.children || node?.children.length === 0) {
      return node;
    } else {
      const firstLeaf = findFirstLeafNode(node?.children);
      if (firstLeaf) {
        return firstLeaf;
      }
    }
  }
  return null;
}

// 获取树
getTreeList();

const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const tree = ref(null);
// 添加节点
function addChildNode() {
  if (!tree.value.getCurrentNode() && routesData.value.length !== 0) {
    $modal.msgWarning("请选择所要添加节点的父节点");
    return;
  }
  resetForm();
  dialogStatus.value = "create";
  dialogFormVisible.value = true;
}
// 修改节点
function updateChildNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  //resetForm();
  dialogStatus.value = "update";
  dialogFormVisible.value = true;
}

//增加节点详细信息
function addNodeMsg() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  msgDialogVisible.value = true;
}

//删除节点
function deleteNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择节点");
    return;
  }
  $modal.confirm("是否删除该节点?").then(() => {
    const curNode = tree.value.getCurrentNode();
    const curNodeTreeIds = getTreeNodeIdsByNode(curNode);
    deleteNodes(curNodeTreeIds).then(() => {
      $modal.msgSuccess("删除节点成功");
      getTreeList();
    });
    tree.value.setCurrentKey(routesData.value[0]?.treeId);
    rowClick();
  });
}

// 定义一个 ref 变量用于跟踪树节点的变化
const selectedTreeNodeId = ref(null);

// 点击树节点时的回调
async function rowClick(nodeObj) {
  rules.value = {};
  if (selectedTreeNodeId.value !== nodeObj.treeId) {
    currentpageNum.value = 1; // 将分页页码设置为1
  }

  //清空tmpArr
  tmpArr.value = []

  // 更新跟踪树节点变化的变量
  selectedTreeNodeId.value = nodeObj.treeId;

  Object.assign(form, {
    treeName: nodeObj.treeName,
    shootEqmt: nodeObj.shootEqmt,
    shootTime: nodeObj.shootTime,
    procMeth: nodeObj.procMeth,
    keyword: nodeObj.keyword,
    ip: nodeObj.ip,
    remotePicture: nodeObj.parentFile,
  });
  const isShowBool = nodeObj.isShow === 1;
  form.isShow = isShowBool;
  nodeIsShow.value = isShowBool;
  loading.value = true;

  // 使用await等待获取完整的图片列表
  updateImageSrcList()
  if (imageSrcList.length === 0) {
    $modal.msgWarning("此节点无图片");
  }
  loading.value = false;

  // 默认选择日期
  if (tree && tree.value.getCurrentNode()?.children) {
    value2.value = [new Date(new Date() - 90 * 24 * 3600 * 1000), new Date()]
    treeIdRank()
    chooseDate();
    isLoading.value = true;
    await getPictureData();
    isLoading.value = false;
  }

}
</script>

<style lang="less" scoped>
.custom-progress {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #409eff;
}

.progress-text {
  position: absolute;
  top: 0;
  right: 0;
  line-height: 10px;
  padding: 0 5px;
  color: #000;
  font-size: 12px;
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
    flex: auto;
  }
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
      color: var(--el-color-primary-light-5);
    }
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

  // span {
  //   font-size: 16px;
  // }
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

/* 新增节点对话框 */
:deep(.el-dialog__header) {
  margin-right: 0px;
  padding-right: 16px;
  background: #1F4E3D;
  margin-top: 10px;

  .el-dialog__title {
    color: white;
  }
}

// :deep(.dialog-footer) {
// .el-button--primary {
//   background: rgb(85, 123, 116);
//   border: #1F4E3D;
// }
// }

:deep(.upload-demo) {
  margin-bottom: 20px;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: green;
  background-color: green;
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
  border-right: 6px solid #E1E1E1;
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

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #f5f5f5;
}

.bg-purple-light {
  background: rgb(32, 177, 159);
}

.grid-content {
  border-radius: 0px;
  height: 50px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.upload {
  width: 100%;
  // border:1px solid #ccc;
}

.mokuai {
  margin-bottom: 0;
  background-color: rgb(183, 202, 189);
  // box-shadow:2px 2px 5px #000;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
}

.right-box {
  margin-left: 20px;
  overflow: auto;
}

.u-title {
  width: 98%;
  margin: 0 auto;
  height: 50px;
}

.u-title ul {
  display: flex;
}

.u-title ul li {
  flex: 1;
  text-align: center;
}

.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<style lang="less" scoped>
.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

/* 按钮样式 */
.addNode-button {
  background: rgb(85, 123, 116);
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
  padding-right: 15px;
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
        content: '';
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
        content: '';
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
  font-size: 13px;
  padding-left: 5px;
  padding-right: 5px;
}

//一级节点选择器
:deep(.el-tree>.el-tree-node> .el-tree-node__content) {
  font-weight: 600;
  color: #80a492;
  height: 28px;

  .el-tree-node__label {
    font-size: 18px;
    font-family: "PingFang SC";
  }
}

//二级节点选择器
:deep(.el-tree>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__content) {
  font-weight: 500;
  color: #99bcac;
  height: 26px;

  .el-tree-node__label {
    font-size: 16px;
  }
}

//三级节点选择器
:deep(.el-tree>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__children>.el-tree-node>.el-tree-node__content) {
  font-weight: 400;
  height: 23px;

  .el-tree-node__label {
    font-size: 14px;
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
  background-color: #F2FBF7;
  padding: 0% !important;
  margin-top: 0% !important;
}


:deep(.el-button) {
  margin: 0% !important;
  margin-right: 20px !important;
}

.mytable {
  background-color: #EEEEEE;
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
}

.search-container{
  display: flex;
  max-width: 1100px;
}

.chooseNameInput,
.chooseDateInput {
  width: 150px;
  flex:0.4 0.4 auto;
}

@media (max-width: 1330px) {
  .my-button {
    margin-right: 2px !important;
    /* 缩小元素之间的间距 */
    font-size: 7px;
  }

  .my_input {
    width: 120px;
    /* 缩小输入框的宽度 */
  }

  .el-button {
    font-size: 12px;
    /* 设置按钮的字体大小为小号 */
    padding: 3px 6px;
    /* 根据需要调整按钮的内边距 */
  }
}
</style>

<!-- 卡片样式 -->
<style lang="less" scoped>
.info-card {
  border: none;
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
  border-top: 1px solid #EBEEF5;

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

.chart {
  height: 500px;
  margin-top: 10px;
  // background-color: #bfa;
}

.chart2 {
  height: 600px;
  margin-top: 40px;
}
</style>
