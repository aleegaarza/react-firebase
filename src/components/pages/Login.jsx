import { React, useEffect } from "react";
import { auth, fireStore, loginWithGoogle, logout } from "../../firebase/firebase";
import logobig from "../../logobig.svg";


//Authentication

    function Login( { setUser, user, } ){

        useEffect(() => {
            const login = fireStore.collection("tweets")

            auth.onAuthStateChanged((user) => {
                console.warn("LOGGED WIDTH:", user);
                setUser(user);
          
              });
              return () => {login()}

        }, []);
        
          
          return(
              
              <>
            <header>
        <div >
          <img src={logobig} alt="" />
        </div>
      </header>


      <section className='login' >
        {user && (
          <div className='user-info' >

            <p>Hola {user.displayName} </p>
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />

          </div>
        )}
        
        <button className='btn-login' type='button' onClick={user ? logout : loginWithGoogle} >
          {user ? "cerrar" : "iniciar"} sesión
        </button>
      </section>
      </>
          );
        
    };


  export default Login;