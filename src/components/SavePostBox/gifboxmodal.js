import { Image, Input, Tooltip, Upload } from 'antd';
import React, { Component } from 'react';

const { Dragger } = Upload;
const { TextArea } = Input;

class GifBox extends Component {
    render() {
        return (
            <div className="upload-image">
                <Dragger className="upload" {...this.props.customprops}>
                    <span className="sharebox-icons gif-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Gif</p>
                </Dragger>
                <div className="mb-16 upload-preview">
                    <Image src="https://i.gifer.com/UZYD.gif" />
                    <a class="item-close">
                        <Tooltip title="Remove">
                            <span className="close-icon"></span>
                        </Tooltip>
                    </a>
                </div>
                <div className="title-img">
                    <TextArea
                        placeholder="Title of the Gif here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
                <div className="caption-image">
                    <TextArea
                        placeholder="Add a caption of Gif, if you like"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default GifBox;