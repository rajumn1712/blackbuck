import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
import firebase from 'firebase/app';
import 'firebase/firestore'
import { message } from 'antd';
firebase.initializeApp({
    apiKey: "AIzaSyD3nPg4XTQYA1eKP-lKLOTM34ujbKSdiRA",
    authDomain: "blackbuck-8e1fe.firebaseapp.com",
    projectId: "blackbuck-8e1fe",
    storageBucket: "blackbuck-8e1fe.appspot.com",
    messagingSenderId: "818728372441",
    appId: "1:818728372441:web:56baa487e5b2de6b4456c8",
    measurementId: "G-0SWKHBNV7E"
});
const db = firebase.firestore();
const ChatSystem = ({ profile, agentProfile, isOpen, handleClick }) => {
    const [messageList, setMessageList] = useState([]);
    const _onMessageWasSent = (message) => {
        db.collection("chat").doc(profile?.Id).collection("messages")
            .add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                message: message.data.text,
                user_id: agentProfile?.UserId,
                type: message.type,
                fromPhoto: profile?.ProfilePic,
                toPhoto: agentProfile?.imageUrl,
                userCreated: profile?.Id
            })
        db.collection("chat").doc(agentProfile?.UserId).collection("messages")
            .add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                message: message.data.text,
                user_id: profile?.Id,
                type: message.type,
                fromPhoto: profile?.ProfilePic,
                toPhoto: agentProfile?.imageUrl,
                userCreated: profile?.Id
            })
    }
    useEffect(() => {
        const unsubscribe = db.collection("chat").doc(profile?.Id).collection("messages")
            .orderBy("createdAt")
            .where("user_id", "==", agentProfile?.UserId)
            .limit(100)
            .onSnapshot(querySnapShot => {
                const data = querySnapShot.docs.map(doc => {
                    const _item = doc.data();
                    return { data: { text: _item.message }, author: _item.userCreated === profile?.Id ? "me" : "them", type: _item.type || "text" }
                });
                setMessageList(data);
            });
        return unsubscribe;
    }, [])
    return <div>
        <Launcher
            agentProfile={agentProfile}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            isOpen={isOpen}
            handleClick={handleClick}
        />
    </div>
}

export default connectStateProps(ChatSystem)