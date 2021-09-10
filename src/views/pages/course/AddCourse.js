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
    CFormText,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import Toaster from 'src/views/notifications/toaster/Toaster';

const AddCourse = () => {

    const filelimitSize = 5242880;
    const history = useHistory();
    const [loadingModal, setLoadingModal] = React.useState(false)
    const [course, setCourse] = React.useState({
        courseName: '',
        courseDescription: '',
        courseThumbnailName: '',
        courseThumbnail: ''


    })

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
    })()

    useEffect(() => {
        if (statusMessage != '') {
            addToast() // kalo abis ada perubahan status message / color, baru add tiast
            // setStatusMessage('')
            // setStatusColor('info')
        }
    }, [statusColor, statusMessage]);

    function submitData() {
        console.log(course)
        // if (course.courseName === '' || course.courseDescription === '') {
        //     // setStatusColor("warning")
        //     // setStatusMessage("Mohon mengisi data yang dibutuhkan terlebih dahulu")
        //     setValidationError(true)
        //     return
        // }
        // setLoadingModal(true)
        // return new Promise((resolve) => {
        //     const baseEndpoint = "http://localhost:8080"
        //     const pathEndpoint = "/api/educen/category"
        //     const requestOptions = {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             courseName: course.courseName,
        //             courseDescription: course.courseDescription,
        //             courseThumbnail: course.courseThumbnail,
        //             courseThumbnailName: course.courseThumbnailName
        //         })
        //     };
        //     console.log(JSON.parse(requestOptions.body))
        //     fetch(baseEndpoint + pathEndpoint, requestOptions)
        //         .then(response => response.json())
        //         .then(data => {
        //             setTimeout((_) => {
        //                 setLoadingModal(false)
        //                 if (data.statusCode === 0) {
        //                     resolve(true)
        //                     setStatusColor('success')
        //                     history.push("/list-category");
        //                 } else {
        //                     resolve(false)
        //                     setStatusColor('danger')
        //                 }
        //                 setStatusMessage(data.statusMessage)
        //             }, 1000)

        //         });
        // })


    }


    function getDocumentFromFile($event, type) {
        if ($event.target.files[0]) {
            var file = $event.target.files[0];
            var fileSize = file.size;
            var fileName = file.name;
            var filePath = $event.target.value
            if (fileSize < filelimitSize) {
                fileToBase64(file).then((fileData) => {
                    switch (type) {
                        case 'thumbnail':
                            course.courseThumbnail = fileData
                            course.courseThumbnailName = fileName

                            break;
                        case 'trailer':
                            course.courseTrailerFile = fileData
                            course.courseTrailerName = fileName
                            break;
                        case 'thumbnail_trailer':

                            course.courseTrailerThumbnailFile = fileData
                            course.courseTrailerThumbnailName = fileName
                            break;
                    }
                    setCourse(course)
                    console.log(course)

                })
            } else {
                this.publicParam.presentAlert("Warning", this.warningFileLimit)
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
                            Add Course
                            <small>  Forms</small>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className={"form-horizontal " + (validationError ? 'was-validated' : '')}>
                                {/* tinggal nambahin class name was validated pas submit button aja */}
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Course Name *</CLabel>
                                    </CCol>

                                    <CCol xs="12" md="9">
                                        <CInput className="form-control-warning " id="categoryInput" value={course.courseName} name="text-input" placeholder="Nama Kategori" onChange={(event) => {
                                            course.courseName = event.target.value
                                            setCourse(course)
                                        }} required />
                                        <CInvalidFeedback className="help-block" >
                                            Please provide a valid course name
                                        </CInvalidFeedback>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="textarea-input">Course Description *</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CTextarea value={course.courseDescription}
                                            name="textarea-input"
                                            id="textarea-input"
                                            rows="9"
                                            placeholder="Deskripsi kategori..."
                                            onChange={(event) => {
                                                course.courseDescription = event.target.value
                                                setCourse(course)
                                            }}
                                            required
                                        />
                                        <CInvalidFeedback className="help-block">
                                            Please provide a valid course description
                                        </CInvalidFeedback>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Course Thumbnail</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                                                getDocumentFromFile(event, 'thumbnail')
                                            }} accept="image/*" />
                                            <CLabel className="custom-file-label" htmlFor="customFile" >
                                                {course.courseThumbnailName !== '' ? (
                                                    course.courseThumbnailName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
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

export default AddCourse
