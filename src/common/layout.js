import React, { Component } from 'react';
import HeaderComponent from './header';
import { Layout } from 'antd';
import Router from '../components/route.component';
const { Footer, Content } = Layout;
class LayoutComponent extends Component {
    render() {

        return (
            <Layout className="layout">
                <HeaderComponent />
                <Content >
                    <div className="site-layout-content">
                        <div className="container"><Router /></div>
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}>Balckbuck ©2020 </Footer> */}
            </Layout>
        )
    }
}

export default LayoutComponent;