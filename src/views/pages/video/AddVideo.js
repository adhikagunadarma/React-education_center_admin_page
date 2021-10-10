import React, { useEffect } from 'react'
import {
    CButton,
    CCard, 
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CTextarea,
    CInput,
    CLabel,
    CRow,
    CInvalidFeedback,
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import { videoService } from 'src/service/video';
import { courseService } from 'src/service/course';
import { fileService, ToastComponent, LoadingModal } from 'src/service/utils';

const AddVideo = () => {

    const history = useHistory();

    const [video, setVideo] = React.useState({})
    const [courses, setCourses] = React.useState([]) // all courses
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [validationError, setValidationError] = React.useState(false)
    const [isFirstTimeLoad, setIsFirstTimeLoad] = React.useState(true)

    const [toasts, setToasts] = React.useState([])
    
    const filelimitSize = 50 * 1024 * 1024;
    const warningFileLimit = "Cannot Upload, maximum Upload of 50 MB";

    useEffect(() => {
        
        if (isFirstTimeLoad ){
            getCourses()
        }
    },[video]);

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
                let toast = {
                  statusColor : 'danger',
                  statusMessage : result.statusMessage
                };
                toasts.push(toast)
                setToasts([...toasts] )
                
                history.push("/list-video");
              }
        })
      }

    function submitData() {
        if (video.videoTitle === undefined || video.videoDescription === undefined || video.videoFile === undefined || video.videoThumbnail === undefined || !video.videoCourse || video.videoCourse == "none") {
        
            setValidationError(true)
            let toast = {
                statusColor : 'warning',
                statusMessage : "Mohon mengisi data yang dibutuhkan terlebih dahulu"
              };
              toasts.push(toast)
              setToasts([...toasts] )
              
            return
        }
        setIsLoading(true)
        return new Promise( async (resolve) => {
            let request = {
                videoTitle: video.videoTitle,
                videoDescription: video.videoDescription,
                videoThumbnail: video.videoThumbnail,
                videoThumbnailName: video.videoThumbnailName,
                videoFile: video.videoFile,
                videoFileName: video.videoFileName,
                videoCourse : video.videoCourse
            }
            const result = await videoService.addVideo(request)
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
            
                  if (result.statusCode === 0) {
                      history.push("/list-video");
                  }
        })
    }

    async function getDocumentFromFile($event, type) {
        if ($event.target.files[0]) {
            var file = $event.target.files[0];
            var fileSize = file.size;
            var fileName = file.name;
            var filePath = $event.target.value
            if (fileSize < filelimitSize) {
                let fileData = await fileService.fileToBase64(file)
                    switch (type) {
                        case 'thumbnail':
                             setVideo({...video, videoThumbnail : fileData, videoThumbnailName : fileName})
                            break;
                        case 'video':
                            setVideo({...video, videoFile : fileData, videoFileName : fileName})
                            break;
                    }
            } else {
                let toast = {
                    statusColor : 'danger',
                    statusMessage : warningFileLimit
                  };
                  toasts.push(toast)
                  setToasts([...toasts] )
            }
        }
    }

    return (
        <>
            <CRow>
                <CCol xs="12" md="12">
                    <CCard>
                        <CCardHeader>
                            Add Video
                            <small>  Forms</small>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className={"form-horizontal " + (validationError ? 'was-validated' : '')}>
                                {/* tinggal nambahin class name was validated pas submit button aja */}
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Video Title *</CLabel>
                                    </CCol>

                                    <CCol xs="12" md="9">
                                        <CInput className="form-control-warning " id="categoryInput" value={video.videoTitle} name="text-input" placeholder="Nama Video" onChange={(event) => {
                                                setVideo({...video, videoTitle : event.target.value})
                                            }} required />
                                        <CInvalidFeedback className="help-block" >
                                            Please provide a valid video name
                                        </CInvalidFeedback>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="textarea-input">Video Description *</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CTextarea value={video.videoDescription}
                                            name="textarea-input"
                                            id="textarea-input"
                                            rows="9"
                                            placeholder="Deskripsi Video..."
                                            onChange={(event) => {
                                                setVideo({...video, videoDescription : event.target.value})
                                            }}
                                            required
                                        />
                                        <CInvalidFeedback className="help-block">
                                            Please provide a valid video description
                                        </CInvalidFeedback>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Video Thumbnail</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                  


                                        <div className="custom-file">
                                       
                                            <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                                                getDocumentFromFile(event, 'thumbnail')
                                            }} accept="image/*" />
                                            <CLabel className="custom-file-label" htmlFor="customFile">
                                                {video.videoThumbnailName !== undefined ? (
                                                    video.videoThumbnailName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Video File</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                                                getDocumentFromFile(event, 'video')
                                            }} accept="image/*" />
                                            <CLabel className="custom-file-label" htmlFor="customFile">
                                                {video.videoFileName !== undefined ? (
                                                    video.videoFileName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Video Course</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                    <CSelect name="select" id="select" value={video.videoCourse} onChange={(event) => {
                                   
                                                    setVideo({...video, videoCourse : event.target.value}) 
                                            }}>
                                            <option value="none">- Mohon Pilih Jenis Course - </option> 
                                        {
                                            courses.map((course,index) => (
                                            <option key={course.id} value={course.id}>{course.courseName}</option>
                                            ))

                                        }
                                       
                                    </CSelect>
                                    </CCol>
                                </CFormGroup>
                              

                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton onClick={submitData} className="mr-1 mb-1" type="submit" size="sm" color="primary"><CIcon name="cil-scrubber" /> Submit</CButton>
                            <CButton className="mr-1 mb-1" type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton>
                        </CCardFooter>
                
                        </CCard>
                </CCol>
                <CCol sm="12" lg="6">
               
                    <LoadingModal isLoading={isLoading} message='Please wait a moment..'></LoadingModal>  
                    <ToastComponent listToasts={toasts}></ToastComponent>
                </CCol>
            </CRow>
        </>
    )
}

export default AddVideo
