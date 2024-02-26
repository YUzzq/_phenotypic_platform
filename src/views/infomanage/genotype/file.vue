<template>
  <div class="home">
    <el-button
      style="margin: 20px; margin-left: calc(95% - 30px)"
      @click="exportFile"
      type="primary"
      size="large"
      >导出</el-button
    >
    <el-container>
      <el-main>
        <div class="file_form">
          <!-- 表格部分 -->
          <el-table
            style="width: 95%; margin: auto"
            ref="multipleTable"
            v-loading="tableLoading"
            :data="tableData"
            tooltip-effect="dark"
            class="trait-form-table"
            stripe
            max-height="100vh - 220px"
          >
            <el-table-column
              label="Edit"
              align="center"
              class-name="small-padding fixed-width"
              fixed="left"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  icon="Document"
                  link
                  @click="modifFile(scope.row)"
                  >Edit
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :label="column.label"
              :prop="column.prop"
              :show-overflow-tooltip="true"
              width="150px"
              max-width="250px"
              align="center"
            >
              <template #default="scope">
                {{ formatTableCell(scope.row[column.prop]) }}
              </template></el-table-column
            >
            <el-table-column label="..." width="auto">...</el-table-column>

          </el-table>
        </div>
      </el-main>

      <el-footer class="footer">
        <div class="demo-pagination-block">
          <el-pagination
            background
            :total="totalPage"
            :current-page="currentpageNum"
            :page-size="pageSize"
            :page-sizes="[15, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>

    <el-dialog
      title="修改文件详情"
      v-model="dialogFormVisible"
      center
      draggable
      width="30%"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-container style="height: 500px">
          <el-form
            ref="dataTreeForm"
            :model="form"
            :rules="rules"
            label-position="left"
            label-width="110px"
          >
            <!-- 循环遍历列，并生成表单项 -->
            <template v-for="column in columns" :key="column.prop">
              <el-form-item :label="column.label" :prop="column.prop">
                <el-input
                  v-model="form[column.prop]"
                  placeholder="输入修改的值"
                  :disabled="isUnmodifiableColumn(column.prop)"
                />
              </el-form-item>
            </template>
          </el-form>
        </el-container>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="updateFileData">
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getTree } from "@/api/tree";
import { onBeforeRouteLeave } from "vue-router";
import {
  selectDetailByFileId,
  exportGenoFile,
  modifiFileData,
  endUpdate,
} from "@/api/infomanage/genotype";

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const route = useRoute();
const total = ref(2);

//分页
const pageSize = ref(15);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);
const dialogFormVisible = ref(false); // 表单可见
const form = reactive({});

const rules = reactive({
  key: [{ required: true, message: "Please input key name", trigger: "blur" }],
  value: [{ required: true, message: "Please input value", trigger: "blur" }],
});

function formatTableCell(value) {
    return value || '-'; // 如果值为空，返回'-'
  }

async function fetchData(pageNumber, pageSize) {
  try {
    tableLoading.value = true;
    traitFileId.value = route.query.id;

    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });
    selectDetailByFileId({
      fileId: traitFileId.value,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
      .then((res) => {
        const tableDataValue = [];
        const columnsValue = [];

        if (res.rows.length > 0) {
          const firstItemKeys = Object.keys(res.rows[0]);
          const visibleColumns = firstItemKeys.slice(0, 100); // 限制为前100列

          visibleColumns.forEach((key) => {
            columnsValue.push({ label: key, prop: key });
          });
          // 填充数据
          res.rows.forEach((item) => {
            const rowData = {};
            visibleColumns.forEach((key) => {
              rowData[key] = item[key];
            });
            tableDataValue.push(rowData);
          });
        }

        totalPage.value = res.total;
        columns.value = columnsValue;
        tableData.value = tableDataValue;
        tableLoading.value = false;
      })
      .catch((err) => {
        tableLoading.value = false;
        console.error(err);
      });
  } catch (error) {
    tableLoading.value = false;
    console.error("获取数据时出错：", error);
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData(currentpageNum.value, val);
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
  fetchData(val, pageSize.value);
};
const unmodifiableColumns = ["genotype_id", "chrom", "position", "id"];

// 计算属性，检查列是否为不可修改
const isUnmodifiableColumn = (columnProp) => {
  return unmodifiableColumns.includes(columnProp);
};

const fileList = [
  {
    experimentName: "试验1",
    pilotName: "试点1",
    repeatNumber: "重复编号1",
    fileId: "1",
    fileName: "文件1",
    description: "描述1",
    varietyName: "品种1",
    parentName: "父本1",
    motherName: "母本1",
    fieldNumber: "田间编号1",
    materialNumber: "材料编号1",
    rowNumber: "排1",
    columnNumber: "列1",
    uniqueNumber: "唯一编号1",
  },
];

const traitFileId = ref(60);
const tableName = ref("");

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); //表格数据

