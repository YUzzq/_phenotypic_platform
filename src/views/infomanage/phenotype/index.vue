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
      v-loading="loading"
      :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-aside
        width="20%"
        class="mokuai card shadow element-plus-tree"
        style="
          min-height: calc(100vh - 180px);
          margin-top: 10px;
          border-radius: 8px;
          padding: 0%;
          margin-top: 0%;
        "
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
        >
        </el-tree>
      </el-aside>

      <!-- //右边的盒子 -->
      <el-container>
        <!-- //右边的盒子 -->
        <el-main
          width="78%"
          style="padding: 0; height: calc(100vh - 100px)"
          class="right-box"
        >
          <div style="height: auto; margin-bottom: 10px">
            <div>
              <el-button
                type="primary"
                class="filter-item my-button"
                style="margin: 10px"
                @click.prevent="addChildNode"
                v-hasPermi="['system:node:add']"
              >
                添加子节点</el-button
              >
              <el-button
                type="danger"
                class="filter-item my-button"
                style="margin: 10px"
                @click.prevent="deleteNode"
                v-hasPermi="['system:node:remove']"
                >删除节点</el-button
              >
              <el-button
                type="info"
                class="filter-item my-button"
                style="margin: 10px"
                @click.prevent="updateChildNode"
                v-hasPermi="['system:node:update']"
                >修改节点</el-button
              >
              <el-button
                type="info"
                class="filter-item my-button"
                style="margin: 10px"
                @click.prevent="downloadTemplate"
                v-hasPermi="['system:node:update']"
                >下载模板文件</el-button
              >
            </div>
            <el-form
              :model="queryParams"
              ref="queryForm"
              :inline="true"
              v-show="showSearch"
              label-width="68px"
              label-position="left"
              class="myform"
              style="margin-top: 20px"
            >
              <!-- <el-form-item label="文件ID" prop="fileId">
                <el-input
                  v-model="queryParams.fileId"
                  placeholder="请输入文件ID"
                  clearable
                  @keyup.enter="handleQuery"
                  class="my-input"
                />
              </el-form-item> -->
              <el-form-item label="文件名称" prop="fileName">
                <el-input
                  v-model="queryParams.fileName"
                  placeholder="请输入文件名称"
                  clearable
                  @keyup.enter="handleQuery"
                  class="my-input"
                />
              </el-form-item>
              <!-- <el-form-item label="文件描述" prop="description">
            <el-input
              v-model="queryParams.description"
              placeholder="请输入文件描述"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item> -->
              <el-form-item>
                <el-button
                  type="primary"
                  icon="Search"
                  class="search-button my-button"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button icon="Refresh" @click="resetQuery" class="my-button"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
            <!-- 操作部分 -->
            <el-button
              type="primary"
              icon="Plus"
              class="my-button"
              @click="handleAdd"
              :disabled="isdisabled3"
              v-hasPermi="['system:logininfor:add']"
              >新增</el-button
            >
            <!--<el-button type="danger" plain icon="Delete" size="small" :disabled="multiple"
              @click="handleDelete" v-hasPermi="['system:logininfor:remove']">删除</el-button>
          -->
            <el-button
              type="danger"
              plain
              icon="Delete"
              @click="handleDelete"
              :disabled="isdisabled3"
              v-hasPermi="['system:logininfor:remove']"
              class="my-button"
              >删除</el-button
            >
          </div>
          <el-container style="height: calc(100vh - 350px)">
            <!-- 表格部分 -->
            <el-table
              v-loading="tableLoading"
              :data="fileList"
              @selection-change="handleSelectionChange"
              stripe
              fit
              max-height="100%"
              class="mytable"
            >
              <el-table-column
                type="selection"
                min-width="55"
                align="center"
                fixed="left"
              />
              <el-table-column
                label="序号"
                width="80px"
                type="index"
                :index="indexMethod"
                align="center"
              />
              <!-- <el-table-column width='0' label="文件ID" align="center" prop="fileId" />  -->
              <!-- <el-table-column label="表型名" align="center" prop="tableName" /> -->
              <el-table-column
                label="文件名"
                width="250"
                align="center"
                prop="fileName"
              />
              <el-table-column
                label="物种名称"
                align="center"
                prop="speciesName"
                width="100px"
              />
              <el-table-column
                label="群体名称"
                align="center"
                width="200px"
                prop="populationName"
              />
              <el-table-column label="年份" align="center" prop="year" />
              <el-table-column label="地区" align="center" prop="location" />
              <el-table-column
                label="是否公开"
                align="center"
                prop="fileStatus"
                v-hasPermi="['system:file:remove']"
                width="120"
              >
                <template #default="scope">
                  <el-switch
                    v-model="fileList[scope.$index].fileStatus"
                    @change="updateFileStatus(scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <!-- <el-table-column label="文件时间" align="center" prop="dateTime" /> -->
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="270px"
              >
                <template #default="scope">
                  <el-button
                    size="medium"
                    type="text"
                    icon="Document"
                    link
                    @click="openfile(scope.row)"
                    class="table_button"
                    >文件详情
                  </el-button>
                  <el-button
                    size="medium"
                    type="text"
                    icon="View"
                    link
                    @click="fileVisual(scope.row)"
                    class="table_button"
                    >可视化
                  </el-button>
                  <el-button
                    size="medium"
                    type="text"
                    icon="Delete"
                    @click="deleteFile(scope.row)"
                    v-hasPermi="['system:file:remove']"
                    class="table_button"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="历史版本"
                align="center"
                class-name="small-padding fixed-width"
                width="120px"
              >
                <template #default="scope">
                  <el-button
                    type="text"
                    size="medium"
                    :loading="downloadLoading"
                    @click="openHistory(scope.row)"
                    class="table_button"
                    >查看历史版本
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="合并操作"
                align="center"
                class-name="small-padding fixed-width"
                fixed="right"
                min-width="150px"
              >
                <template #default="scope">
                  <el-button
                    icon="Download"
                    :loading="downloadLoading"
                    @click="mergeFile(scope.row)"
                    class="hebin-button"
                    >合并
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-container>
        </el-main>
        <!-- 分页 -->
        <el-footer class="footer">
          <el-pagination
            v-show="total > 0"
            :total="total"
            v-model:currentPage="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getList"
            @current-change="getList"
            :background="false"
          />
        </el-footer>
      </el-container>
    </el-container>
    <!-- 节点对话框 -->
    <el-dialog
      :title="textMap[dialogTreeStatus]"
      v-model="dialogTreeFormVisible"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataTreeForm"
        :model="treeForm"
        :rules="treeRules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="节点新名称：" prop="treeName">
          <el-input v-model="treeForm.treeName" placeholder="输入节点新名称" />
        </el-form-item>
        <el-form-item label="是否公开：" prop="isShow">
          <el-switch v-model="treeForm.isShow" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click.passive="
              dialogTreeStatus === 'createNode'
                ? createTreeData()
                : updateTreeData()
            "
          >
            保存
          </el-button>
          <el-button @click="dialogTreeFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
      :close-on-click-modal="false"
      @close="dialogClosed"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="文件名称：" prop="fileName">
          <el-input v-model="dataForm.fileName" placeholder="输入文件名称" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="输入备注" />
        </el-form-item>
        <el-form-item label="是否公开" prop="fileStatus">
          <el-switch v-model="dataForm.fileStatus" />
        </el-form-item>
        <el-form-item
          label="上传文件"
          prop="file"
          v-show="dialogStatus === 'create' || 'other'"
        >
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            ref="upload"
            :limit="1"
            accept=".csv"
            :action="uploadUrl"
            :auto-upload="false"
            :headers="{ Authorization: 'Bearer ' + getToken() }"
            :on-error="uploadFileError"
            :on-success="uploadFileSuccess"
            :on-exceed="handleExceed"
            :on-change="handleUploadFile"
            :before-upload="handleBeforeUpload"
          >
            <el-button type="primary">Click to upload</el-button>
            <template #tip>
              <div class="el-upload__tip">select a file to upload</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-if="dialogStatus === 'create'"
            @click="dialogStatus === 'create' ? createData() : updateData()"
            :disabled="isDisabled"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            v-else
            @click="mergeData()"
            :disabled="isDisabled2"
          >
            合并
          </el-button>
          <el-button @click="deleteUploadData()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="历史版本"
      v-model="historyFormVisible"
      :close-on-click-modal="false"
      @close="dialogClosed"
      center
      draggable
      width="70%"
    >
      <el-table v-loading="historyTableLoading" :data="historyFileList">
        <el-table-column
          label="序号"
          width="100"
          type="index"
          :index="indexMethod"
        />
        <el-table-column label="文件名" align="center" prop="fileName" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              icon="Download"
              :loading="downloadLoading"
              @click="handleDownload(scope.row)"
              >下载
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="Document"
              @click="openDrawer(scope.row)"
              >预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-drawer v-model="drawer" :title="fileName" size="70%">
      <el-table
        :data="drawerTableData"
        stripe
        :max-height="maxCustomH"
        :flexible="true"
        v-loading="drawerTableLoading"
      >
        <el-table-column
          v-for="item in tableProps"
          :prop="item"
          :label="item"
          min-width="120"
          :key="item"
        />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup name="phenoType">
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import { listFile, updateFile, delFile,searchFile } from "@/api/infomanage/phenotype";
import useUserStore from "@/store/modules/user";
import { getJsonByCSV, jsonToTable } from "@/utils/tree";
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/param";
import { getTreeNodeIdsByNode } from "@/utils/tree";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();
// 登录用户权限
const { roles } = useUserStore();
const isDisabled = ref(false);
const isDisabled2 = ref(false);

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");
const tableLoading = ref(false);
const historyTableLoading = ref(false);

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const textMap = {
  create: "添加文件",
  update: "修改文件",
  other: "选择合并文件",
  createNode: "添加节点",
  updateNode: "修改节点",
};

