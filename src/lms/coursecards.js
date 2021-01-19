import { Card, Col, Row, Statistic, Progress, Tabs, Button, Empty } from "antd";
import React, { Component } from "react";
import photography from '../styles/images/photography.png'
import SEO from '../styles/images/seo-marketing.png'
import Blogging from '../styles/images/blogging-content.png'
import { Link } from "react-router-dom";
import { fetchUserCourses } from "./api";
import { connect } from "react-redux";
import ShowMoreText from "react-show-more-text";
import Loader from "../common/loader";

const { Meta } = Card;
const { TabPane } = Tabs;

class CourseCards extends Component {
    state = {
        courses: [],
        recentCourses: [],
        loading: true,
        page: 1,
        pageSize: 50
    }
    componentDidMount() {
        this.loadCourses("1");
    }
    loadCourses = async (key) => {
        key = key == "1" ? "courses" : "recentCourses";
        const _emptyKey = key == "1" ? "recentCourses" : "courses";
        this.setState({ ...this.state, [_emptyKey]: [], loading: true });
        const response = await fetchUserCourses(this.props.profile.Id, this.state.page, this.state.pageSize, key);
        if (response.ok) {
            this.setState({ ...this.state, [key]: response.data, loading: false });
        } else {
            this.setState({ ...this.state, loading: false });
        }
    }
    renderCard = (card, key) => {

    }
    render() {

        return (

            <div className="custom-card">
                <Tabs defaultActiveKey="1" className="profile-tabs" onTabClick={(key) => { this.loadCourses(key) }}>
                    <TabPane tab="My Courses" key="1" >

                        <Card

                            bordered={false}
                        >
                            <div className="p-12">
                                <Row gutter={16}>
                                    {this.state.courses?.map((course, indx) => <Col key={indx} xs={24} md={12} lg={8}>
                                        <Card
                                            className="card-item card-height"
                                            cover={<img alt="photography" src={course.image || photography} />}
                                        >
                                            <Meta
                                                title={<Link to={"course/" + course.id}>{course.name}</Link>}
                                                description={
                                                    <div>
                                                        <ShowMoreText lines={4}>
                                                            {course.description}
                                                        </ShowMoreText>
                                                        <div className="addon-info">
                                                            <span className="mr-8"><span className="grp-type-icon video-play" />10 Videos</span>
                                                            <span className="mr-8"><span className="grp-type-icon lessons" />5 Lessons</span>
                                                        </div>
                                                    </div>} />
                                        </Card>
                                    </Col>)}
                                </Row>
                            </div>

                        </Card>
                        {this.state.loading && <Loader className="loader-middle" />}
                        {!this.state.loading && this.state.courses.length === 0 && this.state.recentCourses.length === 0 && <Empty />}
                    </TabPane>
                    <TabPane tab="Recent Uploads" key="2">
                        <Card

                            bordered={false}
                        >
                            <div className="p-12">
                                <Row gutter={16}>
                                    {this.state.recentCourses?.map((course, indx) => <Col key={indx} xs={24} md={12} lg={8}>
                                        <Card
                                            className="card-item card-height"
                                            cover={<img alt="photography" src={course.image || photography} />}
                                            actions={[
                                                // <Button>Join Course</Button>
                                            ]}
                                        >
                                            <Meta
                                                title={<Link to={"course/" + course.id}>{course.name}</Link>}
                                                description={
                                                    <div>
                                                        <ShowMoreText lines={4}>
                                                            {course.description}
                                                        </ShowMoreText>
                                                        <div className="addon-info">
                                                            <span className="mr-8"><span className="grp-type-icon video-play" />10 Videos</span>
                                                            <span className="mr-8"><span className="grp-type-icon lessons" />5 Lessons</span>
                                                        </div>
                                                    </div>} />
                                        </Card>
                                    </Col>)}
                                </Row>
                            </div>
                            {this.state.loading && <Loader className="loader-middle" />}
                            {!this.state.loading && this.state.courses.length === 0 && this.state.recentCourses.length === 0 && <Empty />}
                        </Card>
                    </TabPane>
                </Tabs>

            </div>


        );
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseCards);