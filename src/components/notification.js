import { Affix, Col, Row, List, Tabs, Button, message } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { Component } from 'react';
import { connect } from "react-redux";
import Moment from "react-moment";
import {
    getNotifications,
    acceptFrienRequest,
    acceptDeclineInvitations,
    readNotification
} from "../shared/api/apiServer";
import notify from '../shared/components/notification';
import { Link, withRouter } from 'react-router-dom';
import { profileSuccess } from "../reducers/auth";
import defaultUser from '../styles/images/defaultuser.jpg';
const { TabPane } = Tabs;

class Notifications extends Component {
    state = {
        data: [],
        typeData: [],
        loading: true,
        loadMore: true,
        page: 1,
        pageSize: this.props.type?20:5,
    };

    componentDidMount() {
        if (this.props.onRef)
            this.props.onRef(this)
        this.getAllNotifications();
        window.addEventListener("scroll", this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
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
        if (this.state.loadMore && !this.state.loading) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getAllNotifications();
            });
        }
    }
    getAllNotifications = () => {
        getNotifications(this.props?.profile.Id,this.state.pageSize,(this.state.pageSize*this.state.page-this.state.pageSize)).then(res => {
            let {data}=this.state;
            this.setState({ ...this.state, data: data.concat(res.data), loading: false ,loadMore: res.data.length === this.state.pageSize}, () => { this.changeTab("1") });
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
                readNotification(friend.NotificationId);
                this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
                this.props.updateProfile(this.props.profile);
                this.updateNotifications(friend);
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
                readNotification(friend.NotificationId);
                this.updateNotifications(friend);
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
                readNotification(friend.NotificationId);
                this.updateNotifications(friend);
                this.props.updateProfile(this.props.profile);
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
                readNotification(friend.NotificationId);
                this.updateNotifications(friend);
                this.props.updateProfile(this.props.profile);
                message.success("Action Success");
            });
        }
    };
    updateNotifications = (item) => {
        let { typeData } = this.state;
        typeData = typeData.filter(obj => obj != item);
        this.setState({ ...this.state, typeData });
    }
    changeTab = (index) => {
        let type = index == "1" ? "Invitations" : (index == "2" ? "Friends" : "Comment");
        let { data, typeData } = this.state;
        // typeData = data?.filter(item => item.Type == type);
        typeData = data;
        this.setState({ ...this.state, typeData });
    }
    getTitle = (item) => {
        const messages = {
            Invitations: <div className="noti-text"><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId} onClick={()=>readNotification(item.NotificationId)}>{item.Firstname}</Link> <span className="fw-400">sent you a invitation to join in</span> {<Link to={"/groupview/" + item.PostId}><b>{item.Name || "Group"}</b></Link>}</div>,
            Friends: <div className="noti-text"><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId} onClick={()=>readNotification(item.NotificationId)}>{item.Firstname}</Link> <span className="fw-400">sent you a friend request</span></div>,
            Comment: <div className="noti-text"><Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId} onClick={()=>readNotification(item.NotificationId)}>{item.Firstname}</Link> <span className="fw-400">commented on your post</span>  <Link to={"/post/" + item.PostId} onClick={()=>readNotification(item.NotificationId)}>{`"${item.Comment}"`}</Link> </div>
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
                        avatar={<Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}><Avatar src={item.Image || defaultUser} /></Link>}
                        title={<>{this.getTitle(item)}</>}
                        description={ <div>{item.CreatedDate && <div> <Moment fromNow>{item.CreatedDate}</Moment></div>}
                       
                        {this.props.type  && <div className="noti-button">
                        {(item.Type == "Invitations" || item.Type == "Friends") && <span className="f-14 mr-16 semibold text-primarygreen cursor-pointer" onClick={() => this.handleAccept(item)}>Accept</span>}
                        {(item.Type == "Invitations" || item.Type == "Friends") && <span className="f-14 semibold text-red cursor-pointer" onClick={() => this.handleRemove(item)}>Remove</span>}
                        </div>}
                    </div>}

                    />
                    {!this.props.type  && <div className="noti-button">
                        {(item.Type == "Invitations" || item.Type == "Friends") && <span className="f-14 mr-16 semibold text-primarygreen cursor-pointer" onClick={() => this.handleAccept(item)}>Accept</span>}
                        {(item.Type == "Invitations" || item.Type == "Friends") && <span className="f-14 semibold text-red cursor-pointer" onClick={() => this.handleRemove(item)}>Remove</span>}
                    </div>}
                </List.Item>


            )}
        />

    }

    render() {
        return <>
           {this.props.type && <Row className="noti-dropdown m-0" gutter={16}>
                <Col className="noti-dropdown p-0" xs={24} sm={24} md={24} lg={24} xl={24}>
                    {this.renderNotifications()}

                </Col>
            </Row>
    }
            {!this.props.type && <Row  gutter={16}>
                <Col className="notification-full" xs={24} sm={24} md={24} lg={24} xl={24}>
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