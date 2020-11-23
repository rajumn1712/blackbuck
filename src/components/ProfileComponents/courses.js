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
        courses:this.props.courses
    }

    handleCourseJoin = ()=>{
        notify({ placement: 'bottom', message: 'Courses', description: 'Course joined' });
    }

    render() {
        const { user } = store.getState().oidc;

        const {courses} = this.state;
        return (
            <div className="custom-card">
                <Card title="Courses" bordered={false} extra={<Link to="">View all</Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={courses}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.Logo} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.CourseName}</span></div>}
                                    description={<div><span style={{color:'var(--textprimary)'}}>{item.Members}</span> Members | <span style={{color:'var(--textprimary)'}}>{item.Posts}</span> posts</div>}
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