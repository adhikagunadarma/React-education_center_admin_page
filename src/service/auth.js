import * as React from "react";

const authContext = React.createContext();

export function useAuth() {
   const [authed, setAuthed] = React.useState(false);
   const doLogin = async(req) => {
            return new Promise((resolve) => {
                const baseEndpoint = "http://localhost:8080"
                const pathEndpoint = "/api/educen/teacher/login"
                const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    teacherUsername: req.username,
                    teacherPassword: req.password,
                  })
                };
                fetch(baseEndpoint + pathEndpoint, requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    setTimeout((_) => {
                      if (data.statusCode === 0) {
                        let loginInfo = data.data[0]
                        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                        resolve(true)
                      } else {
                        resolve(data.statusMessage)
                      }
                    }, 1000)
          
                  });
              })
   }

   return {
    authed,
     login(req) {
       return new Promise((res) => {
         setAuthed(true);
         res(doLogin(req));
       });
     },
     logout() {
       return new Promise((res) => {
         setAuthed(false);
         res();
       });
     }
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