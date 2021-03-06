import React, { useState } from 'react';
import { Modal, Button, Card, Avatar, Input ,Upload} from 'antd';
import user from '../../styles/images/user.jpg';
const { TextArea } = Input;
const { Dragger } = Upload;

const { Meta } = Card;
const NewPostMenu = [
    {
        CssSprite: 'sharebox-icons photo-icon',
        Id: 'Images'
    },
    {
        CssSprite: 'sharebox-icons video-icon',
        Id: 'Video'
    },
];
const fileTypes = {
    Images: ".jpg,.jpeg,.png",
    Video: ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
  };

const Stories = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <>
            <ul className="stories">
                <li className="story-card">
                    <div onClick={showModal}>
                        <div className="story-image">
                            <div className="add-story">
                                <span className="add-story-icon" />
                            </div>
                        </div>
                        <p className="name">Add Story</p>
                    </div>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
            </ul>
            <Modal
                className="share-popup"
                title={
                    <div className="custom-modal-header">
                        <h4>Write a Story</h4>
                        <a>
                            <span className="close-icon" onClick={handleCancel}></span>
                        </a>
                    </div>
                }
                className="custom-popup"
                visible={isModalVisible}
                onOk={handleOk}
                footer={[
                    <div className="d-flex justify-content-between">
                        <Button
                            type="primary"
                            onClick={() => handleOk()}
                        >
                            Share to Story
              </Button>
                    </div>,
                ]}
                destroyOnClose
            >
                <div className="d-flex justify-content-between addpost-user mb-24">
                    <Meta
                        avatar={<Avatar src={user} />}
                        title={<h4 className="mb-0">JMoZ</h4>}
                        description="Computer Science" />
                </div>
                <div className="title-img">
                    <TextArea
                        placeholder={`What's on Your Mind?`}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        style={{ resize: "none", fontWeight: "400" }}
                        name="Message"
                        required={true}
                        maxLength={1306}
                    />
                </div>
                <ul className="share-list">
                    {NewPostMenu.map(menu => {
                        return <Dragger
                            key={menu.Id}
                            className="upload"
                            accept={fileTypes[menu.Id]}
                            multiple={menu.Id === "Images" || menu.Id === "Docs" ? true : false}
                            onRemove={() => this.setState({ ...this.state, uploadSources: [] })}
                            showUploadList={false}
                        >
                            <li onClick={() => this.renderByClickIcon(menu.Id)}>
                                <span className={menu.CssSprite}></span>
                            </li>
                        </Dragger>
                    })}
                </ul>

            </Modal>

        </>
    )
}
export default Stories;