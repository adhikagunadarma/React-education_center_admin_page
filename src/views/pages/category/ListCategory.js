import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CLink
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'

// import usersData from '../../users/UsersData'

import categories from '../../users/CategoriesData'
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
  return (
    <>
     
      <CRow>
        <CCol>
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
        </CCol>
      </CRow>
    </>
  )
}

export default ListCategory
