import React, { Component } from 'react';
import { Card, Col, Row, Typography, Space, Spin, Empty } from 'antd'
import { store } from '../../store'
import Computer from '../../styles/images/computer.jpg';
import {getGroups} from '../../shared/api/usergroupsApi';
import _ from 'lodash';
import '../../index.css';
import '../../App.css';
import { connect } from 'react-redux';
const { Meta } = Card;


class GroupsPage extends Component {

    state = {
        usergroups:{},
        allGroups:[],
        loading:true,
        page: 1,
        pageSize: 5
    }

    async componentDidMount() {
        this.setState({ ...this.state, loading: true })
        const groups = await getGroups(this.props?.profile?.Id, this.state.page, this.state.pageSize);
        if (groups.ok) {
            const allgroups = groups.data;
            const grouped = _.groupBy(groups.data, group => group.type);
           this.setState({ ...this.state, loading: false, usergroups: grouped,allGroups:allgroups })
        }
     }

    render() {
        const { user } = store.getState().oidc;
        return <>
            {this.state.loading&&<Space size="middle"><Spin size="large"/></Space>}
            
            {this.state.allGroups && <div className="group-page" >
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
            </div>}
            {(!this.state.allGroups || this.state.allGroups?.length == 0) && <Empty />}

        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
 }

export default connect(mapStateToProps)(GroupsPage);