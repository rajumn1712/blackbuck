import React, { Component } from 'react';
import { Card, List, Progress } from 'antd'
import { Link } from 'react-router-dom';
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import { fetchCourseSuggestions } from './api';
const data = [
    { title: 'This is panel header 1' },
    { title: 'This is panel header 2' },
    { title: 'This is panel header 3' },
    { title: 'This is panel header 4' },
    { title: 'This is panel header 5' }
];
const { Meta } = Card;
class CourseList extends Component {
    state = {
        suggestions: [],
        loading: true,
        page: 1,
        pageSize: 10
    }
    componentDidMount() {
        this.loadSuggestions();
    }
    loadSuggestions = async() => {
        const response = await fetchCourseSuggestions(this.props.profile?.Id, this.state.page, this.state.pageSize);
        if(response.ok){
            this.setState({...this.state,loading:false,suggestions:response.data});
        }
    }
    render() {
        return (
            <div className="custom-card tag-card">

                <Card
                    className="card-item" actions={[
                        <Link className="card-item-button">Continue</Link>
                    ]}>
                    <Meta
                        title="SEO & Digital Marketing"
                        description={
                            <div>

                                <div className="addon-info">
                                    <span className="mr-8"><span className="grp-type-icon video-play" />10 Videos</span>
                                    <span className="mr-8"><span className="grp-type-icon lessons" />5 Lessons</span>
                                </div>
                                <div className="my-16 progres-bar"><Progress percent={30} /></div>
                            </div>} />
                </Card>

                <Card title="Course Suggestions" bordered={false} >
                    <List
                        itemLayout="vertical"
                        dataSource={this.state.suggestions}
                        renderItem={item => (
                            <div className="tag-name"><Link to="/coursecontent">{item.name}</Link></div>

                        )}
                    />
                </Card>
            </div>

        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
};
export default connect(mapStateToProps)(CourseList);