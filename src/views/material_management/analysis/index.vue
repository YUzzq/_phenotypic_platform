<template>
  <div v-loading="pageLoad">
    <el-tabs type="border-card" class="demo-tabs" @tab-click="handleTabClick">
    <el-tab-pane label="文件选择">
      <div class="uu">
      文件选择管理
      </div>
      <div class="pheno-box">
        <div class="w" >
          <div class="mb-2 flex items-center text-sm">
            <h4>表型数据集</h4>
          </div>
          <el-tree v-loading="tree2Load" 
           :style="{height: scrollerHeight,overflow:'auto'}"
            ref="tree" 
            :data="phenoRouteData"
            :props="defaultProps" 
            node-key="treeId" 
            default-expand-all
            highlight-current
            :current-node-key="1" 
            :default-current-node-key="firstLeafNodeKey"
            @node-click="rowClick" 
            class="permission-tree" 
            :expand-on-click-node="false" 
            accordion />
        </div>

        <div class="table-box">
          <el-table @select="phandleSelection" v-loading="phenoTableLoad" :data="phenoTableData" style="width: 100%;" border :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="fileName" label="文件名" width="240" />
            <el-table-column prop="speciesName" label="物种名称" width="180" />
            <el-table-column prop="populationName" label="群体名称" width="180" />
            <el-table-column prop="year" label="采集年份" width="180" />
            <el-table-column fixed="right" label="数据类型" >
              <template #default>
                <el-button link type="text" @click="changePhenoToOrigin">原始数据</el-button>
                <el-button link type="text" @click="changePhenoToNewest">最新数据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <div class="geno-box">
        <div class="w" >
          <div class="mb-2 flex items-center text-sm">
            <h4>基因型数据集</h4>
          </div>
          <el-tree v-loading="tree1Load" 
          ref="tree1" 
          :data="genoRouteData" 
          :props="defaultProps" 
          node-key="treeId" 
          default-expand-all
          highlight-current 
          :current-node-key="1" 
          :default-current-node-key="firstLeafNodeKey"
          @node-click="rowClick1" 
          class="permission-tree" 
          :expand-on-click-node="false" 
          accordion />    
        </div>

        <div class="table-box">
          <el-table @select="ghandleSelection" v-loading="genoTableLoad" :data="genoTableData" style="width: 100%;" border :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="fileName" label="文件名" width="240" />
            <el-table-column prop="speciesName" label="物种名称" width="180" />
            <el-table-column prop="populationName" label="群体名称" width="180" />
            <el-table-column fixed="right" label="数据类型">
              <template #default>
                <el-button link type="text" @click="changeGenoToOrigin">原始数据</el-button>
                <el-button link type="text" @click="changeGenoToNewest">最新数据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="文件上传">
      <div class="uu">
        上传文件管理
      </div>
      <div class="upload-box">
          <div class="pheno-upload">
            <div class="mb-2 flex items-center text-sm">
            <h4>表型文件</h4>
            </div>
            <el-upload v-model:file-list="fileList.phenoFile" class="upload-demo"
              action="#"  :headers="headers" method="post" :auto-upload="false" multiple :limit="2">
              <template #trigger>
                <el-button type="primary" style="margin-right: 5px;">点击上传</el-button>
              </template>
              
            </el-upload>
          </div>
          <div>
            <div class="mb-2 flex items-center text-sm">
            <h4>基因型文件</h4>
            </div>
            <el-upload v-model:file-list="fileList.genoFile" class="upload-demo"
              action="#" :headers="headers" method="post" :auto-upload="false" multiple :limit="2">
              <template #trigger>
                <el-button type="primary" style="margin-right: 5px;">点击上传</el-button>
              </template>
              
            </el-upload>
          </div>
          
      </div>
    </el-tab-pane>
    </el-tabs>
    <div class="center-box">
      <div class="card-box">
        <div class="title-box">统计学习模型：</div>
        <div class="ul-box">
          <el-checkbox-group v-model="checkedmethods" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in methods" :label="item" size="large">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="card-box">
        <div class="title-box">机器学习模型：</div>
        <div class="ul-box">
          <el-checkbox-group v-model="checkedmethods1" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in methods1" :label="item" size="large">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="card-box">
        <div class="title-box">深度学习模型：</div>
        <div class="ul-box">
            <el-checkbox-group v-model="checkedmethods2" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in methods2" :label="item" size="large">{{ item }}</el-checkbox>
            </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="submit-box">
      <el-button @click="submitform" style="width: 20%;margin-top: 20px; margin-bottom: 20px; font-size: 24px;background-color: #9ABEAF;" size="large">
        提交
      </el-button>
    </div>
    <div style="
        background: #f6f6f6;
        padding: 10px;
        border: 1px solid #f6f6f6;
      ">      
        
        <div class="uu">
          任务信息展示
        </div>
        <div style="background: #fff; border-radius: 10px; margin-top: 10px;padding: 10px;">
          <el-table stripe v-loading="tableDataLoad" :data="tableData" style="width: 100%" @select="handleSelect" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column prop="breedId" label="任务编号" width="180" />
            <el-table-column label="表型文件"  >
              <template #default="scope">
                <span style="color: #409EFF; cursor: pointer;" @click="DownloadPhenoFile(scope.row)">
                  {{ scope.row.phenofileName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="基因型文件">
              <template #default="scope">
                <span style="color: #409EFF; cursor: pointer;" @click="DownloadGenoFile(scope.row)">
                  {{ scope.row.genofileName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" />
            <el-table-column prop="submitTime" label="提交时间" />
            <el-table-column prop="finishTime" label="完成时间"  />
            <el-table-column prop="status" label="任务状态"  />
            <el-table-column prop="result" label="结果"  >
              <template #default="scope">
                <el-button link type="text" @click="hanldeResult(scope.row)">
                  预测结果
                </el-button>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="结果下载" >
                <template #default="scope">
                  <el-button link type="text" @click="DownloadPdf(scope.row)">
                    下载
                  </el-button>
                </template>
              </el-table-column>
            
          </el-table>
          <el-pagination v-show="total > 0" :total="total" 
            :page-sizes="[10, 20, 30, 50]"
            v-model:current-page="queryParams.pageNum" 
            v-model:page-size="queryParams.pageSize"
            layout="total, sizes,prev, pager, next, jumper" 
            @size-change="getList" @current-change="getList" />
        </div>
        <el-dialog v-model="dialogVisible" title="预测结果">
          <h5>模型预测结果如下</h5>
          <h6 v-for="item in arr">
            {{ item }}
          </h6>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogVisible = false">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
    </div>
  </div>
  
</template>

<script setup>
import { getTrees,ddd, ppp, downloadFile,getPdf } from "@/api/material";
import { listFile, listFileGeno } from '@/api/infomanage/phenotype.js';
import { getToken } from "@/utils/auth"
import {ElMessage } from "element-plus";
import {reactive, ref,onMounted, nextTick,computed } from "vue";
import { getBreed,getResult } from "../../../api/system/breed";
import { blobValidate } from '@/utils/param'
let pageLoad = ref(false)
let dialogVisible = ref(false)
let fileList = ref({
  phenoFile:[],
  genoFile:[]
});
let formObj = ref({
  phenoDataType:"原始数据",
  genoDataType:"原始数据",
  models:""
});
let total = ref(0)
let queryParams = reactive({
  pageNum:1,
  pageSize:10
})
const scrollerHeight = computed(()=>{
  return (window.innerHeight - 400) + 'px'
})
let data = reactive({
  methods:['rrBLUP', 'BL', 'BRR', 'BayesA','BayesB'],
  methods1: ['SVR', 'RF', 'LightGBM'],
  methods2: ['DeepGS', 'ResGS', 'LCNN', 'MLP','gMLP']
})
let dialogFormVisible = ref(false)
const checkedmethods = ref([])
const checkedmethods1 = ref([])
const checkedmethods2 = ref([])
const methods = ['rrBLUP', 'BL', 'BRR', 'BayesA','BayesB']
const methods1 = ['SVR', 'RF', 'LightGBM']
const methods2 = ['DeepGS', 'ResGS', 'LCNN', 'MLP','gMLP']
const handleCheckedCitiesChange = (value) => {
  formObj.value.models = ""
  formObj.value.models = checkedmethods.value.concat(checkedmethods1.value,checkedmethods2.value)
  console.log(formObj.value.models)
}
const headers = ref({ Authorization: "Bearer " + getToken() });
const modelOptions = ref([
  {value:"0",label:"RandomForest"},
  {value:"1",label:"LightGBM"},
  {value:"2",label:"GradientBoosting"},
  {value:"3",label:"XGBoost"},
  {value:"4",label:"GaussianNB"},
  {value:"5",label:"SVM"},
])
let tableDataLoad = ref(true)
onMounted(()=>{
  getList()
})
function getList(){
  tableDataLoad.value = true
  getBreed(queryParams).then(res=>{
    total.value = res.total
    tableData.value = res.rows
    tableData.value.forEach(item=>{
      if(item.status == 0) item.status = "运行中"
      else if(item.status == 1) item.status = "完成"
      else item.status = "失败"
      if(item.createBy == null) item.createBy = "-"
      if(item.finishTime == null) item.finishTime = "-"
    })
    tableDataLoad.value = false
  })
}

let dialogTableVisible = ref(false)
// 树控件
const phenoRouteData = ref([]);
const genoRouteData = ref([]);
// 树组件节点属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});
var tableData = ref([]);
const tree = ref(null); // 数的dom实例
const tree1 = ref(null); // 数的dom实例
const histogramLoading = ref(false)
let tree1Load = ref(true)
let tree2Load = ref(false)
let idArr = ref([])
// 获取整棵树
const getTreeList = (id = 4) => {
  getTrees(id).then((res) => {
    console.log(res)
    phenoRouteData.value = res.data.children;
    const firstLeafNodeParent = findFirstLeafNodeParent(phenoRouteData.value);

    if(firstLeafNodeParent) {
      nextTick(()=>{
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          rowClick(firstLeafNodeParent);
        }
      })
    }
    tree1Load.value = false
  });
};
//你们彭霜凌学姐写的函数 好评！
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
const firstLeafNodeKey = ref(null);
const getTreeList1 = (id = 5) => {
  getTrees(id).then((res) => {
    console.log(res)
    genoRouteData.value = res.data.children;
    const firstLeafNode = findFirstLeafNode(genoRouteData.value);
    if (firstLeafNode) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNode.treeId);
          rowClick1(firstLeafNode);
        }
      });
    }
    // nextTick(()=>{
    //   if(!tree1.value.getCurrentNode())
    //   tree1.value.setCurrentNode(genoRouteData.value[0])
    // rowClick1(tree.value.getCurrentNode())
    // })
    tree2Load.value = false
  });
};
getTreeList();
getTreeList1();
//树控件点击回调
const senceOptions = ref([
  { value: "1", label: "基因组预测模块" },
  { value: "2", label: "回交改良" },
  { value: "3", label: "DH系诱导" },
]);

