import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
import firebase from '../firebase';
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
        if (agentProfile) {
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
        }
    }, [agentProfile])
    return <div>
        <Launcher
            agentProfile={agentProfile||{}}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            isOpen={isOpen}
            handleClick={handleClick}
            mute={true}
        />
    </div>
}

export default connectStateProps(ChatSystem)