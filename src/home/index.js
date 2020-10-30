import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Layout, Menu, Space, Row, Col } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import ShareBox  from '../components/sharebox';
class Home extends Component {
    componentDidMount() {
    }
    render() {
        return (
            
            <div className="container">
                <div className="space"></div>
                <Row>
                    <Col span={6} className="col-wsmall"><div className="bg-white"></div></Col>
                    <Col span={12} className="col-wlarge"><ShareBox/></Col>
                    <Col span={6} className="col-wsmall"><div className="bg-white"></div></Col>
                </Row>

            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
export default connect(mapStateToProps)(Home)