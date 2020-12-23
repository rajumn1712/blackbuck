import React, { Component } from 'react';
import { Card, List } from 'antd'
import { Link } from 'react-router-dom';
import { fetchTags } from '../../shared/api/apiServer';
import '../../index.css';
import '../../App.css';
const data = [
    { title: '#IPL' },
    { title: '#COVID-19' },
    { title: '#HBD@PK' },
    { title: '#RRRMovie' },
    { title: '#IPL 2020' }
];
class FriendRequests extends Component {
    componentDidMount() {
        fetchTags(10, 0).then(res => {
            const { tags } = this.state;
            res.data.forEach(item => {
                if (Array.isArray(item)) {
                    item.forEach(index => {
                        if (typeof (index) !== 'object')
                            tags.push(index);
                    })
                }
            });
            this.setState({ tags: tags })
        });
    }

    state = {
        tags: []
    }

    render() {

        const { tags } = this.state;
        return (
            <div className="custom-card tag-card">
                <Card title="#Tags" bordered={false} >
                    <List
                        itemLayout="vertical"
                        dataSource={tags?.slice(0, 5)}
                        renderItem={item => (
                            <div className="tag-name"><Link to="/commingsoon">{item}</Link></div>

                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendRequests;