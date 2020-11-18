import React, { Component } from 'react';
import { Card, Tag, Input, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import { userLogout } from '../reducers/auth';
import '../../index.css';
import '../../App.css';
import CommonModal from './CommonModal';

class Hobbies extends Component {
    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Hobbies" className="hobbies-card" bordered={false} extra={<Link onClick={this.showModal}><span className="icons edit" /></Link>} >
                    <Tag className="tags">Playing Cricket</Tag>
                    <Tag className="tags">Reading Books</Tag>
                    <Tag className="tags">Watching Movies</Tag>
                </Card>
                <CommonModal visible={this.state.visible} title="Hobbies" cancel={this.handleCancel} saved={this.handleOk}>
                <Input
                        className="custom-input"
                        placeholder="Enter Here"
                        suffix={
                            <Tooltip title="Close">
                                <span className="icons close" />
                            </Tooltip>
                        }
                    />
                    <Input
                        className="custom-input"
                        placeholder="Enter here"
                        suffix={
                            <Tooltip title="Add">
                                <span className="icons add" />
                            </Tooltip>
                        }
                    />
                </CommonModal>
            </div>
        )
    }
}
export default Hobbies;