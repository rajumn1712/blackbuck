import React, { Component } from 'react';
import Video from '../../styles/images/video.mp4';
import { Input, Tooltip, Upload } from 'antd';



const { Dragger } = Upload;
const { TextArea } = Input;

class VideoBox extends Component {
    render() {
        return (
            <div className="upload-image">
                <Dragger className="upload" {...this.props.customprops}>
                    <span className="sharebox-icons video-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                </Dragger>
                <div className="mb-16 upload-preview">
                    <video width="100%" controls>
                        <source src={Video} />
                    </video>
                    <a class="item-close">
                        <Tooltip title="Remove">
                            <span className="close-icon"></span>
                        </Tooltip>
                    </a>
                </div>
                <div className="title-img">
                    <TextArea
                        placeholder="Title of the video here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
                <div className="caption-image">
                    <TextArea
                        placeholder="Add a caption of video, if you like"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default VideoBox;