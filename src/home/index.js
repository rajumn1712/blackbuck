import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Affix } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Identity from '../components/identity';
import Invite from '../shared/components/Invite';
import Tags from '../components/ProfileComponents/tags';
import Ads from '../components/ads';
import Groups from '../shared/components/Groups';
import Postings from '../shared/postings';
import { Redirect, Route, Switch } from 'react-router-dom';
import SavedPostsComponent from '../shared/postings/savedPosts';
import FriendSuggestion from '../shared/components/friendSuggestion';
const PostingsComponent = ({ sharebox, friendsSuggestions, postingsType, ...rest }) => {
    return <Postings sharebox={sharebox} friendsSuggestions={friendsSuggestions} postingsType={postingsType} {...rest} />
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
                        <Affix offsetTop={86}>
                            <Tags />
                            <Invite />
                        </Affix>
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={12}>
                        <Switch >
                            <Route path="/newsfeed" render={(props) => { return <PostingsComponent sharebox={true} friendsSuggestions={true} postingsType={"all"} {...props} /> }} />
                            <Route path="/savedposts" component={SavedPostsComponent} />
                            <Route path="/friendsuggestions" component={FriendSuggestion}/>
                            <Route path="/search/:key/:type" render={(props) => {
                                return <PostingsComponent sharebox={false} friendsSuggestions={false} postingsType={"search"} {...props} />
                            }} />
                            {/* <Route path="/notifications" component={()=><CommingSoon />}/> */}
                            <Redirect path="" to="/newsfeed" />
                        </Switch>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
                        <Groups />
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
export default connect(mapStateToProps)(Home)