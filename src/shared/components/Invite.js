import React, { Component } from 'react';
import { Card, Avatar, Button } from 'antd'
import notify from './notification';
import { apiClient } from '../api/clients'
class Invite extends Component {
    state = {
        invite: {},
    }
    componentDidMount() {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            // this.setState({ invite: res.data });
        });
    }
    acceptInvite = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            this.setState({ invite: res.data })
            notify({ placement: 'bottomLeft', message: 'Invite', description: 'Request accepted successfully.' });
        });
    }
    declineInvite = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            this.setState({ invite: res.data })
            notify({ placement: 'bottomLeft', message: 'Invite', description: 'Request declined successfully.' });
        });
    }
    render() {
        let { invite } = this.state;
        let keys = Object.keys(invite);
        return (
            <div className="invite-card">
                <Card title="Invite" bordered={false}>
                    {
                        keys.length > 0 && <div>
                            <Avatar.Group>
                                <Avatar src={invite.Avatar1}></Avatar>
                                <Avatar src={invite.Avatar2} />
                            </Avatar.Group>
                            <p><span>{invite.inviter}</span> was invited to join in <span className="text-color invite-grp-name">{invite.Group}</span> group</p>
                            <div className="invite-btn">
                                <Button className="mr-16" type="primary" onClick={() => this.acceptInvite()}>Accept</Button>
                                <Button type="danger" onClick={() => this.declineInvite()}>Decline</Button>
                            </div>
                        </div>
                    }
                    {
                        keys.length == 0 && <p>No data</p>
                    }
                </Card>
            </div>
        )
    }
}

export default Invite;