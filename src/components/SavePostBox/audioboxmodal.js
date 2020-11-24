import { Input, Upload } from 'antd';
import React, { Component } from 'react';
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';

const { Dragger } = Upload;
const { TextArea } = Input;

class AudioBox extends Component {
    render() {
        return (
            <div className="upload-image">
                <Dragger className="upload" {...this.props.customprops}>
                    <span className="sharebox-icons audio-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Audio</p>
                </Dragger>
                <div className="mb-16">
                    <AudioPlayer
                        autoPlay
                        src="http://example.com/audio.mp3"
                        onPlay={e => console.log("onPlay")}
                        layout="horizontal-reverse"

                    />

                </div>
                <div className="title-img">
                    <TextArea
                        placeholder="Title of the audio here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
                <div className="caption-image">
                    <TextArea
                        placeholder="Add a caption of audio, if you like"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default AudioBox;