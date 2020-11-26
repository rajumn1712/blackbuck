import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography, Space, Spin } from 'antd'
// import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
import Computer from '../../styles/images/computer.jpg';
import {getGroups} from '../../shared/api/usergroupsApi';
import _ from 'lodash';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import { connect } from 'react-redux';
const { Meta } = Card;
const data = [
    { avatar: Computer }
];
const { Title } = Typography;
class GroupsPage extends Component {

    state = {
        usergroups:{},
        loading:true,
        page: 1,
        pageSize: 10
    }

    async componentDidMount() {
        this.setState({ ...this.state, loading: true })
        const groups = await getGroups(4, 1, 5);
        if (groups.ok) {
            const grouped = _.groupBy(groups.data, group => group.type);
           this.setState({ ...this.state, loading: false, usergroups: grouped })
        }
     }

    render() {
        const { user } = store.getState().oidc;
        return <>
            {this.state.loading&&<Space size="middle"><Spin size="large"/></Space>}
            
            <div className="group-page" >
                {Object.keys(this.state.usergroups).map(usergroup=>{
                    return <Row gutter={24} className="mb-16">
                        { this.state.usergroups[usergroup].map((group,indx)=>{
                            return <Col className="" span={12} key={indx}>
                        <Card
                            cover={<img src={group.image} />} actions={[
                                <a className="list-link f-14">Leave Group</a>
                            ]}
                        >
                            <Meta title=""
                                description={<div>{group.name}
                                <div className="d-flex align-items-center">
                                        {/* <span className="list-request">
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
                                        </span>  */}
                                        <span>Mutual Friends</span></div>
                                         </div>}
                            />
                        </Card>
                    </Col>
})}
                </Row>
                })}
                {/* <Row gutter={24} className="mb-16">
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Leave Group</a>
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
                </Row>
                <div className="f-16"><Title level={5}>Entertainment</Title></div>
                <Row gutter={24}>
                    <Col className="" span={12}>
                        <Card
                            cover={<img src={Computer} />} actions={[
                                <a className="list-link f-14">Leave Group</a>
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
                                <a className="list-link f-14">Leave Group</a>
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
                </Row> */}
            </div>


        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
 }

export default connect(mapStateToProps)(GroupsPage);