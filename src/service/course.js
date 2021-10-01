
import { BASE_URL, PATH_URL } from 'src/config.json'
const axios = require('axios').default;


export function useCourseService() {
    const getCoursesByTeacher = (req) => {
        return new Promise(async(resolve) => {
            const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "courses/teacher/" + req.id;
          
            try {
              
                const result = await axios.get(baseEndpoint + pathEndpoint)
                if (result.status === 200) {
                    if (result.data.statusCode === 0){
                        result.data.data.forEach(element => {
                            
                            let courseCategory = []
                            element.courseCategory.map (category => {
                                    courseCategory.push(category.categoryName)
                              
                            })
                            element.courseCategory = courseCategory
                        });
                        
                        resolve(result.data)
                    }else{
                        resolve(result.data)
                    }
                } 
             
            }
            catch(e){
              console.log(e)
              resolve(e)
            }
          })
}

const getCourse = (req) => {
return new Promise(async(resolve) => {
    const baseEndpoint = BASE_URL + PATH_URL
    const pathEndpoint = "course/" + req.id
  
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

const addCourse = (req) => {
    return new Promise(async(resolve) => {
        const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "course"
            const requestBody = {
                    courseName: req.courseName,
                    courseDescription: req.courseDescription,
                    courseThumbnail: req.courseThumbnail,
                    courseThumbnailName: req.courseThumbnailName,
                    
                    courseTrailerFile: req.courseTrailerFile,
                    courseTrailerName: req.courseTrailerName,
                    
                    courseTrailerThumbnailFile: req.courseTrailerThumbnailFile,
                    courseTrailerThumbnailName: req.courseTrailerThumbnailName,
                    
                    courseMembership: req.courseMembership,
                    // coursePublished: req.coursePublished, 
                    courseTeacher : req.courseTeacher, 

                    courseCategory : req.courseCategory ? req.courseCategory.map((category) => {
                        if (category.id){
                            return category.id
                        }else{
                            return category._id
                        }
                    }) : undefined,
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

const editCourse = (req) => {
    return new Promise(async(resolve) => {
        const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "course/" + req.id 
            const requestBody = {
                    courseName: req.courseName,
                    courseDescription: req.courseDescription,
                    courseThumbnail: req.courseThumbnail,
                    courseThumbnailName: req.courseThumbnailName,
                    
                    courseTrailerFile: req.courseTrailerFile,
                    courseTrailerName: req.courseTrailerName,
                    
                    courseTrailerThumbnailFile: req.courseTrailerThumbnailFile,
                    courseTrailerThumbnailName: req.courseTrailerThumbnailName,
                    
                    courseMembership: req.courseMembership,
                    coursePublished: req.coursePublished, 
                    courseTeacher : req.courseTeacher, 

                    courseCategory : req.courseCategory ? req.courseCategory.map((category) => {
                        if (category.id){
                            return category.id
                        }else{
                            return category._id
                        }
                    }) : undefined,
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


    
    const deleteCourse = (req) => {
        return new Promise(async(resolve) => {
            const baseEndpoint = BASE_URL + PATH_URL
            const pathEndpoint = "course/" + req.id
          
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
getCoursesByTeacher,
addCourse,
editCourse,
deleteCourse,
getCourse
};

}