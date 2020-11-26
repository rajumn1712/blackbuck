import React, { Component } from 'react';
import { Card, Avatar, List, message } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
// import user from '../styles/images/user.jpg';
// import { userLogout } from '../reducers/auth';
import '../../index.css';
import '../../App.css';
import notify from '../../shared/components/notification';
import { acceptFrienRequest, fetchFriendRequests } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';

class FriendRequests extends Component {

    state = {
        friendRequests: []
    }
    componentDidMount() {
        this.loadRequests();
    }
    async loadRequests() {
        const requests = await fetchFriendRequests(this.props.profile?.Id);
        if (requests.ok) {
            this.setState({ friendRequests: requests.data })
        }
    }
    handleAccept = async (friend) => {
        acceptFrienRequest(this.props.profile?.Id, friend.id, "accept").then(() => {
            message.success("Action Success");
            this.loadRequests();
        })
    }

    handleRemove = (friend) => {
        acceptFrienRequest(this.props.profile?.Id, friend.id, "decline").then(() => {
            message.success("Action Success");
            this.loadRequests();
        })
    }

    render() {
        const { user } = store.getState().oidc;
        const data = [...this.state.friendRequests];

        return (
            <div className="custom-card requests">
                <Card title="Friend Requests" bordered={false} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className="request-image" src={item.image || "https://via.placeholder.com/150"} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.firstName}</span></div>}
                                    description={<div className="mt-8 d-flex align-items-center">
                                        <span className="list-request">
                                            <Avatar.Group
                                                maxCount={4}
                                                size="large"
                                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                            >
                                                {item?.members?.map((member, index) => {
                                                    return <Avatar src='' key={index} style={{ backgroundColor: (member.avatar ? '' : '#f56a00') }}>
                                                        {member.avatar ? null : member.initial}
                                                    </Avatar>
                                                })}
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div>}
                                />
                                <Link className="f-14 mr-16 list-link" onClick={() => this.handleAccept(item)}>Accept</Link>
                                <Link className="f-14 ml-16 list-remove" onClick={(index) => this.handleRemove(item)}>Remove</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default connectStateProps(FriendRequests);