// 表单实例
const form = ref(null);

// 表单参数
const dataForm = reactive({
  fileId: null,
  fileName: "",
  description: "",
  remark: "",
  fileStatus: true,
  dateTime: null,
});

//删除按钮状态
const deleteDisabled = ref(false);

// 校验规则
const rules = reactive({
  fileName: [{ required: true, message: "请输入文件名", trigger: "blur" }],
  description: [
    { required: false, message: "请输入文件描述备注", trigger: "blur" },
  ],
  dateTime: [{ required: true, message: "请选择一个日期", trigger: "blur" }],
});

const dataForm2 = reactive({
  fileName: "",
  description: "",
  dateTime: "",
  fileStatus: false,
});

const drawer = ref(false); // 文件详情窗口开启状态
const fileName = ref(""); // 选中文件名
const curFileUrl = ref(""); //文件路径

let timerId = null;
//表单重置
function resetForm() {
  dataForm.fileId = null;
  dataForm.fileName = "";
  dataForm.description = "";
  dataForm.remark = "";
  dataForm.fileStatus = true;
  dataForm.dateTime = null;
  if (timerId) clearTimeout(timerId);
}

const drawerTableLoading = ref(false);
const drawerTableData = ref([]);
const tableProps = ref([]);
// 开启文件详情窗口
async function openDrawer(row) {
  fileName.value = row.fileName;
  curFileUrl.value = row.url;
  drawer.value = true;
  drawerTableLoading.value = true;
  getJsonByCSV(row.url).then((result) => {
    tableProps.value = result[0];
    drawerTableData.value = jsonToTable(result);
    drawerTableLoading.value = false;
  });
}

