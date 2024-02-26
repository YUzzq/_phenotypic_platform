<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <el-form
          class="myform"
          label-width="100px"
          label-position="left"
          :inline="true"
        >
          <el-form-item label="材料名、表型">
            <el-input
              placeholder="请输入材料名称或表型名称"
              class="my-input"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="Search"
              class="search-button my-button"
              >搜索</el-button
            >
            <el-button icon="Refresh" class="my-button"
              >重置</el-button
            ></el-form-item
          >
        </el-form>
      </el-header>
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
              v-for="column in tableColumns"
              :key="column.prop"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.width"
              :fixed="column.fixed"
              align="center"
            >
              <template #default="scope">
                {{ formatTableCell(scope.row[column.prop]) }}
              </template>
            </el-table-column>
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
            :page-sizes="[20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { getTree } from "@/api/tree";
import { onBeforeRouteLeave } from "vue-router";

import {
  listFile,
  selectDetailByFileId,
  exportPenoFile,
  modifiFileData,
  endUpdate,
} from "@/api/infomanage/phenotype";

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const dialogFormVisible = ref(false); // 表单可见
const formKeys = ["fileName", "materialId"];

const form = reactive({});

const route = useRoute();
const total = ref(2);

const traitsArray = reactive([]); // 使用后端提供的性状数据填充这个数组
//分页
const pageSize = ref(20);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

function formatTableCell(value) {
  return value || "-"; // 如果值为空，返回'-'
}

async function fetchData(pageNumber, pageSize) {
  try {
    tableLoading.value = true;
    traitFileId.value = 392;
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
        totalPage.value = res.total;
        tableColumns.value = [
          { prop: "fileName", label: "文件名", width: "120px" },
          { prop: "materialId", label: "材料名称", width: "120px" },
        ];

        selectDetailByFileId({
          fileId: traitFileId.value,
          pageSize: queryParams.pageSize,
          pageNum: queryParams.pageNum,
        })
          .then((res) => {
            totalPage.value = res.total;
            updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据

            // 更新tableData
            for (let j = 0; j < res.rows.length; j++) {
              traitRes[j] = new Map();

              for (let i = 0; i < res.rows[j].traits.length; i++) {
                let propertyName = `trait_id_${i}`;
                let traitIdValue = res.rows[j].traits[i][propertyName];
                if (traitIdValue) {
                  let traitValue = traitIdValue.traitValue;
                  traitRes[j].set(propertyName, traitValue);
                }

                tableData[j][propertyName] = traitRes[j].get(propertyName);
              }
            }

            // 更新tableColumns
            for (let i = 0; i < res.rows[0].traits.length; i++) {
              let propertyName = `trait_id_${i}`;
              tableColumns.value.push({
                prop: `trait_id_${i}`,
                label: res.rows[0].traits[i][propertyName].traitName,
                width: "100px",
              });
            }

            tableLoading.value = false;
          })
          .catch((err) => {
            tableLoading.value = false;
            console.error(err);
          });
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
const tableName = ref("");

const fileList = [];

const traitFileId = ref(60);

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = reactive([]); //表格数据

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

const tableColumns = ref([]);
const traitRes = reactive([]);
const columnsValue = [];

//请求性状信息
function chooseForm() {
  tableLoading.value = true;
  traitFileId.value = 392;
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  selectDetailByFileId({
    fileId: traitFileId.value,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      totalPage.value = res.total;
      tableColumns.value = [
        { prop: "fileName", label: "文件名", width: "120px" },
        { prop: "materialId", label: "材料名称", width: "120px" },
      ];

      selectDetailByFileId({
        fileId: traitFileId.value,
        pageSize: queryParams.pageSize,
        pageNum: queryParams.pageNum,
      })
        .then((res) => {
          totalPage.value = res.total;
          updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据

          // 更新tableData
          for (let j = 0; j < res.rows.length; j++) {
            traitRes[j] = new Map();

            for (let i = 0; i < res.rows[j].traits.length; i++) {
              let propertyName = `trait_id_${i}`;
              let traitIdValue = res.rows[j].traits[i][propertyName];
              if (traitIdValue) {
                let traitValue = traitIdValue.traitValue;
                traitRes[j].set(propertyName, traitValue);
              }

              tableData[j][propertyName] = traitRes[j].get(propertyName);
            }
          }
          // 更新tableColumns
          for (let i = 0; i < res.rows[0].traits.length; i++) {
            let propertyName = `trait_id_${i}`;
            tableColumns.value.push({
              prop: `trait_id_${i}`,
              label: res.rows[0].traits[i][propertyName].traitName,
              width: "100px",
            });
          }
          tableLoading.value = false;
        })
        .catch((err) => {
          tableLoading.value = false;
          console.error(err);
        });
    })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

// 将性状数据映射到表格格式的函数
function mapTraitsToTableData(data) {
  return data.map((entry) => {
    const traits = {};
    entry.traits.forEach((trait) => {
      traits[`trait_id_${trait.traitId}`] = trait;
    });
    return { ...entry, traits };
  });
}

const selectedRow = ref(null);

function updateFileData() {
  const baseParams = {
    materialId: form.materialId,
  };

  let traitParams = {};
  for (let i = 0; i <= 39; i++) {
    traitParams[`trait_id_${i}`] = form[`trait_id_${i}`];
  }

  const params = { ...baseParams, ...traitParams };

  modifiFileData(params)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(res.msg);
      dialogFormVisible.value = false;
      chooseForm();
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(res.msg);
      dialogFormVisible.value = false;
    });
}

onMounted(() => {
  chooseForm();
});

onBeforeRouteLeave(() => {
  endUpdate(phenotype_Maize1404_Cubic_HeBei_295089)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style lang="less" scoped>
.footer {
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

:deep(.el-header) {
  padding-top: 1%;
  padding-left: 2.5%;
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

.search-button {
  background: rgb(85, 123, 116);
}
</style>
