import { Affix, Col, Row, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { Component } from 'react';
import Ads from './ads';
import avatar from '../styles/images/avatar.png';
import avatar2 from '../styles/images/user.jpg';
import userImage from '../styles/images/user_image.jpg';
import user_Image from '../styles/images/user-image.jpg';
import defaultUser from '../styles/images/defaultuser.jpg';

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

    render() {
        return <>
            <Row gutter={16} className="mb-8">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <List
                        className="notifications"
                        itemLayout="horizontal"
                        dataSource={data}
                        bordered={true}
                        split={true}

                        renderItem={item => (
                            <List.Item
                            className="unread"
                            actions={[<a key="list-loadmore-edit"><span className="post-icons h-more-icon"></span></a>]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href="">{item.title}</a>}
                                    description={item.timestamp}
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

export default Notifications;