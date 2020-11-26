import React, { Component } from 'react';
import { Typography } from 'antd';
import { apiClient } from '../api/clients';
import notify from './notification';
import { getFriendSuggestions } from '../api/apiServer';
import {Link} from 'react-router-dom'
import connectStateProps from '../stateConnect';
const { Title, Paragraph } = Typography;
class FriendSuggestions extends Component {
    state = {
        friends: []
    }
    addFriend = () => {
    }
    async componentDidMount() {
        const response = await getFriendSuggestions(this.props?.profile?.id, 1, 5);
        if (response.ok) {
            this.setState({ ...this.state, friends: response.data });
        }
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
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><div className="link-color"><Link to="/commingsoon" className="link-color">View all</Link></div>
                </div>
                <div className="friends">
                    {friends.map((friend, index) => {
                        return <div className="friends-list">
                            <img src={friend.Image} width="100%" height="100%" />
                            <div className="friends-list--name">
                                <Paragraph>{friend.Firstname}</Paragraph>
                                <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                            </div>
                            <a className="addfrnd-btn" onClick={() => this.addFriend()}>
                                <span className="post-icons addfriend-icon mr-0"></span>
                            </a>
                            {/* <a className="removefrnd-btn" onClick={() => this.removeSuggestion()}></a> */}
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