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
      <!-- 树 -->
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
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0" class="right-box">
        <!-- 操作部分 -->
        <div style="width: 100%">
          <el-button
            type="primary"
            class="filter-item addNode-button"
            style="margin: 10px"
            @click.prevent="addChildNode"
            v-hasPermi="['system:node:add']"
          >
            添加子节点</el-button
          >
          <el-button
            type="danger"
            class="filter-item deleteNode-button"
            style="margin: 10px"
            @click.prevent="deleteNode"
            v-hasPermi="['system:node:remove']"
            >删除节点</el-button
          >
          <el-button
            type="info"
            class="filter-item reviseNode-button"
            style="margin: 10px"
            @click.prevent="updateChildNode"
            v-hasPermi="['system:node:update']"
            >修改节点</el-button
          >
          <el-button
            type="primary"
            class="filter-item addNode-button"
            style="margin: 10px"
            @click.prevent="addImage"
            v-hasPermi="['system:image:add']"
            >添加图片</el-button
          >
          <el-button
            type="info"
            class="filter-item"
            style="margin: 10px"
            @click.prevent="downloadPython"
            v-hasPermi="['system:image:add']"
            >下载远程连接文件</el-button
          >

          当前节点状态：
          <el-switch
            v-hasPermi="['system:node:update']"
            v-model="nodeIsShow"
            @change="switchChange()"
          />
        </div>
        <!-- 设置图片上传路径 -->
        <div class="upload_path">
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <div class="card-title">
                <div class="card-title-line"></div>
                <div class="card-title-content">图片自动上传地址</div>
              </div>
              <el-card class="SearchBox-card nodeBox">
                <div class="ipBox">
                  <span>IP地址</span>
                  <el-input v-model="form.ip" disabled></el-input>
                </div>
                <div class="photoBox">
                  <span>图片目录</span>
                  <el-input v-model="form.remotePicture" disabled></el-input>
                </div>
              </el-card>
              <div class="button-box">
                <el-button
                  type="primary"
                  @click="autoUpload"
                  class="addNode-button"
                  >开始自动上传</el-button
                >
              </div>
            </div>
          </el-card>
        </div>
        <!-- 内容部分 -->
        <div v-if="imageSrcList.length === 0" style="height: 500px">
          无图片或未选择节点
        </div>
        <div class="image_box img-list" v-else>
          <el-card
            class="image_item item"
            v-for="(item, index) in imageSrcList.slice(
              (currentpageNum - 1) * pageSize,
              currentpageNum * pageSize
            )"
            :key="item.pictureId"
          >
            <div class="wrapper">
              <div class="imgBox">
                <el-image
                  :src="getImageUrlByUrl(item.lessPictureUrl)"
                  :preview-src-list="
                    imageSrcList
                      .slice(
                        (currentpageNum - 1) * pageSize,
                        currentpageNum * pageSize
                      )
                      .map((item) => getImageUrlByUrl(item.pictureUrl))
                  "
                  ref="previewImg"
                  :initial-index="index"
                  style="
                    min-width: 168px;
                    height: 168px;
                    text-align: center;
                    line-height: 168px;
                    font-size: 40px;
                  "
                  fit="fill"
                  lazy
                >
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

            <el-button
              class="delete_button"
              icon="Delete"
              size="large"
              circle
              type="danger"
              @click="deleteImage(item.pictureId, item.pictureUrl)"
              v-hasPermi="['system:image:remove']"
            ></el-button>
          </el-card>
        </div>
        <!--分页组件-->
        <div class="demo-pagination-block">
          <el-pagination
            background
            :current-page="currentpageNum"
            :page-sizes="[4, 8, 12, 16, 24, 28, 32, 36]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
    <!-- 新增节点对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="节点新名称：" prop="treeName">
          <el-input v-model="form.treeName" placeholder="输入节点新名称" />
        </el-form-item>
        <el-form-item label="IP地址：" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="图片目录：" prop="remotePicture">
          <el-input
            v-model="form.remotePicture"
            placeholder="输入图片目录"
          /> </el-form-item
        ><!-- 
        <el-form-item label="节点描述：">
          <el-input placeholder="输入节点描述" />
        </el-form-item> -->
        <el-form-item label="是否公开：" prop="isShow">
          <el-switch v-model="form.isShow" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click.passive="
              dialogStatus === 'create' ? createData() : updateData()
            "
          >
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改路径对话框 -->
    <el-dialog
      title="设置图片上传路径"
      v-model="autoDialog"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="autoPath"
        :rules="pathRules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="IP地址：" prop="ipPath">
          <el-input v-model="autoPath.ipPath" placeholder="IP地址" />
        </el-form-item>
        <el-form-item label="图片目录：" prop="photoPath">
          <el-input v-model="autoPath.photoPath" placeholder="图片目录" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary"> 保存 </el-button>
          <el-button @click="autoDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加图片对话框 -->
    <el-dialog
      title="添加图片"
      v-model="imageDialog"
      center
      draggable
      width="30%"
    >
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        ref="upload"
        accept=".jpeg,.jpg,.png,.bmp,.webp,.zip,.rar"
        list-type="picture-card"
        :action="uploadUrl"
        :auto-upload="false"
        :headers="{ Authorization: 'Bearer ' + getToken() }"
        :on-preview="handlePictureCardPreview"
        :on-error="uploadImageError"
        :on-success="uploadImageSuccess"
        :before-upload="handleBeforeUpload"
        :on-change="handleUploadFile"
        :http-request="httpRequest"
        :multiple="true"
      >
        <el-button type="primary">Click to upload</el-button>

        <template #tip>
          <div class="el-upload__tip">请上传图片或压缩包</div>
        </template>
      </el-upload>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitImage"> 添加 </el-button>
        <el-button @click="suspendSubmitImage">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script setup name="autoPhotos">