//导出
function exportFile() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  exportGenoFile(tableName.value)
    .then((res) => {
      console.log(res);
      $modal.msg("文件生成中，请等待！");
      $download.resource(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
}

// 请求性状信息
function chooseForm() {
  traitFileId.value = route.query.id;
  tableLoading.value = true;
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  // console.log(traitFileId.value,queryParams.pageSize,queryParams.pageNum,"llllllllllllll");
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;

  selectDetailByFileId({
    fileId: traitFileId.value,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      const tableDataValue = [];
      const columnsValue = [];

      totalPage.value = res.total;
      if (res.rows.length > 0) {
        const firstItemKeys = Object.keys(res.rows[0]);
        const visibleColumns = firstItemKeys.slice(0, 100); // 限制为前100列

        visibleColumns.forEach((key) => {
          columnsValue.push({ label: key, prop: key });
        });

        res.rows.forEach((item) => {
          const rowData = {};
          visibleColumns.forEach((key) => {
            rowData[key] = item[key];
          });
          tableDataValue.push(rowData);
        });
      }

      columns.value = columnsValue.filter(column => column.label !== 'genotype_id');
      tableData.value = tableDataValue;
      tableLoading.value = false;
    })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

function modifFile(row) {
  dialogFormVisible.value = true;
  form.fileId = row.fileId;

  // 将行的值设置到表单中
  for (const column of columns.value) {
    form[column.prop] = row[column.prop];
  }
}

function updateFileData() {
  traitFileId.value = route.query.id;

  // 根据表单属性动态构建负载对象
  const payload = { fileId: traitFileId.value, genotypeId: form.genotype_id };
  for (const column of columns.value) {
    // 只添加不被标记为不可修改的项到负载对象中
    if (!isUnmodifiableColumn(column.prop)) {
      payload[column.prop] = form[column.prop];
    }
  }

  modifiFileData(payload)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(res.msg);

      // 清空表单输入
      for (const column of columns.value) {
        form[column.prop] = "";
      }
      dialogFormVisible.value = false;
      chooseForm();
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(err.msg); // 这应该是 res.msg 吗？
    });
}

//暂时
onMounted(() => {
  chooseForm();
});

onBeforeRouteLeave(() => {
  tableName.value = route.query.tableName;
  endUpdate(tableName.value)
    .then((res) => {
      console.log(res);
      //chooseForm();
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>
  
  <style lang="less" scoped>
.demo-pagination-block {
  width: 100%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

/* 使 el-table 的表头文本不换行 */
.trait-form-table .el-table__header .cell {
  white-space: nowrap;
}
</style>

<style lang="less" scoped>
.footer{
  position: absolute;
  left: 2.5%;
  bottom: 0;
  padding: 0%;

  .demo-pagination-block {
    width: 100%;
    margin-top: 10px;
    display: flex;

  }

}

:deep(.el-main, .el-footer) {
  padding: 0%;
}
:deep(.el-input__inner) {
  margin-right: 30px;
}
.scrollbar-wrapper {
  height: 400px; /* 设置容器的高度 */
  overflow-y: auto; /* 启用纵向滚动条 */
}

:deep(.el-dialog__header) {
  margin: 0%;
  background-color: #9abeaf;
  span {
    color: white;
  }
}
</style>

<!-- 表格样式 -->
<style lang="less" scoped>
:deep(.el-table__header){
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;

  th{
    font-weight: 800;
    font-size: 16PX;
    background: #FAFAFA !important;
    // letter-spacing: 2px;
    height: 60px !important;
  }
}

:deep(.el-table__cell){
  .cell{
    word-break: break-word;
  }

}
</style>