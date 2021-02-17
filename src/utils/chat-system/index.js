import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
import firebase from '../firebase';
import { sendNotification } from '../../shared/api/apiServer';
import { SendMessage, GetMessges } from '../../db/db';
const db = firebase.firestore();
const ChatSystem = ({ profile, agentProfile, isOpen, handleClick }) => {
    const [messageList, setMessageList] = useState([]);
    const _onMessageWasSent = (message) => {
        SendMessage({ agentProfile, profile, message });
        sendNotification({ to: agentProfile?.UserId, message: "You have new message from " + profile?.FirstName + " " + profile?.LastName, from: profile?.Id, type: "chat" })
    }
    useEffect(() => {
        if (agentProfile) {
            const unsubscribe = GetMessges.doc(profile?.Id).collection("messages")
                .orderBy("createdAt", "desc")
                .where("user_id", "==", agentProfile?.UserId)
                .limit(100)
                .onSnapshot(querySnapShot => {
                    const data = querySnapShot.docs.map(doc => {
                        const _item = doc.data();
                        return { data: { text: _item.message }, author: _item.userCreated === profile?.Id ? "me" : "them", type: _item.type || "text", createdAt: _item.createdAt }
                    });
                    setMessageList(data.sort((a, b) => a.createdAt - b.createdAt));
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