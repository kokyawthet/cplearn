import FirebaseKeys from './config'
import * as Firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyBvSo0MRtUccyfLhEReClh61BPLr7t6fY8",
    authDomain: "socialapp-175f4.firebaseapp.com",
    databaseURL: "https://socialapp-175f4.firebaseio.com",
    projectId: "socialapp-175f4",
    storageBucket: "socialapp-175f4.appspot.com",
    messagingSenderId: "274603733293",
    appId: "1:274603733293:web:6613b1625319c8c4e7a3a4"
  };
class Fire {
    constructor () {
        if (!Firebase.apps.length) {
            Firebase.initializeApp(firebaseConfig);
        }
    }

    addPost = async ({ text, localuri }) => {
        const remoteUri = await this.uploadImageAsyn(localuri,`photos/${this.uid}/${Date.now()}`);
        return new Promise((res, rej) => {
            this.fireStore.collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timeStamp: this.timeStamp,
                    image: remoteUri
                })
                .then(ref => res(ref))
                .catch(err => rej(err))
        });
    }

    uploadImageAsyn = async (uri,filename) => {
        // const path = `photos/${this.uid}/${Date.now()}.jpg`;
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();
            let upload = Firebase
                .storage()
                .ref(filename)
                .put(file);
            upload.on(
                "state_changed",
                snapshot => { },
                err => { rej(err) },
                async () => {
                    const uri = await upload.snapshot.ref.getDownloadURL();
                    res(uri)
                }
            );
        })
    }

    createUser = async (user) => {
        let remoteUri = null;
        try
        {
            await Firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            let db = this.fireStore.collection("user").doc(this.uid)
            db.set({
                name: user.name,
                email: user.email,
                avatar:null
            })
            if (user.avatar)
            {
                remoteUri = await this.uploadImageAsyn(user.avatar, `avatars/${this.uid}`);
                db.set({ avatar: remoteUri }, { merge: true });
            }

        } catch (error)
        {
            console.log(error)
        }
    }

    updateUser = async (user) => {
        let remoteUri = null;
        let db = this.fireStore.collection("user").doc(this.uid)
        db.update({
            name: user.name,
            email: user.email,
            avatar: null
        });
        if (user.avatar)
        {
            remoteUri = await this.uploadImageAsyn(user.avatar, `avatars/${this.uid}`);
            db.set({ avatar: remoteUri }, { merge: true });
        }
    }


    signOutUser = () => {
        Firebase.auth().signOut();
    }

    get fireStore() {
        return  Firebase.firestore()
    }

    get uid() {
        return (Firebase.auth().currentUser || {}).uid
    }

    get timeStamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;