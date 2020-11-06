import React, { Component } from 'react';
import { Typography, Modal } from 'antd';

const { Title, Paragraph, Link } = Typography;
class  Alert extends Component {
    state = { visible: false };
    showAlert = () => {
        this.setState({
            visible: true,
        });
    };

    hideAlert = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        return (
            <div>
                <Modal
                    title="Modal"
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                </Modal>
            </div>
        )
    }
}

export default Alert;