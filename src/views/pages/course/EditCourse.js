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
    CInvalidFeedback,
    CSwitch,
    CModalHeader,
    CModalTitle,
    CListGroup,
    CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory,useParams } from "react-router-dom";
import { categoryService } from 'src/service/category';
import { courseService } from 'src/service/course';
import { fileService, ToastComponent, LoadingModal } from 'src/service/utils';

const EditCourse = () => {

    const { id } = useParams();
    const history = useHistory();

    const [course, setCourse] = React.useState({})
    const [categories, setCategories] = React.useState([]) // all categories
    const [courseCategory, setCourseCategory] = React.useState([]) // all categories

    const [isLoading, setIsLoading] = React.useState(false)
    const [isCategoryModalShown, setIsCategoryModalShown] = React.useState(false)
    const [validationError, setValidationError] = React.useState(false)
    const [firstTimeLoad, setFirstTimeLoad] = React.useState(true)
    
    const [toasts, setToasts] = React.useState([])

    const filelimitSize = 50 * 1024 * 1024;
    const warningFileLimit = "Cannot Upload, maximum Upload of 50 MB";

    useEffect(() => {
        if (firstTimeLoad){
            fetchAllData()
        }
    }, [course]);

    async function fetchAllData(){
        setIsLoading(true)
        let result = await fetchDataCategories()
        if (result){
            result = await getData()
            if (result){
                setFirstTimeLoad(false)
            }
            setIsLoading(false)
        }else{
            setIsLoading(false)
        }

    }


    function getData() {
        return new Promise(async (resolve) => {
            let request = {
                id : id
            }
            const result = await courseService.getCourse(request)
            if (result.statusCode === 0) {
              resolve(true)
              setCourse(result.data)
              setCourseCategory(result.data.courseCategory)
            } else {
                resolve(false)
                let toast = {
                  statusColor : 'danger',
                  statusMessage : result.statusMessage
                };
                toasts.push(toast)
                setToasts([...toasts] )
                
                history.push("/list-course");
            }
        })
      }

      function fetchDataCategories() {
        return new Promise( async (resolve) => {
            const result = await categoryService.getCategories();
            if (result.statusCode === 0) {
              resolve(true)
              setCategories(result.data)
            } else {
              resolve(false)
              let toast = {
                statusColor : 'danger',
                statusMessage : result.statusMessage
              };
              toasts.push(toast)
              setToasts([...toasts] )
              
              history.push("/list-course");
            }
          })
      }


    function submitData() {
        if (course.courseName === '' || course.courseDescription === '') {
            setValidationError(true)
            return
        }
        setIsLoading(true)
        let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        return new Promise( async(resolve) => {
            let request = {
                id : id,
                courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    courseThumbnail: course.courseThumbnail,
                    courseThumbnailName: course.courseThumbnailName,
                    courseTrailerFile: course.courseTrailerFile,
                    courseTrailerName: course.courseTrailerName,
                    courseTrailerThumbnailFile: course.courseTrailerThumbnailFile,
                    courseTrailerThumbnailName: course.courseTrailerThumbnailName,
                    courseMembership: course.courseMembership,
                    courseTeacher : loginInfo.id, 
                    courseCategory : courseCategory
            }
            const result = await courseService.editCourse(request)
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
                      resolve(true)
                      history.push("/list-course");
                  }
        
        })


    }

    function addCategory(category){
        let checkExist = false
        setIsCategoryModalShown(false)
        courseCategory.forEach((element) => {
            if (element._id === category.id || element.id === category.id){
                checkExist = true
            }
        })

        let toast = checkExist ? {
            statusColor : 'danger',
            statusMessage : `Cannot add category ${category.categoryName}, because its already exist`
        } : { 
            statusColor : 'success',
            statusMessage : `Success adding category ${category.categoryName}`
        }
        
        toasts.push(toast)
        setToasts([...toasts] )

        if (!checkExist){
            courseCategory.push(category)
            setCourseCategory(courseCategory)
        }
        
    }

    function deleteCourseCategory(category){
        const index = courseCategory.indexOf(category);
        if (index > -1) {
            courseCategory.splice(index, 1);
        }
        setCourseCategory(courseCategory)
        
        let toast = {
            statusColor : 'success',
            statusMessage : `Success delete category ${category.categoryName}`
          };
          toasts.push(toast)
          setToasts([...toasts] )
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
                                   
                                            setIsCategoryModalShown(true)
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

                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton onClick={submitData} className="mr-1 mb-1" type="submit" size="sm" color="primary"><CIcon name="cil-scrubber" /> Submit</CButton>
                            <CButton className="mr-1 mb-1" type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton>
                        </CCardFooter>
               
                        <CModal
                            show={isCategoryModalShown}
                            onClose={setIsCategoryModalShown}
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
                  
                <LoadingModal isLoading={isLoading} message='Please wait a moment..'></LoadingModal>  
                    <ToastComponent listToasts={toasts}></ToastComponent>
                </CCol>
            </CRow>
        </>
    )
}

export default EditCourse
