<template>
  <div
    style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    "
  >
    <el-container
      style="padding: 20px; border: 1px solid #eee"
      v-loading="loading"
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
        />
      </el-aside>
      <!-- //右边的盒子-->

      <el-main width="78%" style="padding: 0" class="right-box">
        <!--另一种图片展示样式-->
        <!--操作部分 
        <h3>叶片检测：</h3>
        <div v-if="imageSrcList.length === 0">无图片</div>
        <el-row v-else v-loading="imageLoading" justify="start" align="middle">
          <el-col :span="2" class="info_btn">
            <el-button plain @click.passive="prevPage" circle icon="ArrowLeftBold" :disabled="currentPage === 1">
            </el-button>
          </el-col>
          <el-col v-for="(src, index) in imageSrcList" :key="index" :span="4">
            <el-image :src="getImageUrlByUrl(src.pictureUrl)" fit="contain" @click.passive="clickImage(index)">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="2" class="info_btn">
            <el-button plain @click.passive="nextPage" circle icon="ArrowRightBold"
              :disabled="currentPage === totalPage">
            </el-button>
          </el-col>
        </el-row>
      -->
        <el-carousel
          :interval="4000"
          :autoplay="false"
          trigger="click"
          type="card"
          height="200px"
        >
          <el-carousel-item v-for="(src, index) in imageSrcList" :key="index">
            <el-image
              :src="getImageUrlByUrl(src.lessPictureUrl)"
              fit="contain"
              @click.passive="clickImage(index)"
              lazy
            >
              <template #placeholder>
                <div class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
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

        <el-row v-if="imageSrcList.length !== 0">
          <el-col :span="12">
            <el-button disabled> 待检图片 </el-button>
            <el-image
              :src="getImageUrlByUrl(curImageSrc.lessPictureUrl)"
              :preview-src-list="[getImageUrlByUrl(curImageSrc.pictureUrl)]"
              class="check_btn"
            >
              <template #placeholder>
                <div class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
              </template>
              <template #error>
                <div class="image_div"></div>
              </template>
            </el-image>
            <div v-loading="bladeLoading">
              <!--<el-button @click="checkBlade" v-hasPermi="['system:blade:check']">-->
              <el-button @click="checkBlade"> 叶片检测 </el-button>
              <el-image
                class="check_btn"
                :src="getImageUrlByUrl(lessBladeSrc)"
                :preview-src-list="[getImageUrlByUrl(bladeSrc)]"
              >
                <template #placeholder>
                  <div class="image-slot">
                    Loading<span class="dot">...</span>
                  </div>
                </template>
                <template #error>
                  <div class="image_div"></div>
                </template>
              </el-image>
            </div>
          </el-col>
          <el-col :span="12" style="padding-left: 10px">
            <div class="bladeContainer">
              <div class="bladeTitle">叶片检测结果</div>
            </div>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="variety" label="类别" />
              <el-table-column prop="data" label="值" />
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup name="bladeCheck">
import { ref, getCurrentInstance } from "vue";
import { getTree } from "@/api/tree";
import {
  getImagesBynodeId,
  getCheckedLeafImgByImg,
} from "@/api/identifypre/blade";
import { getImageUrlByUrl } from "@/utils/tree";

// vue实例
const {
  proxy: { $modal },
} = getCurrentInstance();

// 加载
const loading = ref(false);
const imageLoading = ref(false);
const loadingText = ref("加载中...");

// 表格数据
const tableData = ref([
  {
    variety: "检测日期",
    data: "",
  },
  {
    variety: "出苗率",
    data: "",
  },
  {
    variety: "弱苗位置",
    data: "",
  },
  {
    variety: "无苗位置",
    data: "",
  },
  {
    variety: "补苗量",
    data: "",
  },
]);

// 图片列表
const currentPage = ref(1);
const totalPage = ref(null); // 图片总页数
const imageSrcList = ref([]); // 图片列表
const imageList = ref([]);
const curImageSrc = ref(""); // 正在看的图片连接
const bladeLoading = ref(false);
const bladeSrc = ref("");
const lessBladeSrc = ref(""); // 叶片检测后略缩图片链接

function clickImage(index) {
  curImageSrc.value = imageSrcList.value[index];
}

function showImg() {
  $modal.msg("等待图片加载");
}

/*
// 上一页图片
async function prevPage() {
  currentPage.value--;
  imageLoading.value = true;
  let start = (currentPage.value - 1) * 5;
  imageSrcList.value = imageList.value.slice(start, start + 5);
  curImageSrc.value = imageSrcList.value[0];
  imageLoading.value = false;
}

// 下一页图片
async function nextPage() {
  //console.log('a');
  currentPage.value++;
  imageLoading.value = true;
  let start = (currentPage.value - 1) * 5;
  imageSrcList.value = imageList.value.slice(start, currentPage.value === totalPage.value ? start + (imageList.value.length - start) % 5 : start + 5);
  curImageSrc.value = imageSrcList.value[0];
  imageLoading.value = false;
}
*/

// 检测方法
function checkBlade() {
  bladeLoading.value = true;
  imageLoading.value = true;
  getCheckedLeafImgByImg(curImageSrc.value.pictureUrl).then(
    (res) => {
      bladeSrc.value = res.picture;
      lessBladeSrc.value = res.lesspicture;
      delete res.lesspicture;
      tableData.value.map((item) => {
        item.data = res[item.variety];
        return item;
      });
      bladeLoading.value = false;
      imageLoading.value = false;
    },
    (err) => {
      bladeLoading.value = false;
      imageLoading.value = false;
    }
  );
}

// 树控件
const routesData = ref([]);
const defaultProps = ref({
  children: "children",
  label: "treeName",
});
const treeType = 2;
const tree = ref(null);

const getTreeList = () => {
  getTree(treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    nextTick(() => {
      if (!tree.value.getCurrentNode())
        tree.value.setCurrentKey(routesData.value[0]?.treeId);
      rowClick(tree.value.getCurrentNode());
    });
  });
};

getTreeList();

async function rowClick(nodeObj) {
  tableData.value[0].data = "";
  tableData.value[1].data = "";
  tableData.value[2].data = "";
  tableData.value[3].data = "";
  tableData.value[4].data = "";
  bladeSrc.value = "";
  lessBladeSrc.value = "";
  loading.value = true;
  imageList.value = await getImagesBynodeId(nodeObj.treeId);
  imageSrcList.value = imageList.value;
  if (imageList.value.length > 1) {
    showImg();
  }
  if (imageList.value.length == 0) {
    $modal.msg("此节点无图片！");
  }
  currentPage.value = 1;
  totalPage.value = Math.ceil(imageList.value.length / 5);
  curImageSrc.value = imageSrcList.value[0] ? imageSrcList.value[0] : "";
  loading.value = false;
}
</script>
<style lang="scss" scoped>
:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-tree) {
  background-color: rgb(218, 227, 241);
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

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.mokuai {
  margin-bottom: 0;
  background-color: rgb(218, 227, 241);
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
.check_btn {
  display: block;
  min-height: 25vh;
  text-align: center;
  line-height: 25vh;
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

.image_item {
  height: 200px;
}

.info_btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

.bladeContainer {
  height: 40px;
  margin: auto;
  margin-bottom: 10px;
  width: 120px;
  background-color: rgb(218, 227, 241);
  border-radius: 40px;
  text-align: center;
}

.bladeTitle {
  font-size: 14px;
  line-height: 40px;
  color: grey;
  letter-spacing: 2px;
}
</style>
