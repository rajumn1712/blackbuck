import React, { Component } from 'react'
import { Card, Avatar, Typography, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List, Popover, Tag, Empty, Space, Spin } from 'antd';
import SideAction from '../components/postings/Actions/SideActions';
import Comments from '../components/postings/Comments/Comments';
import CommentAction from '../components/postings/Actions/CommentAction';
import ShareAction from '../components/postings/Actions/ShareActions';
import EmojiAction from '../components/postings/Actions/EmojiActions';
import { apiClient } from '../api/clients';
import { getPosts } from '../api/postsApi';
import FriendSuggestions from '../components/friendSuggestion';
import ShareBox from '../../components/SavePostBox/sharebox';
const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

class Postings extends Component {
   state = {
      allPosts: [],
      value: "",
      submitting: false,
      loading: true,
      commentsection: false
   }
   async componentDidMount() {
      this.setState({ ...this.state, loading: true })
      const posts = await getPosts(1, 1, 10, this.props.postingsType);
      if (posts.ok) {
         this.setState({ ...this.state, loading: false, allPosts: posts.data })
      }
   }
   titleAvatar = (user) => {
      return <Meta
         avatar={
            <Avatar src={user.Image} />
         }
         title={user.Firstname}
         description="24-10-2020 09:50 am"
      />
   }
   handleEvent = () => {

   }
   handleSubmit = () => {

   }
   handleEmojiEvent = () => {

   }
   handleChange = () => {

   }
   renderPostImages = (imageObj, type) => {
      const _result = {
         Image: () => {
            if (typeof (imageObj) != "string") {
               return <div style={{ width: '100%', position: 'relative' }}>
                  <div class="images" onClick={this.showModal}>
                     {imageObj.map((image, index) => {
                        return <div key={index} className={index === 0 ? "image-box" : 'image-box ' + imageObj.length}>
                           <img src={image.Name} />
                        </div>
                     })}
                     {imageObj.length > 4 ? <span class="more-images">+2</span> : null}
                  </div>
               </div>
            } else {
               return <div style={{ width: '100%', position: 'relative' }}>
                  <div class="images" onClick={this.showModal}>
                     <div className={""}>
                        <img src={imageObj} />
                     </div>
                  </div>
               </div>
            }
         },
         Video: () => {
            return <div> <video width="100%" controls>
               <source src={imageObj} /></video></div>
         },
         Text: () => {
            return null
         },
         Document:()=>{
            return null
         }

      }


      return imageObj ? (_result[type]?_result[type]():null) : null;
   }
   renderPost = (post) => {

      return <div className="post-card comment-show">
         <Card title={this.titleAvatar(post.userdetails)} style={{ width: '100%' }} bordered={false} extra={
            <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
         }
            actions={[<EmojiAction key="emoji" mystate={post} clickedEvent={(event, name, count) => this.handleEmojiEvent(event, name, count)} />,
            <CommentAction key="comment" clickedEvent={() => this.showComment()} />,
            <ShareAction key="share" />
            ]}
            cover={this.renderPostImages(post.image, post.type)}
         >
            <div className="p-16">
               <Title level={5} className="post-title f-16">{post.title}</Title>
               <Paragraph className="f-14 post-desc">{post.meassage}</Paragraph>
               <ul className="card-actions-count pl-0">
                  <li><span className="counter-icon loves"></span>{post.likes}<span> Loves</span></li>
                  <li><span className="counter-icon claps"></span>{post.claps}<span> Claps</span></li>
                  <li><span className="counter-icon whistles"></span>{post.whistiles}<span> Whistles</span></li>
               </ul>
               <div className="post-tag">
                  {post.tags?.map((tag, index) => {
                     return <Tag key={index} className="f-14 px-16">{tag.tagname}</Tag>
                  })}
               </div>
            </div>
         </Card>
         {this.state.commentsection && <Comments comments={post.comments} submitting={this.state.submitting} value={this.state.value}
            submitted={this.handleSubmit} changed={this.handleChange} />}
         {/* <PostCardModal {...this.state} closed={() => { this.setState({ visible: false }) }} /> */}
      </div>
   }
   showComment = () => {
      this.setState({ ...this.state, commentsection: true })
   }
   render() {
      return <>
         {this.props.sharebox && <ShareBox />}
         {this.props.friendsSuggestions && <FriendSuggestions />}
         {this.state.loading&&<Space size="middle"><Spin size="large"/></Space>}
         {this.state.allPosts?.map((post, indx) => this.renderPost(post))}
         {!this.state.loading&&(!this.state.allPosts||this.state.allPosts?.length==0)&&<Empty/>}
      </>
   }
}

export default Postings;