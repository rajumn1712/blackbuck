import React, { Component } from 'react';
import { Button, Avatar } from 'antd'
import user from '../../../styles/images/user.jpg';
import { apiClient } from '../../api/clients';
import notify from '../notification'
class JoinGroup extends Component {
    state = {
        isShowJoinGroup: true,
        isGroupPost: true,
        avatars: [user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user]
    }
    joinGroup = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            notify({ placement: 'bottomLeft', message: 'Join Group', description: 'Group Joining done successfully' });
        });
    }
    render() {
        const { isShowJoinGroup, isGroupPost, avatars } = this.state;
        return (
            <div>

                <div className="join-grp">
                    {isGroupPost && <Avatar.Group
                        maxCount={4}
                        size="large"
                        popover={false}
                    >
                        {avatars.map((key, index) => {
                            return <Avatar key={index} src={key} />
                        })}
                    </Avatar.Group>
                    }
                    {
                        isShowJoinGroup && <Button type="primary" onClick={() => this.joinGroup()}>Join Group</Button>
                    }
                </div>
            </div>
        )
    }
}
export default JoinGroup;