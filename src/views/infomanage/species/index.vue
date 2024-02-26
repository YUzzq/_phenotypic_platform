<template>
  <body>
    <el-container>
      <el-main>
        <el-card class="card-container">
          <div class="big-wrapper">
            <!-- 第一部分 -->
            <div class="card-title">
              <div class="card-title-line"></div>
              <div class="card-title-content">通过Key值选择图片列表</div>
            </div>
            <el-card class="nodeBox">
              <p>选择Key值</p>
              <el-cascader
                v-model="value"
                :options="selectOptions"
                :props="props"
                @change="handleChangeCascader"
                class="node-cascader"
              />
              <el-button>searching……</el-button>
            </el-card>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </body>
</template>

<script setup name="species">
import { reactive, ref, onMounted } from "vue";
import { getTree } from "@/api/tree.js";
/* 选择框数据 */
const selectOptions = ref([
  {
    value: "species",
    label: "以表型品种分类",
    children: [
      {
        value: "disciplines",
        label: "品种一",
        children: [
          {
            value: "consistency",
            label: "表型一",
          },
          {
            value: "feedback",
            label: "表型二",
          },
          {
            value: "efficiency",
            label: "表型三",
          },
          {
            value: "controllability",
            label: "表型四",
          },
        ],
      },
    ],
  },
  {
    value: "manage",
    label: "以管理员分类",
    children: [
      {
        value: "member",
        label: "成员名称",
        children: [
          {
            value: "menberName1",
            label: "赵一",
          },
          {
            value: "menberName2",
            label: "王二",
          },
          {
            value: "menberName3",
            label: "孙三",
          },
        ],
      },
    ],
  },
]);

const routesData = ref([]);

const treeType = ref(1); // 树的种类

const getTreeList = () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data.children;
    //过滤routesData数组
    routesData.value.map((item) => {});
  });
};

onMounted(() => {
  getTreeList();
});
</script>

<style lang="less" scoped>
/* 统一按钮样式 */
:deep(.el-button) {
  background: rgb(85, 123, 116);
  color: #fff;
}

.card-container {
  width: 95%;
  border-radius: 50px;
  margin: auto;

  :deep(.el-card__body) {
    padding: 15px 20px 20px 20px !important;
  }

  .big-wrapper {
    width: 95%;
    margin: auto;

    .card-title {
      width: 30%;
      color: rgb(64, 64, 112);
      border-radius: 10px;
      height: 40px;
      display: flex;

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
    }

    /* 第一部分 */
    .nodeBox {
      margin: 10px;
      margin-bottom: 20px;
      border-radius: 20px;
      :deep(.el-cascader) {
        margin-right: 20px;
      }
    }
  }
}
</style>