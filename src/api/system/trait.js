import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTrait(query) {
  return request({
    url: '/trait/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getTrait(traitId) {
  return request({
    url: '/trait/' + traitId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addTrait(data) {
  return request({
    url: '/trait',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTrait(data) {
  return request({
    url: '/trait',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delTrait(traitId) {
  return request({
    url: '/trait/' + traitId,
    method: 'delete'
  })
}
export function getLightLine(query,data) {
  return request({
    url: '/sidebarTree/type/selectHighlight' ,
    method: 'post',
    params:query,
    data:data
  })
}
export function getLightLineAll(query,data) {
  return request({
    url: '/sidebarTree/type/selectHighlightAll' ,
    method: 'post',
    params:query,
    data:data
  })
}
export function selHighLAll(data){
  return request({
    url:"/sidebarTree/type/selectHighlightinAll",
    method:'get',
    params:data
  })
}
export function getSelect(){
  return request({
    url: '/Type/selectTraitTypeName' ,
    method: 'get'
  })
}
export function download(data){
  return request({
    url:"/trait/download",
    method:'post',
    responseType:"blob",
    data:data
    
  })
}
export function selHighL(data){
  return request({
    url:"/sidebarTree/type/selectHighlightin",
    method:'get',
    params:data
  })
}
export function addHigh(data){
  return request({
    url:"/sidebarTree/type/CheckUpdate",
    method:'post',
    data:data
  })
}
export function checkout(data){
  return request({
    url:"/trait/checkTraitName",
    method:'post',
    data:data
  })
}