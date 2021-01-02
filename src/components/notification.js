import { Affix, Col, Row, List, Tabs, Button, message } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { Component } from 'react';
import { connect } from "react-redux";
import Moment from "react-moment";
import {
    getNotifications,
    acceptFrienRequest,
    acceptDeclineInvitations
} from "../shared/api/apiServer";
import notify from '../components/notification';
import { Link, withRouter } from 'react-router-dom';
import { profileSuccess } from "../reducers/auth";
const { TabPane } = Tabs;

class Notifications extends Component {
    state = {
        data: [],
        typeData: [],
        loading: true
    };

    componentDidMount() {
        if (this.props.onRef)
            this.props.onRef(this)
        this.getAllNotifications();
    }
    getAllNotifications = () => {
        getNotifications(this.props?.profile.Id).then(res => {
            this.setState({ ...this.state, data: res.data, loading: false }, () => { this.changeTab("1") });
        });
    }
    handleAccept = async (friend) => {
        if (friend.Type == "Invitations") {
            const object = {
                "GroupId": friend.PostId,
                "Type": "accept",
                "UserDetials": {
                    "UserId": this.props?.profile?.Id,
                    "Firstname": this.props?.profile?.FirstName,
                    "Lastname": this.props?.profile?.LastName,
                    "Image": this.props?.profile?.ProfilePic,
                    "Email": this.props?.profile?.Email
                }
            }
            acceptDeclineInvitations(object).then(res => {
                this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
                this.props.updateProfile(this.props.profile);
                this.getAllNotifications();
                notify({ placement: 'bottomLeft', message: 'Invite', description: `Request accepted successfully.` });
            });
        }
        else {
            const obj = {
                UserId: this.props?.profile?.Id,
                Firstname: this.props?.profile?.FirstName,
                Lastname: this.props?.profile?.LastName,
                Image: this.props?.profile?.ProfilePic,
                Email: this.props?.profile?.Email,
                Type: "accept",
                CreatedDate: new Date(),
            };
            acceptFrienRequest(
                this.props.profile?.Id,
                friend.UserId,
                "accept",
                obj
            ).then(() => {
                message.success("Action Success");
                this.getAllNotifications();
                this.props.profile.Friends = this.props.profile.Friends
                    ? this.props.profile.Friends + 1
                    : 1;
                this.props.updateProfile(this.props.profile);
            });
        }
    };

    handleRemove = (friend) => {
        if (friend.Type == "Invitations") {
            const object = {
                "GroupId": friend.PostId,
                "Type": "decline",
                "UserDetials": {
                    "UserId": this.props?.profile?.Id,
                    "Firstname": this.props?.profile?.FirstName,
                    "Lastname": this.props?.profile?.LastName,
                    "Image": this.props?.profile?.ProfilePic,
                    "Email": this.props?.profile?.Email
                }
            }
            acceptDeclineInvitations(object).then(res => {
                this.getAllNotifications();
                notify({ placement: 'bottomLeft', message: 'Invite', description: `Request declined successfully.` });
            });
        }
        else {
            const obj = {
                UserId: this.props?.profile?.Id,
                Firstname: this.props?.profile?.FirstName,
                Lastname: this.props?.profile?.LastName,
                Image: null,
                Email: this.props?.profile?.Email,
                Type: "decline",
            };
            acceptFrienRequest(
                this.props.profile?.Id,
                friend.UserId,
                "decline",
                obj
            ).then(() => {
                this.getAllNotifications();
                message.success("Action Success");
            });
        }
    };
    changeTab = (index) => {
        let type = index == "1" ? "Invitations" : (index == "2" ? "Friends" : "Comment");
        let { data, typeData } = this.state;
        // typeData = data?.filter(item => item.Type == type);
        typeData = data;
        this.setState({ ...this.state, typeData });
    }
    getTitle = (item) => {
        const messages = {
            Invitations: <><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}>{item.Firstname}</Link> sent you a invitation to join in {<Link to={"/groupview/" + item.PostId}><b>{item.Name || "Group"}</b></Link>}</>,
            Friends: <><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}>{item.Firstname}</Link> sent you a friend request </>,
            Comment: <><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}>{item.Firstname}</Link> commented on your post <Link to={"/post/" + item.PostId}>{`"${item.Comment}"`}</Link> </>
        }
        return messages[item.Type]
    }
    renderNotifications = () => {
        return <List
            className="notifications"
            itemLayout="horizontal"
            dataSource={this.state.typeData}
            bordered={true}
            split={true}
            loading={this.state.loading}
            renderItem={item => (
                <List.Item
                    className="read"
                >
                    <List.Item.Meta
                        avatar={<Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}><Avatar src={item.Image} /></Link>}
                        title={<>{this.getTitle(item)}</>}
                        description={item.CreatedDate ? <Moment fromNow>{item.CreatedDate}</Moment> : ''
                        }

                    />
                    <div>
                        {(item.Type == "Invitations" || item.Type == "Friends") && <a className="f-14 mr-16 semibold text-primary" onClick={() => this.handleAccept(item)}>Accept</a>}
                        {item.Type == "Invitations" || item.Type == "Friends" && <span className="f-14 semibold text-red" onClick={() => this.handleRemove(item)}>Remove</span>}
                    </div>
                </List.Item>


            )}
        />

    }

    render() {
        return <>
           {this.props.type && <Row className="noti-dropdown" gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {this.renderNotifications()}

                </Col>
            </Row>
    }
            {!this.props.type && <Row  gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {this.renderNotifications()}

                </Col>
            </Row>
    }
        </>
    }
}

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (info) => {
            dispatch(profileSuccess(info));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Notifications));