import { Input, List, Tooltip, Upload } from 'antd';
import React, { Component } from 'react';

const { Dragger } = Upload;
const { TextArea } = Input;

const docs = [
    {
        avatar: [<span className="doc-icons word"></span>],
        title: 'Mini Project.Doc',
        fileSize: '150 KB'
    },
    {
        avatar: [<span className="doc-icons excel"></span>],
        title: 'Project Members list.xl...',
        fileSize: '40 KB'
    },
    {
        avatar: [<span className="doc-icons ppt"></span>],
        title: 'Power Point Slides of students.PPT',
        fileSize: '10MB'
    }
];

class DocumentsBox extends Component {
    render() {
        return (
            <div className="upload-image">
                {/* <Dragger className {...props}>
                        <Upload className="mb-8"
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture"
                            defaultFileList={[...fileList]}  >
                            
                            <span className="sharebox-icons document-icon mb-4"></span>
                            <p className="ant-upload-text">Upload Document</p>
                        </Upload>
                        </Dragger> */}
                <Dragger className="upload" {...this.props.customprops}>
                    <span className="sharebox-icons docs-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Documents</p>
                </Dragger>
                <div className="docs mb-16">
                    <List
                        itemLayout="horizontal"
                        dataSource={docs}
                        renderItem={item => (
                            <List.Item className="upload-preview">
                                <List.Item.Meta
                                    avatar={item.avatar}
                                    title={item.title}
                                    description={<div className="file-size f-12">{item.fileSize}</div>}
                                />
                                <a class="item-close">
                                    <Tooltip title="Remove">
                                        <span className="close-icon"></span>
                                    </Tooltip>
                                </a>
                            </List.Item>
                        )}
                    />
                </div>
                <div className="title-img">
                    <TextArea
                        placeholder="Title of the documents here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
                <div className="caption-image">
                    <TextArea
                        placeholder="Add a caption of documents, if you like"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default DocumentsBox;