import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listPopulation(query) {
  return request({
    url: '/population/population/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getPopulation(populationId) {
  return request({
    url: '/population/population/use/' + populationId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addPopulation(data) {
  return request({
    url: '/population/population/use',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updatePopulation(data) {
  return request({
    url: '/population/population/use',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delPopulation(populationId) {
  return request({
    url: '/population/population/' + populationId,
    method: 'delete'
  })
}
//获取population下拉框
export function getSelectPopulation() {
  return request({
    url: "/population/population/selectSpeciesName",
    method: 'get'
  })
}

export function SelectPopulation(query,data) {
  return request({
    url: "/population/population/selectPopulation",
    method: 'post',
    params:query,
    data:data
  }
  )
}
export function download(data){
  return request({
    url:"/population/population/download",
    method:'post',
    responseType:"blob",
    data:data
    
  })
}
export function checkout(data){
  return request({
    url:"/population/population/checkPopulationName",
    method:"post",
    data
  })
}