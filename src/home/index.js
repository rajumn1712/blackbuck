import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Layout, Menu, Space, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store';
import { userLogout } from '../reducers/auth';
import ShareBox from '../components/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';
import GroupCard from '../components/groupcard';
import Ads from '../components/ads';
import FriendSuggestions from '../components/FriendSuggestions';

class Home extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Identity />
                        <Invite />
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={12} xl={12}>
                        <ShareBox />
                        <FriendSuggestions />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}><GroupCard /></Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
export default connect(mapStateToProps)(Home)