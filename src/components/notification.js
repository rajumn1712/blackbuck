import { Affix, Col, Row, List, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { Component } from 'react';
import Ads from './ads';
import avatar from '../styles/images/avatar.png';
import avatar2 from '../styles/images/user.jpg';
import userImage from '../styles/images/user_image.jpg';
import user_Image from '../styles/images/user-image.jpg';
import defaultUser from '../styles/images/defaultuser.jpg';
import { connect } from "react-redux";
import Moment from "react-moment";
import {
    getNotifications
} from "../shared/api/apiServer";
import { Link } from 'react-router-dom';
const { TabPane } = Tabs;
class Notifications extends Component {
    state = {
        data: [],
        typeData: [],
        loading: true
    };

    componentDidMount() {
        getNotifications(this.props?.profile.Id).then(res => {
            this.setState({ ...this.state, data: res.data, loading: false }, () => { this.changeTab("1") });
        });
    }
    changeTab = (index) => {
        let type = index == "1" ? "Invitations" : (index == "2" ? "Friends" : "Comment");
        let { data, typeData } = this.state;
        typeData = data?.filter(item => item.Type == type);
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
                        description={item.CreatedDate ? <Moment fromNow>{item.CreatedDate}</Moment> : ''}
                    />
                </List.Item>
            )}
        />
    }
    render() {
        return <>
            <Tabs defaultActiveKey="1" onChange={(index) => this.changeTab(index)}>
                <TabPane tab="Invitations" className="m-0" key="1">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {this.renderNotifications()}

                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Requests" className="m-0" key="2">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {this.renderNotifications()}
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Comments" className="m-0" key="3">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {this.renderNotifications()}

                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile };
};

export default connect(mapStateToProps)(Notifications);