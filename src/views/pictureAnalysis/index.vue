<template>
  <div>
    <div class="article_banner">
      <img src="@/assets/img/banner/analysis_bg.jpg" alt="banner" />
      <div class="title">图片分析</div>
    </div>
    <div style="margin:0 10px"><el-alert show-icon title="上传文件，即可开始分析" type="success"> </el-alert></div>
    <el-upload
      class="upload-container"
      drag
      multiple
      :action="uploadFileUrl"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :file-list="fileList.value"
      :on-remove="handleRemove"
      :accept="'image/png'"
      :show-file-list="false"
      :headers="headers"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件 or <em>点击来上传</em></div>
    </el-upload>
    <div class="searchContainer">
      <el-input
        style="margin-right: 10px;" 
        clearable 
        v-model.trim="searchForm.name" 
        prefix-icon="Search"
        placeholder="图片名">
      </el-input>
     
      <el-input 
        style="margin-right: 10px;"
        clearable 
        v-model.trim="searchForm.createBy" 
        prefix-icon="Search"
        placeholder="提交者">
      </el-input>
      
      <el-date-picker 
        style="margin-right: 10px;"
          v-model="searchForm.submitTime"
          placeholder="提交日期" 
          value-format="YYYY-MM-DD">
      </el-date-picker>

      <el-button style="margin-right: 10px;" @click="searchInfo" icon="Search" type="primary">查询</el-button>
      <el-button style="margin-right: 10px;" @click="commonReset(1)" icon="Refresh" type="info">重置</el-button>
      <el-button style="margin-right: 10px;" @click="commonReset(0)" icon="Refresh" type="warning">刷新任务列表</el-button>
    </div>
    <div class="table-container">
      <el-table 
        :data="tableData.slice((currentpageNum - 1) * pageSize, currentpageNum * pageSize)" 
        v-loading="loading"
      >
        <el-table-column 
          prop="taskId" 
          label="任务ID" 
          width="100" 
          align="center">
      </el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <a
              @click="getDownloadImageLink(row)"
              target="_blank"
              class="download-link blue-link"
            >
              {{ row.imageName }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="taskStatus" label="任务状态">
          <template #default="{ row }">
            <el-tag
              :type="getStatusTagType(row.taskStatus)"
              :class="{ 'first-row': row.taskId === 1 }"
            >
              {{ row.taskStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间"></el-table-column>
        <el-table-column prop="createBy" label="提交者"></el-table-column>
        <el-table-column label="结果下载">
          <template #default="{ row }">
            <a
              :href="row.taskStatus === '已完成' ? getDownloadResultLink(row) : ''"
              target="_blank"
              :style="{ color: row.taskStatus === '已完成' ? '#409eff' : '#ccc',
                        pointerEvents: row.taskStatus === '已完成' ? 'pointer' : 'none' }"
              download=""
            >
              导出pdf
            </a>
          </template>
        </el-table-column>
        <el-table-column label="提示信息">
          <template #default="{row}">
            <el-popover
              placement="top"
              title="Info"
              trigger="hover" 
              :content="row.info"
            >
              <template #reference>
                <el-button link type="text" style="color: #1fb864"
                  >查看提示信息</el-button
                >
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="deleteTask(row.taskId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        
      </el-table>
    </div>

    <!-- Pagination -->
    <el-footer class="footer">
        <div class="demo-pagination-block">
          <el-pagination 
            background 
            :current-page="currentpageNum" 
            :page-sizes="[10, 20, 30]" 
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="totalPage" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
    </el-footer>
  </div>
</template>
  
<script setup>
import { getToken } from "@/utils/auth";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElAlert } from "element-plus";
import {getImagesByUrl,downloadImage} from "@/api/infomanage/types";
import {onBeforeRouteLeave, onBeforeRouteUpdate, useRoute,useRouter} from "vue-router";
const route = useRoute()
const router = useRouter()

const uploadFileUrl = ref(
  import.meta.env.VITE_APP_BASE_API + "/system/task/upload"
); // 上传的图片服务器地址


const gridData = ref([])


const headers = ref({ Authorization: "Bearer " + getToken() });
import {
  getAnalysisTasksList,
  deleteAnalysisTask,
  uploadFileById,
} from "../../api/pictureAnalysis";

const fileList = ref([]);
const tableData = ref([]);
const tableDataCopy = ref([]);
const loading = ref(false);
const visible = ref(false);

// Search form
const searchForm = ref({
  name: "",
  submitTime: "",
  createBy: "",
});

function getPopoverContent(info) {  
  if (info ==="wc_main函数处理异常") {
    return "wc_main函数处理异常";
  } else if (info === null) {
    console.log('hhhdddddd');
    return "提示信息为空";
  } else if (info === "over!") {
    return "完成!";
  }
}


// Function to fetch tasks and update table data
const fetchTasks = async () => {
  try {
    loading.value = true; // Show loading spinner
    const response = await getAnalysisTasksList();
    loading.value = false; // Hide loading spinner
    if (response.code === 200 && response.data) {
      console.log(response.data, 'response.data');
      totalPage.value = response.data.length;
      // Map the response to the format expected by your tableData
      tableData.value = response.data.map((task) => ({

        taskId: task.taskId,
        taskStatus:
          task.taskStatus === "Esht"
            ? "进行中"
            : task.taskStatus === "Mich"
              ? "已完成"
              : task.taskStatus,
        submitTime: task.submitTime,
        imageName: task.imageName,
        taskName: task.taskName || "任务名称未设置", // Assuming 'taskName' can be null
        imageUrl: task.imageUrl,
        taskUrl: task.taskUrl,
        createBy: task.createBy,
        info:getPopoverContent(task.info)
      })).reverse();
      // Copy tableData to search tasks
      tableDataCopy.value = tableData.value
    } else {
      throw new Error(response.msg);
    }
  } catch (error) {
    loading.value = false; // Hide loading spinner in case of error
    ElMessage.error("Failed to fetch tasks: " + error.message);
  }
   console.log(searchForm.value.submitTime);
  searchForm.value.name =  searchForm.value.createBy = searchForm.value.submitTime = ''
};

//Function to reset search information(status:1) or refresh task list(status:0)
const commonReset = async (status) => {
  await fetchTasks().then(()=>{
    status===1?ElMessage.success("重置成功"):ElMessage.success("刷新任务列表成功");
  })
}

// Function to upload file by photoId
const uploadFileId = async () => {
  ElMessage.info('图片开始上传'); 
  await route.query?.id.forEach( (id,index) => {
    try {
      loading.value = true; // Show loading spinner   
      uploadFileById(id).then(res => {
        if(res.code === 200){
          ElMessage.success("任务文件上传成功");
        }else {
          loading.value = false; // Hide loading spinner
        throw new Error(response.msg);
      }
      }).then(()=>{
        if(index === route.query.id.length-1){
          loading.value = false; // Hide loading spinner
          fetchTasks(); // Refresh the list after deletion
        }
      })
    } catch (error) {
      ElMessage.error("Failed to upload file: " + error.message);
    } finally{
      loading.value = false; // Hide loading spinner
    }
  })
  isfromRouter.value = false; // Hide dialogForm

}

onBeforeRouteUpdate(() => {
  console.log('路由变动');
})

// Function to search by name
const searchInfo= async () => {
  loading.value = true
  tableData.value = tableDataCopy.value
  if(!searchForm.value.name && !searchForm.value.createBy && !searchForm.value.submitTime){
    tableData.value = tableDataCopy.value
    ElMessage.success("查询成功")
    totalPage.value = tableData.value.length
    loading.value = false 
    return
  }
  tableData.value = tableDataCopy.value.filter((task) => {
    return task.imageName.includes(searchForm.value.name?searchForm.value.name:'')
    &&task.submitTime.includes(searchForm.value.submitTime?searchForm.value.submitTime:'')
    &&(task.createBy===searchForm.value.createBy || searchForm.value.createBy === '')
  })
  if(tableData.value.length === 0){
    ElMessage.warning("未查到相关任务")
    totalPage.value = tableData.value.length
    loading.value = false
    return 
  }
  ElMessage.success("查询成功")
  totalPage.value = tableData.value.length
  loading.value = false
}

//判断是否从路由跳转过来
const isfromRouter = ref(false)
isfromRouter.value = sessionStorage.getItem("isfromRouter")=='true'? true : false

window.onbeforeunload = function () {
  sessionStorage.setItem("isfromRouter",false);
}

onBeforeRouteLeave((to, from, next) => {
  sessionStorage.setItem("isfromRouter",false);
  next()
})

onMounted(() => {
  fetchTasks();
  console.log(isfromRouter.value, 'isfromRouter');
  console.log(navigator);
  console.log(route.query);
  if(route.query.id){
    typeof(route.query.id)!='string'?route.query.id?.forEach((item,index)=>{
      gridData.value.push({id:item,name:route.query.name[index]})
    }):gridData.value.push({id:route.query.id,name:route.query.name})
    isfromRouter.value?uploadFileId():1
  }
});



const handleChange = async (file, fileList) => {
  fileList.value = [...fileList];
  if (file.status === "success") {
    ElMessage.success("上传成功,分析任务开始");
    await fetchTasks();
  }
};

const beforeUpload = (file) => {
  const isPNGorJPG = file.type === "image/png" || file.type === "image/jpg";

  if (!isPNGorJPG) {
    ElMessage.error("只能上传PNG或JPG类型的文件！");
    return false;
  }
  ElMessage.info("图片开始上传！");
  return isPNGorJPG ;
};

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
};


