<template>
	<div>
		<el-card class="card-container">
			<template #header>
				<div class="card-header">
					<span>基因型数据筛选</span>
				</div>
			</template>

			<el-select v-model="value" placeholder="请选择">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>

		</el-card>
	</div>
</template>

<script>
import{
  getMaterialList
}from "@/api/tree";
import { onMounted } from "vue";
export default {
  data() {
    return {
      options: [],
      value: ''
    }
  },
	mounted(){
		this.getMaterialLists();
	},

	methods:{
		getMaterialLists(){
			const tableName = this.$route.query.tableName;
			console.log(tableName);
			// let mlist=[]; 
			// getMaterialList().then(res =>{
			// 	console.log(res);
			// })
		}
	}
}
</script>

<!-- 卡片样式 -->
<style lang="less" scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

:deep(.el-card__header) {
	background: #9abeaf;
	height: 60px !important;
	display: flex;
	vertical-align: middle;
	padding-left: 50px !important;

	span {
		font-weight: 700;
		font-size: 20px;
		color: white;
		letter-spacing: 2px;
	}
}

:deep(.el-table__header) {
	border-bottom: 1px solid black;
	border-top: 1px solid #ebeef5;

	th {
		font-weight: 800;
		font-size: 16PX;
		background: #FAFAFA !important;
		letter-spacing: 2px;
		height: 60px !important;
	}
}

:deep(.el-table__cell) {
	.cell {
		word-break: break-word;
	}
}

.card-container {
	border-radius: 20px;
	width: 95%;
	margin: auto;
	margin-top: 30px;
}
</style>