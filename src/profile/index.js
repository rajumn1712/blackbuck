import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import ShareBox from '../components/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';
import GroupCard from '../components/groupcard';
import Ads from '../components/ads';
import FriendSuggestions from '../components/FriendSuggestions';
import PostCard from '../components/postcard/Post';

class Profile extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <Row gutter={16}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                <Invite />
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                <ShareBox />
                                <PostCard />
                            </Col>
                        </Row>
                        <FriendSuggestions />

                    </Col>
                    <Col xs={24} sm={8} md={8} lg={6} xl={6}>
                        <Ads />
                        <GroupCard />

                    </Col>
                </Row>
            </div>
        )
    }
}

export default Profile;