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
import { useVideoService } from 'src/service/video';
import { useCourseService } from 'src/service/course';
import { useToastService } from 'src/service/utils';

const fields = ['videoThumbnail','videoTitle', 'videoDescription','videoCourseName', 'action']

const ListVideo = () => {

const history = useHistory();

const { getVideosByCourse, deleteVideo } = useVideoService()
const { getCoursesByTeacher} = useCourseService()
const {  
  statusMessage,
  statusColor,   
  setStatusColor,
  setStatusMessage,
  addToast,
  toasters} = useToastService()
  
const [videos, setVideos] = React.useState([])
const [courses, setCourses] = React.useState([]) // all courses
const [selectedCourse, setSelectedCourse] = React.useState('') // all courses
const [selectedVideo, setSelectedVideo] = React.useState('')

const [loadingModal, setLoadingModal] = React.useState(false)
const [deleteModal, setDeleteModal] = React.useState(false)

useEffect(() => {
  if (statusMessage != ''){
    addToast() 
  }

  if (courses.length === 0 ){
    getCourses()
  }

}, [selectedCourse,statusColor,statusMessage]);

  function getCourses() {
    let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
    setLoadingModal(true)
    return new Promise( async (resolve) => {
        const idTeacher = loginInfo.id
        const result = await getCoursesByTeacher({id : idTeacher});
        console.log(result)
        if (result.statusCode === 0) {
          resolve(true)
          setCourses(result.data)
        } else {
          resolve(false)
          setStatusColor('danger')
          setStatusMessage(result.statusMessage)
        }
        setLoadingModal(false)
    })
  }

 async function getData(id) {
  if (!id || id == "none"){
    return
  }
  setLoadingModal(true)
  return new Promise( async (resolve) => {
    const result = await getVideosByCourse({id : id});
    if (result.statusCode === 0) {
      resolve(true)
      setVideos(result.data)
    } else {
      resolve(false)
      setStatusColor('danger')
      setStatusMessage(result.statusMessage)
    }
    setLoadingModal(false)
  })
}

function goToEditVideo(data,index){
  history.push("/edit-video/"+ data.id);
}

function deleteData(data,index){
  setSelectedVideo(data)
  setDeleteModal(true)
}

function confirmDelete(){
  setDeleteModal(false)
  setLoadingModal(true)
  return new Promise(async(resolve) => {
      const result = await deleteVideo({id : selectedVideo.id});
              setLoadingModal(false)
              if (result.statusCode === 0){
                resolve(true)
                setStatusColor('success')
              }else{
                resolve(false)
                setStatusColor('danger')
              }
              window.location.reload();
      
  })

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
              show={loadingModal} 
              onClose={setLoadingModal}
            >
              <CModalBody>
                Please wait a moment..
              </CModalBody>
            </CModal>
            <CModal 
              show={deleteModal} 
              onClose={() => {
                setDeleteModal(false)
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
                    setDeleteModal(false)
                    setSelectedVideo('')
                  }}
                >Cancel</CButton>
              </CModalFooter>
            </CModal>
        </CCol>
        <CCol sm="12" lg="12">
              {Object.keys(toasters).map((toasterKey) => (
                <CToaster
                  position={toasterKey}
                  key={'toaster' + toasterKey}
                >
                  {
                    toasters[toasterKey].map((toast, key)=>{
                    return(
                      <CToast
                        key={'toast' + key}
                        show={true}
                        autohide={toast.autohide}
                        fade={toast.fade}
                        color={toast.statusColor}
                      >
                        <CToastHeader closeButton={toast.closeButton}>
                          Alert Notification
                        </CToastHeader>
                        <CToastBody>
                          <CLabel>{toast.statusMessage}</CLabel>
                        </CToastBody>
                      </CToast>
                    )
                  })
                  }
                </CToaster>
              ))}
            </CCol>
      </CRow>
    </>
  )
}

export default ListVideo
