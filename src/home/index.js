import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Identity from '../components/identity';
import Invite from '../shared/components/Invite';
import Ads from '../components/ads';
import FriendSuggestions from '../shared/components/friendSuggestion';
import PostCard from '../components/postcard/Post';
import Groups from '../shared/components/Groups';
import Postings from '../shared/postings';

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
                        <Postings sharebox={true} friendsSuggestions={true} postingsType="all"/>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Groups />
                        <Ads />
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
export default connect(mapStateToProps)(Home)