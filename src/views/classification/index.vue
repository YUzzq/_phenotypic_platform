<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="large" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="性状类型">
        <!-- <el-input
          v-model="add.type"
          placeholder="请输入性状名称"
          clearable
          @keyup.enter.native="handleQuery"
        /> -->
        <el-select v-model="add.type" class="m-2" placeholder="请选择性状类型" clearable>
          <el-option v-for="item in traitOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="性状名称">
        <el-input v-model="add.name" placeholder="请输入性状名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="large" @click="handleQuery" :loading="isSearching">搜索</el-button>
        <el-button icon="Refresh" size="large" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain size="large" @click="isModify"
          v-hasPermi="['system:trait:export']" :loading="isModifing">确认修改</el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" @queryTable="resetQuery"></right-toolbar>
    </el-row>

    <el-table ref="multipleTable" :data="traitList" v-model="selectArr" @select-all="handleSelectAll" @selection-change="handleSelectionChange"
      @select="handleSelect"  :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="性状名称" align="center" prop="traitName" />
      <el-table-column label="全称" align="center" prop="fullName" />
      <el-table-column label="缩写" align="center" prop="abbreviationName" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <el-pagination 
      v-show="total > 0" 
      :total="total" 
      :page-sizes="[10, 20, 30, 50]"
      v-model:current-page="queryParams.pageNum" 
      v-model:page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper" 
      @size-change="getHigh" 
      @current-change="getHigh" />
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
import { addHigh, selHighL, download, getSelect, getLightLine, listTrait, getTrait, delTrait, addTrait, updateTrait,selHighLAll,getLightLineAll } from "@/api/system/trait";
import { blobValidate } from '@/utils/param'
import { ElMessage } from "element-plus";
import { saveAs } from 'file-saver'
export default {
  name: "Trait",
  data() {
    return {
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
      },
      //记录是否第一次查询
      isFirstSearch: true,
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
      //高亮显示
      tableRowClassName: '',
      add: {
        type: "",
        name: ""
      },
      rowid: [],
      traitOptions: [],
      len: "",
      selectArr: [],
      //所有选中的数据
      allSelecArr: {},
      //是否为第一次查询
      isFirstSelection: true,
      //保存每页当前的数据
      pageSelection: [],
      //保存上一次的数据
      lastSelection: [],
      //加载项
      isSearching: false,
      isModifing: false
    };
  },
  created() {
    this.getHigh();
    this.getsel();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      let query = { ...this.queryParams, ...this.add }
      listTrait(query).then(response => {
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
      this.add.type = ""
      this.add.name = ""
      this.len = ""
      this.resetForm("form");
    },
    getHigh() {
      this.loading = true;
      let formdata = new FormData()
      formdata.append("type", this.add.type)
      formdata.append("name", this.add.name)
      getLightLine(this.queryParams, formdata).then(response => {
        this.traitList = response.rows
        this.total = response.total
        let query = { ...this.add, ...this.queryParams }
        selHighL(query).then(res => {
          if((this.add.type||this.add.name)&&res.data==0&&this.isFirstSearch){
            ElMessage.warning("没有符合条件的数据")
          }else if((this.add.type||this.add.name)&&this.isFirstSearch){
            ElMessage.success("查询成功")
          }
          this.isFirstSelection = true
          this.isFirstSearch = false
          this.len = res.data
          const num=this.queryParams.pageNum
          const size=this.queryParams.pageSize
          const start=(num-1)*size
          this.selectArr = this.traitList.slice(0,this.len)
          this.$refs.multipleTable.clearSelection();
          this.pageSelection = []
          this.traitList.forEach((item,index) => {
          if(this.allSelecArr[index+start] && item.traitId==this.allSelecArr[index+start].traitId){
            this.$refs.multipleTable.toggleRowSelection(item, true)
            this.pageSelection.push(index)
          }
          })
          this.isSearching = false
          console.log(this.allSelecArr, "this.allSelecArr");
          this.tableRowClassName = ({ row, rowIndex }) => {
            if (this.allSelecArr[rowIndex+start] && row.traitId==this.allSelecArr[rowIndex+start].traitId) {
              return "success-row"
            }
            else return ""
          }
        })

        this.loading = false;
      });
    },
    gethigh() {
      this.loading = true;
    },
    //查询所有选择的数据
    getAllSelection(){
      return new Promise((resolve,reject)=>{
        let formdata = new FormData()
        formdata.append("type", this.add.type)
        formdata.append("name", this.add.name)
        getLightLineAll({
          pageNum: 1,
          pageSize: 1000
        },formdata)
        .then(res1=>{
          let query = { ...this.add,pageNum: 1,pageSize: 1000 }
          selHighLAll(query).then(res2 => {
            res1.rows.slice(0, res2.data).forEach((item,index) => {
              this.allSelecArr[index]=item
            })
            resolve()
          })
        })
      })
    },
    /** 搜索按钮操作 */
    async handleQuery() {
      if (this.add.type == "" && this.add.name == "") {
        ElMessage.warning("请输入查询条件")
        return
      }
      this.queryParams.pageNum = 1;
      this.isFirstSearch = true;
      this.isFirstSelection = true
      this.allSelecArr = {}
      this.traitId = []
      this.isSearching = true
      this.getAllSelection().then(()=>{
        this.getHigh();
      })
      // this.getHigh();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.add.name = ""
      this.add.type = ""
      this.len = ""
      this.allSelecArr = {}
      this.traitId = []
      this.queryParams.pageNum = 1;
      this.isFirstSearch = true;
      this.isFirstSelection = true
      this.getHigh();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.isFirstSelection = false
      //获取allSelecArr的id数组
      console.log(this.allSelecArr, "this.allSelecArr111");
      this.traitId = []
      for(let key in this.allSelecArr){
        this.traitId.push(this.allSelecArr[key].traitId)
      }
      console.log(this.traitId, "this.traitId");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.traitId != null) {
            updateTrait(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrait(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const trait_id = this.traitId
      download(trait_id).then(res => {
        const isLogin = blobValidate(res);
        if (isLogin) {
          const blob = new Blob([res])
          saveAs(blob, `trait_classification${new Date().getTime()}.xlsx`)
        } else {
          const resText = data.text();
          const rspObj = JSON.parse(resText);
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          Message.error(errMsg);
        }
      })
    },
    //选中行高亮
    handleSelect(selection, row) {
      console.log(selection, "selection");
      const index = this.traitList.findIndex(item => item.traitId == row.traitId)+(this.queryParams.pageNum-1)*this.queryParams.pageSize
      console.log(this.pageSelection, "this.pageSelection计算前");
      this.lastSelection = this.pageSelection
      this.pageSelection = selection
      console.log(this.pageSelection,this.pageSelection.length, "this.pageSelection");
      console.log(this.lastSelection,this.lastSelection.length,"this.lastSelection");
      if(this.pageSelection.length>this.lastSelection.length){
        this.allSelecArr[index]=row
      }else{
        delete this.allSelecArr[index]
      }
      console.log(this.allSelecArr, "this.allSelecArr");
    },
    //全选数据
    handleSelectAll(selection) {
      const start =(this.queryParams.pageNum-1)*this.queryParams.pageSize
      if(selection.length==0){
        this.pageSelection = []
        this.traitList.forEach((item,index) => {
          delete this.allSelecArr[index+start]
        })
      }else{
        this.pageSelection = selection
        selection.forEach((item,index) => {
          this.allSelecArr[index+start]=item
        })
      }
      this.traitId = []
      for(let key in this.allSelecArr){
        this.traitId.push(this.allSelecArr[key].traitId)
      }
    },

    getsel() {
      getSelect().then(res => {
        this.traitOptions = res.data
      })
    },
    isModify() {
      let obj = {
        list: [],
        type: ""
      }
      obj.list = this.traitId
      obj.type = this.add.type
      if (obj.type == "" || obj.type == null) {
        ElMessage.warning("请通过形状类型来修改！！")
      }
      else {
        this.isModifing = true
        addHigh(obj).then(res => {
          if (res.code == 200) {
            ElMessage.success("修改成功")
          }
          else {
            ElMessage.error("修改失败")
          }
          this.resetQuery()
          this.isModifing = false
        })
      }

    }
  }
};
</script>
<style lang="scss">
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
<style lang="less" scoped>
:deep(.el-dialog__header) {
  margin-right: 0px;
  background: #9ABEAF;
  height: 60px !important;

  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}
</style>
