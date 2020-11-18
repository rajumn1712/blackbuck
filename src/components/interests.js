import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Input } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';
import Modal from 'antd/lib/modal/Modal';
const { Search } = Input;
const onSearch = value => console.log(value);
const data = [

    {
        avatar: User1,
        title: 'Indian Cricket Team',
        members: 2,
        post:5,
    },
    {
        avatar: User2,
        title: 'Pan India Movies',
        members: 10,
        post:5,
    },

    {
        avatar: User3,
        title: 'Pan India Movies',
        members: 21,
        post:5,
    },
    {
        avatar: User4,
        title: 'Indian Cricket Team',
        members: 3,
        post:5,
    },
];
class Interests extends Component {
    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Interests" bordered={false} extra={<Link onClick={this.showModal}><span className="icons add" /></Link>}  >
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Mutual Friends</div>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                <Modal
                    className="modal-interest"
                    title={<div className="custom-modal-header"><h4>Interests</h4><a onClick={this.handleCancel}><span className="close-icon" /></a></div>}
                    visible={this.state.visible}
                    closable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div className="d-flex justify-content-between">
                        <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                            Close
                        </Button>
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            Save
                        </Button></div>
                    ]}>
                    <div className="modal-search p-16">
                        <Search className="header-searchbar" placeholder="Search Groups / Courses" onSearch={onSearch} />
                    </div>
                    <div className="custom-card p-16 bg-white">
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                        description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Members | <span style={{ color: 'var(--textprimary)' }}>{item.posts}</span> posts</div>}
                                    />
                                    <Link to="" className="f-12 list-link">Interest</Link>
                                    <Link to="" className="f-12 list-link ml-16 text-red">Remove</Link>
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
            </div>

        )
    }
}
export default Interests;