<template>
    <div>
        <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
        ">
        基因组预测介绍模块
        </div>
        <div style="width: 90%;margin:0 auto;display: flex;flex-direction: column;gap: 20px;">
            <el-card class="stepcard" >
                <template #header>
                    <div class="card-header">
                        <span>基因组育种决策目的</span>
                    </div>
                </template>
                <div class="stepPs">
                        <p style="line-height: 2em;">&nbsp; &nbsp;&nbsp;&nbsp;基因组育种决策平台是一个基于基因组和表型大数据，通过<strong style="color: #c0392b;">AI算法</strong>实现基因组精准预测的平台。
                        给定任意材料的基因型，预测该材料的<strong style="color: #c0392b;">株高，开花期，产量等关键性状</strong>的表型值。
                        给定任意材料和一组测验种，预测该材料的一般配合力以及杂交组合的育种价值。
                        基于以产量为核心、抗倒耐密早熟为辅的多性状综合选择策略，提供<strong style="color: #c0392b;">育种材料筛选决策建议</strong>。
                    </p>
                    </div>
            </el-card>
            <el-card class="stepcard" >
                <template #header>
                    <div class="card-header">
                        <span>基因组育种决策流程图</span>
                    </div>
                </template>
                <img src="/liucheng1.png" style="width: 100%;">
            </el-card>
            
            <el-card class="stepcard" >
                <template #header>
                    <div class="card-header">
                        <span>基因组育种决策说明</span>
                    </div>
                    </template>

                <div class="stepPs">
                    <p> <strong><el-icon><CaretRight /></el-icon></strong>  训练模型的基因型和表型数据集：
                     1) 材料：<strong style="color: #f39c12;">自交系1404</strong> 个材料， 和<strong style="color: #f39c12;"> 6210份杂交种</strong>。
                     2) 基因型：<strong style="color: #f39c12;">1000万</strong> 的SNP基因型。
                     3) 表型：产量，株高，开花期等<strong style="color: #f39c12;">20个农艺性状</strong></p>
                    <p> <strong><el-icon><CaretRight /></el-icon></strong> 基因组预测模型：
                    1) 统计学习方法：rrBLUP, BayesLASSO, BRR, BayesA, BayesB
                    2) 机器学习方法：SVR, RF, LightGBM
                    3) 深度学习方法：DeepGS, LCNN, DLGWAS, MLP, gMLP</p>
                    <p> <strong><el-icon><CaretRight /></el-icon></strong> 模型选择：通过五折<strong style="color: #c0392b;">交叉验证</strong>评价每个模型，选取最优模型对输入的材料进行杂交选育评估。</p>
                </div>

            </el-card>
        </div>
        <!-- <div style="display: flex;gap: 20px;align-items: stretch">
            <div style="flex: 1;">
                    <img src="/liucheng.png" style="width: 100%;margin: 20px 10px 10px 30px;">
            </div>
            <div style="flex: 1;"
            >
            <el-card class="stepcard" >
                <template #header>
                    <div class="card-header">
                        <span>基因组育种决策说明</span>
                    </div>
                    </template>

                <div class="stepPs">
                    <p> <strong>1.</strong>  训练模型的基因型和表型数据集：</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp; 1) 材料：<strong style="color: #f39c12;">自交系1404</strong> 个材料， 和<strong style="color: #f39c12;"> 6210份杂交种</strong>。</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp; 2) 基因型：<strong style="color: #f39c12;">1000万</strong> 的SNP基因型。</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp; 3) 表型：产量，株高，开花期等<strong style="color: #f39c12;">20个农艺性状</strong></p>
                    <p> <strong>2.</strong> 基因组预测模型：</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp;1) 统计学习方法：rrBLUP, BayesLASSO, BRR, BayesA, BayesB</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp;2) 机器学习方法：SVR, RF, LightGBM</p>
                    <p> &nbsp; &nbsp;&nbsp;&nbsp;3) 深度学习方法：DeepGS, LCNN, DLGWAS, MLP, gMLP</p>
                    <p> <strong>3.</strong> 模型选择：通过五折<strong style="color: #c0392b;">交叉验证</strong>评价每个模型，选取最优模型对输入的材料进行杂交选育评估。</p>
                    <p> <strong>4.</strong> 育种决策步骤：</p>
                    <p>&nbsp; &nbsp;&nbsp;&nbsp;1) 基于平台中的基因组和表型大数据，通过<strong style="color: #c0392b;">AI算法</strong>实现基因组预测。</p>
                    <p>&nbsp; &nbsp;&nbsp;&nbsp;2) 给定任意材料的基因型，预测该材料的育种价值，得到<strong style="color: #c0392b;">PH, DTT, EW等关键性状</strong>的表型值。</p>
                    <p>&nbsp; &nbsp;&nbsp;&nbsp;3) 给定任意材料和一组测验种，预测该材料的一般配合力以及和杂交组合的育种价值。</p>
                    <p>&nbsp; &nbsp;&nbsp;&nbsp;4) 基于以产量为核心、抗倒耐密早熟为辅的多性状综合选择策略，提供<strong style="color: #c0392b;">育种材料筛选决策建议</strong>。</p>
                </div>

            </el-card>

            </div>
        </div> -->
        <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
        ">
        基因组预测功能模块
        </div>
        <el-divider content-position="center">输入材料名称 <strong style="color: #f39c12;">或者</strong>  上传基因型文件</el-divider>
        <div style="display: flex;align-items: center;justify-content: center; gap:80px">
        
            <div style="width: 25%;">
                <div class="">
                    <h4 style="font-weight:bold;color: #c0392b;">输入材料名称</h4>
                </div>
                <div class="input-box">
                    <el-input v-model="materialName.materialName" placeholder="请输入材料名称" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" style="max-height: 400px;"/>
                    <!-- <el-button type="primary" @click="submit" style="font-size:18px;width:30%">提交</el-button> -->
                </div>    
                <div class="eg-box">
                    例如: 
                    <el-button type="text" @click="materialName.materialName='MG_298'">MG_298</el-button>,
                    <el-button type="text" @click="materialName.materialName='MG_806'">MG_806</el-button>,
                    <!-- <el-button type="text" @click="materialName.materialName='MG_833'">MG_833</el-button>, -->
                    <el-button type="text" @click="materialName.materialName='MG_199'">MG_199</el-button>...
                </div> 
            </div> 
            <div style="width: 25%;">
                <div class="">
                    <h4 style="font-weight:bold;color: #c0392b;">材料基因型文件</h4>
                </div>
                <el-upload v-model:file-list="fileList.materialGenoFile" class="upload-demo" accept=".vcf,.csv"
                action="#" :headers="headers" method="post" :auto-upload="false" multiple :limit="1" drag>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                   拖拽文件 或者 <em>点击上传</em>
                </div>
                <!-- <template #tip>
                    <div class="el-upload__tip">
                        csv文件的大小 {{ '<' }} 50mb
                    </div>
                </template> -->
                
                </el-upload>
            </div>
        </div>
        <el-divider content-position="center">使用默认数据库测验种 <strong style="color: #f39c12;">或者</strong> 上传测验种文件</el-divider>
        <div style="display: flex;align-items: center;justify-content: center; gap:80px">

            <div style=" width: 25%;">
                <div style=" text-align: center;">
                    <h4 style="font-weight:bold;color: #c0392b;">系统测验种</h4>
                </div>
                <section class="svg-container">
                    <!-- <h1>默认测验种</h1> -->
                    
                    <svg id="test" class="circle" @click="addcircleActive">
                        <g>
                        <ellipse class="background" ry="60" rx="60" cy="62.5" cx="62.5" stroke-width="2"/>
                        <ellipse class="foreground" ry="60" rx="60" cy="62.5" cx="62.5" stroke-width="2"/>
                        <line class="line line1" x1="52" y1="62" x2="74" y2="62" />
                        <line class="line line2" x1="52" y1="62" x2="74" y2="62" />
                        </g>
                    </svg>
                    </section>
            </div>

            <div style=" width: 25%;">
                <div >
                    <h4 style="font-weight:bold;color: #c0392b;">测验种基因型文件</h4>
                </div>
                <el-upload v-model:file-list="fileList.testGenoFile" class="upload-demo" accept=".vcf,.csv"
                    action="#" :headers="headers" method="post" :auto-upload="false" multiple :limit="1" drag>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                    拖拽文件 或者 <em>点击上传</em>
                    </div>
                    <!-- <template #tip>
                        <div class="el-upload__tip">
                            csv文件的大小 {{ '<' }} 50mb
                        </div>
                    </template> -->
                    
                </el-upload>
            </div>
        
        </div>

        <div style="width:20%;margin: 0 auto;">
            <el-button type="primary" @click="submit" style="font-size:18px;width:50%;height: 40px;letter-spacing: 0.5em;">提交</el-button>
            <el-button type="" @click="exportGeno('C:\\Users\\Administrator\\Desktop\\sdxx\\xm_2_1\\6210\\vcf_template.vcf')" >下载vcf模板</el-button>
        </div>


        <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
        ">
        任务信息展示 
        </div>
        <div class="table-box">
            <el-button style="float: right;margin-bottom: 20px;" size="large" @click="reflushTable" icon="RefreshRight" type="warning" plain>刷新任务表格</el-button>
            <el-table v-loading="loading" trigger :data="tableData" border :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
                <el-table-column label="序号" type="index" width="80" />
                <el-table-column prop="id" label="任务编号" width="180" />
                <el-table-column label="材料名称">
                <template #default="scope">
                    <span style="color: #409EFF; cursor: pointer;" @click="DownloadGenoFile(scope.row)">
                    {{ scope.row.materialName }}
                    </span>
                </template>
                </el-table-column>
                <el-table-column fixed="right" label="材料基因型" >
                    <template #default="scope">
                    <el-button v-if="scope.row.genofile!= null " link type="text" @click="exportGeno(scope.row.genofile)">
                        {{scope.row.genofile.split("\\").pop()}}
                    </el-button>
                    <el-button v-else link type="text" disabled >
                        无文件
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="测验种基因型" >
                    <template #default="scope">
                    <el-button v-if="scope.row.ceyanfile!= null " link type="text" @click="exportGeno(scope.row.ceyanfile)" >
                        {{scope.row.ceyanfile.split("\\").pop()}}
                    </el-button>
                    <el-button v-else link type="text" disabled >
                        无文件
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column
                    label="任务状态"
                    width="150"
                >
                    <template #default="scope">
                    <div id="status">
                        <el-icon                         
                        style="color: #0dbc79;font-size: 25px;"
                        v-show="scope.row.status == 1"><SuccessFilled /></el-icon>
                        <el-icon
                        style="font-size: 25px;"
                        v-show="scope.row.status == 0"
                        ><Loading /></el-icon>
                        <el-icon
                        style="color: #d32f2f; font-size: 25px;"
                        v-show="scope.row.status == 2"
                        ><CircleCloseFilled /></el-icon>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="结果下载" >
                    <template #default="scope">
                    <el-button link type="text" @click="exportPdf(scope.row)" v-show="scope.row.status == 1">
                        导出pdf
                    </el-button>
                    <el-button link type="text" disabled v-show="scope.row.status != 1">
                        导出pdf
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="结果下载" >
                    <template #default="scope">
                        <el-popover
                            placement="top"
                            title="Info"
                            trigger="hover"
                            :content="scope.row.info"
                        >
                            <template #reference>
                                <el-button link type="text">查看提示信息</el-button>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" >
                    <template #default="scope">
                        <el-popconfirm title="确定删除该任务？"  @confirm='handleDelete(scope.row)'>
                            <template #reference>
                                <el-button link type="text">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                        
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-show="total > 0" :total="total" 
            :page-sizes="[3,10, 20, 30, 50]"
            v-model:current-page="queryParams.pageNum" 
            v-model:page-size="queryParams.pageSize"
            layout="total, sizes,prev, pager, next, jumper" 
            @size-change="getList" @current-change="getList" />
        </div>
    </div>
    
