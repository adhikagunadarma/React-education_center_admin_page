import * as React from "react";

const authContext = React.createContext();

export function useAuth() {
   const [authed, setAuthed] = React.useState(false);
   const logout = (_) => {
          return new Promise(resolve => {
              sessionStorage.removeItem('loginInfo');
              setAuthed(false);
              resolve(authed)
          })
   }
   const login = async(req) => {
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
                      if (data.statusCode === 0) {
                        let loginInfo = data.data[0]
                        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                        setAuthed(true);
                        console.log(authed)
                        resolve(authed)
                      } else {
                        resolve(data.statusMessage)
                      }
          
                  });
              })
   }

   return {
    authed,
    login,
    logout
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