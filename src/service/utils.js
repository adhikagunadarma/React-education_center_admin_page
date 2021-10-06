import * as React from "react";


export const fileService = {
    fileToBase64(file){
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        })
    
      }
}

export const toastService = {
    statusColor : 'info',
    statusMessage : '',
    position : 'top-center',
    autohide : true,
    autohideValue : 5000,
    closeButton : true,
    fade : true,
    toasts : [],
    // toasters : (() => {
    //     return this.toasts.reduce((toasters, toast) => {
    //         toasters[toast.position] = toasters[toast.position] || []
    //         toasters[toast.position].push(toast)
    //         return toasters
    //     }, {})
    // }),

    addToast(){
        this.toasts = [
            ...this.toasts,
            { position : this.position, 
                autohide: this.autohide && this.autohideValue, 
                closeButton : this.closeButton, 
                fade : this.fade, 
                statusMessage : this.statusMessage, 
                statusColor : this.statusColor
            }
        ]
    }

}

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