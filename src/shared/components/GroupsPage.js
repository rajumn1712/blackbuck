import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography } from 'antd'
import { store } from '../../store'
import connectStateProps from '../stateConnect';
import { getGroups } from '../api/usergroupsApi'
const { Meta } = Card;
class GroupsPage extends Component {
    componentDidMount() {
        getGroups(this.props?.profile?.Id, 5, 0)
            .then(res => {
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
                <Row gutter={24} className="mb-16">

                    {Groups.map((group, index) => {
                        return <Col className="" span={12}>
                            <Card key={index}
                                cover={<img src={group.image} />} actions={[
                                    <a className="list-link f-14">Leave Group</a>
                                ]}
                            >
                                <Meta title="CSC Champs"
                                    description={<div>{group.name}
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


                </Row>
            </div>


        )
    }
}
export default connectStateProps(GroupsPage);