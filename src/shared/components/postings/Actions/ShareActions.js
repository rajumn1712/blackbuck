import React, { Component } from 'react';
import { Menu, Popover, Modal, Select, Form, Button } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon, FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import connectStateProps from '../../../stateConnect';
import { uuidv4 } from '../../../../utils';
import { savePost } from '../../../api/postsApi';
import notify from '../../notification';
import { fetchUserGroups } from '../../../api/apiServer';
const { Option } = Select;
class ShareAction extends Component {
    state = {
        visible: false,
        isModalVisible: false,
        groupData: {
            GroupId: null,
            GroupName: null,
            GroupImage: null,
        },
        groupsLu: [],
    }
    handleShare = async (isGroup) => {
        const object = { ...this.props.post }
        const mainUSer = {
            ...this.props.post.userdetails, PostId: object.id, CreatedDate: object.date, groupDetails: isGroup ? (object.Shares?.length == 0 ? object.Group : {
                GroupId: null,
                GroupName: null,
                GroupImage: null,
            }) : null
        }
        const _saveObject = {
            PostId: uuidv4(),
            Type: object.type,
            Message: object ? object.meassage : "",
            Title: object ? object.title : "",
            IsAnonymous: object ? object.IsAnonymous : false,
            ImageUrl: object ? (object.image ? object.image : null) : null,
            CreatedDate: new Date(),
            UserDetails: {
                UserId: this.props.profile?.Id,
                Firstname: this.props.profile?.FirstName,
                Lastname: this.props.profile?.LastName,
                Image: this.props.profile?.ProfilePic,
                Email: this.props.profile?.Email,
            },
            Tags: object ? object.tags : [],
            Likes: [],
            Claps: [],
            whistiles: [],
            Comments: [],
            PostType: object ? object.PostType : "",
            CourseType: object ? object.CourseType : "",
            LiveDate: object ? object.LiveDate : "",
            UrlType: object ? object.UrlType : "",
            CategoryType: object ? object.CategoryType : "",
            Author: object ? object.Author : "",
            CourseId: object ? object.CourseId : "",
            Loves: [],
            Group: isGroup ? this.state.groupData : (object.Shares?.length == 0 ? object.Group : {
                GroupId: null,
                GroupName: null,
                GroupImage: null,
            }),
            Shares: [mainUSer],
        }
        const res = await savePost(_saveObject);
        if (res.ok) {
            notify({ message: "Share", description: isGroup ? "Post shared on selected group" : "Post shared on you're timeline" });
            this.setState({ visible: false ,isModalVisible:false})
        }
        const user = {
            UserId: this.props.profile?.Id,
            Firstname: this.props.profile?.FirstName,
            Lastname: this.props.profile?.LastName,
            Image: this.props.profile?.ProfilePic,
            Email: this.props.profile?.Email,
        }
        const obj = {
            PostId: object ? object.id : uuidv4(),
            Type: object.type,
            Message: object ? object.meassage : "",
            Title: object ? object.title : "",
            IsAnonymous: object ? object.IsAnonymous : false,
            ImageUrl: object ? (object.image ? object.image : null) : null,
            CreatedDate: object ? new Date(object.date) : null,
            UserDetails: object ? object.userdetails : {
                UserId: this.props.profile?.Id,
                Firstname: this.props.profile?.FirstName,
                Lastname: "",
                Image: this.props.profile?.ProfilePic,
                Email: this.props.profile?.Email,
            },
            Tags: object ? object.tags : [],
            Likes: [],
            Claps: [],
            whistiles: [],
            Comments: [],
            Loves: [],
            Group: object ? object.Group : {
                GroupId: null,
                GroupName: null,
                GroupImage: null,
            },
            PostType: object ? object.PostType : "",
            CourseType: object ? object.CourseType : "",
            LiveDate: object ? object.LiveDate : "",
            UrlType: object ? object.UrlType : "",
            CategoryType: object ? object.CategoryType : "",
            Author: object ? object.Author : "",
            CourseId: object ? object.CourseId : "",
            Shares: [],
            SharedUsers: this.props.post.SharedUsers ? this.props.post.SharedUsers.concat([user]) : [user]
        }
        savePost(obj, true);
    }
    fetchGroupSuggestions = async () => {
        const groupsData = await fetchUserGroups(this.props.profile?.Id,5000,0);
        if (groupsData.ok) {
            this.setState({ ...this.state, groupsLu: groupsData.data, isModalVisible: true, visible: false })
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    handleShareGroup = () => {
        this.fetchGroupSuggestions();
    }
    handleCancel = () => {
        this.setState({ ...this.state, isModalVisible: false, visible: false });
    }
    handleChange = (option) => {
        let { groupData } = this.state;
        if (option.value) {
            groupData.GroupId = option.value;
            groupData.GroupName = option.name;
            groupData.GroupImage = option.avatar;
        }
        else {
            groupData.GroupId = null;
            groupData.GroupName = null;
            groupData.GroupImage = null;
        }
        this.setState({ ...this.state, groupData });
    }
    shareInGroup = () => {
        this.handleShare(true)
    }
    render() {
        return (
            <>
            <Popover visible={this.state.visible} onVisibleChange={(visible) => { this.setState({ visible }) }} content={<Menu className="share-pop" >
                <Menu.Item key="0" onClick={() => this.setState({ visible: false })}>
                    <FacebookShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <FacebookIcon size={24} borderRadius={24} />Facebook</FacebookShareButton>
                </Menu.Item>
                <Menu.Item key="1" onClick={() => this.setState({ visible: false })}>
                    <TwitterShareButton url={this.props.url} imageUrl={this.props.imgUrl}>  <TwitterIcon size={24} borderRadius={24} />Twitter</TwitterShareButton>
                </Menu.Item>
                <Menu.Item key="3" onClick={() => this.setState({ visible: false })}>
                    <LinkedinShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <LinkedinIcon size={24} borderRadius={24} />LinkedIn</LinkedinShareButton>
                </Menu.Item>
                <Menu.Item key="4" onClick={() => this.setState({ visible: false })}>
                    <WhatsappShareButton url={this.props.url} imageUrl={this.props.imgUrl}> <WhatsappIcon size={24} borderRadius={24} />Whatsapp</WhatsappShareButton>
                </Menu.Item>
                <Menu.Divider />
                    <Menu.Item key="5" onClick={() => this.handleShare()}>
                        <span className="post-icons timeline-icon"></span>&nbsp;Share Now
                </Menu.Item>
                  {/* <Menu.Item key="6" onClick={() => this.handleShareGroup()}>
                        <span className="post-icons sharenow-icon"></span>&nbsp;Share to a group
                </Menu.Item>  */}
                <CopyToClipboard text={this.props.url} onCopy={() => notify({ message: "Copied to clipboard" })}>
                    <Menu.Item key="6" onClick={() => this.setState({ visible: false })}>

                        <>
                            <span className="post-icons copylink-icon"></span>&nbsp;Copy Link
                        </>

                    </Menu.Item>
                </CopyToClipboard>
            </Menu>} trigger="click">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
            </Popover>
                <Modal title="Share to a group" visible={this.state.isModalVisible} onCancel={this.handleCancel} centered
                    footer={<>
                        <Button type="primary" form="myForm" key="submit" htmlType="submit">Save</Button>
                    </>}
                    destroyOnClose={true}

                >
                    <Form id="myForm" onFinishFailed={() => { }} onFinish={() => this.shareInGroup()} initialValues={{ GroupName: "", GroupId: "" }}>
                        <div>
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4 ant-form-item-required">* Group</label>
                                <Form.Item name="GroupId" rules={[{ required: true, message: "Group  required" }]}>
                                    <Select defaultValue="Choose Group" placeholder="Choose Group" onChange={(val, Option) => this.handleChange(Option)}>
                                        <Option value="">Choose Group</Option>
                                        {this.state?.groupsLu?.map((group) => <Option value={group?.id} avatar={group?.image} name={group?.name}>{group?.name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </Modal>
         </>
        )
    }
}

export default connectStateProps(ShareAction);