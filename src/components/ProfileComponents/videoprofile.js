import React, { Component } from 'react';
import { Card, Input, Upload, Form } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import Video from '../styles/images/video.mp4';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import '../../styles/theme.css';
import CommonModal from './CommonModal';

const { Dragger } = Upload;
class VideoProfile extends Component {
    state = { 
        videoUrl:'https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4',
        visible: false 
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Video as Profile" className="pfvideocard" cover={<video width="100%" controls src={this.state.videoUrl}>
                </video>} bordered={false} extra={<Link onClick={this.showModal}><span className="icons edit" /></Link>} >
                </Card>
                <CommonModal visible={this.state.visible} title="Internships" cancel={this.handleCancel} saved={this.handleOk}>
                <div className="">
                        <Dragger className="upload mb-16">
                            <span className="sharebox-icons video-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                        </Dragger>
                        <Form layout="vertical" className="mt-16">
                            <Form.Item label="URL" className="custom-fields">
                                <Input />
                            </Form.Item>
                        </Form>
                    </div>
                </CommonModal>
            </div>
        )
    }
}
export default VideoProfile;