//点击Tree拿到文件信息
let PhenoTypeData = ref([]);
let GeneData = ref([]);
let fromQuery = ref({
  pageSize: 50,
  pageNum: 1
})
let phenoTableData = ref([])
let genoTableData = ref([])
let genoTableLoad = ref(false)
let phenoTableLoad = ref(false)
function rowClick(nodeObj) {
  phenoTableLoad.value = true
  fromQuery.value = nodeObj;
  console.log(phenoRouteData)
    listFile(fromQuery.value).then(res => {
      console.log(res)
      phenoTableData.value = res.rows
      PhenoTypeData.value = [];
      PhenoTypeData.value = res.rows
      phenoTableLoad.value = false
    })

}
function rowClick1(nodeObj) {
  console.log(nodeObj)
  genoTableLoad.value = true
  fromQuery.value= nodeObj;
  console.log(phenoRouteData)
    listFileGeno(fromQuery.value).then(res => {
      genoTableData.value = res.rows
      genoTableData.value.forEach(item=>{
       let nameArr = item.fileName.split('_') 
       console.log(item.fileName.split('_'));
       item.speciesName = nameArr[0];
       item.populationName = nameArr[1] 
      })
      // genoTableData.value
      GeneData.value = []
      GeneData.value = res.rows
      genoTableLoad.value = false
    })
}
let formdata = new FormData();