// 上传实例
const upload = ref(null);
// 文件上传
const uploadUrl = ref("");

//文件上传前触发
//文件格式验证
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isCsv = fileType === "csv";
  if (!isCsv) {
    $modal.msgError(
      "只能上传csv格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  return isCsv;
};

/* const handleUploadFile = (file) => {
  // Handle file upload
  console.log(file);
}; */

const createData = async () => {
  const valid = await form.value.validate();
  console.log(valid);
  if (valid) {
    uploadUrl.value = `${
      import.meta.env.VITE_APP_UPLOAD_URL
    }/phenotypeFile/upload?treeId=${
      tree.value.getCurrentNode().treeId
    }&fileStatus=${dataForm.fileStatus ? 1 : 0}&remark=${
      dataForm.remark
    }&fileName=${dataForm.fileName}`;

    $modal.msg("上传数据较大，请耐心等待！");
    await upload.value.submit();
    console.log("2");
    isDisabled.value = true;
    onsole.log("3");
    console.log("4");
    tableLoading.value = false;
    tableName.value = "";
  }
  dialogFormVisible.value = false;
};

const tableName = ref("");

//文件合并
function mergeFile(row) {
  dialogStatus.value = "other";
  tableName.value = row.tableName;
  fileList.value = [];
  resetForm();
  dialogFormVisible.value = true;
  isDisabled2.value = false;
}

//文件合并

const mergeData = async () => {
  const valid = await form.value.validate();
  console.log(valid);
  if (valid) {
    uploadUrl.value = `${
      import.meta.env.VITE_APP_UPLOAD_URL
    }/phenotypeFile/merge?tableName=${tableName.value}&remark=${
      dataForm.remark
    }&fileName=${dataForm.fileName}`;
    $modal.msg("上传数据较大，请耐心等待！");
    await upload.value.submit();
    isDisabled2.value = true;
    tableLoading.value = false;
    tableName.value = "";
  }
};

// 文件上传成功回调
async function uploadFileSuccess(response) {
  if (response.code === 200) {
    $modal.msgSuccess(response.msg);
  } else {
    $modal.msgError("格式不正确，请下载模板文件比对！");
  }
  //$modal.msgSuccess("上传成功");

  isDisabled.value = false;
  dialogFormVisible.value = false;
  timerId = setTimeout(() => {
    const curNode = tree.value.getCurrentNode();
    getList();
    rowClick(curNode);
  }, 2000);
}

// 文件上传失败回调
const uploadFileError = (error, file, fileList) => {
  console.log("File upload error", error);
  $modal.msgError("上传失败");
  timerId = setTimeout(() => {
    getList();
  }, 2000);
};

//更新文件
async function updateData() {
  form.value.validate((valid) => {
    if (valid) {
      uploadUrl.value = `${
        import.meta.env.VITE_APP_UPLOAD_URL
      }/phenotypeFile/upload?fileName=${dataForm.fileName}&description=${
        dataForm.description
      }&fileStatus=${dataForm.fileStatus ? 1 : 0}&treeId=${
        tree.value.getCurrentNode().treeId
      }&dateTime=${parseTime(dataForm.dateTime)}`;
      nextTick(async () => {
        tableLoading.value = false;
        await upload.value.submit();
        isDisabled.value = true;
        getList();
      });
    }
  });
}

//取消文件对话框
function deleteUploadData() {
  dialogFormVisible.value = false;
  isDisabled.value = false;
  /*rules.value = {}; */
  if (form.value) {
    form.value.resetFields();
  }
  getList();
}

//关闭添加文件窗口
const dialogClosed = () => {
  getList();
};

// 文件替换
function handleExceed(files) {
  upload.value?.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  upload.value?.handleStart(file);
}

// 文件表格
const fileList = ref([]); // 文件列表
const historyFileList = ref([]); //历史文件版本
const ids = ref([]); // 选中数组
const multiple = ref(false); // 是否多选

// 打开添加文件对话框
function handleAdd() {
  dialogStatus.value = "create";
  fileList.value = [];
  resetForm();
  dialogFormVisible.value = true;
  isDisabled.value = false;
}

// 删除文件
function handleDelete() {
  if (ids.value.length == 0) {
    $modal.msg("您没有选择文件！");
  } else {
    $modal.confirm("是否删除文件?").then(() => {
      delFile(ids.value)
        .then((res) => {
          console.log("222");
          $modal.msgSuccess("删除成功！");
          getList();
        })
        .catch((err) => {
          $modal.msgError("删除失败");
        });
    });
  }
}

const allFileId = ref([]);
const isdisabled3 = ref(false);

// 请求文件列表
function getList() {
  tableLoading.value = true;
  console.log(tree.value.getCurrentNode().children);
  if (tree.value.getCurrentNode().children.length != 0) {
    isdisabled3.value = true;
  } else {
    isdisabled3.value = false;
  }
  listFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
  })
    .then((res) => {
      tableLoading.value = false;
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
      }));
      fileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
      total.value = res.total;
    })
    .catch((err) => {
      tableLoading.value = false;
      $modal.msgError("获取列表失败");
    });
}
function search() {
  tableLoading.value = true;
  console.log(tree.value.getCurrentNode().children);
  if (tree.value.getCurrentNode().children.length != 0) {
    isdisabled3.value = true;
  } else {
    isdisabled3.value = false;
  }
  searchFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
  })
    .then((res) => {
      if(res.code==200){
        tableLoading.value = false;
        fileList.value = res.rows.map((item) => ({
          ...item,
          fileStatus: item.status === 1,
        }));
        fileList.value.forEach((item) => {
          allFileId.value.push(item.fileId);
        });
        total.value = res.total;
        res.rows.length==0?ElMessage.warning('未查询到相关文件'):ElMessage.success('搜索成功')
      }else{
        ElMessage.error('搜索失败')
      }
    })
    .catch((err) => {
      tableLoading.value = false;
      console.log(err);
      $modal.msgError("获取列表失败");
    });
}