const getDownloadImageLink = async (row) =>{
  ElMessage.info('准备下载图片')
  getImagesByUrl(row.imageUrl)
  .then(res => {
    if(res.status === 200){
      const reader = new FileReader()// 创建一个FileReader实例
      console.log(typeof(res.data),'res.data')
      reader.readAsDataURL(res.data, 'utf-8')// 读取图片
      reader.onload = ()=>{
        try{
          const msg =JSON.parse(reader.result)// 这一步报错则返回的是二进制流图片，否则是JSON
          console.log(msg)
        }catch(e){
          let imageType=res.headers['content-type']
          let blob=new Blob([res.data],{type:imageType})
          let url=window.URL.createObjectURL(blob)
          console.log(url,'url')
          let a=document.createElement('a')
          a.style.display='none'
          a.href=url
          a.download=row.imageName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)// 移除a标签
          window.URL.revokeObjectURL(url)// 释放url
        }
      }
      ElMessage.success("图片下载成功")
    }else {
    throw new Error(response.msg)
  }
  }).catch(err => {
    ElMessage.error("图片下载失败")
  })
};

const getDownloadResultLink = (row) => `${import.meta.env.VITE_APP_BASE_API}/${row.taskUrl}`;
// show tag
const getStatusTagType = (status) => {
  if (status === "进行中") {
    return "warning";
  } else if (status === "已完成") {
    return "success";
  } else {
    return "info";
  }
};
// Delete task funticon
const deleteTask = async (taskId) => {
  try {
    loading.value = true; // Show loading spinner   
    const response = await deleteAnalysisTask(taskId);
    if (response.code === 200) {
      ElMessage.success("任务文件删除成功");
      await fetchTasks(); // Refresh the list after deletion
    } else {
      throw new Error(response.msg);
    }
  } catch (error) {
    ElMessage.error("Failed to delete task: " + error.message);
  } finally {
    loading.value = false; // Hide loading spinner
  }
};


