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
    CSwitch,
    CInputFile,
    CModalHeader,
    CModalTitle,
    CListGroup,
    CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import Toaster from 'src/views/notifications/toaster/Toaster';

const AddCourse = () => {

    const filelimitSize = 50 * 1024 * 1024;
    const warningFileLimit = "Cannot Upload, maximum Upload of 50 MB";
    const history = useHistory();
    const [loadingModal, setLoadingModal] = React.useState(false)
    
    const [showCategoryModal, setShowCategoryModal] = React.useState(false)
    const [course, setCourse] = React.useState({})
    const [categories, setCategories] = React.useState([]) // all categories
    const [courseCategory, setCourseCategory] = React.useState([]) // all categories

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
        if (categories.length === 0 ){//first time only
            getCategories()
        }
    }, [course,statusColor, statusMessage]);

    function getCategories() {

        setLoadingModal(true)
        return new Promise((resolve) => {
          const baseEndpoint = "http://localhost:8080"
          const pathEndpoint = "/api/educen/categories"
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
                  setCategories(data.data)
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
        if (course.courseName === '' || course.courseDescription === '') {
            // setStatusColor("warning")
            // setStatusMessage("Mohon mengisi data yang dibutuhkan terlebih dahulu")
            setValidationError(true)
            return
        }
        setLoadingModal(true)
        return new Promise((resolve) => {
            const baseEndpoint = "http://localhost:8080"
            const pathEndpoint = "/api/educen/course"
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    courseThumbnail: course.courseThumbnail,
                    courseThumbnailName: course.courseThumbnailName,
                    
                    courseTrailerFile: course.courseTrailerFile,
                    courseTrailerName: course.courseTrailerName,
                    
                    courseTrailerThumbnailFile: course.courseTrailerThumbnailFile,
                    courseTrailerThumbnailName: course.courseTrailerThumbnailName,
                    
                    courseMembership: course.courseMembership,
                    // coursePublished: course.coursePublished,
                    courseTeacher : "6137021a86140b3a7043bbba", // hardcode, should take teacher id from login

                    courseCategory : courseCategory.map((category) => {
                        return category.id
                    }),
                })
            };
            fetch(baseEndpoint + pathEndpoint, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setTimeout((_) => {
                        setLoadingModal(false)
                        if (data.statusCode === 0) {
                            resolve(true)
                            setStatusColor('success')
                            history.push("/list-course");
                        } else {
                            resolve(false)
                            setStatusColor('danger')
                        }
                        setStatusMessage(data.statusMessage)
                    }, 1000)

                });
        })


    }

    function addCategory(category){
        setShowCategoryModal(false)
        if (courseCategory.includes(category)){
            setStatusColor('danger')
            setStatusColor(`Cannot add category ${category.categoryName}, because its already exist`)
        }else{
            
            courseCategory.push(category)
            setCourseCategory(courseCategory)
            setStatusColor('success')
            setStatusColor(`Success adding category ${category.categoryName}`)
        }

        // nanti aja pas submit
        // course.courseCategory = courseCategory
        // setCourse(course)
        
    }

    function deleteCourseCategory(category){
        
        const index = courseCategory.indexOf(category);
        if (index > -1) {
            courseCategory.splice(index, 1);
        }
        setCourseCategory(courseCategory)
        
        setStatusColor('success')
        setStatusColor(`Success delete category ${category.categoryName}`)
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
                             setCourse({...course, courseThumbnail : fileData, courseThumbnailName : fileName})
                            break;
                        case 'trailer':
                            
                            setCourse({...course, courseTrailerFile : fileData, courseTrailerName : fileName})
                            break;
                        case 'thumbnail_trailer':

                            setCourse({...course, courseTrailerThumbnailFile : fileData, courseTrailerThumbnailName : fileName})
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
                                                setCourse({...course, courseName : event.target.value})
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
                                                setCourse({...course, courseDescription : event.target.value})
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
                                            <CLabel className="custom-file-label" htmlFor="customFile">
                                                {course.courseThumbnailName !== undefined ? (
                                                    course.courseThumbnailName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Course Trailer</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                                                getDocumentFromFile(event, 'trailer')
                                            }} accept="image/*" />
                                            <CLabel className="custom-file-label" htmlFor="customFile">
                                                {course.courseTrailerName !== undefined ? (
                                                    course.courseTrailerName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Course Trailer Thumbnail</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                                                getDocumentFromFile(event, 'thumbnail_trailer')
                                            }} accept="image/*" />
                                            <CLabel className="custom-file-label" htmlFor="customFile">
                                                {course.courseTrailerThumbnailName !== undefined ? (
                                                    course.courseTrailerThumbnailName
                                                ) : (
                                                    'Choose file'
                                                )}

                                            </CLabel>
                                        </div>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Category</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                    {courseCategory.map((category) => (
                                         <CButton color="primary" size="sm" className="btn-brand mr-1 mb-1" key={category.id}>
                                        <CIcon size="sm" name="cil-X" className="float-right" onClick={() => {
                                            deleteCourseCategory(category)
                                        }}/>
                                        <span className="mfs-2">{category.categoryName} &nbsp;</span></CButton>
                                    ))}
                                    <CButton  variant="outline" color="primary" size="sm" className="btn-brand mr-1 mb-1" onClick={() => {
                                            setShowCategoryModal(true)
                                        }}>
                                        <CIcon size="sm" name="cil-plus" className="float-right" />
                                        <span className="mfs-2">Add Category &nbsp;</span></CButton>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Membership</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                    <CSwitch
                      className="mr-1"
                      color="info"
                      checked={course.courseMembership}
                      shape="pill"
                      
                      onClick={(event) => {
                        
                        setCourse({...course, courseMembership : event.target.checked})
                    }}
                    />         
                                    </CCol>
                                </CFormGroup>
                                {/* <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="categoryInput">Published</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                    <CSwitch
                      className="mr-1"
                      color="info"
                      checked={course.coursePublished}
                      shape="pill"
                      onClick={(event) => {
                        
                        setCourse({...course, coursePublished : event.target.checked})
                    }}
                    />         
                                    </CCol>
                                </CFormGroup> */}
                       

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
                        <CModal
                            show={showCategoryModal}
                            onClose={setShowCategoryModal}
                        >
                            <CModalHeader>
                                <CModalTitle>
                                    Please choose a category
                                </CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                            <CListGroup>
                            {categories.map((category, indexDelivery) => (
                                <CListGroupItem action key={category.id} onClick={() => { addCategory(category) }}>{category.categoryName}</CListGroupItem>
                            ))}
                            
                            </CListGroup>
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
