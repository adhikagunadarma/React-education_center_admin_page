import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react'
import { DocsLink } from 'src/reusable'

// import usersData from '../../users/UsersData'

import categories from '../../users/CategoriesData'

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
              // scopedSlots = {{
              //   'status':
              //     (item)=>(
              //       <td>
              //         <CBadge color={getBadge(item.status)}>
              //           {item.status}
              //         </CBadge>
              //       </td>
              //     )
              // }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ListCategory
