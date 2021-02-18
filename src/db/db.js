import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/messaging';
const db = firebase.firestore();
const SendMessage = ({ agentProfile, profile, message }) => {
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
}
const addToken = (token, id) => {
    db.collection("devices").doc(id).collection("tokens").add({
        token
    });
}

const GetMessges = db.collection('chat');

export { GetMessges, SendMessage, addToken }