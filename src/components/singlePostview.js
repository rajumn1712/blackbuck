import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Affix } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Identity from '../components/identity';
import Invite from '../shared/components/Invite';
import Tags from '../components/ProfileComponents/tags';
import Ads from '../components/ads';
import FriendSuggestions from '../shared/components/friendSuggestion';
import Groups from '../shared/components/Groups';
import Postings from '../shared/postings';
import { Redirect, Route, Switch } from 'react-router-dom';
import SavedPostsComponent from '../shared/postings/savedPosts';

class SinglePostView extends Component {
    componentDidMount() {
    }
    render() {
        if (!this.props.user || this.props.user.expired) {
            return null
        }
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>
                        <div className="singlepostid">
                            <Identity />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
                        <Postings
                            postingsType="user"
                            sharebox={false}
                            userId={this.props.match.params.userId}
                            key={this.props.match.params.userId}
                            postActions={false}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
                        <Affix offsetTop={86} >
                            <Ads />
                        </Affix>
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user }
}
export default connect(mapStateToProps)(SinglePostView)