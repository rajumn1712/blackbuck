import React, { Component } from 'react';
import { Menu, Popover } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon, FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import connectStateProps from '../../../stateConnect';
import { uuidv4 } from '../../../../utils';
import { savePost } from '../../../api/postsApi';
import notify from '../../notification';
class ShareAction extends Component {
    state = {
        visible: false
    }
    handleShare = async () => {
        const object = { ...this.props.post }
        const mainUSer = { ...this.props.post.userdetails, PostId: object.id, CreatedDate: object.date };
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
            Loves: [],
            Group: {
                GroupId: null,
                GroupName: null,
                GroupImage: null,
            },
            Shares: [mainUSer],
        }
        const res = await savePost(_saveObject);
        if (res.ok) {
            notify({ message: "Share", description: "Post shared on you're timeline" });
            this.setState({ visible: false })
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
            Shares: [],
            SharedUsers: this.props.post.SharedUsers ? this.props.post.SharedUsers.concat([user]) : [user]
        }
        savePost(obj, true);
    }
    render() {
        return (
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
                    <span className="post-icons sharenow-icon"></span>&nbsp;Share Now
                </Menu.Item>
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
        )
    }
}

export default connectStateProps(ShareAction);