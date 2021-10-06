import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom';
import { authService } from 'src/service/auth';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CInvalidFeedback,
  CModal,
  CModalBody,
  CToaster,
  CToast,
  CToastHeader,
  CLabel,
  CToastBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toastService } from 'src/service/utils';

const Login = () => {

  const history = useHistory(); 
  
  const [teacherUsername, setTeacherUsername] = React.useState('')
  const [teacherPassword, setTeacherPassword] = React.useState('')

  const [validationError, setValidationError] = React.useState(false)
  const [loadingModal, setLoadingModal] = React.useState(false)

  useEffect(() => {
    if (toastService.statusMessage != '') {
      toastService.addToast()
    }
    toastService.statusMessage =''
    toastService.statusColor ='info'
  }, [toastService.statusColor, toastService.statusMessage]);

  async function submitData(e) {
    e.preventDefault()
  
    if (teacherUsername === '' || teacherPassword === '') {
      setValidationError(true)
      return
    }
    setLoadingModal(true)
    const result = await authService.login({username : teacherUsername, password : teacherPassword})
      console.log(result)
      setLoadingModal(false)
      if (result === true){
        history.push("/dashboard");
      }
      else {
        toastService.statusColor = 'danger'
        toastService.statusMessage = result

      }
  
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-5">
                <CCardBody>
                  <CForm className={"form-horizontal " + (validationError ? 'was-validated' : '')}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput className="form-control-warning" type="text" placeholder="Username" id="usernameInput" onChange={event => setTeacherUsername(event.target.value)} value={teacherUsername} autoComplete="username" required />
                      <CInvalidFeedback className="help-block" >
                        Please provide a valid username
                      </CInvalidFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput className="form-control-warning" type="password" id="passwordInput" onChange={event => setTeacherPassword(event.target.value)} value={teacherPassword} placeholder="Password" autoComplete="current-password" required />
                      <CInvalidFeedback className="help-block" >
                        Please provide a valid password
                      </CInvalidFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={(e) => {
                          submitData(e)
                        }} type="submit">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                <CModal
                  show={loadingModal}
                  onClose={setLoadingModal}
                >
                  <CModalBody>
                    Please wait a moment..
                  </CModalBody>
                </CModal>
              </CCard>
            </CCardGroup>
          </CCol>

        </CRow>
        <CRow >
          {/* {Object.keys(toastService.toasters).map((toasterKey) => ( */}
            <CToaster
              position={toastService.position}
            >
              {
                toastService.toasts.map((toast, key) => {
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
          {/* ))} */}
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
