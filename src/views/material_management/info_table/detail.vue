<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.query);
const input = ref("");
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>
<template>
  <div
    style="
      background: #f6f6f6;
      min-height: 90vh;
      padding: 10px;
      border: 1px solid #f6f6f6;
    "
  >
    <div
      style="
        background: #9abeaf;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
      "
    >
      材料信息
    </div>
    <div
      style="
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        margin-top: 10px;
      "
    >
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="8"> <el-input v-model="input" /></el-col>
        <el-col :span="1.5"> <el-button type="primary">排序</el-button></el-col>
        <el-col :span="1.5"> <el-button type="primary">过滤</el-button></el-col>
        <el-col :span="1.5"> <el-button type="primary">导出</el-button></el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
