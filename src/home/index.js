import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tag } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Identity from '../components/identity';
import Invite from '../shared/components/Invite';
import Tags from '../components/ProfileComponents/tags';
import Ads from '../components/ads';
import FriendSuggestions from '../shared/components/friendSuggestion';
import PostCard from '../components/postcard/Post';
import Groups from '../shared/components/Groups';
import Postings from '../shared/postings';
import { Redirect, Route, Switch } from 'react-router-dom';
import SavedPostsComponent from '../shared/postings/savedPosts';
import CommingSoon from '../components/comingsoon';
const PostingsComponent = () => {
    return <Postings sharebox={true} friendsSuggestions={true} postingsType="all" />
}
class Home extends Component {
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
                        <Identity />
                        <Invite />
                        <Tags />
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
                        <Switch >
                            <Route path="/newsfeed" component={PostingsComponent} />
                            <Route path="/savedposts" component={SavedPostsComponent}/>
                            {/* <Route path="/notifications" component={()=><CommingSoon />}/> */}
                            <Redirect path="" to="/newsfeed" />
                        </Switch>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
                        <Groups />
                        <Ads />
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user }
}
export default connect(mapStateToProps)(Home)