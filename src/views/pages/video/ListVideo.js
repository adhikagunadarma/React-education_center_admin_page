import React, { useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CLink,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalBody,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CLabel,
  CImg,
  CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import { videoService } from 'src/service/video';
import { courseService } from 'src/service/course';
import { ToastComponent, LoadingModal } from 'src/service/utils';

const fields = ['videoThumbnail','videoTitle', 'videoDescription','videoCourseName', 'action']

const ListVideo = () => {

const history = useHistory();
  
const [videos, setVideos] = React.useState([])
const [courses, setCourses] = React.useState([]) // all courses
const [selectedCourse, setSelectedCourse] = React.useState('') // all courses
const [selectedVideo, setSelectedVideo] = React.useState('')

const [isLoading, setIsLoading] = React.useState(false)
const [isDeleteModalShown, setIsDeleteModalShownn] = React.useState(false)
const [isFirstTimeLoad, setIsFirstTimeLoad] = React.useState(true)

const [toasts, setToasts] = React.useState([])
useEffect(() => {

  if (isFirstTimeLoad){
    getCourses()
  }
}, [selectedCourse]);

  function getCourses() {
    let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
    setIsLoading(true)
    return new Promise( async (resolve) => {
        const idTeacher = loginInfo.id
        const result = await courseService.getCoursesByTeacher({id : idTeacher});
        
        setIsLoading(false)
        if (result.statusCode === 0) {
              resolve(true)
              setCourses(result.data)
              setIsFirstTimeLoad(false)
            } else {
              resolve(false)
              toasts.push({
                statusColor : 'danger',
                statusMessage : result.statusMessage
              })
              setToasts([...toasts] )
            }
    })
  }

 async function getData(id) {
  if (!id || id == "none"){
    return
  }
  setIsLoading(true)
  return new Promise( async (resolve) => {
    const result = await getVideosByCourse({id : id});
    setIsLoading(false)
    if (result.statusCode === 0) {
      resolve(true)
      setVideos(result.data)
    } else {
      resolve(false)
      toasts.push({
        statusColor : 'danger',
        statusMessage : result.statusMessage
      })
      setToasts([...toasts] )
    }
  })
}

function goToEditVideo(data,index){
  history.push("/edit-video/"+ data.id);
}

function deleteData(data,index){
  setSelectedVideo(data)
  setIsDeleteModalShownn(true)
}

 async function confirmDelete(){
  setIsDeleteModalShownn(false)
  setIsLoading(true)
      const result = await videoService.deleteVideo({id : selectedVideo.id});
              setIsLoading(false)
              let toast = result.statusCode === 0 ? {
                statusColor : 'success',
                statusMessage : result.statusMessage
              } : {
                statusColor : 'danger',
                statusMessage : result.statusMessage
              };

              toasts.push(toast)
              setToasts([...toasts] )
              setSelectedVideo('')
              getCourses()
              // window.location.reload()
}

  return (
    <>
      <CRow>
        <CCol sm="12" lg="12">
          <CCard>
            <CCardHeader>
              <div>
              List Video
                </div>
                <div className="card-header-list">
                <CSelect name="select" id="select" value={selectedCourse} onChange={(event) => {
                                   setSelectedCourse(event.target.value)
          
                                   getData(event.target.value)

                           }}>
                           <option value="none">- Mohon Pilih Jenis Course - </option> 
                       {
                           courses.map((course,index) => (
                           <option key={course.id} value={course.id}>{course.courseName}</option>
                           ))

                       }
                      
                   </CSelect>
                </div>
              <div className="card-header-actions">
                <CLink to="/add-video">
                <CButton block variant="outline" color="primary" size="sm" className="btn-brand mr-1 mb-1">
              <CIcon size="sm" name="cil-plus" className="float-right"/>
                <span className="mfs-2">Add Video &nbsp;</span></CButton>
                </CLink>
         
              </div>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={videos}
              fields={fields}
              hover
              striped
              bordered
              size="sm"
              itemsPerPage={15}
              pagination
              addTableClasses = 'td-list-video'
              scopedSlots = {{
                'action':
                (item, index)=>{
                  return (
                    <td className="py-3">
                      {/* <CLink to="/add-category/"> */}
          
                      <CButton
                        color="warning"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1 mb-1"
                        onClick={()=>{goToEditVideo(item,index)}}
                      >
                        Update
                      </CButton>
                      
                {/* </CLink> */}
                      
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1 mb-1"
                        onClick={()=>{deleteData(item,index)}}
                      >
                        Delete
                      </CButton>
                    </td>
                    )
                },
                
                    'videoThumbnail':
                    (item)=>(
                        <td>
                          <CImg
                            src={item.videoThumbnail}
                            fluid
                            className="td-avatar-thumbnail"
                          />
                        </td>
                      ),
              }}
            />
            </CCardBody>
          </CCard>
      
            <CModal 
              show={isDeleteModalShown} 
              onClose={() => {
                setIsDeleteModalShownn(false)
                setSelectedVideo('')
              }}
            >
              <CModalHeader closeButton>
                <CModalTitle>Delete Confirmation</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Are you sure you want to delete video name {selectedVideo.name} ?
              </CModalBody>
              <CModalFooter>
                <CButton color="danger"
                onClick={confirmDelete}
                >Delete</CButton>
                <CButton 
                  color="secondary" 
                  onClick={() => {
                    setIsDeleteModalShownn(false)
                    setSelectedVideo('')
                  }}
                >Cancel</CButton>
              </CModalFooter>
            </CModal>
        </CCol>
        <CCol sm="12" lg="12">
          <LoadingModal isLoading={isLoading} message='Please wait a moment..'></LoadingModal>
          <ToastComponent listToasts={toasts}></ToastComponent>
            </CCol>
      </CRow>
    </>
  )
}

export default ListVideo
