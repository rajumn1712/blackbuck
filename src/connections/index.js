import React, { Component } from 'react';
import { connect } from 'react-redux';
import Friends from "../components/friends";
import { Row, Col, Affix } from 'antd';
import Ads from '../components/ads';

class Connection extends Component {
    componentDidMount() {
    }
    render() {
        if (!this.props.user || this.props.user.expired) {
            return null
        }
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={16} lg={18} xl={17} xxl={17}>
                        <Friends />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={7} xxl={7}>
                        <Affix offsetTop={86} >
                            <Ads />
                        </Affix>
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user }
}
export default connect(mapStateToProps)(Connection)