</template>

<script setup >
import {ref,reactive,onMounted} from 'vue';
import { getlist2,addMar,deleteMar,downloadFile,addMarNew } from '../../../api/material';
import {listUser} from "@/api/system/user";
import { blobValidate } from '@/utils/param'
import {useRoute,useRouter} from "vue-router"


import { ElMessage, ElMessageBox } from 'element-plus'
let total = ref(0)
let loading = ref(false)
let materialName = ref({materialName:""})
let queryParams = reactive({pageNum:1,pageSize:3})
let tableData = ref([])

const router = useRouter()
onMounted(()=>{
    getList();
    getUserTrans();
    // setInterval(() => {
    //     reflushTable()
    // }, 1000);
})

let userTrans=reactive({})
async function getUserTrans(){
    let res= await listUser({pageNum:1,pageSize:1000})

    res.rows.forEach(function(user,index,array){

        userTrans[user['userId']]=user['userName']

    })
    
}
function getList(){
    loading.value = true
    console.log(queryParams)
    getlist2(queryParams).then(res=>{
        total.value = res.total
        tableData.value = res.rows
        tableData.value.forEach(item=>{
            item.createBy = userTrans[parseInt(item.createBy)]
            if(item.createBy == null) item.createBy = "-"
            if(item.createTime == null) item.createTime = "-"
            if(item.materialName == null) item.materialName = "-"
        })
        loading.value = false
    })
}

