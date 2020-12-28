import React, { Component } from 'react';
import HeaderComponent from './header';
import { Layout } from 'antd';
import Router from '../components/route.component';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
const { Footer, Content } = Layout;
class LayoutComponent extends Component {
    state = {
        className: 'container'
    }
    componentDidUpdate(prevProps) {
        if (this.props.location != prevProps.location) {
            const className = window.location.href.indexOf('admin') > -1 ? 'admin-panel' : 'container';
            this.setState({ className })
        }
    }
    componentDidMount() {
        const className = window.location.href.indexOf('admin') > -1 ? 'admin-panel' : 'container';
        this.setState({ className });
    }
    render() {

        return (
            <Layout className="layout">
                <HeaderComponent />
                <Content >
                    <div className="site-layout-content">
                        <div className={this.state.className}><Router /></div>
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}>Balckbuck ©2020 </Footer> */}
            </Layout>
        )
    }
}

export default withRouter(LayoutComponent);