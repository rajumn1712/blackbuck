import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, message, Spin } from 'antd'
import notify from '../notification';
import Video from '../../../styles/images/video.mp4';
class PostVideo extends Component {
    state = {
        data: [
        ],
    };
    render() {
        return (
            <div>
                {<div> <video width="100%" controls src="https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4">
                </video></div>
                }
            </div>

        )
    }
}
export default PostVideo;