<template>
  <div class="home">
    <el-button
      style="margin: 20px; margin-left: calc(95% - 30px)"
      @click="exportFile"
      type="primary"
      size="large"
      >导出</el-button
    >
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="材料名">
        <el-select v-model="searchForm.searchMaterialId" multiple filterable clearable placeholder="请选择材料名">
          <el-option
            v-for="(item,index) in materialoptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表型名">
        <el-select v-model="searchForm.searchTraitId" multiple filterable clearable placeholder="请选择表型名">
          <el-option
            v-for="(item,index) in traitoptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="search-button" type="primary" @click="searchSubmit" icon="Search">搜索</el-button>
        <el-button type="info" @click="reset" icon="refresh">重置</el-button>
      </el-form-item>
    </el-form>
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
            max-height="100vh - 280px"
          >
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="auto"
              fixed="left"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  icon="Document"
                  link
                  @click="modifFile(scope.row)"
                  >修改
                </el-button>
              </template>
            </el-table-column>

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
            style="width: 100%"
          >
            <el-form-item
              v-for="column in tableColumns"
              :label="column.label"
              :prop="column.prop"
              :key="column.prop"
            >
              <el-input
                v-model="form[column.prop]"
                :value="form[column.prop]"
                :disabled="isUnmodifiableColumn(column.prop)"
              />
            </el-form-item>
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
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { getTree } from "@/api/tree";
import { onBeforeRouteLeave } from "vue-router";

import {
  listFile,
  searchBox,
  traitAndMaterialList,
  selectDetailByFileId,
  exportPenoFile,
  modifiFileData,
  endUpdate,
} from "@/api/infomanage/phenotype";

const traitFileId = ref(60);

const searchForm = reactive({
  searchMaterialId:[],
  searchTraitId:[],
})

function searchSubmit(){
  searchBox({
    fileId: traitFileId.value,
    searchMaterialId:searchForm.searchMaterialId,
    searchTraitId:searchForm.searchTraitId,
  }).then((res) => {
          // console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
          totalPage.value = res.total;
          updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据
          tableColumns.value = [

            { prop: "speciesName", label: "物种名", width: "80px", fixed: "left" },
            {
              prop: "populationName",
              label: "种群名",
              width: "130px",
              fixed: "left",
            },
            { prop: "location", label: "地区", width: "80px", fixed: "left" },
            { prop: "repeat", label: "重复试验", width: "120px" },
            { prop: "kindId", label: "品种ID", width: "120px" },
            { prop: "kindName", label: "品种名称", width: "200px" },
            { prop: "materialId", label: "材料ID", width: "120px" },
            { prop: "fieldId", label: "田间编号", width: "120px" },
            { prop: "controlType", label: "对照类型", width: "100px" },
            { prop: "father", label: "父本", width: "100px" },
            { prop: "mother", label: "母本", width: "100px" },
            { prop: "remark", label: "备注", width: "380px" },

          ];
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
          console.log("1");
          // 更新tableColumns
          
          for (let i = 0; i < res.rows[0].traits.length; i++) {
            let propertyName = `trait_id_${i}`;
            tableColumns.value.push({
              prop: `trait_id_${i}`,
              label: res.rows[0].traits[i][propertyName].traitName,
              width: '100px'
            });
          }
          console.log(tableColumns.value, "ioio");

          tableLoading.value = false;
        })
        .catch((err) => {
          tableLoading.value = false;
          console.error(err);
        });
}

//重置
function reset(){
  searchForm.searchMaterialId=[];
  searchForm.searchTraitId=[];
  searchSubmit();
}


const traitoptions = ref([]);
const materialoptions =ref([]);





// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const dialogFormVisible = ref(false); // 表单可见
const formKeys = [
  "tableName",
  "fileId",
  "phenotypeId",
  "father",
  "mother",
  "location",
  "fieldId",
  "controlType",
  "kindId",
  "kindName",
  "populationId",
  "speciesName",
  "populationName",
  "remark",
  "materialId",
];

const form = reactive({});

formKeys.forEach((key) => {
  form[key] = "";
});

// 添加 trait_id_n 属性
for (let i = 0; i <= 39; i++) {
  form[`trait_id_${i}`] = "";
}

const rules = reactive({
  key: [{ required: true, message: "Please input key name", trigger: "blur" }],
  value: [{ required: true, message: "Please input value", trigger: "blur" }],
});

const route = useRoute();
const total = ref(2);

