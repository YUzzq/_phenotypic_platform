<template>
	<div class="block">
        <el-slider
          v-model="svalue"
          range
          :marks="marks">
        </el-slider>
      </div>
</template>

<script>
import {
	getChromRatioAndMaxPos,
	getMaterialInfo
} from "@/api/tree";
import * as echarts from "echarts";
export default {
	data() {
		return {
			tableData: [],
			value: '',
			options: [],
			selectedItem: null,

			svalue: [30, 60],
			marks: {
				0: '0°C',
				8: '8°C',
				37: '37°C',
				50: {
					style: {
					color: '#1989FA'
					},
					label: this.$createElement('strong', '50%')
				}
			}
		}
	},
	mounted() {
		this.drawChart();
		this.getMaterialInfos();
	},

	methods: {
		drawChart() {
			getChromRatioAndMaxPos('genotype_maize_amp507_998191').then(res => {
				this.responseData = res.data;
				this.test_series = [];
				this.responseData.forEach((data, index) => {
					this.test_series.push({
						type: 'bar',
						name: data.chrom,
						stack: '总量',
						barMaxWidth: 20,
						label: {
							show: true,
							position: 'inside',
							formatter: '{a}'
						},
						//data: data.ratio
						data: [data.ratio]
					});
				});
				let chart = echarts.init(document.getElementById('chart'));
				window.addEventListener('resize', function () { chart.resize() });
				console.log(this.test_series, "iii");
				chart.setOption({
					color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
					grid: {
						x: 60,
						y: 80,
						x2: 60,
						y2: 40,
						containLabel: true
					},
					// tooltip: {
					// 	trigger: 'axis',
					// 	axisPointer: {
					// 		type: 'none'
					// 	},
					// 	textStyle: {
					// 		color: '#cdd3ee'
					// 	},
					// 	formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%'
					// },
					legend: {
						textStyle: {
							fontSize: 16,
							color: '#cdd3ee'
						},
						top: 13,
						//data: ['已完成', '进行中', '未完成']
					},
					xAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						}
					},
					yAxis: [
						{
							type: 'category',
							axisTick: {
								show: false
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: '#cdd3ee'
								}
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								show: false,
								fontSize: 16,
								color: '#cdd3ee',
								formatter: '{value}'
							},
						}
					],
					series: this.test_series
				})
			})

		},

		getMaterialInfos(){
			getMaterialInfo('genotype_maize_amp507_998191','04k5672','chr1',0,10000).then(res =>{
				console.log(res);
			}).catch(err =>{
				console.log(err);
			})
		}
	}

}
</script>
<style scoped>
.wrapper {
	width: 100%;
}

.wrapper .chart {
	height: 400px;
	margin: 100px auto 0;
}
</style>