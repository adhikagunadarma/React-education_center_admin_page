import * as React from "react";
const axios = require('axios').default;

const authContext = React.createContext();

export function useAuth() {
   const [authed, setAuthed] = React.useState(false);
   const checkAuth = (_) => {
    return new Promise(resolve => {
        let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        if (loginInfo && loginInfo != null){
          setAuthed(true);
        }else{
          setAuthed(true);
        }
        resolve(authed)
    })
}
   const logout = (_) => {
          return new Promise(resolve => {
              sessionStorage.removeItem('loginInfo');
              setAuthed(false);
              resolve(authed)
          })
   }
   const login = (req) => {
            return new Promise(async(resolve) => {
                const baseEndpoint = "http://localhost:8080"
                const pathEndpoint = "/api/educen/teacher/login"
                const requestBody = {
                  teacherUsername: req.username,
                  teacherPassword: req.password,
                }
                try {
                  
                    const result = await axios.post(baseEndpoint + pathEndpoint, requestBody)
                    if (result.data.statusCode === 0 && result.status === 200) {
                    
                      let loginInfo = result.data.data[0]
                      sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                      setAuthed(true);
                      resolve(authed)
                    } else {
                      resolve(result.data.statusMessage)
                    }
                 
                }
                catch(e){
                  console.log(e)
                  resolve(e)
                }
              })
   }

   return {
    authed,
    login,
    logout,
    checkAuth
   };

}

export function AuthProvider({ children }) {
   const auth = useAuth();

   return (
     <authContext.Provider value={auth}>
       {children}
     </authContext.Provider>
   )
}

export default function AuthConsumer() {
   return React.useContext(authContext);
}