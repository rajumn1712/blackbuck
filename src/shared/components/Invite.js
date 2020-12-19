import React, { Component } from 'react';
import { Card, Avatar, Button, Empty } from 'antd'
import notify from './notification';
import { getUserInvitations, acceptDeclineInvitations } from '../api/apiServer';
import { profileSuccess } from '../../reducers/auth';
import { connect } from 'react-redux';

class Invite extends Component {
    state = {
        invitations: [],
    }
    componentDidMount() {
        this.getUserInvites();
    }
    getUserInvites = () => {
        getUserInvitations(this.props.profile?.Id,1,0).then(res => {
            this.setState({ invitations: res.data?.length > 0 ? res.data : [] })
        });
    }
    acceptInvite = (type, obj) => {
        const object = {
            "GroupId": obj.GroupId,
            "Type": type,
            "UserDetials": {
                "UserId": this.props?.profile?.Id,
                "Firstname": this.props?.profile?.FirstName,
                "Lastname": this.props?.profile?.LastName,
                "Image": this.props?.profile?.ProfilePic,
                "Email": this.props?.profile?.Email
            }
        }
        acceptDeclineInvitations(object).then(res => {
            if (type == 'accept') {
                this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
                this.props.upadateProfile(this.props.profile)
            }
            this.getUserInvites();
            notify({ placement: 'bottomLeft', message: 'Invite', description: `Request ${type} successfully.` });
        });
    }
    render() {
        let { invitations } = this.state;
        return (
            <div className="invite-card">
                <Card title="Invite" bordered={true}>
                    {
                        invitations.length > 0 && <div>
                            <Avatar.Group>
                                <Avatar src={this.props?.profile?.ProfilePic}></Avatar>
                                <Avatar src={invitations[0]?.Image} />
                            </Avatar.Group>
                            <p><span>{invitations[0]?.InviterName}</span> was invited you to join in <span className="text-color invite-grp-name">{invitations[0]?.GroupName}</span> group</p>
                            <div className="invite-btn">
                                <Button className="mr-16" type="primary" onClick={() => this.acceptInvite('accept', invitations[0])}>Accept</Button>
                                <Button type="danger" onClick={() => this.acceptInvite('decline', invitations[0])}>Decline</Button>
                            </div>
                        </div>
                    }
                    {
                        invitations.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
const mapDispatchToProps = dispatch => {
    return {
        upadateProfile: (info) => { dispatch(profileSuccess(info)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Invite);