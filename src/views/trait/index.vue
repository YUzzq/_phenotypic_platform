<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="large" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="性状名称" prop="traitName">
        <el-input
          v-model="queryParams.traitName"
          placeholder="请输入性状名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
        <!-- <el-select v-model="queryParams.traitName" class="m-2" placeholder="请输入性状名称" clearable>
          <el-option
            v-for="item in traitOptions"
            :key="item"
            :value="item"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="全称" prop="fullName">
        <el-input
          v-model="queryParams.fullName"
          placeholder="请输入全称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="缩写" prop="abbreviationName">
        <el-input
          v-model="queryParams.abbreviationName"
          placeholder="请输入缩写"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="large" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" size="large" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="large"
          @click="handleAdd"
          v-hasPermi="['system:trait:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          size="large"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:trait:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          size="large"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:trait:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          size="large"
          @click="handleExport"
          v-hasPermi="['system:trait:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  :data="traitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column label="性状名称" align="center" prop="traitName" />
      <el-table-column label="全称" align="center" prop="fullName" />
      <el-table-column label="缩写" align="center" prop="abbreviationName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="large"
            type="text"
            @click="handleUpdate(scope.row)" q  
          >修改</el-button>
          <el-button
            size="large"
            type="text"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getList"
      @current-change="getList"
      
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" v-model="open" width="500px"> 
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="性状名称" prop="traitName">
          <el-input v-model="form.traitName" placeholder="请输入性状名称" />
        </el-form-item>
        <el-form-item label="全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入全称" />
        </el-form-item>
        <el-form-item label="缩写" prop="abbreviationName">
          <el-input v-model="form.abbreviationName" placeholder="请输入缩写" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { download,checkout,listTrait, getTrait, delTrait, addTrait, updateTrait,getSelect } from "@/api/system/trait";
import { blobValidate } from '@/utils/param'
import { saveAs } from 'file-saver'
export default {
  name: "Trait",
  data() {
    return {
      name:"",
      ifAdd:0,
      // 遮罩层
      loading: true,
      // 选中数组
      traitId: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      traitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        traitName: null,
        fullName: null,
        abbreviationName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        traitName: [
          { required: true, message: "性状名称不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "全称不能为空", trigger: "blur" }
        ],
        abbreviationName: [
          { required: true, message: "缩写不能为空", trigger: "blur" }
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
      //性状名称下拉框
      traitOptions:[]
      // addition:
    };
  },
  created() {
    this.getList();
    // this.getsel();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTrait(this.queryParams).then(response => {
         this.traitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        traitId: null,
        traitName: null,
        fullName: null,
        abbreviationName: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.traitId = selection.map(item => item.traitId)
      this.single = selection.length!==1
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
      const traitId = row.traitId || this.traitId
      getTrait(traitId).then(response => {
        this.form = response.data;
        this.name = this.form.traitName
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.traitId != null) {
            if(this.name == this.form.traitName){
              updateTrait(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              });
            }
            else{
              checkout(this.form).then(res=>{
                this.ifAdd = res.data;
                if(this.ifAdd == 0){
                  updateTrait(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
                }
                else{this.$modal.msgWarning("该名称已存在！")}
              })
            }
          } else {
            checkout(this.form).then(res=>{
              this.ifAdd = res.data
              if(this.ifAdd == 0){
                addTrait(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }
              else{
                this.$modal.msgWarning("该名称已存在！")
              }
            })
            
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const traitIds = row.traitId || this.traitId;
      this.$modal.confirm('是否确认删除编号为"' + traitIds + '"的数据项？').then(function() {
        return delTrait(traitIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const trait_id = this.traitId
      // let formdata = new FormData()
      // formdata.append("species_id",species_id)
      download(trait_id).then(res=>{
        const isLogin = blobValidate(res);
        if (isLogin) {
          const blob = new Blob([res])
          // console.log(blob)
          saveAs(blob, `trait${new Date().getTime()}.xlsx`)
        } else {
          const resText = data.text();
          const rspObj = JSON.parse(resText);
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          Message.error(errMsg);
        }
      })
    },

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
