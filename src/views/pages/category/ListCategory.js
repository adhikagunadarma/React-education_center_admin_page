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
  CModal,
  CModalBody,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CLabel
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import { Link } from 'react-router-dom'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields = ['name','description', 'action']


const ListCategory = () => {
  
const [loadingModal, setLoadingModal] = React.useState(false)
const [categories, setCategories] = React.useState([])

const [position, setPosition] = React.useState('top-center')
const [autohide, setAutohide] = React.useState(true)
const [autohideValue, setAutohideValue] = React.useState(5000)
const [closeButton, setCloseButton] = React.useState(true)
const [fade, setFade] = React.useState(true)
const [statusColor , setStatusColor] = React.useState('info')
const [statusMessage , setStatusMessage] = React.useState('')

const [toasts, setToasts] = React.useState([])

const addToast = () => {
  setToasts([
    ...toasts, 
    { position, autohide: autohide && autohideValue, closeButton, fade, statusMessage, statusColor }
  ])
}
const toasters = (()=>{
  return toasts.reduce((toasters, toast) => {
    toasters[toast.position] = toasters[toast.position] || []
    toasters[toast.position].push(toast)
    return toasters
  }, {})
})()

useEffect(() => {
  getData()
  if (statusMessage != ''){
    addToast() // kalo abis ada perubahan status message / color, baru add tiast
  }
}, [statusColor,statusMessage]);

function getData() {

  setLoadingModal(true)
  return new Promise((resolve) => {
      const baseEndpoint = "http://localhost:8080"
      const pathEndpoint = "/api/educen/categories"
      const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      };
      fetch(baseEndpoint + pathEndpoint)
          .then(response => response.json())
          .then(data => {
            setTimeout((_) => {
              setLoadingModal(false)
              if (data.statusCode === 0){
                resolve(true)
                setCategories(data.data)
              }else{
                resolve(false)
                setStatusColor('danger')
                setStatusMessage(data.statusMessage)
              }
            },1000)
   
          });
  })


}
  return (
    <>
     
      <CRow>
        <CCol sm="12" lg="12">
          <CCard>
            <CCardHeader>
              List Category
              <div className="card-header-actions">
                <CLink to="/add-category">
                <CButton block variant="outline" color="primary" size="sm" className="btn-brand mr-1 mb-1">
              <CIcon size="sm" name="cil-plus" className="float-right"/>
                <span className="mfs-2">Add Category &nbsp;</span></CButton>
                </CLink>
         
              </div>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={categories}
              fields={fields}
              hover
              striped
              bordered
              size="sm"
              itemsPerPage={15}
              pagination
              scopedSlots = {{
                'action':
                (item, index)=>{
                  return (
                    <td className="py-3">
                      <CButton
                        color="warning"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1 mb-1"
                      >
                        Update
                      </CButton>
                      
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1 mb-1"
                      >
                        Delete
                      </CButton>
                    </td>
                    )
                }
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

export default ListCategory
