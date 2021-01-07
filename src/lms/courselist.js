import React, { Component } from 'react';
import { Card, List, Row, Col, Progress } from 'antd'
import { Link } from 'react-router-dom';
import { fetchTags } from '../shared/api/apiServer';
import CourseContent from '../lms/coursecontent'
import SEO from '../styles/images/seo-marketing.png'
import '../index.css';
import '../App.css';
const data = [
    { title: 'This is panel header 1' },
    { title: 'This is panel header 2' },
    { title: 'This is panel header 3' },
    { title: 'This is panel header 4' },
    { title: 'This is panel header 5' }
];
const { Meta } = Card;
class CourseList extends Component {
    render() {
        return (
            <div className="custom-card tag-card">

                <Card
                    className="card-item"  actions={[
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

                <Card title="Course List" bordered={false} >
                    <List
                        itemLayout="vertical"
                        dataSource={data}
                        renderItem={item => (
                            <div className="tag-name"><Link to="/coursecontent">{item.title}</Link></div>

                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default CourseList;