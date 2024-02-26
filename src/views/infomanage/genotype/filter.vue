<template>
  <div>
    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <span>基因型数据筛选</span>
        </div>
      </template>

      <el-container>
        <el-main width="78%" class="right-box">
          <el-container style="height: 350px">
            <!-- 表格部分 -->
            <el-table @row-click="handleEdit" :data="tableData" ref="singleTable"
              @selection-change="handleSelectionChange" stripe fit highlight-current-row height="250" class="mytable el-table__body-wrapper">
              <el-table-column label="序号" width="80px" type="index" align="center" />
              <el-table-column label="材料名" align="center" prop="label" />
            </el-table>
          </el-container>

          <el-select v-model="selectedItem" filterable placeholder="请选择" @change="selectChange">
            <el-option v-for="item in options" :key="item.index" :label="item.label" :value="item.index">
            </el-option>
          </el-select>
          <el-button type="primary" plain icon="edit" @click="searchMaterial" class="filter-item my-button" v-model="selectedItem">确认</el-button>


          <div class='wrapper'>
            <div class='chart' id='chart'></div>
          </div>
          <el-slider
            v-model="sliderValue"
            range
            :min = min
            :max = max
            :key="sliderKey"
            @change="sliderChange"
            ref ="slider"
            style = "max-width: 100%">
           
          </el-slider>

          
        </el-main>
        <!-- 分页 -->
        <!-- <el-footer class="footer">
					<el-pagination v-show="total > 0" :total="total" v-model:currentPage="queryParams.pageNum"
						v-model:page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
						@size-change="getList" @current-change="getList" :background="false" />
				</el-footer> -->
      </el-container>


      

      <el-container class="gene-informage-container">
        <div class="scrollable-content" id="geneInformageContainer">
        </div>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import {
  getMaterialList,
  getChromRatioAndMaxPos,
  getMaterialInfo
} from "@/api/tree";
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  data() {
    return {
      tableData: [],
      value: '',
      options: [],
      currentRow: null,
      selectedItem: null,
      start: 0,
      end : 0,
      min : 0,
      max : 0,
      geneName: '',
      sliderKey: 0,
      sliderValue: [],
    }
  },
  mounted() {
    this.getMaterialLists();

    this.drawChart();
    //this.getMaterialInfos();

    //this.func();
  },

  methods: {
    getMaterialLists() {
      console.log("getMaterialLists");
      const tableName = this.$route.query.tableName;
      getMaterialList(tableName).then(res => {
        if (res.code === 200) {
          // this.options = res.data; // 将获取到的数据赋值给options数组
          this.tableData = res.data.map(item => ({ label: item, value: item })); // 将获取到的数据赋值给options数组
          this.options = res.data.map((item, index) => ({ label: item, value: item , index: index })); // 将获取到的数据赋值给options数组
          console.log(res);
          this.$refs.singleTable.setCurrentRow(this.tableData[0]);
          this.selectedItem = this.tableData[0].label;
        } else {
          console.error('获取数据失败');
        }
      }).catch(error => {
        console.error(error);
      })

      // 获取el-table中的所有行
      const rows = document.querySelectorAll('.el-table__body-wrapper tbody tr');

      // 遍历所有行
      rows.forEach((row,index) => {
        // 在这里执行对每一行的操作
        //console.log(row); // 打印每一行的DOM元素
        row.id = index.toString();
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      //this.currentRow = val;
    },  
    searchMaterial() {
      //this.getMaterialInfos();
      this.func();
    },
    selectChange(value) {
      this.selectedItem = this.tableData[value].label;
      //console.log(value,"vvv");
      this.$refs.singleTable.setCurrentRow(this.tableData[value]);
      this.scrollToRow(value);
    },
    
    handleEdit(row) {
      this.selectedItem = row.label;
    },
    handleSelectionChange(selection){
      this.selectedItem = selection[0];
    },
    sliderChange(val){
      this.start = val[0];
      this.end = val[1];
      this.sliderValue = val;
    },
    scrollToRow(rowNumber) {
      const Tbody = this.$refs.singleTable.$el.querySelector('.el-table__body-wrapper');
      setTimeout(() => {
        Tbody.querySelector('.current-row')?.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
      }, 300);
    },
    resetSlider(min,max) {
      setTimeout(() => {
        this.min = min;
        this.max = max;
        // console.log(this.min,"mmmmmin");
        // console.log(this.max,"mmmmmmax");
        this.start = this.min;
        this.end = this.max;
        //this.sliderValue[0] = min;
        //this.sliderValue[1] = max;
        this.sliderValue = [min, max];
        //this.sliderKey += 1;
        //console.log(this.min,this.max,this.start,this.end,this.sliderValue,"///////////");
        //console.log(this.sliderValue,"ppppppppp");

        //this.$refs.slider.syncValue();
        //this.$refs.slider.$forceUpdate();
        //this.$refs.slider.set(this,'slider',[min,max]);  // 常用的vue更新视图方法，解决vue2双向绑定问题
      });
    },


    drawChart() {
      const tableName = this.$route.query.tableName;
      getChromRatioAndMaxPos(tableName).then(res => {
        this.responseData = res.data;
        this.test_series = [];
        //console.log(this.responseData);
        this.geneName = this.responseData[0].chrom;
        let temp = '';
        this.responseData.forEach((data, index) => {
          if(/^\d+$/.test(data.chrom)) temp = "chr" + data.chrom;
          else temp = data.chrom;
          this.test_series.push({
            type: 'bar',
            name: temp,
            stack: '总量',
            //barMaxWidth: 20,
            label: {
              show: true,
              position: 'inside',
              formatter: '{a}'
            },
            itemStyle: {
              color: '#9ABEAF',
              borderWidth:1, //设置border的宽度有多大
              borderColor:'#fff',
            },
            //data: data.ratio
            data: [data.ratio]
          });
          this.test_series[0].itemStyle = {
              color: '#5470c6',
              borderWidth:1, //设置border的宽度有多大
              borderColor:'#fff',
            };
        });
        this.resetSlider(this.responseData[0].min,this.responseData[0].max);
        //console.log(this.sliderValue,"thisssssssssss");
        let chart = echarts.init(document.getElementById('chart'));
        window.addEventListener('resize', function () { chart.resize() });
        console.log(this.test_series, "iii");
        
        chart.setOption({
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          grid: {
            top:"0px",
            left:"0px",
            right:"0px",
            bottom:"0px",
            //height: "29px",// 高度
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
            show:false,
            selectedMode:"true", 
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
          series: this.test_series,
          aria: {
              enabled: true,
              decal: {
                  show: true,
                  decals: {
                    symbol: 'line',
                    rotation: 0.423,
                    color: 'rgba(250, 200, 88,0.8)',
                    dashArrayX: [10,0],
                    dashArrayY: [10,0],
                  }
              }
            },
        });
        // chart.on('click', function(params) {
        //   // 控制台打印数据的名
        //   this.geneName = params.seriesName;
        //   console.log(this.geneName);
        // });
        chart.on('click', (params) => {
          // 控制台打印数据的名
          this.geneName = this.responseData[params.seriesIndex].chrom
          console.log(params,"ppppppp");
          //console.log(this.responseData,"qqqqqqqq");
          this.resetSlider(this.responseData[params.seriesIndex].min,this.responseData[params.seriesIndex].max);
          


        });

        chart.on('click', (params) => {
          //console.log(this.test_series);
          //console.log(series);
          for (let i = 0; i < this.test_series.length; i++) {
            if (i === params.seriesIndex) {
              this.test_series[i].itemStyle = {
                color: '#5470c6',
              };
            }else{
              this.test_series[i].itemStyle = {
                color: '#9ABEAF',
              };
            }
          }
          chart.setOption({ series: this.test_series });
        });
        this.func();
      })
    },

    initPresentationBox(box_num){
      const container = document.getElementById("geneInformageContainer");

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      for(let i=0;i<box_num;i++)
      {
        const bigdiv = document.createElement("div");
        bigdiv.className = "child-div";
        // 可以在这里设置div的样式、内容等
        container.appendChild(bigdiv);
        
      };

      const bigdivs = document.getElementsByClassName("child-div");
      for(let i=0;i<box_num;i++)
      {
        const smalldiv1 = document.createElement("div");
        const smalldiv2 = document.createElement("div");
        smalldiv1.className = "upper-child-div";
        smalldiv2.className = "lower-child-div";
        //smalldiv1.id = "upperDiv";
        //smalldiv2.id = "lowerDiv";
        bigdivs[i].appendChild(smalldiv1);
        bigdivs[i].appendChild(smalldiv2);
      };
      


      const upperDivs = document.getElementsByClassName("upper-child-div");
      for(let i=0;i<box_num;i++)
      {
        const textDiv= document.createElement("div");
        textDiv.className = "textDiv";
        //textDiv.id = "textDiv";
        upperDivs[i].appendChild(textDiv);
        //console.log(i);
      }
        
    },

    func(){
      setTimeout(() => {
        const tableName = this.$route.query.tableName;
        const materialName = this.selectedItem;
        //const materialName = 'MG_1000';
        const geneName = this.geneName;
        // const start = this.start;
        // const end = this.end;
        const start = this.start;
        const end = this.end;
        console.log(tableName,materialName,geneName,start,end);
        getMaterialInfo(tableName,materialName,geneName,start,end).then(res =>{
        //getMaterialInfo('genotype_maize_amp507_998191','04K5672','chr1',start,end).then(res =>{
          console.log(res);
          const box_num = res.data.length;
          this.initPresentationBox(box_num);

          //const textDiv = document.getElementById("textDiv");
          //textDiv.textContent = "123";

          const materialData = res.data;
          const elements1 = [...document.getElementsByClassName("textDiv")];
          const elements2 = [...document.getElementsByClassName("lower-child-div")];
          materialData.forEach((data,index) =>{
            //console.log(data,index,"iiiiiiiiiii");
            const text1 = data.genotype_id + '_' + data.position;
            
            elements1[index].textContent = '';
            elements1[index].textContent = text1;
            let text2 = '';
            
            if (data.original === "0/0") {
              text2 = data.ref + "/" + data.ref;
            } else if (data.original === "0/1") {
              text2 = data.ref + "/" + data.alt;
            } else if (data.original === "1/1") {
              text2 = data.alt + "/" + data.alt;
            }
            elements2[index].textContent = '';
            elements2[index].textContent = text2;
          })

        }).catch(err =>{
          console.log(err);
        })
        },2000);
      
    },
    
   
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


<style scoped lang="less">
.wrapper {
	width: 100%;
  //background-color:blue;
}

.wrapper .chart {
	height: 30px;
	margin: 100px auto 0;
  width: 100%;
}
</style>

<style lang="less">
.gene-informage-container{
  height: auto;
  width: 100%;
  background-color: #F2F4F3;
  margin-top: 50px;
  overflow-x: auto;
}

.scrollable-content {
  /* 给内容容器设置一个适当的高度，以便内容超过这个高度时出现滚动条 */
  height: 100%;
  display: flex; /* 使用flex布局 */
  //flex-wrap: wrap; /* 当一行放不下所有子元素时换行 */
}
.child-div{
  height:250px;
  margin:5px;
  //background-color:blue;
  display:inline-block;
  width:80px;
}
.upper-child-div{
  height:80%;
  //padding:8px;
  //margin:2px;
  //background-color:pink;
  //position:absolute;

  // writing-mode: vertical-rl;
  // text-orientation: upright;
  //width:30px;
}
.textDiv{
  // padding-top:35px;
  // display: inline-block;
  // transform: rotate(90deg);
  // transform-origin: right;
  // background-color:orange;

  // position:relative;
  // //top:20px;
  // right:0;
  // text-align: center;
  // width:100%;
  // height:20px;

  margin-left:60px;
  display: block;
  transform: rotate(90deg);
  transform-origin: bottom left;
  white-space: nowrap;
}
.lower-child-div{
  height:auto;
  padding:3px;
  margin:2px;
  //background-color:green;
  text-align: right;
  //width:100%;
  word-break: break-all;
  //max-width:150px;
  //width:auto;


  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.lower-child-div:hover {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
</style>