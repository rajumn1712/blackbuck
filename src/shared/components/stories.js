import React, { useState } from 'react';
import { Modal, Button, Card, Avatar, Input ,Upload, Image, Tooltip} from 'antd';
import user from '../../styles/images/user.jpg';
import connectStateProps from '../stateConnect';
import { uuidv4 } from '../../utils';
import notify from './notification';
import moment from 'moment';
import { savestories } from '../api/apiServer';
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

const Stories = ({profile}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadSources,setUploadSources] = useState({});
    const [loader,setLoader] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const saveStory = async () => {
        createObject.CreatedDate = new Date();
        createObject.Stories = uploadSources;
        const response = await savestories(createObject);
        if(response.ok){
            setIsModalVisible(false);
        }else{
            notify({
                description: `Something went wrong`,
                type: "error",
                message: "Story",
              });
        }
    };

    const handleCancel = () => {
        setUploadSources({});
        setIsModalVisible(false);
    };
    const createObject = 
        {
            "StoryId": uuidv4(),
            "UserId": profile.Id,
            "Firstname": profile.Firstname,
            "Lastname": profile.LastName,
            "Image": profile.ProfilePic,
            "Email": profile.Email,
            "Story": "",
          "CreatedDate": null,
          "Stories":{}
          }
    const renderByClickIcon = (type)=>{
        uploadSources.type = type === "Images" ? 'image' : 'video';
        setUploadSources({...uploadSources});

    }
   const uploadProps = {
        name: "file",
    multiple: false,
    action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    onChange:(info)=>{
        setLoader(true);
        const { status } = info.file;
        if(status === "done"){
            uploadSources.url = info.file.response[0];
            setUploadSources({...uploadSources});
            setLoader(false);
        } else if (status === "error") {
            notify({
              description: `Something went wrong`,
              type: "error",
              message: "Upload",
            });
            setLoader(false);
          } else if (status == undefined) {
            setLoader(false);
          }
    }
    }
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
                footer={[
                    <div className="d-flex justify-content-between">
                        <Button
                            type="primary"
                            disabled={!uploadSources.url}
                            onClick={() => saveStory()}
                        >
                            Share to Story
              </Button>
                    </div>,
                ]}
                destroyOnClose
            >
                <div className="d-flex justify-content-between addpost-user mb-24">
                    <Meta
                        avatar={<Avatar src={profile.ProfilePic} />}
                        title={<h4 className="mb-0">{profile.FirstName}</h4>}
                        description={profile.Branch} />
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
                            {...uploadProps}
                            showUploadList={false}
                        >
                            <li onClick={() => renderByClickIcon(menu.Id)}>
                                <span className={menu.CssSprite}></span>
                            </li>
                        </Dragger>
                    })}
                </ul>
                {uploadSources.type && <div className="mb-16 upload-preview">
              {uploadSources.type === 'image' && uploadSources.url && <Image src={uploadSources.url} />}
              {uploadSources.type === 'video' && uploadSources.url && <video width="100%" controls controlsList="nodownload">
                <source src={uploadSources.url} />
              </video>}
              <a
                class="item-close"
                onClick={() => {
                  setUploadSources({});
                }}
              >
                <Tooltip title="Remove">
                  <span className="close-icon"></span>
                </Tooltip>
              </a>
            </div>}

            </Modal>

        </>
    )
}
export default connectStateProps(Stories);