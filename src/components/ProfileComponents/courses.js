import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import notify from '../../shared/components/notification';

class Courses extends Component {

    state={
        courses:[

            {
                avatar: User1,
                title: 'Civil Engineering',
                members: 32,
                posts: 18,
            },
            {
                avatar: User2,
                title: 'Artificial Intelligence',
                members: 150,
                posts: 35,
        
            },
        
            {
                avatar: User3,
                title: 'ECE',
                members: 31,
                posts: 6,
        
            },
            {
                avatar: User4,
                title: 'Computer Science',
                members: 18,
                posts: 2,
        
            },
        ]
    }

    handleCourseJoin = ()=>{
        notify({ placement: 'bottom', message: 'Courses', description: 'Course joined' });
    }

    render() {
        const { user } = store.getState().oidc;

        const data = [...this.state.courses];
        return (
            <div className="custom-card">
                <Card title="Courses" bordered={false} extra={<Link to="">View all</Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{color:'var(--textprimary)'}}>{item.members}</span> Members | <span style={{color:'var(--textprimary)'}}>{item.posts}</span> posts</div>}
                                />
                                <Link className="f-12 list-link" onClick={this.handleCourseJoin}>Join</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Courses;