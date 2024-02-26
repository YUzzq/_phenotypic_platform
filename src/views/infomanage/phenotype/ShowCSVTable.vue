<template>
  <el-table :data="tableData" stripe :max-height="maxCustomH" :flexible="true" :loading="tableLoading">
    <el-table-column v-for="item in tableProps" :prop="item" :label="item" min-width="120" :key="item" />
  </el-table>
</template>

<script setup>
import { ref,watchEffect } from 'vue';
import { getJsonByCSV,jsonToTable } from '@/utils/tree';

const tableLoading = ref(false)

const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  maxCustomH: {
    type: String,
    default: '85vh'
  }
})
const emits = defineEmits(['getDates'])

const tableProps = ref([]);
const tableData = ref([]);

watchEffect(() => {
  console.log(props.url,'9090');
  if (props.url) {
    tableLoading.value = true
    getJsonByCSV(props.url).then(result => {
      console.log(result,'klkl');
      tableProps.value = result[0]
      tableData.value = jsonToTable(result)
      emits('getDates', result[0].slice(1))
      tableLoading.value = false
    })
  }
})
</script>

<style scoped>
</style>
