import React, { Component } from 'react';
import { Button, Layout, Menu, Space } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
const { Header } = Layout;

class HeaderComponent extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <Header style={{ paddingLeft: 300 }}>

                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']} title="Blackbuck">
                    <Menu.Item key=""><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="about"><Link to="/about">About</Link></Menu.Item>
                    <Menu.Item key="contact"><Link to="/contact">Contact</Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts">Posts</Link></Menu.Item>
                    {user && <Menu.Item key="logout"> <Button onClick={() => { store.dispatch(userLogout()); userManager.signoutRedirect() }}>Logout</Button></Menu.Item>}
                </Menu>

            </Header>
        )
    }
}

export default HeaderComponent;