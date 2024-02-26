
import request from '@/utils/request';

// 查询树节点上的文件列表
export function genoListFile(query) {
    return request({
      url: '/genotypeFile/list',
      method: 'get',
      params: query
    });
  }

  //查看文件详情
export function selectDetailByFileId(query) {
  return request({
    url: `genotypeFile/selectDetailByFileId/${query.fileId}`,
    method: 'get',
    params:{
      pageNum : query.pageNum,
      pageSize : query.pageSize
    },
    timeout: 100000, // 设置超时时间为10秒（单位为毫秒）
  });

}

  //预览文件详情
  export function selectHistoryDetailByFileId(query) {
    return request({
      url: `genotypeFile/selectHistoryDetailByFileId/${query.fileId}`,
      method: 'get',
      params:{
        pageNum : query.pageNum,
        pageSize : query.pageSize
      },
      timeout: 100000, // 设置超时时间为10秒（单位为毫秒）
    });
  
  }

//导出文件
export function exportGenoFile(tableName){
  return request({
    url: `/genotypeFile/exportFile`,
    params:{tableName},
    method: 'get'
  });
}

// 删除树节点上的文件
export function delFile(fileId) {
  return request({
    url: '/genotypeFile/' + fileId,
    method: 'delete'
  });
}

// 修改树节点上的文件
export function updateFile(data) {
  data.fileStatus = data.fileStatus ? 1 : 0;
  return request({
    url: '/genotypeFile',
    method: 'put',
    data
  });
}


//修改文件详情
export function modifiFileData(params){
  return request({
    url:'/genotypeFile/updateGenoTypeFile',
    method:'post',
    params
  })
}

//修改文件详情
export function endUpdate(tableName){
  return request({
    url:'/genotypeFile/endUpdate',
    method:'get',
    params:{tableName},
  })
}