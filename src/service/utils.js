import * as React from "react";
import {
    CToaster,
    CToast,
    CToastHeader,
    CLabel,
    CToastBody,
    CModal,
    CModalBody
  } from '@coreui/react'

export const fileService = {
    fileToBase64(file){
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        })
    
      }
}


export const ToastComponent = (props) => {
 
    const position = 'top-center'
    const autoHide =  true && 5000
    const closeButton =  true
    const fade = true

    return (
        <CToaster
          position={position}
        >
          {
            props.listToasts.map((toast, key) => {
              return (
                <CToast
                
                  key={'toast' + key}
                  show={true}
                  autohide={autoHide}
                  fade={fade}
                  color={toast.statusColor}
                >
                  <CToastHeader closeButton={closeButton}>
                    {/* Alert Notification */}
                  </CToastHeader>
                  <CToastBody>
                    <CLabel>{toast.statusMessage}</CLabel>
                  </CToastBody>
                </CToast>
              )
            })
          }
        </CToaster>
    )
}

export const LoadingModal = (props) => {
    return (
        <CModal
        show={props.isLoading}
        onClose={((_) => {
            props.isLoading = false
        })}
      >
        <CModalBody>
            {props.message}
        </CModalBody>
      </CModal>
    )
}
