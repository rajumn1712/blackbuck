import React, { Component } from 'react';
import { Card, List } from 'antd'
import { Link } from 'react-router-dom';
import { fetchTags } from '../shared/api/apiServer';
import '../index.css';
import '../App.css';
const data = [
    { title: 'IPL' },
    { title: 'COVID-19' },
    { title: 'HBD@PK' },
    { title: 'RRRMovie' },
    { title: 'IPL 2020' }
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