import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import { fetchUserFriends } from '../api/apiServer';
import { connect } from 'react-redux';
class FriendsRequestsCard extends Component {
    state = {
        lstFriendsRequests: [
        ]
    }
    componentDidMount() {
        fetchUserFriends(this.props?.profile?.Id)
            .then(res => {
                const lstFriendsRequests = [];
                this.setState({ lstFriendsRequests: lstFriendsRequests });
            })
    }
    render() {
        const { user } = store.getState().oidc;
        const { lstFriendsRequests } = this.state;
        return (
            <div className="custom-card">
                <Card title="Friend Requests" bordered={false} extra={<a className="f-14 list-link">View all</a>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={lstFriendsRequests}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Mutual Friends</div>}
                                />
                                <a className="f-14 list-link" >Accept</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
 }
export default connect(mapStateToProps)(FriendsRequestsCard);