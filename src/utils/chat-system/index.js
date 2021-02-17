import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
import firebase from '../firebase';
import { cloudMessaging } from '../../shared/api/clients';
import { sendNotification } from '../../shared/api/apiServer';
const db = firebase.firestore();
const ChatSystem = ({ profile, agentProfile, isOpen, handleClick }) => {
    const [messageList, setMessageList] = useState([]);
    const [userDevice, setUserDevice] = useState("")
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
            });
        db.collection("chat").doc(agentProfile?.UserId).collection("messages")
            .add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                message: message.data.text,
                user_id: profile?.Id,
                type: message.type,
                fromPhoto: profile?.ProfilePic,
                toPhoto: agentProfile?.imageUrl,
                userCreated: profile?.Id
            });
        db.collection('chat').doc(agentProfile?.UserId).collection("notifications").add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            message: message.data.text,
            image: profile?.ProfilePic,
            name: profile?.FirstName + " " + profile?.LastName,
            from: profile?.Id
        });
        sendNotification({ to: agentProfile?.UserId, message: "You have new message from " + profile?.FirstName + " " + profile?.LastName, from: profile?.Id })
    }
    useEffect(() => {

        if (agentProfile) {
            db.collection("devices").doc(agentProfile?.UserId).collection("tokens")
                .get().then(snap => {
                    const data = snap.docs.map(item => {
                        return item.data().token;
                    });
                    if (data.length > 0) {
                        setUserDevice(data.filter((item, indx, arr) => indx == arr.indexOf(item)));
                    }
                });
            const unsubscribe = db.collection("chat").doc(profile?.Id).collection("messages")
                .orderBy("createdAt")
                .where("user_id", "==", agentProfile?.UserId)
                .limit(1000)
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
            agentProfile={agentProfile || {}}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            isOpen={isOpen}
            handleClick={handleClick}
            mute={true}
            showEmoji={false}
        />
    </div>
}

export default connectStateProps(ChatSystem)