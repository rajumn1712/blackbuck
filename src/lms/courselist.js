import React, { Component } from 'react';
import { Card, List } from 'antd'
import { Link } from 'react-router-dom';
import { fetchTags } from '../shared/api/apiServer';
import CourseContent from '../lms/coursecontent'
import '../index.css';
import '../App.css';
const data = [
    { title: 'This is panel header 1' },
    { title: 'This is panel header 2' },
    { title: 'This is panel header 3' },
    { title: 'This is panel header 4' },
    { title: 'This is panel header 5' }
];
class CourseList extends Component {
    render() {
        return (
            <div className="custom-card tag-card">
                <Card title="Course List" bordered={false} >
                    <List
                        itemLayout="vertical"
                        dataSource={data}
                        renderItem={item => (
                            <div className="tag-name"><Link to="/commingsoon">{item.title}</Link></div>

                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default CourseList;