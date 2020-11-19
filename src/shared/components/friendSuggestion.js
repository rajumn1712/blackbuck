import React, { Component } from 'react';
import { Typography, UserAddOutlined } from 'antd';
import user from '../../styles/images/user.jpg';
import userImage from '../../styles/images/user_image.jpg';
import user_Image from '../../styles/images/user-image.jpg';
import { apiClient } from '../api/clients';
import notify from './notification';


const { Title, Paragraph, Link } = Typography;
class FriendSuggestions extends Component {
    state = {
        friends: [{
            Name: 'kumar', Dept: 'IT', user: user
        }, {
            Name: 'sindhu', Dept: 'ECE', user: userImage
        }
            , {
            Name: 'mounika', Dept: 'LTE', user: user_Image
        },
            , {
            Name: 'Lakshmi', Dept: 'RTE', user: user
        }
            , {
            Name: 'venkat', Dept: 'PTC', user: user_Image
        }]
    }
    addFriend = () => {
    }
    removeSuggestion = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            notify({ placement: 'topRight', message: 'Remove Suggestion', description: 'Suggestion removed successfully.' });
        });
    }
    goToFriendsSuggestions = () => {
    }
    render() {
        const { friends } = this.state;
        return (
            <div>
                <div className="friends-thead">
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><div className="link-color"><a href="" className="link-color">View all</a></div>
                </div>
                <div className="friends">
                    {friends.map((friend, index) => {
                        return<div className="friends-list">
                            <img src={friend.user} width="100%" height="100%" />
                            <div className="friends-list--name">
                                <Paragraph>{friend.Name}</Paragraph>
                                <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                            </div>
                            <a className="addfrnd-btn" onClick={() => this.addFriend()}>
                                <span className="post-icons addfriend-icon mr-0"></span>
                            </a>
                            <a className="removefrnd-btn" onClick={() => this.removeSuggestion()}></a>
                        </div>
                    })
                    }
                    {friends.length > 4 && <a className="more-frnd-btn" onClick={() => this.goToFriendsSuggestions()}><span className="icon right-arrow mr-0"></span></a>}
                </div>
            </div>
        )
    }
}
export default FriendSuggestions;