import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClINg_GKVxm2VECma1Vr_bneucBoGHVVI",
  authDomain: "towmap-bb20a.firebaseapp.com",
  projectId: "towmap-bb20a",
  storageBucket: "towmap-bb20a.firebasestorage.app",
  messagingSenderId: "535416709701",
  appId: "1:535416709701:web:369dcc0ce5d0629501792c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);