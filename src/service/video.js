
import { BASE_URL, PATH_URL } from 'src/config.json'
const axios = require('axios').default;

export const videoService = {
  getVideosByCourse(req){
    return new Promise(async(resolve) => {
        const baseEndpoint = BASE_URL + PATH_URL
        const pathEndpoint = "videos/course/" + req.id
      
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
getVideo(req) {
  return new Promise(async(resolve) => {
      const baseEndpoint = BASE_URL + PATH_URL
      const pathEndpoint = "video/" + req.id
    
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
addVideo(req) {
  return new Promise(async(resolve) => {
      const baseEndpoint = BASE_URL + PATH_URL
      const pathEndpoint = "video"
      const requestBody = {
          videoTitle: req.videoTitle,
          videoDescription: req.videoDescription,
          videoThumbnail: req.videoThumbnail,
          videoThumbnailName: req.videoThumbnailName,
          videoFile: req.videoFile,
          videoFileName: req.videoFileName,
          videoCourse : req.videoCourse
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
  editVideo(req) {
    return new Promise(async(resolve) => {
        const baseEndpoint = BASE_URL + PATH_URL
        const pathEndpoint = "video/" + req.id 
        const requestBody = {
            videoTitle: req.videoTitle,
            videoDescription: req.videoDescription,
            videoThumbnail: req.videoThumbnail,
            videoThumbnailName: req.videoThumbnailName,
            videoFile: req.videoFile,
            videoFileName: req.videoFileName,
            videoCourse : req.videoCourse
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
    deleteVideo(req) {
      return new Promise(async(resolve) => {
          const baseEndpoint = BASE_URL + PATH_URL
          const pathEndpoint = "video/" + req.id
        
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


