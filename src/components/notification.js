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
const { TabPane } = Tabs;

const data = [
    {
        avatar: avatar,
        title: 'Vin Diesel commented on your post',
        timestamp: 'a min ago',
    },
    {
        avatar: avatar2,
        title: 'Shrelyn mentioned you in the timeline.',
        timestamp: '15 min ago'
    },
    {
        avatar: userImage,
        title: 'Andrew sent you a friend request.',
        timestamp: '1 hour ago'
    },
    {
        avatar: user_Image,
        title: 'Simon added a new photo.',
        timestamp: 'a day ago'
    },
    {
        avatar: defaultUser,
        title: 'Andrew sent you a Group Invite.',
        timestamp: '2 days ago'
    },
    {
        avatar: avatar,
        title: 'Vin Diesel shared his story.',
        timestamp: '1 week ago'
    },
    {
        avatar: userImage,
        title: 'Andrew sent you a friend request.',
        timestamp: '1 month ago'
    },
    {
        avatar: defaultUser,
        title: 'Simon added a new photo.',
        timestamp: 'last year'
    },
];

class Notifications extends Component {
    state = {
        data: [],
        typeData: []
    };
    componentDidMount() {
        getNotifications(this.props?.profile.Id).then(res => {
            this.setState({ ...this.state, data: res.data });
        });
    }
    changeTab = (index) => {
        let type = index == "1" ? "Invitations" : (index == "2" ? "Friends" : "Comment");
        let { data, typeData } = this.state;
        typeData = data?.filter(item => item.Type == type);

    }
    getTitle = (item) => {
        item.title = item.Type == "Invitations" ? (`${item.Firstname} sent you a Group Invite.`) : (item.Type == "Friends" ? (`${item.Firstname} sent you a friend request`) : (`${item.Firstname} commented on your post`))
    }
    render() {
        const { typeData } = this.state;
        return <>
            <Tabs defaultActiveKey="1" onChange={(index) => this.changeTab(index)}>
                <TabPane tab="Invitations" className="m-0" key="1">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Requests" className="m-0" key="2">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Comments" className="m-0" key="3">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
            <Row gutter={16} className="mb-8">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <List
                        className="notifications"
                        itemLayout="horizontal"
                        dataSource={typeData}
                        bordered={true}
                        split={true}

                        renderItem={item => (
                            <List.Item
                                className="unread"
                                actions={[<a key="list-loadmore-edit"><span className="post-icons h-more-icon"></span></a>]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.Image} />}
                                    title={() => this.getTitle(item)}
                                    description={item.CreatedDate ? <Moment fromNow>{item.CreatedDate}</Moment> : ''}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                {/* <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
                    <Affix offsetTop={86} >
                        <Ads />
                    </Affix>
                </Col> */}
            </Row>
        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile };
};

export default connect(mapStateToProps)(Notifications);