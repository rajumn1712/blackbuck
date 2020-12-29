import React, { Component } from 'react';
import { Card, Avatar, Button, Empty, Row, Col } from 'antd'
import notify from './notification';
import { getUserInvitations, acceptDeclineInvitations } from '../api/apiServer';
import { profileSuccess } from '../../reducers/auth';
import { connect } from 'react-redux';
import defaultUser from "../../styles/images/defaultuser.jpg";
import { Link } from 'react-router-dom';

class Invite extends Component {
    state = {
        invitations: [],
        loadMore: true,
        pageSize: 20,
        page: 1
    }
    componentDidMount() {
        if (this.props.displayas)
            window.addEventListener("scroll", this.handleScroll);
        this.getUserInvites();
    }
    componentWillUnmount() {
        if (this.props.displayas)
            window.removeEventListener("scroll", this.handleScroll);
    }
    getUserInvites = () => {
        getUserInvitations(this.props.profile?.Id, this.props.displayas ? this.state.pageSize : 1, this.props.displayas ? (this.state.page * this.state.pageSize - this.state.pageSize) : 0).then(res => {
            if (!this.props.displayas)
                this.setState({ invitations: res.data?.length > 0 ? res.data : [] })
            else {
                let { invitations } = this.state;
                invitations = invitations.concat(res.data?.length > 0 ? res.data : []);
                this.setState({ invitations: invitations, loadMore: res.data.length === this.state.pageSize, })
            }
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
            if (!this.props.displayas)
                this.getUserInvites();
            else
                this.updateInvitations(object);
            notify({ placement: 'bottomLeft', message: 'Invite', description: `Request ${type} successfully.` });
        });
    }
    updateInvitations = (item) => {
        let { invitations } = this.state;
        invitations = invitations.filter(ite => item.GroupId !== ite.GroupId);
        this.setState({ ...this.state, invitations });
    }

    handleScroll = () => {
        const windowHeight =
            "innerHeight" in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {
        }
    };
    loadMore(e) {
        if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getUserInvites();
            });
        }
    }
    render() {
        let { invitations } = this.state;
        return this.props.displayas ? (<div className="group-page p-12">
            <Row gutter={16}>
                {invitations.map((invitation, index) => {
                    return <Col md={24} lg={8} xl={8} xxl={6} key={index} className="mb-8">
                        <div className="invite-card"><Card bordered={true}>
                            <div>
                                <Avatar.Group>
                                    <Avatar src={this.props?.profile?.ProfilePic || defaultUser}></Avatar>
                                    <Avatar src={invitation?.Image || defaultUser} />
                                </Avatar.Group>
                                <p className="f-14"><span className="text-primary semibold">{invitation?.InviterName}</span> invited you to join in <span className="text-color invite-grp-name text-primary"><Link to={"/groupview/" + invitation.GroupId}>{invitation?.GroupName}</Link></span> group</p>
                                <div className="invite-btn">
                                    <Button className="mr-8" type="primary" onClick={() => this.acceptInvite('accept', invitation)}>Accept</Button>
                                    <Button type="danger" onClick={() => this.acceptInvite('decline', invitation)}>Decline</Button>
                                </div>
                            </div>


                        </Card>
                        </div>
                    </Col>
                })}
                {invitations.length == 0 &&
                    <Card>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                }
            </Row>
        </div>) : (
                <div className="invite-card">
                    <Card title="Invite" bordered={true}>
                        {
                            invitations.length > 0 && <div>
                                <Avatar.Group>
                                    <Avatar src={this.props?.profile?.ProfilePic || defaultUser}></Avatar>
                                    <Avatar src={invitations[0]?.Image || defaultUser} />
                                </Avatar.Group>
                                <p><span>{invitations[0]?.InviterName}</span> invited you to join in <span className="text-color invite-grp-name">{invitations[0]?.GroupName}</span> group</p>
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