const traitsArray = reactive([]); // 使用后端提供的性状数据填充这个数组
//分页
const pageSize = ref(20);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

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
        console.log(res, "9090");
        let i = ref(0);

        totalPage.value = res.total;
        tableColumns.value = [
          {
            prop: "speciesName",
            label: "物种名",
            width: "80px",
            fixed: "left",
          },
          {
            prop: "populationName",
            label: "种群名",
            width: "130px",
            fixed: "left",
          },
          { prop: "location", label: "地区", width: "80px", fixed: "left" },
          { prop: "repeat", label: "重复试验", width: "80px" },
          { prop: "kindId", label: "品种ID", width: "120px" },
          { prop: "kindName", label: "品种名称", width: "200px" },
          { prop: "materialId", label: "材料ID", width: "120px" },
          { prop: "fieldId", label: "田间编号", width: "80px" },
          { prop: "controlType", label: "对照类型", width: "100px" },
          { prop: "father", label: "父本", width: "100px" },
          { prop: "mother", label: "母本", width: "100px" },
          { prop: "remark", label: "备注", width: "380px" },
        ];

        selectDetailByFileId({
          fileId: traitFileId.value,
          pageSize: queryParams.pageSize,
          pageNum: queryParams.pageNum,
        })
          .then((res) => {
            console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
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
                width: '100px'
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

const unmodifiableColumns = [
  "tableName",
  "fileId",
  "phenotypeId",
  "location",
  "speciesName",
  "populationName",
];

// 计算属性，检查列是否为不可修改
const isUnmodifiableColumn = (columnProp) => {
  return unmodifiableColumns.includes(columnProp);
};

//导出
function exportFile() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  exportPenoFile(tableName.value)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(res.msg);
      $download.resource(res.data);
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(res.msg);
    });
}

const fileList = [];



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
  traitFileId.value = route.query.id;
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
      console.log(res, "9090");
      let i = ref(0);

      totalPage.value = res.total;
      tableColumns.value = [

        { prop: "speciesName", label: "物种名", width: "80px", fixed: "left" },
        {
          prop: "populationName",
          label: "种群名",
          width: "130px",
          fixed: "left",
        },
        { prop: "location", label: "地区", width: "80px", fixed: "left" },
        { prop: "repeat", label: "重复试验", width: "120px" },
        { prop: "kindId", label: "品种ID", width: "120px" },
        { prop: "kindName", label: "品种名称", width: "200px" },
        { prop: "materialId", label: "材料ID", width: "120px" },
        { prop: "fieldId", label: "田间编号", width: "120px" },
        { prop: "controlType", label: "对照类型", width: "100px" },
        { prop: "father", label: "父本", width: "100px" },
        { prop: "mother", label: "母本", width: "100px" },
        { prop: "remark", label: "备注", width: "380px" },

      ];

      selectDetailByFileId({
        fileId: traitFileId.value,
        pageSize: queryParams.pageSize,
        pageNum: queryParams.pageNum,
      })
        .then((res) => {
          console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
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
          console.log("1");
          // 更新tableColumns
          for (let i = 0; i < res.rows[0].traits.length; i++) {
            let propertyName = `trait_id_${i}`;
            tableColumns.value.push({
              prop: `trait_id_${i}`,
              label: res.rows[0].traits[i][propertyName].traitName,
              width: '100px'
            });
          }
          console.log(tableColumns.value, "ioio");

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

function modifFile(row) {
  dialogFormVisible.value = true;

  const keys = [
    "tableName",
    "fileId",
    "phenotypeId",
    "repeat",
    "father",
    "mother",
    "controlType",
    "location",
    "kindId",
    "fieldId",
    "kindName",
    "populationId",
    "speciesName",
    "populationName",
    "remark",
    "materialId",
  ];

  keys.forEach((key) => {
    form[key] = row[key];
  });

  for (let i = 0; i <= 39; i++) {
    form[`trait_id_${i}`] = row[`trait_id_${i}`];
  }
}
function updateFileData() {
  const baseParams = {
    fileId: form.fileId,
    tableName: form.tableName,
    phenotypeId: form.phenotypeId,
    father: form.father,
    mother: form.mother,
    repeat: form.repeat,
    location: form.location,
    kindId: form.kindId,
    kindName: form.kindName,
    populationId: form.populationId,
    speciesName: form.speciesName,
    populationName: form.populationName,
    remark: form.remark,
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
  tableName.value = route.query.tableName;
  traitAndMaterialList(tableName.value).then((res)=>{
    traitoptions.value=res.data.trait;
    materialoptions.value=res.data.material;
  }).catch((err)=>{
    $modal.msgError(res.msg);
  })
});

onBeforeRouteLeave(() => {
  endUpdate(form.tableName)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped lang="less"> 
  .search-form{
    margin-left: 50px;
  }

  .search-button{
    border:#1F4E3D;
    background: rgb(85, 123, 116);
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

:deep(.el-table__header){
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;

  th{
    font-weight: 800;
    font-size: 16PX;
    background: #FAFAFA !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}
el-main{
  height: 100px;
  overflow: auto;
}
</style>