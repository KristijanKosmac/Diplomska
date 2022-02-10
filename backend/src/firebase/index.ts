import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { config } from "../../config/firebaseConfig"
import * as serviceAccount from "../../config/serviceAccountKey.json"
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as unknown as string),
  });
  
firebase.initializeApp(config);

const auth = firebase.auth()

export { auth, admin }