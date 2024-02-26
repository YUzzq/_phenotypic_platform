<template>
  <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE">
    <el-container style="padding:20px;border: 1px solid #eee" v-loading="loading" :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-aside width="20%" class="mokuai card shadow" style="min-height: calc(100vh - 180px)">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding:0" class="right-box">
        <el-carousel :interval="4000" :autoplay="false" type="card" trigger="click" height="200px">
          <el-carousel-item v-for="(src, index) in imageSrcList" :key="index">
            <el-image :src="getImageUrlByUrl(src.lessPictureUrl)"  fit="contain" @click.passive="clickImage(index)">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>

        <el-divider />
        <el-row v-if="imageSrcList.length !== 0" style="margin-top:10px;">
          <el-col :span="11">
            <el-button disabled>
              待检图片
            </el-button>
            <el-image :src="getImageUrlByUrl(curImageSrc.lessPictureUrl)" :preview-src-list="[getImageUrlByUrl(curImageSrc.pictureUrl)]" class="check_btn">
              <template #error>
                <div class="image_div">
                </div>
              </template>
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="1"></el-col>
          <!--苗盘生长点检测-->
          <el-col :span="11" v-loading="growLoading">
            <!--<el-button @click="checkGrow">-->
            <el-button @click="checkGrow">
              苗盘生长点检测
            </el-button>
            <el-image class="check_btn" :src="getImageUrlByUrl(curGrowthDetected)" :preview-src-list="[getImageUrlByUrl(curGrowthDetectedPre)]">
              <template #error>
                <div class="image_div">
                </div>
              </template>
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </el-col>
        </el-row>
        <el-row v-if="imageSrcList.length !== 0">
          <el-col :span="11" v-loading="holeLoading">
            <el-button @click="checkHoles">
              苗盘穴孔检测
            </el-button>
            <el-image :src="getImageUrlByUrl(curPlugDetected)" :preview-src-list="[getImageUrlByUrl(curPlugDetectedPre)]"  class="check_btn" lazy>
              <template #error>
                <div class="image_div">
                </div>
              </template>
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="11" v-loading="greenLoding">
            <el-button @click="checkGreen">
              苗盘超绿检测
            </el-button>
            <el-image class="check_btn" :src="getImageUrlByUrl(curGreenDetected)" :preview-src-list="[getImageUrlByUrl(curGreenDetectedPre)]">
              <template #error>
                <div class="image_div">
                </div>
              </template>
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup name="plugCheck">
import { ref, getCurrentInstance } from 'vue';
import { getTree } from '@/api/tree';
import { getImagesBynodeId, getCheckedGreenImgByImg, getCheckedHoleImgByImg, getCheckedGrowthImgByImg } from '@/api/identifypre/plug';
import { getImageUrlByUrl } from '@/utils/tree';

// vue实例
const { proxy: { $modal } } = getCurrentInstance();

// 加载
const loading = ref(false);
const imageLoading = ref(false);
const loadingText = ref('加载中...');

// 图片列表
const currentPage = ref(1);
const imageList = ref([]); // 后端发过来的所有图片
const imageSrcList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',]); // 图片列表
const totalPage = ref(null); // 图片总页数

const curImageSrc = ref(imageSrcList.value[0]); // 正在看的图片对象
const curGrowthDetected = ref('');  // 生长点检测略缩图片
const curGrowthDetectedPre = ref('');  // 生长点检测图片
const curPlugDetected = ref('');  //苗盘穴孔检测略缩图片
const curPlugDetectedPre = ref('');  //苗盘穴孔检测图片
const curGreenDetected = ref(''); // 苗盘超绿检测略缩图片
const curGreenDetectedPre = ref(''); // 苗盘超绿检测图片

function clickImage(index) {
  curImageSrc.value = imageSrcList.value[index];
}

function showImg(){
  $modal.msg('等待图片加载');
}

const growLoading = ref(false);
const greenLoding = ref(false);
const holeLoading = ref(false);

// 检测方法

//苗盘生长点检测
function checkGrow() {
  growLoading.value = true;
      getCheckedGrowthImgByImg(curImageSrc.value.pictureId).then(res => {
        curGrowthDetected.value = res.lessPicture;
        curGrowthDetectedPre.value = res.pictureDeal;
        $modal.msg('正在检测中')
        growLoading.value = false;
      }, err => {
        growLoading.value = false;
      })
}
//苗盘穴孔检测
function checkHoles() {
  holeLoading.value = true;
  getCheckedHoleImgByImg(curImageSrc.value.pictureUrl).then(res => {
    curPlugDetected.value = res.lessPicture;
    curPlugDetectedPre.value = res.pictureDeal;
    holeLoading.value = false;
  }, err => {
    holeLoading.value = false;
  });
}
//苗盘超绿检测
function checkGreen() {
  greenLoding.value = true;
  getCheckedGreenImgByImg(curImageSrc.value.pictureUrl).then(res => {
    curGreenDetected.value = res.lessPicture;
    curGreenDetectedPre.value = res.pictureDeal;
    greenLoding.value = false;
  }, err => {
    greenLoding.value = false;
  });
}

// 树控件
const routesData = ref([]);
const defaultProps = ref({
  children: 'children',
  label: 'treeName'
});

const treeType = 2;  // 树的种类
const tree = ref(null); // 树的dom实例

//获得树列表
const getTreeList = () => {
  getTree(treeType, 0, 1).then(res => {
    routesData.value = res.data.children;
    nextTick(() => {
      if (!tree.value.getCurrentNode())
        tree.value.setCurrentKey(routesData.value[0]?.treeId);
      rowClick(tree.value.getCurrentNode());
    });
  });
};

getTreeList();

// 点击树节点回调
async function rowClick(nodeObj) {
  curGrowthDetected.value = "";  // 生长点检测略缩图片
  curGrowthDetectedPre.value = "";  // 生长点检测图片
  curPlugDetected.value = "";  //苗盘穴孔检测略缩图片
  curPlugDetectedPre.value = "";  //苗盘穴孔检测图片
  curGreenDetected.value = ""; // 苗盘超绿检测略缩图片
  curGreenDetectedPre.value = ""; // 苗盘超绿检测图片
  loading.value = true;
  imageList.value = await getImagesBynodeId(nodeObj.treeId);
  imageSrcList.value = imageList.value;
  if(imageList.value.length>1){
    showImg()
  }
  if(imageList.value.length == 0){
    $modal.msg('此节点无图片！');
  }
  currentPage.value = 1;
  curImageSrc.value = imageSrcList.value[0];
  loading.value = false;
}

</script>
<style lang="scss" scoped>
:deep(.el-tree-node__label) {
    font-size: 16px;
    
}

:deep(.el-tree) {
    background-color: rgb(218,227,241);
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background-color: #fff !important;
}

.right-box {
  margin-left: 20px;
}

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.check_btn {
  display: block;
  min-height: 30vh;
  text-align: center;
  line-height: 30vh;
  font-size: 40px;
}

.image_div {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  border: black 1px solid;
}


.mokuai {
  margin-bottom: 0;
  background-color: rgb(218,227,241);
}

.right-box {
  margin-left: 20px;
}

.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<style  scoped>
.info_btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

.el-image img {
  width: 100%;
}
</style>