// Pagination
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
const pageSize = ref(10);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

</script>
  
<style scoped lang="less">
.title {
  width: 400px;
  height: 60px;
  background: #ffffffad;
  text-align: center;
  line-height: 60px;
  position: absolute;
  left: calc(50% - 200px);
  top: calc(50% - 30px);
  border-radius: 5px;
  color: #00000087;
  font-weight: 800;
}

.upload-container {
  border: 1px dashed #ccc;
  padding: 10px;
  text-align: center;
  color: #999;
  margin: 10px;
  background: #1F4E3D;
  border-radius: 5px;
}

.upload-container em {
  color: #409eff;
}

.el-upload__tip {
  color: #fff;
}

.table-container {
  margin: 10px;
  border-radius: 5px;
}

.el-table-column--mini>.cell {
  padding: 5px 0;
}

.collapse-container {
  margin: 10px;
}

.blue-link {
  color: rgb(64, 158, 255);
}

.article_banner {
  margin: 10px;
  width: calc(100% - 20px);
  height: 11vw;
  overflow: hidden;
  background-size: cover;
  opacity: 0; // 默认设置为透明
  animation: fadeIn 2s forwards; // 2秒渐显效果
  position: relative;
  border-radius: 5px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.article_banner img {
  width: 100vw;
  height: 100%;
  object-fit: cover;
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

.columnClassName{
  font-size: 20px;
}

.searchContainer{
  margin-left:10px;
  display: flex;
  width: 65%;

  .el-input,
  .el-date-picker
  {
    width: auto;
    margin:auto;
  }

  .el-button{
    margin:auto;
  }
}
</style>