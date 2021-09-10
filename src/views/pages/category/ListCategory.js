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

const fields = ['categoryThumbnail', 'categoryName', 'categoryDescription', 'action']

const ListCategory = () => {

  const history = useHistory();

  const [loadingModal, setLoadingModal] = React.useState(false)
  const [categories, setCategories] = React.useState([])

  const [position, setPosition] = React.useState('top-center')
  const [autohide, setAutohide] = React.useState(true)
  const [autohideValue, setAutohideValue] = React.useState(5000)
  const [closeButton, setCloseButton] = React.useState(true)
  const [fade, setFade] = React.useState(true)
  const [statusColor, setStatusColor] = React.useState('info')
  const [statusMessage, setStatusMessage] = React.useState('')

  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [deleteModal, setDeleteModal] = React.useState(false)

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

  function goToEditCategory(data, index) {
    // console.log(data.id)
    history.push("/edit-category/" + data.id);
  }

  function deleteData(data, index) {
    // console.log(index)
    console.log(data)
    setSelectedCategory(data)
    setDeleteModal(true)
  }

  function confirmDelete() {
    setDeleteModal(false)
    setLoadingModal(true)
    return new Promise((resolve) => {
      const baseEndpoint = "http://localhost:8080"
      const pathEndpoint = "/api/educen/category/" + selectedCategory.id
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
                    <CIcon size="sm" name="cil-plus" className="float-right" />
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
                scopedSlots={{
                  'action':
                    (item, index) => {
                      return (
                        <td className="py-3">
                          {/* <CLink to="/add-category/"> */}

                          <CButton
                            color="warning"
                            variant="outline"
                            shape="square"
                            size="sm"
                            className="mr-1 mb-1"
                            onClick={() => { goToEditCategory(item, index) }}
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
                            onClick={() => { deleteData(item, index) }}
                          >
                            Delete
                          </CButton>
                        </td>
                      )
                    },
                  'categoryThumbnail':
                    (item) => (
                      <td>
                        <CImg
                          src={item.categoryThumbnail}
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
              setSelectedCategory('')
            }}
          >
            <CModalHeader closeButton>
              <CModalTitle>Delete Confirmation</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure you want to delete category name {selectedCategory.categoryName} ?
            </CModalBody>
            <CModalFooter>
              <CButton color="danger"
                onClick={confirmDelete}
              >Delete</CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setDeleteModal(false)
                  setSelectedCategory('')
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

export default ListCategory
