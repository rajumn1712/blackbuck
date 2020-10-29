import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Input } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import Logo from '../styles/images/logo.svg';

const { Search } = Input;
const { Header } = Layout;
const onSearch = value => console.log(value);

class HeaderComponent extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <Header className="main-header">
                <Row>
                    <Col span={8} className="left-block">
                        <div className="logo" >
                            <img src={Logo} alt="" width="50px" />
                        </div>
                        <Search
                            className="header-searchbar"
                            placeholder="Search"
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 300, margin: '0 10px' }}
                        />
                    </Col>
                    <Col span={8} justify="center">
                        <Menu style={{ background: 'transparent', textAlign: 'center' }} mode="horizontal" defaultSelectedKeys={['home']} title="Blackbuck">
                            <Menu.Item key=""><Link to="/"><i className="icons home-icon"></i>
                            </Link></Menu.Item>
                            <Menu.Item key="about"><Link to="/about"><i className="icons social-icon"></i></Link></Menu.Item>
                            <Menu.Item key="contact"><Link to="/contact"><i className="icons suitcase-icon"></i></Link></Menu.Item>
                            <Menu.Item key="posts"><Link to="/posts"><i className="icons lms-icon"></i></Link></Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={8}>
                        <Menu style={{ background: 'transparent', textAlign: 'end' }} mode="horizontal" title="Blackbuck">
                            <Menu.Item key=""><Link to="/"><i className="icons chat-icon"></i></Link></Menu.Item>
                            <Menu.Item key="about"><Link to="/about"><i className="icons notification-icon"></i></Link></Menu.Item>
                            {user && <Menu.Item key="logout"> <Button onClick={() => { store.dispatch(userLogout()); userManager.signoutRedirect() }}>Logout</Button></Menu.Item>}
                        </Menu>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default HeaderComponent;