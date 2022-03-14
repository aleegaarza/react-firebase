import firebaseApp from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";

//config

import config from './config';

firebaseApp.initializeApp(config);

export const fireStore = firebaseApp.firestore();

//Módulo de autenticación
export const auth = firebaseApp.auth();
//Auth Provider
export const provider = new firebaseApp.auth.GoogleAuthProvider();
//Login with pop-up
export const loginWithGoogle = () => auth.signInWithPopup(provider);
//Logout
export const logout = () => auth.signOut();

export default firebaseApp;