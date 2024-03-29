import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyAAG8DXWh1Ry2ggAD7eKugsV6cWLXops1s",
    authDomain: "superchat-2c0dc.firebaseapp.com",
    projectId: "superchat-2c0dc",
    storageBucket: "superchat-2c0dc.appspot.com",
    messagingSenderId: "190234216135",
    appId: "1:190234216135:web:fa10fa755d7447881520e2"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
    const [user] = useAuthState(auth)

    return (
    <div className="App">
        <header>

        </header>

        <section>
            {user ? <ChatRoom /> : <SignIn />}
        </section>
    </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
    }

    return <button onClick={signInWithGoogle}>Sign in with Google</button>
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)

    const [messages] = useCollectionData(query, {idField: 'id'})

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {
        e.preventDefault()
        const {uid, photoURL} = auth.currentUser

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })
    }

    return (
        <>
        <div>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>

        <form onSubmit={sendMessage}>
            <input value={formValue} onChange={e => setFormValue(e.target.value)} />
            <button type="submit">►</button>
        </form>
        </>
    )
}

function ChatMessage(props) {
    const {text, uid, photoURL} = props.message

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

    return (
        <div className={`message ${messageClass}`}>
            <img alt="userProfileImage" src={photoURL} />
            <p>{text}</p>
        </div>
    )
}

export default App;