// 选择文件项
function handleSelectionChange(selection) {
  ids.value = [];
  selection.forEach((item) => {
    ids.value.push(item.fileId);
  });
}

// 更新是否公开选项
async function updateFileStatus(row) {
  updateFile({
    fileId: row.fileId,
    status: +row.fileStatus,
  })
    .then((res) => {
      $modal.msgSuccess("更新成功");
    })
    .catch((err) => {
      $modal.msgError("更新失败");
    });
}

// 下载文件
const downloadLoading = ref(false);
let downloadTimer = null;
async function handleDownload(row) {
  if (downloadLoading.value) {
    return; // Prevent multiple downloads while in progress
  }
  $modal.msg("正在下载中，请等待");
  downloadLoading.value = true;
  try {
    await $download.resource(row.url);

    downloadTimer = setTimeout(() => {
      downloadLoading.value = false;
      clearTimeout(downloadTimer);
    }, 5000);
  } catch (error) {
    console.log(error);
    downloadLoading.value = false;
  }
}

// 修改文件
function handleUpdate(row) {
  dataForm.fileId = row.fileId;
  dataForm.fileName = row.fileName;
  dataForm.description = row.description;
  dataForm.fileStatus = row.fileStatus;
  dataForm.dateTime = row.dateTime;
  dialogFormVisible.value = true;
  dialogStatus.value = "update";
}