import { ref, reactive, toRefs, getCurrentInstance, nextTick } from "vue";
import { getTreeNodeIdsByNode, getImageUrlByUrl } from "@/utils/tree";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import { getToken } from "@/utils/auth";

import {
  getImagesBynodeId,
  deleteImageByIdAndUrl,
  updateByIp,
} from "@/api/infomanage/types";
import zipLogo from "@/assets/zip/zip.webp";
import { fromPairs } from "lodash";

// vue实例
const {
  proxy: { $download },
} = getCurrentInstance();

/* const props = defineProps({
    treeType: {
      type: Number,
      default: 1,
    },
  }); */

const treeType = ref(1);

// vue实例
const {
  proxy: { $modal },
} = getCurrentInstance();

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");

// 图片
const imageSrcList = ref([]);

//分页
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
const pageSize = ref(12);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

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
  {
    pictureId: 3,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
  {
    pictureId: 4,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
  {
    pictureId: 5,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
  {
    pictureId: 6,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
];

//图片上传地址
const autoPath = reactive({
  ipPath: "localhost",
  photoPath: "C:\\Users\\Administrator\\Desktop\\tabletype\\新建文件夹",
});

//自动上传点击事件
function autoUpload() {
  const curNode = tree.value.getCurrentNode();
  updateByIp(form.ip, form.remotePicture, curNode.treeId).then(
    () => {
      $modal.msgSuccess("开启自动上传成功");
      rowClick(curNode);
    },
    () => {}
  );
}

function deleteImage(pictureId, pictureUrl) {
  $modal.confirm("是否删除该图片?").then(() => {
    const curNode = tree.value.getCurrentNode();
    deleteImageByIdAndUrl(pictureId, pictureUrl).then(
      () => {
        $modal.msgSuccess("删除图片成功");
        rowClick(curNode);
      },
      () => {
        $modal.msgError("删除图片失败");
      }
    );
  });
}

// 打开添加图片对话框
function addImage(imageUrl) {
  imageDialog.value = true;
}

function downloadPython() {
  $download.resource("C:\\Users\\Administrator\\Desktop\\tabletype\\main.exe");
}

// 重置图片上传地址
const resetAutoPath = () => {
  autoDialog.value = true;
};

// 添加图片对话框
const imageDialog = ref(false);
const autoDialog = ref(false);

const fileList = ref([]);

// 提交添加图片
const upload = ref(null);
const uploadUrl = ref("");

const submitImage = () => {
  imageDialog.value = false;
  uploadUrl.value = `${
    import.meta.env.VITE_APP_UPLOAD_URL
  }/system/picture/upload?isShow=1&treeId=${
    tree.value.getCurrentNode().treeId
  }`;
  nextTick(async () => {
    await upload.value.submit();
  });
  addImage();
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

//图片上传前触发
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const whiteList = ["png", "jpg", "jpeg", "bmp", "webp", "zip", "rar"];
  if (whiteList.indexOf(fileType) === -1) {
    $modal.msgError(
      "只能上传图片或压缩包格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
};

//图片上传成功回调
async function uploadImageSuccess(res) {
  $modal.msgSuccess(res.msg);

  fileList.value = [];
  const curNode = tree.value.getCurrentNode();
  imageSrcList.value = await getImagesBynodeId(curNode.treeId);
  imageDialog.value = false;
  rowClick(curNode);
}

//图片上传失败回调
function uploadImageError() {
  $modal.msgError("添加图片失败");
}

const previewImg = ref(null);
const viewBigPicture = () => {
  previewImg.value.clickHandler();
};

const showImageViewer = ref(false);
const url = ref([]);
const showImg = () => {
  //预览大图
  showImageViewer.value = true;
};
const close = () => {
  showImageViewer.value = false;
};

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref("create");
const textMap = {
  create: "添加节点",
  update: "修改节点",
};

const form = reactive({
  treeName: "",
  ip: "",
  remotePicture: "",
  isShow: true,
});

// 重置表单
function resetForm() {
  form.treeName = "";
  form.isShow = true;
}

// 对话框表单
const dataForm = ref(null);

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
  var reg = /^([a-zA-Z]:\\)?[^\/\:\*\?\"\<\>\|]*$/; // 只允许使用有效的文件路径字符串，不允许使用特殊字符
  if (value === "") {
    callback(new Error("请输入图片目录"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的文件目录"));
  } else {
    callback();
  }
};

const rules = reactive({
  treeName: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
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
  isShow: [{ required: true, message: "请选择", trigger: "blur" }],
});

const pathRules = reactive({
  ipPath: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
  photoPath: [{ required: true, message: "请输入图片目录", trigger: "blur" }],
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
        ip: form.ip,
        parentFile: form.remotePicture,
        treeName: form.treeName,
        parentId: id,
        treeType: treeType.value,
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
        ip: form.ip,
        parentFile: form.remotePicture,
        treeId: tree.value.getCurrentNode().treeId,
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

const nodeIsShow = ref(true);
//更新节点状态
const switchChange = () => {
  //const curNodes = tree.value.getCurrentNode();
  updateNode({
    //尝试改改
    isShow: nodeIsShow.value ? 1 : 0,
    treeName: form.treeName,
    treeId: tree.value.getCurrentNode().treeId,
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

const allFileId = ref([]);

const getTreeList = () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data.children;
    routesData.value.forEach((item) => {
      allFileId.value.push(item.fileId);
    });
    nextTick(() => {
      if (!tree.value.getCurrentNode()) {
        tree.value.setCurrentKey(routesData.value[0]?.treeId);
      }
      tree.value.setCurrentKey(tree.value.getCurrentNode().treeId);
      rowClick(tree.value.getCurrentNode());
    });
  });
};

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

// 点击树节点时的回调
async function rowClick(nodeObj) {
  rules.value = {};
  currentpageNum.value = 1;
  form.treeName = nodeObj.treeName;
  form.ip = nodeObj.ip;
  form.remotePicture = nodeObj.parentFile;
  if (nodeObj.isShow === 1) {
    form.isShow = true;
    nodeIsShow.value = true;
  } else {
    form.isShow = false;
    nodeIsShow.value = false;
  }
  loading.value = true;
  imageSrcList.value = await getImagesBynodeId(nodeObj.treeId);
  totalPage.value = imageSrcList.value.length;
  pageSize.value = 12;
  if (imageSrcList.length === 0) {
    $modal.msgWarning("此节点无图片");
  }
  loading.value = false;
}
</script>
  
  <style lang="less" scoped>
:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-form-item__label) {
  width: 110px;
}

:deep(.el-tree) {
  background-color: rgb(183, 202, 189);
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: #fff !important;
}

:deep(.el-card__body) {
  position: relative;
  padding: 10px 15px 15px 15px !important;
}

.image_item:hover .delete_button {
  opacity: 1;
  transition: 0.4s ease-in-out;
}

.delete_button {
  position: absolute;
  top: 150px;
  left: 10px;
  z-index: 9;
  opacity: 0;
  transition: 0.4s ease-in-out;
}

.card {
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* 上方卡片 */

.card-container {
  width: 90%;
  border-radius: 50px;
  margin-left: 30px;
  margin-top: 10px;
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding: 15px 20px 20px 20px !important;
  }
}

.big-wrapper {
  width: 95%;
  margin: auto;
}

.card-container .SearchBox-card {
  border-radius: 20px;
}

.searchtable {
  margin-bottom: 10px;
}

.SearchBox-card {
  margin: 10px;
  margin-bottom: 20px;

  .ipBox {
    display: flex;
    margin-bottom: 15px;

    span {
      width: 15%;
    }
  }

  .photoBox {
    display: flex;

    span {
      width: 15%;
    }
  }
}

.searchbox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.input-title {
  color: grey;
  font-size: 12px;
}

.input-title span {
  color: rgb(78, 151, 211);
}

/*card的title */
.card-title {
  width: 30%;
  color: rgb(64, 64, 112);
  border-radius: 10px;
  height: 40px;
  display: flex;
}
.card-title-line {
  width: 2%;
  height: 40px;
  background-color: rgb(154, 190, 175);
}

.card-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 40px;
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
  background: rgb(154, 190, 175);
  margin-top: 10px;

  .el-dialog__title {
    color: white;
  }
}

:deep(.dialog-footer) {
  .el-button--primary {
    background: rgb(85, 123, 116);
  }
}

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
  height: calc(100vh - 180px);
  justify-content: flex-start;
}

.image_item {
  box-sizing: border-box;
  margin: 10px 5px;
  width: 23%;
  height: 200px;
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

/* .img-list .item .wrapper {
     position: relative;
     width: 100%;
     overflow: hidden;
     -webkit-border-radius: 2px;
     -moz-border-radius: 2px;
     border-radius: 2px;
     -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
     -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33); 
  } */

/* .img-list .item .wrapper .imgBox {
     position: absolute;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
   }
   */
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
</style>
  <style lang="less" scoped>
.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
           0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}

/* 按钮样式 */
.addNode-button {
  background: rgb(85, 123, 116);
}
</style>
  
  
  
  