import React, { Component } from "react";
import { Card, List, Progress } from "antd";
import { Link } from "react-router-dom";
import "../index.css";
import "../App.css";
import { connect } from "react-redux";
import { fetchCourseSuggestions } from "./api";
import Courses from '../components/ProfileComponents/courses';
import Title from "antd/lib/typography/Title";

const { Meta } = Card;
class CourseList extends Component {
  state = {
    suggestions: [],
    loading: true,
    page: 1,
    pageSize: 10
  };
  componentDidMount() {
    this.loadSuggestions();
  }
  loadSuggestions = async () => {
    const response = await fetchCourseSuggestions(
      this.props.profile?.Id,
      this.state.page,
      this.state.pageSize
    );
    if (response.ok) {
      this.setState({
        ...this.state,
        loading: false,
        suggestions: response.data
      });
    }
  };
  render() {
    return (
      <div className="custom-card tag-card">
        <Card className="card-item">
            <Title className="text-primary f-16 semibold mb-8">
              SEO & Digital Marketing
            </Title>
            <div className="addon-info">
              <span className="mr-12 f-12 text-secondary">
                <span className="grp-type-icon video-play" />
                10 Videos
              </span>
              <span className="f-12 text-secondary">
                <span className="grp-type-icon lessons" />5 Lessons
              </span>
            </div>
            <div className="mt-12 progres-bar d-flex">
              <Progress percent={30} /><span className="ml-4"><Link className="card-item-button">Continue</Link></span>
            </div>
        </Card>
        {/* <Card title="Course Suggestions" bordered={false}>
          <List
            itemLayout="vertical"
            dataSource={this.state.suggestions}
            renderItem={item => (
              <div className="tag-name">
                <Link to="/coursecontent">{item.name}</Link>
              </div>
            )}
          />
        </Card> */}
         <Courses loadUserCourse={false} />
      </div>
    );
  }
}

const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseList);