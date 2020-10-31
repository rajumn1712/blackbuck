import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Layout, Menu, Space, Row, Col } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import ShareBox from '../components/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';

class Home extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div className="main">
                <Row gutter={16} justify="center">
                    <Col span={5} className="">
                            <Identity />
                            <Invite />
                        </Col>
                    <Col span={10} className=""><ShareBox /></Col>
                    <Col span={5} className=""><div className="bg-white"></div></Col>
                </Row>

            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
export default connect(mapStateToProps)(Home)