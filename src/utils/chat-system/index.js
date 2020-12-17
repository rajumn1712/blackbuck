import React, { useEffect, useState } from 'react'
import connectStateProps from '../../shared/stateConnect'
import { Launcher } from 'react-chat-window'
import './chat.css'
const ChatSystem = ({ profile, agentProfile, isOpen, handleClick }) => {
    const [messageList, setMessageList] = useState([]);
    const _onMessageWasSent = (message) => {
        setMessageList([...messageList, { ...message }])
    }
    const _sendMessage = (text) => {
        if (text.length > 0) {
            this.setState({
                messageList: [...this.state.messageList, {
                    author: 'them',
                    type: 'text',
                    data: { text }
                }]
            })
        }
    }
    useEffect(() => {
        
    }, [])
    return <div>
        <Launcher
            agentProfile={agentProfile}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            showEmoji
            isOpen={isOpen}
            handleClick={handleClick}
        />
    </div>
}

export default connectStateProps(ChatSystem)