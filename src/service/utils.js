import * as React from "react";

export function useFileService(){
    const fileToBase64 = (file) => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        })
    
      }
      return {
        fileToBase64
       };
}

export function useToastService() {

    const [statusColor, setStatusColor] = React.useState('info')
    const [statusMessage, setStatusMessage] = React.useState('')
    const [position, setPosition] = React.useState('bottom-center')
    // const [autohide, setAutohide] = React.useState(true)
    // const [autohideValue, setAutohideValue] = React.useState(5000)
    // const [closeButton, setCloseButton] = React.useState(true)
    // const [fade, setFade] = React.useState(true)
    const [toasts, setToasts] = React.useState([])

    const addToast = () => {
        setToasts([
            ...toasts,
            { position, autohide: true && 5000, closeButton : true, fade : true, statusMessage, statusColor }
        ])
    }
    const toasters = (() => {
        return toasts.reduce((toasters, toast) => {
            toasters[toast.position] = toasters[toast.position] || []
            toasters[toast.position].push(toast)
            return toasters
        }, {})
    })

   
 
    return {
     toasts,
     statusColor,
     statusMessage,
     setToasts,
     setStatusColor,
     setStatusMessage,
     setPosition,
     addToast,
     toasters,
    };
 
 }