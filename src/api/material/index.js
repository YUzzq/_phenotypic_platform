import request from "@/utils/request";
export function getSpecies() {
  return request({
    url: "materials/phenotype/species",
    method: "get",
    timeout: 1000 * 600,
  });
}
export function getGroups(speciesId) {
  return request({
    url: "materials/phenotype/population",
    method: "get",
    params: {
      speciesId,
    },
    timeout: 1000 * 600,
  });
}
export function getYears(speciesId, populationId) {
  return request({
    url: "materials/phenotype/years",
    method: "get",
    params: {
      speciesId: speciesId,
      populationId: populationId,
    },
    timeout: 1000 * 600,
  });
}
export function getAreas(speciesId, populationId, year) {
  return request({
    url: "materials/phenotype/locations",
    method: "get",
    params: {
      speciesId,
      populationId,
      year,
    },
    timeout: 1000 * 600,
  });
}
export function getTableName(speciesId, populationId, year, location) {
  return request({
    url: "materials/phenotype/tableName",
    method: "get",
    params: {
      speciesId: speciesId,
      populationId: populationId,
      year: year,
      location: location,
    },
    timeout: 1000 * 600,
  });
}
export function getTableData(
  speciesId = 14,
  populationId = 9,
  year = "2023",
  location = "山东",
  tableName = "phenotype_default_583262"
) {
  return request({
    url: "materials/phenotype/table",
    method: "get",
    params: {
      speciesId: speciesId,
      populationId: populationId,
      year: year,
      location: location,
      tableName: tableName,
    },
    timeout: 1000 * 600,
  });
}
export function getRelations(material_id) {
  return request({
    url: "materials/phenotype/relations",
    method: "get",
    params: {
      material_id,
    },
    timeout: 1000 * 600,
  });
}
export function getTrees(treeType) {
    return request({
      url: "system/tree/list",
      method: "get",
      params: {
        treeType
      },
      timeout: 1000 * 600,
    });
  }
export function getFileDetail(fileId){
  return request({
    url:"/phenotypeFile/"+fileId,
    method:"get",
    timeout:1000*60
  })
}
export function downloadFile(query){
  return request({
    url:"/common/download/resource",
    method:"get",
    params:query,
    responseType:"blob",
    timeout: 1000*600
  })
}
export function uploadFile(data){
  return request({
    url:"/system/breed/upload",
    method:"post",
    data:data,
    timeout:1000*600
  })
}
export function addBreedTask(data){
  return request({
    url:"/system/breed/task",
    method:"post",
    params:data,
    timeout:1000*600
  })
}
export function ddd(query){
  return request({
    url:"/system/breed/callPythonByFileId",
    method:"post",
    params:query,
    timeout:1000*600
  })
}
export function ppp(query,data){
  return request({
    url:"/system/breed/callPythonByNewFile",
    method:"post",
    params:query,
    data,
    timeout:1000*600
  })
}
export function getlist(){
  return request({
    url:"/system/breed/list",
    method:"get",
    timeout:1000*600
  })
}
export function getPdf(query){
  return request({
    url:"/system/breed/downloadPdf",
    method:"get",
    params:query,
    timeout: 1000*600
  })
}
export function getlist2(query){
  return request({
    url:"/system/breed2/list",
    method:"get",
    params:query,
    timeout:1000*600
  })
}
export function addMar(data){
  return request({
    url:"/system/breed2",
    method:"post",
    params:data,
    timeout:1000*600
  })
}

export function addMarNew(query,data){
  return request({
    url:"/system/breed2/NewFile",
    method:"post",
    params:query,
    data,
    timeout:1000*600
  })
}
// export function exportPDF(query){
//   return request({
//     url:"/system/breed2/getPdf",
//     method:"post",
//     responseType:"blob",
//     params:query,
//     timeout:1000*600
//   })
// }
export function deleteMar(ids){
  return request({
    url:"/system/breed2/"+ids,
    method:"delete",
  })
}