var fileName = 
{
  phenoFileName:"",
  genoFileName:"",
}
function handleSelect(selection, row) {
  console.log(selection, row)
}
function phandleSelection(selection,row) {
  console.log(selection)
  console.log(row)
  formObj.value.phenoFileId = row.fileId;
  fileName.phenoFileName = row.fileName
}
function ghandleSelection(selection,row) {
  console.log(selection)
  console.log(row)
  formObj.value.genoFileId = row.fileId;
  fileName.genoFileName = row.fileName
}
var tabLable = "";
function handleTabClick(pane,ev){
  console.log(pane)
  console.log(ev)
  tabLable = pane.props.label
}
async function submitform(){
  if(tabLable == "文件上传"){
    pageLoad.value = true
    formdata.append("phenoFile",fileList.value.phenoFile[0].raw)
    formdata.append("genoFile",fileList.value.genoFile[0].raw)
    await ppp(formObj.value,formdata).then(res=>{
      pageLoad.value = false
    }).catch(err=>{
      ElMessage.warning("系统繁忙，请稍后再试...")
      pageLoad.value = false
    });
    getList()
  }
  else{
    tableDataLoad.value = true
    await ddd(formObj.value).then(res=>{
      console.log(res)
    })
    getList()
  }
  
  console.log(formdata)
  
}
  function DownloadGenoFile(row){
  console.log(row)
  let resource = {resource:row.genofile}
      downloadFile(resource).then(res => {
      console.log(res)
      const isLogin = blobValidate(res);
      if (isLogin) {
        const blob = new Blob([res])
        saveAs(blob, `breed${new Date().getTime()}.csv`)
      } else {
        const resText = data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error(errMsg);
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error('下载文件出现错误，请联系管理员！');
    })
  }
    let result = reactive({
      models:"",
      result:""
    })
    let arr = ref([]);
  function hanldeResult(row){
      console.log(row)
      // var id = {id:row.breedId}
      // getResult(id)
      console.log(row.models)
      result.models = row.models
      result.result = row.result
      arr.value = row.result.split('*')
      console.log(arr)
      if(result.result == null) result.result = "空"
      dialogVisible.value = true

  }
  function DownloadPhenoFile(row){
  console.log(row)
  let resource = {resource:row.phenofile}
      downloadFile(resource).then(res => {
      console.log(res)
      const isLogin = blobValidate(res);
      if (isLogin) {
        const blob = new Blob([res])
        saveAs(blob, `breed${new Date().getTime()}.csv`)
      } else {
        const resText = data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        Message.error(errMsg);
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error('下载文件出现错误，请联系管理员！');
    })
  }
  function changePhenoToOrigin(){
    formObj.value.phenoDataType = "原始数据"
    ElMessage.success("选择成功！")
  }
  function changePhenoToNewest(){
    formObj.value.phenoDataType = "最新数据"
    ElMessage.success("选择成功！")
  }
  function changeGenoToOrigin(){
    formObj.value.genoDataType = "原始数据"
  }
  function changeGenoToNewest(){
    formObj.value.phenoDataType = "最新数据"
    ElMessage.success("选择成功！")
  }
  async function DownloadPdf(row){
    console.log(row)
    pageLoad.value = true
    var id = {breedId:row.breedId}
    var url = {resource:""}
    await getPdf(id).then(res => {
      url.resource = res.msg
    })
    await downloadFile(url).then(res => {
      console.log(res)
      const isLogin = blobValidate(res);
      if (isLogin) {
        const blob = new Blob([res])
        saveAs(blob, `基因组预测比较-${id.breedId}.pdf`)
        pageLoad.value = false
      } else {
        const resText = data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error("下载文件出现错误，请联系管理员！");
        pageLoad.value = false
      }
    }).catch(err => {
      console.log(err)
      pageLoad.value = false
      ElMessage.error('下载文件出现错误，请联系管理员！');
    })
    
  }

</script>
<style scoped lang="less">
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
.dialog-footer {
  margin-top: 15px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.pheno-box {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.table-box{
    flex: 1;
    margin: 20px;
  }
.geno-box {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 20px;
}
.center-box{
  padding: 10px;
}
.ui.raised.segment {
    -webkit-box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
      0 2px 10px 0 rgba(34, 36, 38, 0.15);
    box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
      0 2px 10px 0 rgba(34, 36, 38, 0.15);
  }
  .ui.segment {
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
    box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
    margin: 1rem 0;
    padding: 1em 1em;
    border-radius: 0.28571429rem;
    border: 1px solid rgba(34, 36, 38, 0.15);
    width: 25%;
    height: 180px;
  }
  
  .ui.segment:first-child {
    margin-top: 0;
  }
  
  .ui.segment:last-child {
    margin-bottom: 0;
  }
  
  .ui.teal.ribbon.label {
    border-color: #00827c !important;
  }
  
  .ui.teal.label,
  .ui.teal.labels .label {
    background-color: #00b5ad !important;
    /* border-color: #00b5ad!important; */
    color: #fff !important;
  }
  
  .ui.ribbon.label {
    left: calc(-1rem - 1.2em);
    margin-right: -1.2em;
    padding-left: calc(1rem + 1.2em);
    padding-right: 1.2em;
  }
  
  .ui.ribbon.label {
    cursor: default;
    position: relative;
    margin: 0;
    min-width: -webkit-max-content;
    min-width: 400px;
    min-width: max-content;
    border-radius: 0 0.28571429rem 0.28571429rem 0;
    border-color: rgba(0, 0, 0, 0.15);
  }
  .ui.label,
  .ui.labels .label {
    /* font-size: 0.85714286rem; */
    font-size:0.95rem;
  }
  .ui.label {
    display: inline-block;
    line-height: 1;
    vertical-align: baseline;
    margin: 0 0.14285714em;
    background-color: #e8e8e8;
    background-image: none;
    padding: 0.5833em 0.833em;
    color: rgba(0, 0, 0, 0.6);
    text-transform: none;
    font-weight: 700;
    border: 0 solid transparent;
    border-radius: 0.28571429rem;
    -webkit-transition: background 0.1s ease;
    transition: background 0.1s ease;
  }
  
  .ui.ribbon.label:after {
    position: absolute;
    content: "";
    top: 100%;
    left: 0;
    background-color: transparent !important;
    border-style: solid;
    border-width: 0 1.2em 1.2em 0;
    border-color: transparent;
    border-right-color: inherit;
    width: 0;
    height: 0;
  }
  
  .ui.teal.labels .label:hover,
  a.ui.teal.label:hover {
    background-color: #009c95 !important;
    border-color: #009c95 !important;
    color: #fff !important;
  }
.model-box{
  // margin: 0 auto;
  // margin-right: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.datadiv{
  height: 160px;
}
.submit-box{
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-box{
  display: flex;
  flex-direction: row;
  justify-content:flex-start;
  .pheno-upload{
    margin-right: 50px;
  }
}
.w{
  background: #f6f6f6;
  border-radius: 10px;
  padding: 10px;
  width:25%;
}
.uu{
  background: #9abeaf;
  margin: 10px 0;
  color: white;
  height: 50px;
  border-radius: 10px;
  line-height: 50px;
  padding-left: 10px;
  box-shadow: var(--el-box-shadow-lighter);
}
.center-box{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top:20px;
  .card-box{
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    .title-box{
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    .ul-box{
      // width:65%;
      height: 40px;
      line-height: 40px;
      width: 60%;
      // background-color: red;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}

</style>