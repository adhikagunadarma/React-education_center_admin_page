import React, { useEffect } from 'react'
import {
    CBadge,
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
    CImg
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { useHistory } from "react-router-dom";
import { courseService } from 'src/service/course';
import { ToastComponent, LoadingModal } from 'src/service/utils';
const getBadge = status => {
    switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: return 'primary'
    }
}
const fields = ['courseThumbnail', 'courseName', 'courseCategory', 'courseMembership', 'coursePublished', 'courseTotalBought', 'action']


const ListCourse = () => {

    const history = useHistory();
   
    const [courses, setCourses] = React.useState([])
    const [selectedCourse, setSelectedCourse] = React.useState('')

    const [isLoading, setIsLoading] = React.useState(false)
    const [isVerificationModalShown, setIsVerificationModalShown] = React.useState(null)
    const [isFirstTimeLoad, setIsFirstTimeLoad] = React.useState(true)
    
    const [toasts, setToasts] = React.useState([])

    useEffect(() => {
        if (isFirstTimeLoad){
            getData()
        }
    });

    function getData() {
        let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        setIsLoading(true)
        return new Promise( async (resolve) => {
            const idTeacher = loginInfo.id
            const result = await courseService.getCoursesByTeacher({id : idTeacher});
            // console.log(result)
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
            setIsLoading(false)
        })
    }

    function goToEditCourse(data, index) {
        history.push("/edit-course/" + data.id);
    }

    function showVerificationModal(data, index, type) {
        setSelectedCourse(data)
        setIsVerificationModalShown(type)
    }

    async function confirmVerification(type) {
        setIsVerificationModalShown(null)
        setIsLoading(true)
            let toast;
            if (type==='Delete'){
                const result = await courseService.deleteCourse({id : selectedCourse.id});
              setIsLoading(false)
              toast = result.statusCode === 0 ? {
                statusColor : 'success',
                statusMessage : result.statusMessage
              } : {
                statusColor : 'danger',
                statusMessage : result.statusMessage
              };
        
            }
            if (type==='Publish'){
                const result = await courseService.editCourse({id : selectedCourse.id, coursePublished: true});
                setIsLoading(false)
                toast = result.statusCode === 0 ? {
                    statusColor : 'success',
                    statusMessage : result.statusMessage
                  } : {
                    statusColor : 'danger',
                    statusMessage : result.statusMessage
                  };
            }
            toasts.push(toast)
            setToasts([...toasts] )
            setSelectedCourse('')
            getData()
    }

    return (
        <>
            <CRow>
                <CCol sm="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            List Course
                            <div className="card-header-actions">
                                <CLink to="/add-course">
                                    <CButton block variant="outline" color="primary" size="sm" className="btn-brand mr-1 mb-1">
                                        <CIcon size="sm" name="cil-plus" className="float-right" />
                                        <span className="mfs-2">Add Course &nbsp;</span></CButton>
                                </CLink>

                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={courses}
                                fields={fields}
                                hover
                                striped
                                bordered
                                size="sm"
                                itemsPerPage={15}
                                pagination
                                scopedSlots={{
                                    'action':
                                        (item, index) => {
                                            return (
                                                <td className="py-3">
                                                    {
                                                        item.coursePublished === false ?
                                                        <CButton
                                                        color="warning"
                                                        variant="outline"
                                                        shape="square"
                                                        size="sm"
                                                        className="mr-1 mb-1"
                                                        onClick={() => { goToEditCourse(item, index) }}
                                                    >
                                                        Update
                                                    </CButton> : 
                                                    null

                                                    }
                                                    <CButton
                                                        color="danger"
                                                        variant="outline"
                                                        shape="square"
                                                        size="sm"
                                                        className="mr-1 mb-1"
                                                        onClick={() => { showVerificationModal(item, index, 'Delete') }}
                                                    >
                                                        Delete
                                                    </CButton>
                                                {
                                                    item.coursePublished === false ?
                                                    <CButton
                                                    color="info"
                                                    variant="outline"
                                                    shape="square"
                                                    size="sm"
                                                    className="mr-1 mb-1"
                                                    onClick={() => { showVerificationModal(item, index, 'Publish') }}
                                                >
                                                    Publish
                                                </CButton> :
                                                    null
                                                }
                                                </td>
                                            )
                                        },
                                    'courseMembership':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.courseMembership)}>
                                                    {item.courseMembership === true ? (
                                                        'Member'
                                                    ) : (
                                                        'Non-Member'
                                                    )}
                                                </CBadge>
                                            </td>
                                        ),
                                    'coursePublished':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.coursePublished)}>
                                                    {item.coursePublished === true ? (
                                                        'Published'
                                                    ) : (
                                                        'Not Published'
                                                    )}
                                                </CBadge>
                                            </td>
                                        ),
                                    'courseThumbnail':
                                        (item) => (
                                            <td>
                                                <CImg
                                                    src={item.courseThumbnail}
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
                        show={isLoading}
                        onClose={setIsLoading}
                    >
                        <CModalBody>
                            Please wait a moment..
                        </CModalBody>
                    </CModal>
                    <CModal
                        show={isVerificationModalShown != null}
                        onClose={() => {
                            setIsVerificationModalShown(null)
                            setSelectedCourse('')
                        }}
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{isVerificationModalShown} Confirmation</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            Are you sure you want to {isVerificationModalShown} course name {selectedCourse.courseName} ?
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="danger"
                                onClick={() => {
                                    confirmVerification(isVerificationModalShown)
                                }}
                            >{isVerificationModalShown}</CButton>
                            <CButton
                                color="secondary"
                                onClick={() => {
                                    setIsVerificationModalShown(null)
                                    setSelectedCourse('')
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

export default ListCourse
