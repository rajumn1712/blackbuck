import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, List, message, Spin, Divider } from 'antd'
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
            <div className="reight-rail group-card">
                <Card  title="Groups" extra={<a href="#">View all</a>} >
                        <List 
                            dataSource={this.state.data} 
                            renderItem={item => (
                                <List.Item key={item.id} actions={[<a className="link-color" key="list-loadmore-more">Join Group</a>]}>
                                    <List.Item.Meta 
                                        avatar={<Avatar className="mt-4" src={GroupImage} /> }
                                        title={<div>IT Group<span className="icons-small lock-icon"></span></div>}
                                        description={<div className="f-12 text-overflow text-hash"><span className="fw-400">156</span> Members | <span className="fw-400">14</span> Posts</div>}
                                    />
                                </List.Item>   
                        )} >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                        <List
                            dataSource={this.state.data}
                            renderItem={item => ( 
                                <List.Item key={item.id}  actions={[<a className="link-color" key="list-loadmore-more">Join Group</a>]}> 
                                    <List.Item.Meta
                                        avatar={<Avatar src={GroupImage1} /> }
                                        title=" Walkina"
                                        description={<div className="f-12 text-overflow text-hash"><span className="fw-400">2K</span> Members | <span className="fw-400">245</span> Posts</div>}
                                    />
                                </List.Item>
                            )} >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List> 
                        
                        <List
                            dataSource={this.state.data}
                            renderItem={item => ( 
                                <List.Item key={item.id} actions={[<a className="link-color" key="list-loadmore-more">Join Group</a>]}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={GroupImage2} /> }
                                        title="CSC Champs" 
                                        description={<div className="f-12 text-overflow text-hash"><span className="fw-400">954</span> Members | <span className="fw-400">55</span> Posts </div> } 
                                    />  
                                </List.Item>
                            )} >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                        <List
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item key={item.id}  actions={[<a className="link-color" key="list-loadmore-more">Join Group</a>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={GroupImage1} /> }
                                        title="IT Group"
                                        description={<div className="f-12 text-overflow text-hash"><span className="fw-400">2K</span> Members | <span className="fw-400">245 </span>Posts</div>}
                                    />
                                    
                                    
                                </List.Item>
                            )} >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>

                    <div className="m-16 text-center">
                        <Button type="primary">Create a Group</Button>
                    </div>

                </Card>

            </div>
        )
    }
}
export default GroupCard;