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
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CLabel,
    CImg
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { useHistory } from "react-router-dom";
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

    const [loadingModal, setLoadingModal] = React.useState(false)
    const [courses, setCourses] = React.useState([])

    const [position, setPosition] = React.useState('top-center')
    const [autohide, setAutohide] = React.useState(true)
    const [autohideValue, setAutohideValue] = React.useState(5000)
    const [closeButton, setCloseButton] = React.useState(true)
    const [fade, setFade] = React.useState(true)
    const [statusColor, setStatusColor] = React.useState('info')
    const [statusMessage, setStatusMessage] = React.useState('')

    const [selectedCourse, setSelectedCourse] = React.useState('')
    const [verificationModal, setVerificationModal] = React.useState(null)

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
        
        getData()
        if (statusMessage != '') {
            addToast() // kalo abis ada perubahan status message / color, baru add tiast
        }

    }, [statusColor, statusMessage]);

    function getData() {

        setLoadingModal(true)
        return new Promise((resolve) => {
            //default get listcourse will fetched by teacher id because its their login info
            const idTeacher = "6137021a86140b3a7043bbba"// later on will changed by login teacher info
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
                            data.data.forEach(element => {
                                
                                let courseCategory = []
                                element.courseCategory.map (category => {
                                        courseCategory.push(category.categoryName)
                                  
                                })
                                element.courseCategory = courseCategory
                            });
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

    function goToEditCourse(data, index) {
        history.push("/edit-course/" + data.id);
    }

    function showVerificationModal(data, index, type) {
        setSelectedCourse(data)
        setVerificationModal(type)
    }

    function confirmVerification(type) {
        setVerificationModal(null)
        setLoadingModal(true)
        return new Promise((resolve) => {
            
            const baseEndpoint = "http://localhost:8080"
            const pathEndpoint = "/api/educen/course/" + selectedCourse.id
            if (type==='Delete'){
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                };
              
                fetch(baseEndpoint + pathEndpoint, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setTimeout((_) => {
                        setLoadingModal(false)
                        if (data.statusCode === 0) {
                            resolve(true)
                            setStatusColor('success')
                        } else {
                            resolve(false)
                            setStatusColor('danger')
                        }

                        setStatusMessage(data.statusMessage)
                    }, 1000)

                });
            }
            if (type==='Publish'){
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        coursePublished: true,
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
                        } else {
                            resolve(false)
                            setStatusColor('danger')
                        }

                        setStatusMessage(data.statusMessage)
                    }, 1000)

                });
            }
     
        })

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
                        show={loadingModal}
                        onClose={setLoadingModal}
                    >
                        <CModalBody>
                            Please wait a moment..
                        </CModalBody>
                    </CModal>
                    <CModal
                        show={verificationModal != null}
                        onClose={() => {
                            setVerificationModal(null)
                            setSelectedCourse('')
                        }}
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{verificationModal} Confirmation</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            Are you sure you want to {verificationModal} course name {selectedCourse.courseName} ?
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="danger"
                                onClick={() => {
                                    confirmVerification(verificationModal)
                                }}
                            >{verificationModal}</CButton>
                            <CButton
                                color="secondary"
                                onClick={() => {
                                    setVerificationModal(null)
                                    setSelectedCourse('')
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

export default ListCourse
