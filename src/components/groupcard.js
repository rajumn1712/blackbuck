import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal,Card } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
const { Header } = Layout;
class  GroupCard extends Component {



    render() {
        const { user } = store.getState().oidc;
        return (
            <div>

            </div>


        )
}

}
export default GroupCard;