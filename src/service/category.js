
import { BASE_URL, PATH_URL } from 'src/config.json'
const axios = require('axios').default;


export const categoryService = {
  getCategories() {
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
},

  getCategory(req){
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
  },

  addCategory(req) {
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
  },
  editCategory(req) {
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
  },



  deleteCategory(req)  {
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


  }
