import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'
import { store } from '../store'
import '../index.css';
import '../App.css';
import connectStateProps from '../shared/stateConnect'
import { fetchUserFriends } from '../shared/api/apiServer';
class Friends extends Component {
    componentDidMount() {
        fetchUserFriends(this.props?.profile?.Id)
            .then(res => {
                const friendsInfo = res.data[0];
                this.setState({ FriendsList: friendsInfo });
            })
    }
    state = {
        FriendsList: [
        ],
    }
    render() {
        const { user } = store.getState().oidc;
        const { FriendsList } = this.state;
        return (
            <div className="custom-card requests">
                <Card title="Friends" bordered={false} >
                    <List grid={{
                        gutter: 16,
                        column: 2,
                        xs: 1,
                        md: 2,
                    }}
                        itemLayout="horizontal"
                        dataSource={FriendsList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className="request-image" src={item.Image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.Firstname}</span></div>}
                                    description={
                                        <div className="mt-8 d-flex align-items-center">
                                            <span className="list-request">
                                                <Avatar.Group
                                                    maxCount={4}
                                                    size="large"
                                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                                >
                                                    {item.mutulFnds?.map((friend, index) => {
                                                        return <Avatar key={index} src={friend} />
                                                    })
                                                    }
                                                </Avatar.Group>
                                            </span>
                                            {item.mutulFnds && <span>Mutual Friends</span>}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default connectStateProps(Friends);