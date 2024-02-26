<template>
    <div class="outBox">
        <div class="chooseType">
            <span>表型数据可视化：</span>
            <el-select placeholder="请选择可视化模块" v-model="visualModule">
                <el-option label="表型和材料数量&表型分析" value="num"></el-option>
                <el-option label="性状分析" value="traitAnalysis"></el-option>
                <el-option label="性状管理" value="traitManage"></el-option>
            </el-select>
        </div>
        <num v-if="visualModule==='num'"></num>
        <trait-analysis v-if="visualModule==='traitAnalysis'"></trait-analysis>
        <trait-manage v-if="visualModule==='traitManage'"></trait-manage>
    </div>
</template>

<script setup>
//控制可视化模块的显示
const visualModule = ref('traitAnalysis')

import num from './visual/num.vue'
import traitAnalysis from './visual/traitAnalysis.vue'
import traitManage from './visual/traitManage.vue'

</script>

<style scoped>

.outBox{
    margin: 2%;
}

.chooseType{
    margin: 20px 0;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);
    font-size: 20px;
    border-radius: 30px;
}

</style>