// 删除文件
function deleteFile(row) {
  $modal.confirm("是否删除文件?").then(() => {
    delFile([row.fileId])
      .then((res) => {
        $modal.msgSuccess("删除成功！");
        getList();
      })
      .catch((err) => {
        $modal.msgError("删除失败");
      });
  });
}

//跳转文件详情
const openfile = (row) => {
  console.log(row.tableName, "klkl");
  router.push({
    path: "/phenotype/file", // 跳转到的目标页面的路由名称
    query: { id: row.fileId, tableName: row.tableName },
  });
};

//跳转可视化
const fileVisual = (row) => {
  router.push({
    path: "/phenotype/fileVisual", // 跳转到的目标页面的路由名称
    query: { id: row.fileId, tableName: row.tableName },
  });
};

//查看文件历史版本
function openHistory(row) {
  historyTableLoading.value = true;
  historyFormVisible.value = true;
  listFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
    tableName: row.tableName,
  })
    .then((res) => {
      tableLoading.value = false;
      historyFileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
      }));
      historyFileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
      total.value = res.total;
      historyTableLoading.value = false;
    })
    .catch((err) => {
      tableLoading.value = false;
      historyTableLoading.value = false;
      $modal.msgError("获取列表失败");
    });
}

// 表单提交
const total = ref(2);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  treeId: "",
  fileId: "",
  fileName: "",
  description: "",
  fileStatus: "",
  dateTime: "",
});
const showSearch = ref(true);
const queryForm = ref(null); // 查询表单dom元素
const handleQuery = async () => {
  // 查询回调
  queryParams.treeId = tree.value.getCurrentNode().treeId;
  search();
};

const resetQuery = () => {
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.treeId = 0;
  queryParams.fileId = "";
  queryParams.fileName = "";
  queryParams.description = "";
  queryParams.fileStatus = true;
  getList();
};

// 树控件
const routesData = ref([]);

// 树表单
const treeForm = reactive({
  treeName: "",
  isShow: true,
});

const dialogTreeFormVisible = ref(false); // 树表单可见
const historyFormVisible = ref(false); //历史上传记录表单
const dataTreeForm = ref(null); // 树表单dom实例
const dialogTreeStatus = ref("createNode");
//树表单验证规则
const treeRules = reactive({
  treeName: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
  ],
  isShow: [{ required: true, message: "Please select", trigger: "blur" }],
});

// 树组件节点属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = ref(2); // 树的种类
const tree = ref(null); // 数的dom实例
const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const getTreeList = () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data.children;
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

// 重置树表单
function resetTreeForm() {
  treeForm.treeName = "";
  treeForm.isShow = true;
}

