import React, { Component } from 'react';
import { Menu, Card, Select, Input, Row, Col, DatePicker, Button, Empty } from 'antd';
import { Link, withRouter } from "react-router-dom";
import Title from 'antd/lib/typography/Title';
import notify from '../../shared/components/notification';
import { getGroups, courseDelete } from "../../shared/api/apiServer";
import { connect } from "react-redux";
import moment from "moment";
import defaultguser from "../../styles/images/default-cover.png";
const { Meta } = Card;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Courses extends Component {
    state = {
        lstCourses: [],
        page: 1,
        pageSize: 20,
        loading: false,
        loadMore: true,
    }
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        this.getGroups();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    deleteCourse = (course) => {
        courseDelete(course.Id).then((res) => {
            if (res.ok) {
                notify({
                    description: "Course deleted successfully",
                    message: "Delete",
                });
                let { lstCourses } = this.state;
                lstCourses = lstCourses.filter(item => { return item.Id != course.Id });
                this.setState({
                    ...this.state,
                    loading: false,
                    lstCourses: lstCourses,
                });
            }
        });
    }
    handleScroll = () => {
        const windowHeight =
            "innerHeight" in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {
        }
    };
    loadMore(e) {
        if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getGroups();
            });
        }
    }
    getGroups(type) {
        this.setState({ ...this.state, loading: true });
        getGroups(
            this.props.userId ? this.props.userId : this.props?.profile?.Id,
            this.state.pageSize,
            this.state.page * this.state.pageSize - this.state.pageSize
        ).then((res) => {
            if (res.ok) {
                let { lstCourses } = this.state;
                if (type !== 'Update')
                    lstCourses = lstCourses.concat(res.data);
                else
                    for (var i in res.data) {
                        for (var j in lstCourses) {
                            if (lstCourses[j].id == res.data[i].id) {
                                lstCourses[j] = res.data[i];
                            }
                        }
                    }
                this.setState({
                    ...this.state,
                    loading: false,
                    lstCourses: lstCourses,
                    loadMore: res.data.length === this.state.pageSize,
                });
            }
        });
    }
    render() {
        const { lstCourses } = this.state;
        return <>
            <div className="d-flex">
                <div>
                    <Title className="f-18 text-primary semibold">Courses</Title>
                    <div className="custom-card">
                        <Card className="p-12 custom-fields">
                            <Row gutter={16} align="middle">
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                    <Input placeholder="Course Name" />
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                    <Select allowClear placeholder="Choose Group">
                                        <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                                        <Option value="Chemical Engineering">Chemical Engineering</Option>
                                        <Option value="Information Technology">Information Technology</Option>
                                        <Option value="Civil Engineering">Civil Engineering</Option>
                                        <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                                        <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                                    </Select>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                    <RangePicker placeholder={['From Date', 'To Date']} />
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                    <Button type="primary">Search</Button>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div className="custom-card">
                        <Card >
                            <div className="p-12">

                                <Row gutter={16}>
                                    <Col xs={24} md={10} lg={6}>
                                        {lstCourses.map((course, index) => {
                                            return <Card key={index}
                                                className="card-item"
                                                cover={<img alt="photography" src={course.Image || defaultguser} />}
                                                actions={[
                                                    <Link className="text-red card-item-button-red" onClick={() => this.deleteCourse(course)}>Delete</Link>
                                                ]}
                                            >
                                                <Meta
                                                    title={<div onClick={this.props.onCourseEdit()}>{course.CourseName}</div>}
                                                    description={
                                                        <div className="addon-info">
                                                            {course.Members && <span className="mr-8"><span className="grp-type-icon video-play" />{course.Members} Members</span>}
                                                            {course.Date && <div>Date: <span>{moment(course.Date).format('ll')}</span></div>}
                                                        </div>} />
                                            </Card>
                                        })
                                        }
                                    </Col>
                                    {
                                        lstCourses.length == 0 &&
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>

                                    }
                                </Row>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile, user: oidc.user };
};
export default connect(mapStateToProps)(withRouter(Courses));