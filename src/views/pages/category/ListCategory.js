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
  CImg
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { useHistory } from "react-router-dom";
import { useCategoryService } from 'src/service/category';
import { LoadingModal, ToastComponent, toastService } from 'src/service/utils';

const fields = ['categoryThumbnail', 'categoryName', 'categoryDescription', 'action']

const ListCategory = () => {

  const { getCategories, deleteCategory } = useCategoryService()

  const history = useHistory();
  
  const [categories, setCategories] = React.useState([])
  const [selectedCategory, setSelectedCategory] = React.useState('')
  
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleteModalShown, setIsDeleteModalShown] = React.useState(false)

  useEffect(() => {
    getData()
    if (toastService.statusMessage != '') {
      toastService.addToast()
    }
    toastService.statusMessage =''
    toastService.statusColor ='info'

  }, [toastService.statusColor, toastService.statusMessage]);



  function getData() {

    setIsLoading(true)
    return new Promise( async (resolve) => {
      const result = await getCategories();
      if (result.statusCode === 0) {
        resolve(true)
        setCategories(result.data)
      } else {
        resolve(false)
        toastService.statusColor = 'danger'
        toastService.statusMessage = result.statusMessage
      }
      setIsLoading(false)
    })
  }

  function goToEditCategory(data, index) {
    history.push("/edit-category/" + data.id);
  }

  function deleteData(data, index) {
    setSelectedCategory(data)
    setIsDeleteModalShown(true)
  }

  function confirmDelete() {
    setIsDeleteModalShown(false)
    setIsLoading(true)
    return new Promise( async (resolve) => {
      const result = await deleteCategory({id : selectedCategory.id});
      setIsLoading(false)
      if (result.statusCode === 0){
        toastService.statusColor = 'success'
        resolve(true)
      }else{
        toastService.statusColor = 'danger'
        resolve(false)
      }
      toastService.statusMessage = result.statusMessage
      // window.location.reload();
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
            show={isDeleteModalShown}
            onClose={() => {
              setIsDeleteModalShown(false)
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
                  setIsDeleteModalShown(false)
                  setSelectedCategory('')
                }}
              >Cancel</CButton>
            </CModalFooter>
          </CModal>
        </CCol>
        <CCol sm="12" lg="12">
        <CRow >
          <LoadingModal isLoading={isLoading} message='Please wait a moment..'></LoadingModal>
          <ToastComponent toasts={toastService.toasts} position={toastService.position}></ToastComponent>
          </CRow>
        </CCol>
      </CRow>
    </>
  )
}

export default ListCategory