let fileList = ref({
    materialGenoFile:[],
    testGenoFile:[]
});
let formdata = new FormData();

async function submit(){
    console.log(fileList.value)
    if(fileList.value.materialGenoFile.length!=0) formdata.append("genoFile",fileList.value.materialGenoFile[0].raw)
    if(fileList.value.testGenoFile.length!=0) formdata.append("ceyanFile",fileList.value.testGenoFile[0].raw)

    if((fileList.value.materialGenoFile.length!=0&&fileList.value.materialGenoFile[0].name.indexOf(" ") != -1)||
    (fileList.value.testGenoFile.length!=0&&fileList.value.testGenoFile[0].name.indexOf(" ") != -1)){
        ElMessage.error("文件名不能包含空格")
        return
    }
    let param={
        param:materialName.value.materialName,
        flag:checktest.value
    }

    if(fileList.value.testGenoFile.length==0&&checktest.value==0){
        ElMessage.error("测验种按钮和文件必须至少输入一个！")
        return
    }
    // await addMar(param,formdata);
    let result= await addMarNew(param,formdata);

    if(result.code==200){
        getList()
        ElMessage.success("添加成功！")
        materialName.value.materialName = "" 

        router.go(0)
    }
   
}
function exportGeno(fileUrl){
    let resource ={resource:fileUrl}
    // if(type=='ceyan'){
    //      resource = {resource:row.ceyanfile}
    // }else{
    //      resource = {resource:row.genofile}
    // }
    let filename=resource.resource.split("\\").pop()
    // console.log(filename)
    downloadFile(resource).then(res => {
      console.log(res)
      const isLogin = blobValidate(res);
      if (isLogin) {
        const blob = new Blob([res])
        saveAs(blob,`${filename}`)
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
function exportPdf(row){
    console.log(row)
    if(row.status!=1){
        ElMessageBox.alert('任务尚未成功时不能导出pdf', '错误', {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            type:'error',
            callback: () => {
            },
        })
        return
    }
    let resource = {resource:row.pdfpath}
    downloadFile(resource).then(res => {
      console.log(res)
      const isLogin = blobValidate(res);
      if (isLogin) {
        const blob = new Blob([res])
        saveAs(blob, `breed${row.id}.pdf`)
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
    // let id = {id:row.id}
    // console.log(id)
    // exportPDF(id).then(res => {
    //   console.log(res)
    //   const isLogin = blobValidate(res);
    //   if (isLogin) {
    //     const blob = new Blob([res])
    //     saveAs(blob, `基因组预测比较-${id.id}.pdf`)
    //     pageLoad.value = false
    //   } else {
    //     const resText = data.text();
    //     const rspObj = JSON.parse(resText);
    //     const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    //     ElMessage.error("下载文件出现错误，请联系管理员！");
    //     pageLoad.value = false
    //   }
    // }).catch(err => {
    //   console.log(err)
    //   pageLoad.value = false
    //   ElMessage.error('下载文件出现错误，请联系管理员！');
    // })
}
async function handleDelete(row){
    console.log(row)
    await deleteMar(row.id)
    getList()
}
function reflushTable(){
    getList()
}

let checktest=ref(0)
function addcircleActive(){
    var div = document.getElementById('test');

    if(div.classList.contains("circleActive")){
        div.classList.remove('circleActive');
        checktest.value=0
    }
    else{
        div.classList.add('circleActive');
        checktest.value=1

    }
    
}
</script>

<style lang="less" scoped>
.input-box{
    // width:30%;
    margin :0 auto;
    // background-color: pink;
    display: flex;
    justify-content: space-between;
    .el-input{
        margin-right: 20px;
        // width: 40%;
    }
    .el-button{
        width:220px;
    }
}
.table-box{
    width: 90%;
    margin: 0 auto;
    // margin-top: 40px;
    margin-bottom: 30px;
}
.eg-box{
    display: flex;
    font-size: 15px;
    color: #8d8484;
    height: 40px;
    line-height: 40px;
    justify-content: center;
    align-items: center;
}
.stepcard{
    width: 90%;
    height: 100%;
    border-color:#18bc9c;
    margin-left: 2rem;
}
.stepcard :deep(.el-card__header){
  background-color: #18bc9c;
  color: #fff;
  font-size: 22px;
  font-weight: bolder;
  letter-spacing: 0.1em;
  padding-bottom: 15px !important;
  /* border: #A5ECE4; */
}

.stepPs p{
    color: #2c3e50;
    text-align: justify;

    // font-size: 10px;
}
:deep(.el-divider__text){
    font-size: 20px;
    color: #17a2b8;
    font-weight: bold;
}


.svg-container {
  height: 124px;
  position: relative;
  width: 124px;

  margin: 0 auto;
  
  h1 {
    color: #aaa;
    font-family: "Source Sans Pro";
    font-size: 1.2rem;
    left: 50%;
    letter-spacing: 4px;
    position: absolute;
    text-align: center;
    top: -60px;
    transform: translateX(-50%);
    width: 100%;
  }
}

.circle {
  height: 124px;
  width: 124px;
  cursor: pointer;
  
  .background {
    fill: transparent;
    stroke: #EE3769;
    transition: all 200ms ease;
  }
  
  .foreground {
    fill: transparent;
    stroke-dasharray: 377;
    stroke-dashoffset: 377;
    stroke: #1abc9c;
    transform-origin: 50% 50%;
    transform: rotate(-270deg);
    transition: all 800ms ease;
  }
  
  .line {
    stroke-width: 2;
    stroke: #EE3769;
    transform-origin: 50% 50%;
    transition: all 500ms ease;
  }
  
  .line2 {
    // transform: rotate(-90deg);
  }
  
//   &:hover {
//     cursor: pointer;
    
//     .background {
//       stroke: transparent;
//     }
    
//     .foreground {
//       stroke-dashoffset: 0;
//       transform: rotate(-90deg);
//     }
    
//     .line {
//       stroke: #1abc9c;
//     }
    
//     .line {
//       transform: rotate(180deg);
//     }
    
//     .line2 {
//       transform: rotate(90deg);
//     }
//   }
}

.circleActive {
    cursor: pointer;
    
    .background {
      stroke: transparent;
    }
    
    .foreground {
      stroke-dashoffset: 0;
      transform: rotate(-90deg);
    }
    
    .line {
      stroke: #1abc9c;
    }
    
    .line {
      transform: rotate(180deg);
    }
    
    .line2 {
      transform: rotate(90deg);
    }
  }

:deep(.el-upload-dragger)
{    
    width: 240px;
    height: 120px;
}

:deep(.el-icon--upload)
{    
    margin: 10px 0 10px;
}

</style>
