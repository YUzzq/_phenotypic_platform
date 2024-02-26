/* import request from '@/utils/request';

// 查询树节点上的文件列表
export function listFile(query) {
  return request({
    url: '/phenotypeFile/list',
    method: 'get',
    params: query
  });
}

// 根据文件url获取文件内容
export function getFileContent(fileUrl) {
  return request({
    baseURL: `${import.meta.env.VITE_APP_UPLOAD_URL}/csv/${fileUrl}`,
    method: 'get',
    responseType: 'arraybuffer'
  });
}

// 新增树节点上的文件
export function addFile(data) {
  data.fileStatus = data.fileStatus ? 1 : 0;
  return request({
    url: '/phenotypeFile',
    method: 'post',
    data
  });
}

// 修改树节点上的文件
export function updateFile(data) {
  data.fileStatus = data.fileStatus ? 1 : 0;
  return request({
    url: '/phenotypeFile',
    method: 'put',
    data
  });
}

// 删除树节点上的文件
export function delFile(fileId) {
  return request({
    url: '/phenotypeFile' + fileId,
    method: 'delete'
  });
}

//发送文件
export function getNewFiles(){
  return request({
    url:'/phenotypeFile/prcess',
    method:'get'
  })
}
 */

import request from '@/utils/request';

// 查询树节点上的文件列表
export function listFile(query) {
  return request({
    url: '/phenotypeFile/list',
    method: 'get',
    params: query
  });
}

//搜索文件
export function searchFile(query) {
  return request({
    url: '/phenotypeFile/oldList',
    method: 'get',
    params: query
  });

}

export function listFileGeno(query) {
  return request({
    url: '/genotypeFile/list',
    method: 'get',
    params: query
  });
}
// 根据文件url获取文件内容
export function getFileContent(fileUrl) {
  return request({
    baseURL: `${import.meta.env.VITE_APP_UPLOAD_URL}/csv/${fileUrl}`,
    method: 'get',
    responseType: 'arraybuffer',
    timeout:1000000,
  });
}



// 新增树节点上的文件
export function addFile(data) {
  data.fileStatus = data.fileStatus ? 1 : 0;
  return request({
    url: '/system/file',
    method: 'post',
    data
  });
}

// 修改树节点上的文件
export function updateFile(data) {
  return request({
    url: '/phenotypeFile',
    method: 'put',
    data
  });
}

// 删除树节点上的文件
export function delFile(fileId) {
  return request({
    url: '/phenotypeFile/' + fileId,
    method: 'delete'
  });
}

//发送文件
export function getNewFiles() {
  return request({
    url: '/system/file/prcess',
    method: 'get'
  })
}

//查看文件详情
export function selectDetailByFileId(query) {
  return request({
    url: `phenotypeFile/selectDetailByFileId/${query.fileId}`,
    method: 'get',
    params:{
      pageNum : query.pageNum,
      pageSize : query.pageSize
    }
  });
}

// 文件详情多选材料
export function traitAndMaterialList(tableName){
  return request({
    url:`/phenotypeFile/traitAndMaterialList`,
    method:'get',
    params:{
      tableName,
    }
  })
}


// 文件详情搜索框
export function searchBox({fileId,searchMaterialId,searchTraitId}){
  return request({
    url:`/phenotypeFile/searchBox`,
    method:'post',
    data:{
      fileId,
      materialId:searchMaterialId,
      traitId:searchTraitId,
    }
  })
}

//导出文件
export function exportPenoFile(tableName){
  return request({
    url: `/phenotypeFile/exportFile`,
    params:{tableName},
    method: 'get'
  });
}

//修改文件详情
export function modifiFileData(params){
  return request({
    url:'/phenotypeFile/updatePhenoTypeFile',
    method:'post',
    params
  })
}

//修改文件详情
export function endUpdate(tableName){
  return request({
    url:'/phenotypeFile/endUpdate',
    method:'get',
    params:{tableName},
  })
}