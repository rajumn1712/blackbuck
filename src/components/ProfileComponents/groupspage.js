import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography } from 'antd'
// import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
import Computer from '../../styles/images/computer.jpg';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
const { Meta } = Card;
const data = [
    { avatar: Computer }
];
const { Title } = Typography;
class GroupsPage extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="group-page" >
                <Row gutter={24} className="mb-16">
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Join Group</a>
                            ]}
                        >
                            <Meta title="CSC Champs"
                                description={<div>Created many changes with CBU
                                <div className="d-flex align-items-center">
                                        <span className="list-request">
                                            <Avatar.Group
                                                maxCount={4}
                                                size="large"
                                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                            >
                                                <Avatar src={user} />
                                                <Avatar src={user} />
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div> </div>}
                            />
                        </Card>
                    </Col>
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Join Group</a>
                            ]}>
                            <Meta title="CSC Champs"
                                description={<div>Created many changes with CBU
                                <div className="d-flex align-items-center">
                                        <span className="list-request">
                                            <Avatar.Group
                                                maxCount={4}
                                                size="large"
                                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                            >
                                                <Avatar src={user} />
                                                <Avatar src={user} />
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div> </div>}
                            />
                        </Card>
                    </Col>
                </Row>
                <div className="f-16"><Title level={5}>Entertainment</Title></div>
                <Row gutter={24}>
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Join Group</a>
                            ]}
                        >
                            <Meta title="CSC Champs"
                                description={<div>Created many changes with CBU
                                <div className="d-flex align-items-center">
                                        <span className="list-request">
                                            <Avatar.Group
                                                maxCount={4}
                                                size="large"
                                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                            >
                                                <Avatar src={user} />
                                                <Avatar src={user} />
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div> </div>}
                            />
                        </Card>
                    </Col>
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Join Group</a>
                            ]}>
                            <Meta title="CSC Champs"
                                description={<div>Created many changes with CBU
                                <div className="d-flex align-items-center">
                                        <span className="list-request">
                                            <Avatar.Group
                                                maxCount={4}
                                                size="large"
                                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                            >
                                                <Avatar src={user} />
                                                <Avatar src={user} />
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div> </div>}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>


        )
    }
}
export default GroupsPage;