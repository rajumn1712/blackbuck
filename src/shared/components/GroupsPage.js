import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography ,Empty} from 'antd'
import { store } from '../../store'
import connectStateProps from '../stateConnect';
import { getGroups } from '../api/usergroupsApi'
const { Meta } = Card;
class GroupsPage extends Component {
    componentDidMount() {
        getGroups((this.props.userId?this.props.userId:(this.props?.profile?.Id)),1,4)
            .then(res => {
                debugger;
                const Groups = res.data;
                this.setState({ Groups: Groups });
            })
    }

    state = {
        Groups: [],
    }
    render() {
        const { user } = store.getState().oidc;
        const { Groups } = this.state;
        return (
            <div className="group-page" >
                <Row gutter={16} className="">
                    {Groups.length>0 && Groups?.map((group, index) => {
                        return <Col className="mb-16" md={12} lg={6}>
                            <Card key={index}
                                cover={<img src={group.image} />} actions={[
                                    <a className="list-link f-14" href="/commingsoon">Leave Group</a>
                                ]}
                            >
                                <Meta title={<a href="/commingsoon" className="post-title">{group.name}</a>}
                                    description={<div>
                                        <div className="d-flex align-items-center">
                                            <span className="list-request">
                                                <Avatar.Group
                                                    maxCount={4}
                                                    size="large"
                                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                                >
                                                    {group.mutulFnds?.map((friend, index) => {
                                                        return <Avatar key={index} src={friend} />
                                                    })
                                                    }
                                                </Avatar.Group>
                                            </span>
                                            {group.mutulFnds && <span>Mutual Friends</span>}

                                        </div>
                                    </div>}
                                />
                            </Card>
                        </Col>
                    })
                    }
                    {Groups.length==0 && <Empty ></Empty>

                    }


                </Row>
            </div>


        )
    }
}
export default connectStateProps(GroupsPage);