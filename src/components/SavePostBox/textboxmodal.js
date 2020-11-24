import { Input } from 'antd';
import React, { Component } from 'react'

const { TextArea } = Input;

class TextBox extends Component {

    render() {
        return (
            <div className="upload-image">
                <div className="title-img mb-0">
                    <TextArea
                        placeholder="Title here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
                <div className="caption-image">
                    <TextArea
                        placeholder="Add a caption of Title, if you like"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default TextBox;