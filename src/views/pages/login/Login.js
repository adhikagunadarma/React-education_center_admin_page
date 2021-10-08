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
    CModalBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toastService, ToastComponent, LoadingModal } from 'src/service/utils';

const Login = () => {

  const history = useHistory(); 
  
  const [teacherUsername, setTeacherUsername] = React.useState('')
  const [teacherPassword, setTeacherPassword] = React.useState('')

  const [statusColor, setStatusColor] = React.useState('info')
  const [statusMessage, setStatusMessage] = React.useState('')

  const [validationError, setValidationError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [toasts, setToasts] = React.useState([])
 
  useEffect(() => {
    // if (toastService.statusMessage != '') {
    //   toastService.addToast()
    // }
    // toastService.statusMessage =''
    // toastService.statusColor ='info'
  });


  async function submitData(e) {
    e.preventDefault()
  
    if (teacherUsername === '' || teacherPassword === '') {
      setValidationError(true)
      return
    }
    
    setIsLoading(true)
    setTimeout(async (_) => {
      const result = await authService.login({username : teacherUsername, password : teacherPassword})
      console.log(result)
      setIsLoading(false)
      if (result === true){
        history.push("/dashboard");
      }
      else {
        setStatusColor('danger')
        setStatusMessage(result)
        setToasts(
          ...toasts,
          { 
              statusMessage : 'danger', 
              statusColor : result
          })
      }
    },1000)
  
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
            
              </CCard>
            </CCardGroup>
          </CCol>

        </CRow>
        <CRow >
          <LoadingModal isLoading={isLoading} message='Please wait a moment..'></LoadingModal>
          <ToastComponent toasts={toasts}></ToastComponent>
          </CRow>
      </CContainer>
    </div>
  )
}

export default Login
