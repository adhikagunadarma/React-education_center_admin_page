
import { BASE_URL, PATH_URL } from 'src/config.json'
const axios = require('axios').default;


export function useCategoryService() {
    const getCategories = (_) => {
        return new Promise(async(resolve) => {
            const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "categories";
          
            try {
              
                const result = await axios.get(baseEndpoint + pathEndpoint)
                if (result.status === 200) {
                  resolve(result.data)
                } 
             
            }
            catch(e){
              console.log(e)
              resolve(e)
            }
          })
}

const getCategory = (req) => {
return new Promise(async(resolve) => {
    const baseEndpoint = BASE_URL + PATH_URL
    const pathEndpoint = "category/" + req.id
  
    try {
      
        const result = await axios.get(baseEndpoint + pathEndpoint)
        if (result.data.statusCode === 0 && result.status === 200) {
          resolve(result.data)
        } 
     
    }
    catch(e){
      resolve(e)
    }
  })
}

const addCategory = (req) => {
return new Promise(async(resolve) => {
    const baseEndpoint = BASE_URL + PATH_URL
    const pathEndpoint = "category"
    const requestBody = {
        categoryName: req.categoryName,
        categoryDescription: req.categoryDesc,
        categoryThumbnail: req.categoryThumbnail,
        categoryThumbnailName: req.categoryThumbnailName
    }
    try {
        const result = await axios.post(baseEndpoint + pathEndpoint, requestBody)
        if (result.status === 200) {
          resolve(result.data)
        } 
    }
    catch(e){
      resolve(e)
    }
  })
}

const editCategory = (req) => {
    return new Promise(async(resolve) => {
        const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "category/" + req.id 
            const requestBody = {
                categoryName: req.categoryName,
                categoryDescription: req.categoryDesc,
                categoryThumbnail: req.categoryThumbnail,
                categoryThumbnailName: req.categoryThumbnailName
            }
            try {
                const result = await axios.put(baseEndpoint + pathEndpoint, requestBody)
                if (result.status === 200) {
                  resolve(result.data)
                } 
            }
            catch(e){
              resolve(e)
            }
          })
    }


    
    const deleteCategory = (req) => {
        return new Promise(async(resolve) => {
            const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "category/" + req.id
          
            try {
              
                const result = await axios.delete(baseEndpoint + pathEndpoint)
                if (result.status === 200) {
                  resolve(result.data)
                } 
            }
            catch(e){
              console.log(e)
              resolve(e)
            }
          })
}   

return {
getCategories,
addCategory,
editCategory,
deleteCategory,
getCategory
};

}