// 添加节点
function addChildNode() {
  if (!tree.value.getCurrentNode() && routesData.value.length !== 0) {
    $modal.msgWarning("请选择所要添加节点的父节点");
    return;
  }
  resetTreeForm();
  dialogTreeStatus.value = "createNode";
  dialogTreeFormVisible.value = true;
}

// 修改节点
function updateChildNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  dialogTreeStatus.value = "updateNode";
  dialogTreeFormVisible.value = true;
}

//下载模板文件
function downloadTemplate() {
  //下载
  $download.resource(
    "C:\\Users\\Administrator\\Desktop\\yuzhong\\表型数据模板.csv"
  );
}

// 创建树节点
function createTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      const id = tree.value.getCurrentNode()
        ? tree.value.getCurrentNode().treeId
        : 0;
      addNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        parentId: id,
        treeType: treeType.value,
      }).then(
        () => {
          $modal.msgSuccess("添加节点成功");
          getTreeList();
        },
        () => {
          $modal.msgError("添加节点失败");
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

// 更新树节点
function updateTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        treeId: tree.value.getCurrentNode().treeId,
      }).then(
        () => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        () => {
          $modal.msgError("修改失败");
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

//删除节点
function deleteNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择节点");
    return;
  }
  $modal.confirm("是否删除该节点").then(() => {
    const curNode = tree.value.getCurrentNode();
    const curNodeTreeIds = getTreeNodeIdsByNode(curNode);
    deleteNodes(curNodeTreeIds).then(() => {
      $modal.msgSuccess("删除节点成功");
      getTreeList();
    });
  });
}

//树控件点击回调
function rowClick(nodeObj) {
  if (nodeObj.disabled) {
    return;
  }
  /* resetForm(); */
  treeRules.value = {};
  /* rules.value = {};  */
  treeForm.treeName = nodeObj.treeName;
  if (nodeObj.isShow == 1) {
    treeForm.isShow == true;
  } else {
    treeForm.isShow == false;
  }

  queryParams.treeId = nodeObj.treeId;
  getList();
}

onMounted(() => {
  getTreeList();
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

.u-main .el-tag + .el-tag {
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

:deep(.dialog-footer) {
  .el-button--primary {
    background: rgb(85, 123, 116);
    border: #1F4E3D;
  }
}
</style>
<style lang="scss" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: calc(100vh - 180px);
}

.image_item {
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 25%;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
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
  background-color: #f2fbf7;
  // box-shadow:2px 2px 5px #000;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
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
// .addNode-button,
// .search-button {
//   border: #1F4E3D;
//   background: rgb(85, 123, 116);
// }

.addExcel {
  background: grey;
  color: #fff;
}
</style>
<style lang="less" scoped>
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
</style>

<style lang="less" scoped>
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

      /* ^ 设置子节点左外边距 */
      .el-tree-node__content:has(.is-leaf) {
        // color: #00ffff;
        margin-left: 12px !important;
        .el-tree-node__label {
          //font-size: 8px;
        }
        //background-color: red;
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
  background-color: #f2fbf7;
  padding: 0% !important;
}

:deep(.el-button) {
  margin: 0% !important;
  margin-right: 20px !important;
}
.mytable {
  background-color: #eeeeee;
  overflow: auto;
}

@media (max-width: 1330px) {
  .my-button {
    margin-right: 2px !important; /* 缩小元素之间的间距 */
    font-size: 7px;
  }

  .my-input {
    width: 120px; /* 缩小输入框的宽度 */
    margin-right: 2px;
    padding: 0% !important;
  }

  .el-button {
    font-size: 12px; /* 设置按钮的字体大小为小号 */
    padding: 3px 6px; /* 根据需要调整按钮的内边距 */
  }

  :deep(.el-input__inner) {
    padding: 1px 11px;
  }

  :deep(.el-form-item__label) {
    padding: 0%;
  }
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
  span {
    font-size: 15px !important;
    color: #4f6f46 !important;
  }
}
.el-tree-node__content {
  position: relative;
}
.disabled {
  cursor: not-allowed;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.footer {
  height: fit-content;
}

:deep(.el-table__header) {
  border-bottom: 1px solid black;
  border-top: 1px solid #ebeef5;

  th {
    font-weight: 800;
    font-size: 16px;
    background: #fafafa !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
  }
}

.hebin-button {
  margin-right: 0% !important;
}
</style>
