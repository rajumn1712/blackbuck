import React, { Component } from 'react';
import { Card, Avatar, Col, Row, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import connectStateProps from '../stateConnect';
import { fetchUserGroups } from '../api/apiServer'
const { Meta } = Card;
class GroupsPage extends Component {
    state = {
        Groups: [],
        page: 1,
        pageSize: 20,
        loading: true,
        loadMore: true,
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.getGroups();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }
    getGroups() {
        this.setState({ ...this.state, loading: true });
        fetchUserGroups((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.pageSize, (this.state.page * this.state.pageSize - this.state.pageSize))
            .then(res => {
                if (res.ok) {
                    let { Groups } = this.state;
                    Groups= Groups.concat(res.data)
                    this.setState({ ...this.state, loading: false, Groups: Groups, loadMore: res.data.length === this.state.pageSize })
                }
            })
    }
    handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {

        }
    }
    loadMore(e) {
        if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getGroups();
            })
        }
    }
    render() {
        const { user } = store.getState().oidc;
        const { Groups } = this.state;
        return (
            <div className="group-page p-16" >
                <Row gutter={16} className="">
                    {Groups.length > 0 && Groups?.map((group, index) => {
                        return <Col className="mb-16" md={12} lg={6}>
                            <Card key={index}
                                cover={<img className="obj-fit" src={group.image} />} actions={[
                                    <Link className="list-link f-14" to="/commingsoon">Leave Group</Link>
                                ]}
                            >
                                <Meta title={<Link to="/commingsoon" className="post-title">{group.name}</Link>}
                                    description={<div>
                                        <div className="d-flex align-items-center">
                                            <span className="list-request">
                                                <Avatar.Group
                                                    maxCount={4}
                                                    size="large"
                                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                                >
                                                    {group.mutulFnds?.map((friend, index) => {
                                                        return <Avatar key={index} src={friend.image} />
                                                    })
                                                    }
                                                </Avatar.Group>
                                            </span>
                                            {group.mutulFnds && <span><span>{group.MutualFriends.length}</span>Mutual Friends</span>}

                                        </div>
                                    </div>}
                                />
                            </Card>
                        </Col>
                    })
                    }
                    {Groups.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

                    }


                </Row>
            </div>


        )
    }
}
export default connectStateProps(GroupsPage);