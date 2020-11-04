import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, List, message, Spin } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import GroupImage from '../styles/images/groupimage.png';
import GroupImage1 from '../styles/images/groupimage1.png';
import GroupImage2 from '../styles/images/groupimage2.png';
import { userLogout } from '../reducers/auth';
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const { Header } = Layout;
const { Meta } = Card;
class GroupCard extends Component {
    state = {
        data: [{ id: "1" }],
        loading: false,
        hasMore: true,
    };
    handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    };
    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="right-rail group-card">
                <Card size="small" title="Groups" extra={<a href="#">View all</a>} >
                    <div className="reight-rail">
                        <List
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar src={GroupImage} />
                                        }
                                        title="IT Group"
                                        description={<div className="f-10"><span>156 Members</span> | <span>14 Posts</span></div>}
                                    />
                                    <div className="link-color"><a href="#">Send Request</a></div>
                                </List.Item>
                            )}
                        >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                        <List
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar src={GroupImage1} />
                                        }
                                        title="IT Group"
                                        description={<div className="f-10"><span>2K Members</span> | <span>245 Posts</span></div>}
                                    />
                                    <div className="link-color"><a href="#">Join Group</a></div>
                                </List.Item>
                            )}
                        >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                        <List
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar src={GroupImage2} />
                                        }
                                        title="IT Group"
                                        description={<div className="f-10"><span>954 Members</span> | <span>55 Posts</span> </div>}
                                        
                                    />
                                    <div className="link-color"><a href="#">Join Group</a></div>
                                </List.Item>
                            )}
                        >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                    </div>

                    <div className="m-16 text-center">
                        <Button type="primary">Create a Group</Button>
                    </div>

                </Card>

            </div>
        )
    }

}
export default GroupCard;