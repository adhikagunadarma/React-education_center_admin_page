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
  CInvalidFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory, useParams } from "react-router-dom";
import { categoryService } from 'src/service/category';
import { LoadingModal, ToastComponent, fileService } from 'src/service/utils';

const EditCategory = () => {


  const history = useHistory();
  const { id } = useParams();
  
  const [categoryName, setCategoryName] = React.useState('')
  const [categoryDesc, setCategoryDesc] = React.useState('')
  const [categoryThumbnail, setCategoryThumbnail] = React.useState('')
  const [categoryThumbnailName, setCategoryThumbnailName] = React.useState('')

  const [isLoading, setIsLoading] = React.useState(false)
  const [validationError, setValidationError] = React.useState(false)
  const [isFirstTimeLoad, setIsFirstTimeLoad] = React.useState(true)
  
  const [toasts, setToasts] = React.useState([])

  const filelimitSize = 50 * 1024 * 1024;
  const warningFileLimit = "Cannot Upload, maximum Upload of 50 MB";


  useEffect(() => {
    if (isFirstTimeLoad){
      getData()
    }
  });


  function getData() {

    setIsLoading(true)
    return new Promise( async (resolve) => {
      let request = {
          id : id
      }
      const result = await categoryService.getCategory(request)
      setIsLoading(false)
      if (result.statusCode === 0) {
        resolve(true)
        
        setCategoryDesc(result.data.categoryDescription)
        setCategoryName(result.data.categoryName)
        setCategoryThumbnail(result.data.categoryThumbnail)
        setCategoryThumbnailName(result.data.categoryThumbnailName)
        setIsFirstTimeLoad(false)
      } else {
        resolve(false)
        let toast = {
          statusColor : 'danger',
          statusMessage : result.statusMessage
        };
        toasts.push(toast)
        setToasts([...toasts] )
        
        history.push("/list-category");
      }
    })


  }

  function saveData() {
    if (categoryName === '' || categoryDesc === '') {
      setValidationError(true)
      return
    }
    setIsLoading(true)
    return new Promise( async (resolve) => {
      let request = {
          id : id,
          categoryName: categoryName,
          categoryDesc: categoryDesc,
          categoryThumbnail: categoryThumbnail,
          categoryThumbnailName: categoryThumbnailName
      }
      const result = await categoryService.editCategory(request)
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
          history.push("/list-category");
      }
  
    })
  }


  function getDocumentFromFile($event) {
    if ($event.target.files[0]) {
      var file = $event.target.files[0];
      var fileSize = file.size;
      var fileName = file.name;
      var filePath = $event.target.value
      if (fileSize < filelimitSize) {
        fileService.fileToBase64(file).then((fileData) => {
          setCategoryThumbnail(fileData)
          setCategoryThumbnailName(fileName)

        })
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
              Edit Category
              <small>  Forms</small>
            </CCardHeader>
            <CCardBody>
              <CForm className={"form-horizontal " + (validationError ? 'was-validated' : '')}>
                {/* tinggal nambahin class name was validated pas submit button aja */}
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="categoryInput">Category Name *</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="form-control-warning " id="categoryInput" value={categoryName} name="text-input" placeholder="Nama Kategori" onChange={event => setCategoryName(event.target.value)} required />
                    <CInvalidFeedback className="help-block" >
                      Please provide a valid category name
                    </CInvalidFeedback>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="textarea-input">Category Description *</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea value={categoryDesc}
                      name="textarea-input"
                      id="textarea-input"
                      rows="9"
                      placeholder="Deskripsi kategori..."
                      onChange={event => setCategoryDesc(event.target.value)}
                      required
                    />
                    <CInvalidFeedback className="help-block">
                      Please provide a valid category description
                    </CInvalidFeedback>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="categoryInput">Category Thumbnail</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" id="customFile" onChange={(event) => {
                        getDocumentFromFile(event)
                      }} accept="image/*" />
                      <CLabel className="custom-file-label" htmlFor="customFile" >
                        {categoryThumbnailName !== '' ? (
                          categoryThumbnailName
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
              <CButton onClick={saveData} className="mr-1 mb-1" type="submit" size="sm" color="primary"><CIcon name="cil-scrubber" /> Submit</CButton>
              <CButton className="mr-1 mb-1" type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton>
            </CCardFooter>
          
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

export default EditCategory
