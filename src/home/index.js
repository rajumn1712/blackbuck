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
import Stories from '../shared/components/stories';
import BBScholars from '../shared/components/scholars';
import JobCard from '../careers/jobcard';
import JobDetails from '../careers/jobdetail';
import UpcomingCourses from '../lms/upcomingCourses';
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
                    <Col xs={{ order: 1, span: 24 }} sm={{ order: 1, span: 8 }} lg={6} xl={5} xxl={5} >
                        <div className="xs-none">
                            <Identity />
                        </div>
                        <div className="affix-top xs-none">
                            <Tags />
                            <UpcomingCourses />
                            {/* <Invite /> */}
                        </div>
                    </Col>
                    <Col xs={{ order: 2, span: 24 }} sm={{ order: 2, span: 16 }} lg={12} xl={12} xxl={12}  >
                        <Switch >
                            <Route path="/stories" component={Stories} />
                            <Route path="/newsfeed" render={(props) => { return <PostingsComponent sharebox={true} friendsSuggestions={true} postingsType={"all"} {...props} /> }} />
                            <Route path="/savedposts" component={SavedPostsComponent} />
                            <Route path="/friendsuggestions" component={FriendSuggestion} />
                            <Route path="/scholors" component={BBScholars} />
                            <Route path="/search/:key/:type" render={(props) => {
                                return <PostingsComponent sharebox={false} friendsSuggestions={false} postingsType={"search"} {...props} />
                            }} />
                            {/* <Route path="/jobsearch/:state?/:city?" render={(props) => {
                                return <JobCard postingsType={"jobsearch"} {...props} />
                            }} /> */}
                            <Route path="/savedjobs" render={(props) => {
                                return <JobCard postingsType={"savedjobs"} {...props} />
                            }} />
                            <Route path="/jobdetail/:jobid" component={JobDetails} />
                            {/* <Route path="/notifications" component={()=><CommingSoon />}/> */}
                            <Redirect path="" to="/newsfeed" />
                        </Switch>
                    </Col>
                    <Col xs={{ order: 3, span: 24 }} sm={{ order: 3, span: 24 }} lg={6} xl={7} xxl={7}  >
                        <div className="xs-none">
                            <Groups />
                        </div>
                        <div className="affix-top "><Ads /></div>
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