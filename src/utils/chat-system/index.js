import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
import firebase from '../firebase';
import { cloudMessaging } from '../../shared/api/clients';
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
        cloudMessaging.post("fcm/send", {
            // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            data: {
                title: message.data.text,
                image: profile?.ProfilePic,
                message: profile?.FirstName + " " + profile?.LastName
            },
            to: "duQMBVfCbG4zmQwGiDaN4A:APA91bFkmeyrwyjP3xh-hc4TwW_aAWSaxLYmsTpGGe3HQlkKtu0WwT76aqTfOCrqbzS2x0xUGyk78v2ZQxW2N1Ahh_Z8eyKJb1X1gnUKepFo2Lw9vQsJiAxhT1sfJkhoenPa5Rj0kV-F"
            // from: profile?.Id
        }).then(res => {
            debugger
        }).catch(err => {
            debugger
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
            agentProfile={agentProfile || {}}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            isOpen={isOpen}
            handleClick={handleClick}
            mute={true}
        />
    </div>
}

export default connectStateProps(ChatSystem)