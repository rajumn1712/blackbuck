import React, { Component } from 'react';
import { Col, Collapse, Row, Card, Button, List, Avatar, Input,Form } from 'antd';
import { Link } from 'react-router-dom';
import { store } from '../store'
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';
import Item from 'antd/lib/list/Item';


const data = [
    {
        title: 'How Blackbuck uses your data',
        description: 'Manage how your data is used and download it anytime',
    },
];
class Settings extends Component {

    render() {

        return (
            <div>
                <Row justify="center">

                    



                </Row>

            </div>


        )
    }
}

export default Settings;