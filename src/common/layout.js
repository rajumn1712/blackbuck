import React, { Component } from 'react';
import HeaderComponent from './header';
import { Layout, Breadcrumb } from 'antd';
import Router from '../components/route.component';
const { Footer, Content } = Layout;
class LayoutComponent extends Component {
    render() {

        return (
            <Layout className="layout">
                <HeaderComponent />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content"><Router /></div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Balckbuck ©2020 </Footer>
            </Layout>
        )
    }
}

export default LayoutComponent;