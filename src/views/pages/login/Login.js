import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useHistory } from "react-router-dom";
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

const Login = () => {

  const history = useHistory();
  const [validationError, setValidationError] = React.useState(false)

  const [teacherUsername, setTeacherUsername] = React.useState('')
  const [teacherPassword, setTeacherPassword] = React.useState('')


  const [loadingModal, setLoadingModal] = React.useState(false)
  const [statusColor, setStatusColor] = React.useState('info')
  const [statusMessage, setStatusMessage] = React.useState('')

  const [position, setPosition] = React.useState('bottom-center')
  const [autohide, setAutohide] = React.useState(true)
  const [autohideValue, setAutohideValue] = React.useState(5000)
  const [closeButton, setCloseButton] = React.useState(true)
  const [fade, setFade] = React.useState(true)
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
    if (statusMessage != '') {
      addToast() // kalo abis ada perubahan status message / color, baru add tiast
      // setStatusMessage('')
      // setStatusColor('info')
    }
  }, [statusColor, statusMessage]);

  function submitData() {
    if (teacherUsername === '' || teacherPassword === '') {
      // setStatusColor("warning")
      // setStatusMessage("Mohon mengisi data yang dibutuhkan terlebih dahulu")
      setValidationError(true)
      return
    }
    setLoadingModal(true)
    return new Promise((resolve) => {
      const baseEndpoint = "http://localhost:8080"
      const pathEndpoint = "/api/educen/teacher/login"
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherUsername: teacherUsername,
          teacherPassword: teacherPassword,
        })
      };
      console.log(JSON.parse(requestOptions.body))
      fetch(baseEndpoint + pathEndpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
          setTimeout((_) => {
            setLoadingModal(false)
            if (data.statusCode === 0) {
              resolve(true)
              setStatusColor('success')
              // need to save the credential information in local to provide data later on when doing task
              // also need to genertate token that save the credential for amount of time
              // need to work on the routing, not login cannot access the page
              history.push("/dashboard");
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
                      <CInput className="form-control-warning" type="text" placeholder="Username" id="categoryInput" onChange={event => setTeacherUsername(event.target.value)} value={teacherUsername} autoComplete="username" required />
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
                      <CInput className="form-control-warning" type="password" id="categoryInput" onChange={event => setTeacherPassword(event.target.value)} value={teacherPassword} placeholder="Password" autoComplete="current-password" required />
                      <CInvalidFeedback className="help-block" >
                        Please provide a valid password
                      </CInvalidFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={submitData} type="submit">Login</CButton>
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
              {/* <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>

        </CRow>
        <CRow >
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
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
