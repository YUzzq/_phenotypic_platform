import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listSpecies(query) {
  return request({
    url: '/species/species/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getSpecies(speciesId) {
  return request({
    url: '/species/species/' + speciesId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addSpecies(data) {
  return request({
    url: '/species/species',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateSpecies(data) {
  return request({
    url: '/species/species',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delSpecies(speciesId) {
  return request({
    url: '/species/species/' + speciesId,
    method: 'delete'
  })
}
//下载
export function download(data){
  return request({
    url:"/species/species/download",
    method:'post',
    responseType:"blob",
    data:data
    
  })
}
export function checkout(data){
  return request({
    url:"/species/species/checkSpeciesName",
    method:"post",
    data
  })
}