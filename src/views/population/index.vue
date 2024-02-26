<template>
  <div class="app-container">
    <el-form :model="addition" ref="queryForm" size="large" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属物种" prop="species_name">
        <el-select v-model="addition.species_name" class="m-2" placeholder="请选择物种名称" clearable>
          <el-option v-for="item in species_nameOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="群体名称" prop="population_name">
        <el-input v-model="addition.population_name" placeholder="请输入群体名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="Search" size="large" @click="handleQuery">搜索</el-button >
        <el-button  icon="Refresh" size="large" @click="resetQuery">重置</el-button >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button  type="primary" plain icon="Plus" size="large" @click="handleAdd"
          v-hasPermi="['system:population:add']">新增</el-button >
      </el-col>
      <el-col :span="1.5">
        <el-button  type="success" plain icon="Edit" size="large" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:population:edit']">修改</el-button >
      </el-col>
      <el-col :span="1.5">
        <el-button  type="danger" plain icon="Delete" size="large" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:population:remove']">删除</el-button >
      </el-col>
      <el-col :span="1.5">
        <el-button  type="warning" plain icon="Download" size="large" @click="handleExport"
          v-hasPermi="['system:population:export']">导出</el-button >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="handle_List"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="populationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="群体名称" align="center" prop="population_name" />
      <el-table-column label="所属物种" align="center" prop="species_name" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  link size="large" icon="Edit" type="text" @click="handleUpdate(scope.row)">修改</el-button >
          <el-button  link size="large" type="text" icon="Delete" @click="handleDelete(scope.row)">删除</el-button >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 30, 50]"
      v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize" layout="total, sizes,prev, pager, next, jumper" @size-change="handle_List" @current-change="handle_List" />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物种名称" prop="species_name">
          <el-select v-model="form.species_name" class="m-2" placeholder="请选择物种名称" clearable>
            <el-option v-for="item in species_nameOptions" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="群体名称" prop="population_name">
          <el-input v-model="form.population_name" placeholder="请输入群体名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="submitForm">确 定</el-button >
        <el-button  @click="cancel">取 消</el-button >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { download, checkout, listPopulation, SelectPopulation, getPopulation, delPopulation, addPopulation, updatePopulation, getSelectPopulation } from "@/api/system/population";
import { blobValidate } from '@/utils/param'
import { saveAs } from 'file-saver'
export default {
  name: "Population",
  data() {
    return {
      name:"",
      ifAdd: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      populationId: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      populationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      addition: {
        species_name: "",
        population_name: "",
      },
      // species_name:null,
      // population_name: null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        population_name: [
          { required: true, message: "群体名称不能为空", trigger: "blur" }
        ],
        speciesId: [
          { required: true, message: "物种ID不能为空", trigger: "blur" }
        ],
        species_name: [
          { required: true, message: "物种名称不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建者不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "更新者不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ],
      },
      //种群名称下拉选项
      species_nameOptions: []
    };
  },
  created() {
    this.handle_List();
    this.getSelPopu();
  },
  watch:{
    "form":{
      handler(newVal,oldVal){
        console.log(newVal)
        console.log(oldVal)
      },
      immediate:false,
      deep:true
    }
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listPopulation(this.queryParams).then(response => {
        console.log(response)
        this.populationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //population下拉框
    getSelPopu() {
      getSelectPopulation().then(res => {
        console.log(res)
        this.species_nameOptions = res.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        populationId: null,
        population_name: null,
        speciesId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
      // this.addition.population_name = ""
      // this.addition.species_name = ""
    },
    /**搜索 */
    handle_List() {
      let formdata = new FormData()
      formdata.append("population_name", this.addition.population_name)
      formdata.append("species_name", this.addition.species_name)
      // this.loading = true;
      SelectPopulation(this.queryParams, formdata).then(response => {
        console.log(response)
        this.populationList = response.rows;
        this.populationList.forEach(item=>{
          if(item.remark == null) item.remark = "-"
        })
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.handle_List();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.addition.population_name = ""
      this.addition.species_name = ""
      this.resetForm("form");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.populationId = selection.map(item => item.populationId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const populationId = row.population_id || this.populationId
      getPopulation(populationId).then(response => {
        this.form = response.data;
        this.name = this.form.population_name;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.population_id != null) {
            if(this.form.population_name == this.name)
            {
              updatePopulation(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.handle_List();
                });
            }
            else{
              checkout(this.form).then(res => {
              this.ifAdd = res.data;
              if (this.ifAdd == 0) {
                updatePopulation(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.handle_List();
                });
              }
              else { this.$modal.msgWarning("该名称已存在！") }
              })
            }
            

          } else {
            // let obj = {"speciesName":this.form.species_name}
            checkout(this.form).then(res => {
              this.ifAdd = res.data
              if (this.ifAdd == 0) {
                addPopulation(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.handle_List();
                });
              }
              else {
                this.$modal.msgWarning("该名称已存在")
              }
            })


          }
        }
      });
    },
    
    /** 删除按钮操作 */
    handleDelete(row) {
      const populationIds = row.population_id || this.populationId;
      this.$modal.confirm('是否确认删除编号为"' + populationIds + '"的数据项？').then(function () {
        return delPopulation(populationIds);
      }).then(() => {
        this.handle_List();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const population_id = this.populationId
      console.log(population_id)
      // let formdata = new FormData()
      // formdata.append("species_id",species_id)
      download(population_id).then(res => {
        const isLogin = blobValidate(res);
        if (isLogin) {
          const blob = new Blob([res])
          // console.log(blob)
          saveAs(blob, `population${new Date().getTime()}.xlsx`)
        } else {
          const resText = data.text();
          const rspObj = JSON.parse(resText);
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          Message.error(errMsg);
        }
      })
    }
  }
};
</script>
<!-- el-dialog的append-to-body属性会导致el-dialog的样式修改失效，先去掉 -->
<style lang="less" scoped>

:deep(.el-dialog__header){
  margin-right: 0px;
  background: #9ABEAF;
  height: 60px  !important;
  span{

    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}
</style>
