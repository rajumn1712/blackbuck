import React, { Component } from 'react';
import { message, Typography } from 'antd';
import { apiClient } from '../api/clients';
import notify from './notification';
import { getFriendSuggestions, sendFirendRequest } from '../api/apiServer';
import { Link } from 'react-router-dom'
import connectStateProps from '../stateConnect';
const { Title, Paragraph } = Typography;
class FriendSuggestions extends Component {
    state = {
        friends: []
    }
    addFriend = async (friend) => {
        const obj = {
            "UserId": this.props?.profile?.Id,
            "Firstname": this.props?.profile?.FirstName,
            "Lastname": this.props?.profile?.LastName,
            "Image": null,
            "Email": this.props?.profile?.Email,
            "Type": "request"
        }
        sendFirendRequest(friend.UserId, obj).then(() => {
            message.success("Request sent");
            this.removeSuggestion(friend)
        })
    }
    componentDidMount() {
        this.loadSuggestions();
    }
    async loadSuggestions() {
        const response = await getFriendSuggestions(this.props?.profile?.Id, 1, 5);
        if (response.ok) {
            this.setState({ ...this.state, friends: response.data });
        }
    }
    removeSuggestion = (friend) => {
        let { friends } = this.state;
        friends = friends.filter(item => item.UserId !== friend.UserId);
        this.setState({ friends })
    }
    goToFriendsSuggestions = () => {

    }
    render() {
        const { friends } = this.state;
        if(!friends||friends.length===0){return null;}
        return (
            <div>
                <div className="friends-thead">
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><div className="link-color"><Link to="/commingsoon" className="link-color">View all</Link></div>
                </div>
                <div className="friends">
                    {friends.map((friend, index) => {
                        return <div className="friends-list">
                            <img src={friend.Image} width="100%" height="100%" />
                            <div className="friends-list--name">
                                <Paragraph>{friend.FirstName}</Paragraph>
                                <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                            </div>
                            <a className="addfrnd-btn" onClick={() => this.addFriend(friend)}>
                                <span className="post-icons addfriend-icon mr-0"></span>
                            </a>
                            <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                        </div>
                    })
                    }
                    {friends.length > 4 && <Link to="/commingsoon" className="more-frnd-btn" onClick={() => this.goToFriendsSuggestions()}><span className="icon right-arrow mr-0"></span></Link>}
                </div>
            </div>
        )
    }
}
export default connectStateProps(FriendSuggestions);