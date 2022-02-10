import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
    apiKey: "AIzaSyCd-j8INTCPf3HuVsW6Yg1NCAF16uMyAI0",
    authDomain: "diplomska-725b7.firebaseapp.com",
    projectId: "diplomska-725b7",
    storageBucket: "diplomska-725b7.appspot.com",
    messagingSenderId: "617284751825",
    appId: "1:617284751825:web:12a2d0d7e2fc8339a7d0f0",
    measurementId: "G-N859FX7BHT"
};

// export const createUserProfileDocument = async (userAuth, additionalData) => {
//   if (!userAuth) return;

//   const userRef = firestore.doc(`users/${userAuth.uid}`);
//   const snapShot = await userRef.get();

//   if (!snapShot.exists) {
//     const { displayName, email } = userAuth;
//     const createdAt = new Date();
//     try {
//       await userRef.set({
//         displayName,
//         createdAt,
//         email,
//         ...additionalData,
//       });
//     } catch (error) {
//       console.log("error", error.message);
//     }
//   }
//   return userRef;
// };

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const signUp = async(email: string, password: string) => {
    try {
        const response = await auth.createUserWithEmailAndPassword(email, password)
        await response.user!.sendEmailVerification()
    } catch (err : any) {
        throw err
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const { user }: any = await auth.signInWithEmailAndPassword(email, password)
        if(!user) {
            throw "User doesn't exist"
        } else if ( !user.multiFactor.user.emailVerified) {
            throw "Verify your email"
        }

        return {
            accessToken: user.multiFactor.user.accessToken,
            profile: {
                id: user.multiFactor.user.uid,
                email: user.multiFactor.user.email
            },
            refreshToken:  user.multiFactor.user.stsTokenManager.refreshToken
        }
    } catch (err : any) {
        throw err.message
    }
}

export const resetPasswordFirebase = async (email: string) => {
    try {
        await auth.sendPasswordResetEmail(email)
    } catch (err : any) {
        throw err
    }
}

export default firebase;