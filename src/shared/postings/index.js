import React, { Component } from 'react'
import { Card, Avatar, Typography, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List, Popover, Tag, Empty, Space, Spin, message } from 'antd';
import SideAction from '../components/postings/Actions/SideActions';
import Comments from '../components/postings/Comments/Comments';
import CommentAction from '../components/postings/Actions/CommentAction';
import ShareAction from '../components/postings/Actions/ShareActions';
import EmojiAction from '../components/postings/Actions/EmojiActions';
import { getPosts, saveActions } from '../api/postsApi';
import FriendSuggestions from '../components/friendSuggestion';
import ShareBox from '../../components/SavePostBox/sharebox';
import Moment from 'react-moment';
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../common/loader';
const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

class Postings extends Component {
   state = {
      allPosts: [],
      value: "",
      submitting: false,
      loading: true,
      commentselection: [],
      page: 1,
      pageSize: 10
   }
   componentDidMount() {
      window.addEventListener('scroll', (e) => {
         let element = e.target.scrollingElement
         if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page }, () => {
               this.loadPosts();
            })
         }
      })
      this.loadPosts();
   }
   async loadPosts() {
      this.setState({ ...this.state, loading: true });
      const posts = await getPosts(this.props?.profile?.Id, this.state.page, this.state.pageSize, this.props.postingsType);
      let { allPosts } = this.state;
      allPosts = allPosts.concat(posts.data);
      if (posts.ok) {
         this.setState({ ...this.state, loading: false, allPosts })
      }
   }
   titleAvatar = (user, date) => {
      return <Meta
         avatar={
            <Avatar src={user.Image} />
         }
         title={user.Firstname}
         description={<Moment fromNow>{date}</Moment>}
      />
   }
   handleEvent = () => {

   }
   handleSubmit = () => {

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
                     <div className={"image-box single"}>
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
         Document: () => {
            return null
         },
         Audio: () => {
            return <div style={{ width: '100%', position: 'relative' }}>
               <div class="audio" onClick={this.showModal}>
                  <AudioPlayer
                     src={imageObj}
                     onPlay={e => console.log("onPlay")}
                     layout="horizontal-reverse"
                  />
               </div>
            </div>
         },
         Gif: () => {
            return <div style={{ width: '100%', position: 'relative' }}>
               <div class="images" onClick={this.showModal}>
                  <div className={"image-box gif"}>
                     <img src={imageObj} />
                  </div>
               </div>
            </div>
         }

      }


      return imageObj ? (_result[type] ? _result[type]() : null) : null;
   }
   handleActions = async (type, post) => {
      type = type === "Whistles" ? "Whistiles" : type;
      type = type === "Love" ? "Likes" : type;
      const { Id, ProfilePic, FirstName, Email, LastName } = this.props.profile;
      const saveObj = {
         "UserId": Id,
         "Firstname": FirstName,
         "Lastname": LastName,
         "Image": ProfilePic,
         "Email": Email
      }
      const saveResponse = await saveActions(post.id, type, saveObj);
      if (saveResponse.ok) {
         let { allPosts } = this.state;
         for (let i in allPosts) {
            if (allPosts[i].id === post.id) {
               allPosts[i][type.toLowerCase()] = allPosts[i][type.toLowerCase()] + 1;
            }
         }
         this.setState({ ...this.state, allPosts })
      }else{
         message.error("Action failed")
      }
   }
   renderPost = (post) => {

      return <div className="post-card comment-show">
         <Card title={this.titleAvatar(post.userdetails, post.date)} style={{ width: '100%' }} bordered={false} extra={
            <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
         }
            actions={[<EmojiAction key="emoji" mystate={post} clickedEvent={(event, name, count) => this.handleActions(name, post)} />,
            <CommentAction key="comment" clickedEvent={() => this.showComment(post)} />,
            <ShareAction key="share" />
            ]}
            cover={this.renderPostImages(post.image, post.type)}
         >
            <div className="p-16">
               <Title level={5} className="post-title f-16">{post.title}</Title>
               <Paragraph className="f-14 post-desc">{post.meassage}</Paragraph>
               <ul className="card-actions-count pl-0">
                  <li><span className="counter-icon loves"></span>{post.likes}<span> Loves</span></li>
                  <li ><span className="counter-icon claps"></span>{post.claps}<span> Claps</span></li>
                  <li><span className="counter-icon whistles"></span>{post.whistiles}<span> Whistles</span></li>
               </ul>
               <div className="post-tag">
                  {post.tags?.map((tag, index) => {
                     return <Tag key={index} className="f-14 px-16"><Link to="/commingsoon">{tag.Name}</Link></Tag>
                  })}
               </div>
            </div>
         </Card>
         {this.state.commentselection.indexOf(post.id) > -1 && <Comments comments={post.comments} submitting={this.state.submitting} value={this.state.value}
            submitted={this.handleSubmit} changed={this.handleChange} />}
         {/* <PostCardModal {...this.state} closed={() => { this.setState({ visible: false }) }} /> */}
      </div>
   }
   showComment = (post) => {
      const { commentselection } = this.state;
      const idx = commentselection.indexOf(post.id);
      if (idx > -1) {
         commentselection.splice(idx, 1);
      } else {
         commentselection.push(post.id);
      }
      this.setState({ ...this.state, commentselection })
   }

   render() {
      return <div onScroll={this.handleScroll}>
         {this.props.sharebox && <ShareBox />}
         {this.props.friendsSuggestions && <FriendSuggestions />}
      
         {this.state.allPosts?.map((post, indx) => this.renderPost(post))}
         {this.state.loading &&<Loader/>}
         {!this.state.loading && (!this.state.allPosts || this.state.allPosts?.length == 0) && <Empty />}
      </div>
   }
}
const mapStateToProps = ({ oidc }) => {
   return { profile: oidc.profile }
}
export default connect(mapStateToProps)(Postings);