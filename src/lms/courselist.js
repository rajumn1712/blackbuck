import React, { Component } from "react";
import { Card, Empty, List, Progress,Tooltip } from "antd";
import { Link } from "react-router-dom";
import "../index.css";
import "../App.css";
import { connect } from "react-redux";
import { fetchCourseSuggestions, userRecentWatchedCourse } from "./api";
import Courses from '../components/ProfileComponents/courses';
import Title from "antd/lib/typography/Title";

const { Meta } = Card;
class CourseList extends Component {
  state = {
    suggestions: [],
    recentList:{},
    loading: true,
    page: 1,
    pageSize: 10
  };
  componentDidMount() {
    this.loadUserRecentCourse();
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
  loadUserRecentCourse = async ()=>{
    const response = await userRecentWatchedCourse(this.props.profile?.Id)
    if(response.ok){
      this.setState({...this.state,recentList:response.data})
    }
  }
  render() {
    const {recentList} = this.state
    return (
      <div className="custom-card tag-card">
        {recentList.length > 0 && <Card className="card-item">
            <Title className="text-primary f-16 semibold mb-8">
              {recentList[0].name}
            </Title>
            <div className="addon-info">
              <span className="mr-12 f-12 text-secondary">
                <span className="grp-type-icon lessons" />
                {recentList[0].sections} Sections
              </span>
              <span className="f-12 text-secondary">
                <span className="grp-type-icon video-play" />
                {recentList[0].videos} {`${recentList[0].videos === '1' ? 'Video' : 'Videos'}`}
              </span>
            </div>
            <div className="mt-12 progres-bar d-flex">
              <Progress percent={Math.floor(recentList[0].Percentage)} /><span className="ml-4"><Link to={"course/" + recentList[0].id} className="card-item-button"><Tooltip placement="topRight" title="Continue"><span className="playicons continue-icon"></span></Tooltip></Link></span>
            </div>
        </Card>}                
         <Courses loadUserCourse={false} isDataReferesh={this.props.isDataReferesh}/>
      </div>
    );
  }
}

const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseList);