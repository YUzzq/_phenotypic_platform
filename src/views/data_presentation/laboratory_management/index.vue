<template>
  <div
    style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    "
  >
    <el-container
      style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!--树-->
      <el-aside
        width="20%"
        class="mokuai card shadow element-plus-tree"
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
          :default-current-node-key="firstLeafNodeKey"
          @node-click="rowClick"
          class="permission-tree"
          :check-strictly="true"
          :check-on-click-node="true"
          :expand-on-click-node="false"
        />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0" class="right-box">
        <el-card class="card-container" v-show="fileChooseShow">
          <template #header>
            <div class="card-header">
              <span>表型文件选择</span>
            </div>
          </template>
          <div
            v-if="fileList.length"
            class="big-wrapper"
            style="margin-top: 10px"
          >
            <div class="form_choose">
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
            </div>
            <el-row>
              <el-button
                @click="chooseForm"
                v-loading="chooseLoading"
                size="large"
                type="primary"
                style="width: 80px"
                >确定</el-button
              >
            </el-row>
          </div>
          <div v-else>此节点下无文件</div>
        </el-card>
        <el-card class="card-container" v-show="routerFileShow">
          <template #header>
            <div class="card-header">
              <span>表型文件选择</span>
            </div>
          </template>
          <div class="big-wrapper" style="margin-top: 10px">
            <div class="form_choose">
              <h3>文件名 : {{ routerFileName }}</h3>
              <h3>材料ID : {{ routerMaterialId }}</h3>
            </div>
          </div>
        </el-card>

        <div
          class="big_container home"
          v-show="laboratoryShow"
          v-loading="laboratoryLoading"
        >
          <el-card class="card-container" >
            <template #header>
              <div class="card-header">
                <span>多试验分析</span>
              </div>
            </template>
            <div style="margin-top: 10px">
              <div v-show="fileChooseShow">
                <div class="input-title">
                  <h1>请选择材料</h1>
                </div>
                <div class="search_table">
                  <el-select
                    v-model="traitValue"
                    filterable
                    placeholder="请选择材料id"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-button
                    style="margin-left: 20px !important"
                    @click="search_trait"
                    v-loading="searchLoading"
                    icon="Search"
                    type="primary"
                    >搜索</el-button
                  >
                </div>
              </div>
              <!--  第二部分表单 -->
              <div class="labotatory_form">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 90%; margin: 30px auto"
                  class="trait-form-table"
                  v-show="laboratorFormShow"
                  stripe
                >
                  <el-table-column
                    label="序号"
                    width="80"
                    type="index"
                    align="center"
                    :index="indexMethod"
                  />
                  <el-table-column
                    prop="traitName"
                    label="性状名"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="average"
                    label="平均值"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="maxNum"
                    label="最大值"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="minNum"
                    label="最小值"
                    align="center"
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
import { ref, reactive, onMounted, watch, computed } from "vue";
import { getTree } from "@/api/tree";
import { listFile } from "@/api/infomanage/phenoType";
import {
  getDataByFormId,
  getLocationByTraitId,
  getMaterialIdByFileId,
  dataAnalysisByMaterilId,
} from "@/api/data_presentation/laboratory_management";
const route = useRoute();

const laboratoryShow = ref(false);
const fileChooseShow = ref(true);
const routerFileShow = ref(false);
const traitValue = ref("");

const tableData = reactive([
  {
    traitId: 266,
    traitName: "茎腐病",
    average: 0.0,
    maxNum: 0.0,
    minNum: 0.0,
  },
]);

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

const traitFileId = ref(1);
const laboratoryLoading = ref(false);

const chooseLoading = ref(false);

//请求性状信息
function chooseForm() {
  laboratoryLoading.value = true;
  laboratoryShow.value = true;
  laboratorSearchShow.value = true;
  chooseLoading.value = true;
  traitFileId.value = declaredDates.value.fileId;
  laboratorFormShow.value = false;

  getMaterialIdByFileId(traitFileId.value)
    .then((res) => {
      laboratoryShow.value = true;
      laboratoryLoading.value = false;
      chooseLoading.value = false;
      $modal.msgSuccess("选择成功！");
      console.log(res, "hhhh");

      states.value = res.data;
      options.value = states.value.map((item) => {
        return { value: item, label: item };
      });
      traitValue.value = options.value[0].value;
      const materilId = traitValue.value;
      const id = traitFileId.value;
      dataAnalysisByMaterilId(id, materilId)
        .then((res) => {
          searchLoading.value = false;
          laboratorFormShow.value = true;

          updateTableData(res.data);
          searchLoading.value = false;
          $modal.msgSuccess("搜索成功！");
          console.log(res, "res");
        })
        .catch((err) => {
          console.error(err);
          searchLoading.value = false;
        });
    })
    .catch((err) => {
      console.error(err);
      laboratoryLoading.value = false;
      chooseLoading.value = false;
    });
  laboratoryLoading.value = false;
  chooseLoading.value = false;
}

const laboratorFormShow = ref(false);
const laboratorSearchShow = ref(true);
const searchLoading = ref(false);

function search_trait() {
  searchLoading.value = true;
  console.log(traitValue.value, "9090");
  const materilId = traitValue.value;
  const id = traitFileId.value;
  dataAnalysisByMaterilId(id, materilId)
    .then((res) => {
      searchLoading.value = false;
      laboratorFormShow.value = true;

      updateTableData(res.data);
      searchLoading.value = false;
      $modal.msgSuccess("搜索成功！");
      console.log(res, "res");
    })
    .catch((err) => {
      console.error(err);
      searchLoading.value = false;
    });
}

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

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
      declaredDates.value = fileList.value[0];
      chooseForm();
    })
    .catch((err) => {
      //console.log(fileList);
    });
}

// 树控件
const routesData = ref([]);
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = 2;
const tree = ref(null); // 树的dom实例

const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const getTreeList = () => {
  getTree(treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    const firstLeafNodeParent = findFirstLeafNodeParent(routesData.value);

    if (firstLeafNodeParent) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          if(!route.query.fileId){
            rowClick(firstLeafNodeParent);
          }
        }
      });
    }
  });
};

// 递归查找第一个叶子节点的父节点的函数
function findFirstLeafNodeParent(nodes, parentNode = null) {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      // 如果当前节点是叶子节点，返回其父节点
      return parentNode;
    } else {
      const firstLeafParent = findFirstLeafNodeParent(node.children, node);
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
    if (!node.children || node.children.length === 0) {
      return node;
    } else {
      const firstLeaf = findFirstLeafNode(node.children);
      if (firstLeaf) {
        return firstLeaf;
      }
    }
  }
  return null;
}

// 获取表格日期
function getTableDate() {
  return Object.keys(tableData.value[0]);
}

const declaredDates = ref(null);
function handleCheckedDatesChange(val) {
  console.log(val.fileId, "opop");
}

//选择框
const value = ref("");
const reqLoading = ref(false);
const options = ref([]);

const states = ref(["110", "110", "120", "900", "800", "700"]);
const routerFileName = ref("");
const routerMaterialId = ref("");

function rowClick(nodeObj) {
  fileChooseShow.value = true;
  routerFileShow.value = false;
  histogrM3DShow.value = false;
  laboratoryShow.value = false;
  loading.value = true;
  histogramLoading.value = false;
  traitChoosed.value = false;
  getList();
}

onMounted(async () => {
  getTreeList();
  routerFileName.value = route.query.fileName;
  routerMaterialId.value = route.query.materialId;
  if (route.query.fileId && route.query.materialId) {
    dataAnalysisByMaterilId(route.query.fileId, route.query.materialId)
      .then((res) => {
        routerFileShow.value = true;
        fileChooseShow.value = false;
        laboratoryShow.value = true;
        laboratorFormShow.value = true;
        laboratorSearchShow.value = false;
        updateTableData(res.data);
        $modal.msgSuccess("获取信息成功！");
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
</script>

<style lang="less" scoped>
:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-form-item__label) {
  width: 110px;
}

:deep(.el-tree) {
  /* background-color: rgb(183, 202, 189); */
  background: transparent;
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: #fff !important;
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
  left: 0;
  right: 0;
  bottom: 0;
  width: 200px;
  // background: url(@/assets/img/tree/tree2.jpg) no-repeat center center / cover;
  background-color: #f2fbf7;
  opacity: 1;
  width: 100%;
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
  // box-shadow:2px 2px 5px #000;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}

:deep(.permission-tree) {
  margin: 10px;
  margin-bottom: 30px;
  background: #f2fbf7;
  padding-right: 15px;
}
:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  line-height: 30px;
  font-size: 14px;
  color: black;
  padding: 0%;
}
:deep(.el-tree-node__content:hover) {
  color: #ffd04b;
  color: #f56c6c;
  background-color: rgba(198, 198, 198, 0.3);
  .el-tree-node__expand-icon {
    color: #ffd04b;
    color: #f56c6c;
  }
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
    > .el-tree-node {
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
    }
    /* / 设置子节点左外边距 */
    /* ---- ---- ---- ---- /（新增辅助线）---- ---- ---- ---- */
  }
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: rgba(rgb(243, 121, 121), 0.3) !important;
}

.footer {
  //background-color: red;
  position: relative;
  height: auto;

  .pag {
    position: absolute;
    bottom: 0;
    padding-top: 100px;
    //background-color: blue;
  }
}

.filter-item {
  margin-right: 20px;
}

:deep(el-col) {
  padding: 0%;
}

.myform {
  display: flex !important;
  align-items: center !important;
  height: auto;
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
    > .el-tree-node {
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
:deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  font-weight: 600;
  color: #80a492;
  height: 28px;
  .el-tree-node__label {
    font-size: 18px;
    font-family: "PingFang SC";
  }
}
//二级节点选择器
:deep(
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
  ) {
  font-weight: 500;
  color: #99bcac;
  height: 26px;
  .el-tree-node__label {
    font-size: 16px;
  }
}
//三级节点选择器
:deep(
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
  ) {
  font-weight: 400;
  height: 23px;
  .el-tree-node__label {
    font-size: 14px;
  }
}
// 设置高亮颜色
:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
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
  padding: 0% !important;
  background-color: #f2fbf7;
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-card__header) {
  background: #9abeaf;
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
  border-top: 1px solid #ebeef5;

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
</style>