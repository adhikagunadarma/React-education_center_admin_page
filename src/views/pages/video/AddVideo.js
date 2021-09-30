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
    CModal,
    CModalBody,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CInvalidFeedback,
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import { useVideoService } from 'src/service/video';

const AddVideo = () => {

    const filelimitSize = 50 * 1024 * 1024;
    const warningFileLimit = "Cannot Upload, maximum Upload of 50 MB";
    const history = useHistory();
    const { addVideo } = useVideoService()

    const [loadingModal, setLoadingModal] = React.useState(false)
    
    const [video, setVideo] = React.useState({})
    const [courses, setCourses] = React.useState([]) // all courses

    const [statusColor, setStatusColor] = React.useState('info')
    const [statusMessage, setStatusMessage] = React.useState('')
    const [validationError, setValidationError] = React.useState(false)

    const [position, setPosition] = React.useState('bottom-center')
    const [autohide, setAutohide] = React.useState(true)
    const [autohideValue, setAutohideValue] = React.useState(5000)
    const [closeButton, setCloseButton] = React.useState(true)
    const [fade, setFade] = React.useState(true)
    const [toasts, setToasts] = React.useState([])

    const addToast = () => {
        setToasts([
            ...toasts,
            { position, autohide: autohide && autohideValue, closeButton, fade, statusMessage, statusColor }
        ])
    }
    const toasters = (() => {
        return toasts.reduce((toasters, toast) => {
            toasters[toast.position] = toasters[toast.position] || []
            toasters[toast.position].push(toast)
            return toasters
        }, {})
    })


    useEffect(() => {
        if (statusMessage !== '') {
            addToast() // kalo abis ada perubahan status message / color, baru add tiast
            // setStatusMessage('')
            // setStatusColor('info')
        }
        if (courses.length === 0 ){//first time only
            getCourses()
        }
    }, [video,statusColor, statusMessage]);

    function getCourses() {
        let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        const idTeacher = loginInfo.id
        setLoadingModal(true)
        return new Promise((resolve) => {
          const baseEndpoint = "http://localhost:8080"
          const pathEndpoint = "/api/educen/courses/teacher/"+idTeacher
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          };
          fetch(baseEndpoint + pathEndpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
              setTimeout((_) => {
                setLoadingModal(false)
                if (data.statusCode === 0) {
                  resolve(true)
                  setCourses(data.data)
                } else {
                  resolve(false)
                  setStatusColor('danger')
                  setStatusMessage(data.statusMessage)
                }
              }, 1000)
    
            });
        })
    
    
      }

    function submitData() {
        if (video.videoTitle === undefined || video.videoDescription === undefined || video.videoFile === undefined || video.videoThumbnail === undefined || !video.videoCourse || video.videoCourse == "none") {
            setStatusColor("warning")
            setStatusMessage("Mohon mengisi data yang dibutuhkan terlebih dahulu")
            setValidationError(true)
            return
        }
        setLoadingModal(true)
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
            const result = await addVideo(request)
                setLoadingModal(false)
                if (result.statusCode === 0) {
                    resolve(true)
                    setStatusColor('success')
                    history.push("/list-video");
                } else {
                    resolve(false)
                    setStatusColor('danger')
                }
                setStatusMessage(result.statusMessage)
         
        })


    }

    async function getDocumentFromFile($event, type) {
        if ($event.target.files[0]) {
            var file = $event.target.files[0];
            var fileSize = file.size;
            var fileName = file.name;
            var filePath = $event.target.value
            if (fileSize < filelimitSize) {
                let fileData = await fileToBase64(file)
                    switch (type) {
                        case 'thumbnail':
                             setVideo({...video, videoThumbnail : fileData, videoThumbnailName : fileName})
                            break;
                        case 'video':
                            
                            setVideo({...video, videoFile : fileData, videoFileName : fileName})
                            break;
                     
                    }

            } else {
                    setStatusColor('danger')
                    setStatusMessage(warningFileLimit)
            }
        }
    }

    function fileToBase64(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        })

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
                        <CModal
                            show={loadingModal}
                            onClose={setLoadingModal}
                        >
                            <CModalBody>
                                Please wait a moment..
                            </CModalBody>
                        </CModal>
                        </CCard>
                </CCol>
                <CCol sm="12" lg="6">
                    {Object.keys(toasters).map((toasterKey) => (
                        <CToaster
                            position={toasterKey}
                            key={'toaster' + toasterKey}
                        >
                            {
                                toasters[toasterKey].map((toast, key) => {
                                    return (
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

export default AddVideo
