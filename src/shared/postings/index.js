import React, { Component } from 'react'
import { Card, Avatar, Typography, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List, Popover, Tag, Empty, Space, Spin, message } from 'antd';
import SideAction from '../components/postings/Actions/SideActions';
import Comments from '../components/postings/Comments/Comments';
import CommentAction from '../components/postings/Actions/CommentAction';
import ShareAction from '../components/postings/Actions/ShareActions';
import EmojiAction from '../components/postings/Actions/EmojiActions';
import { deletePost, getPosts, saveActions } from '../api/postsApi';
import FriendSuggestions from '../components/friendSuggestion';
import ShareBox from '../../components/SavePostBox/sharebox';
import Moment from 'react-moment';
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../common/loader';
import defaultUser from '../../styles/images/defaultuser.jpg';
import PostCardModal from '../components/postings/PostModal';
const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
let postObj = { tags: [],userdetails:{} };
class Postings extends Component {
   state = {
      allPosts: [],
      value: "",
      submitting: false,
      loading: true,
      commentselection: [],
      page: 1,
      pageSize: 10,
      showModal:false,
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
      const posts = await getPosts((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.page, this.state.pageSize, this.props.postingsType);
      let { allPosts } = this.state;
      allPosts = allPosts.concat(posts.data);
      if (posts.ok) {
         this.setState({ ...this.state, loading: false, allPosts })
      }
   }
   titleAvatar = (user, date) => {
      return <Meta
         avatar={
            <Avatar src={user.Image || defaultUser} />
         }
         title={user.Firstname}
         description={<Moment fromNow>{date}</Moment>}
      />
   }
   closed = () => {
      this.setState({ showModal: false });
   }
   showModal = (post) => {
      postObj = post;
      this.setState({ showModal: true })
   }
   handleEvent = (e, name, post) => {
      switch (name) {
         case "Delete":
            this.deletePost(post);
            break;
         case "Edit":
            break;
         case "Save Post":
            break;
         default:
            break;
      }
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
                  <div class="images">
                     {imageObj.map((image, index) => {
                        return <div key={index} className={index === 0 ? "image-box single" : 'image-box ' + imageObj.length}>
                           <img src={image.Name || image} />
                        </div>
                     })}
                     {imageObj.length > 4 ? <span class="more-images">+2</span> : null}
                  </div>
               </div>
            } else {
               return <div style={{ width: '100%', position: 'relative' }}>
                  <div class="images">
                     <div className={"image-box single"}>
                        <img src={imageObj} />
                     </div>
                  </div>
               </div>
            }
         },
         Video: () => {
            return <div className="video-post">
                     <video width="100%" controls>
                        <source src={imageObj} />
                     </video>
                     <div className="play"></div>
                  </div>
         },
         Text: () => {
            return null
         },
         Document: () => {
            return null
         },
         Audio: () => {
            return <div style={{ width: '100%', position: 'relative' }}>
               <div class="audio">
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
               <div class="images">
                  <div className={"image-box gif"}>
                     <img src={imageObj} />
                  </div>
               </div>
            </div>
         }

      }


      return imageObj ? (_result[type] ? _result[type]() : null) : null;
   }
   handleActions = async (event, type, post) => {
      event.stopPropagation();
      type = type === "Whistles" ? "Whistiles" : type;
      type = type === "Love" ? "Loves" : type;
      const { Id, ProfilePic, FirstName, Email, LastName } = this.props.profile;
      const saveObj = {
         "UserId": Id,
         "Firstname": FirstName,
         "Lastname": LastName,
         "Image": ProfilePic,
         "Email": Email,
         "Type": type
      }
      const saveResponse = await saveActions(post.id, saveObj);
      if (saveResponse.ok) {
         let { allPosts } = this.state;
         for (let i in allPosts) {
            if (allPosts[i].id === post.id) {
               allPosts[i][type.toLowerCase()] = (allPosts[i][type.toLowerCase()]?allPosts[i][type.toLowerCase()]:0) + 1;
               allPosts[i].IsUserLikes =  !allPosts[i].IsUserLikes;
            }
         }
         this.setState({ ...this.state, allPosts })
      } else {
         message.error("Action failed")
      }
   }
   fetchCardActions = (user) => {
      const ownerActions = [
         { action: 'Edit', icons: 'post-icons edit-icon' },
         { action: 'Delete', icons: 'post-icons delete-icon' }
      ]
      const actionsList = [
         { action: 'Save Post', icons: 'post-icons savepost-icon' },
         { action: 'Turn on Notifications', icons: 'post-icons notify-icon' },
      ]
      const result = user.UserId === this.props.profile.Id ? ownerActions.concat(actionsList) : actionsList;
      return result;
   }
   deletePost = (post) => {
      deletePost(post.id).then(() => {
         let { allPosts } = this.state;
         allPosts = allPosts.filter(item => item.id !== post.id);
         this.setState({ ...this.state, allPosts });
         message.success("Post deleted");
      })
   }
   renderPost = (post) => {

      return <div className={`post-card ${this.state.commentselection.indexOf(post.id) > -1 ? 'comment-show' : ""}`}>
         <Card title={this.titleAvatar(post.userdetails, post.date)} style={{ width: '100%' }} bordered={false} extra={
            <SideAction clickedEvent={(event, name) => this.handleEvent(event, name, post)} actionsList={this.fetchCardActions(post.userdetails)} />
         }
         actions={[<EmojiAction IsUserLikes={post.IsUserLikes} key="emoji" mystate={post} clickedEvent={(event, name) => this.handleActions(event, name, post)} />,
            <CommentAction key="comment" clickedEvent={() => this.showComment(post)} />,
            <ShareAction key="share" />
            ]}
            cover={<div onClick={()=>this.showModal(post)}>{this.renderPostImages(post.image, post.type,post)}</div>}
         >
            <div className="p-16">
            <div onClick={()=>this.showModal(post)}>
               <Title level={5} className="post-title">{post.title}</Title>
               <Paragraph className="post-desc">{post.meassage}</Paragraph>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ul className="card-actions-count pl-0">
                     <li><span className="counter-icon loves"></span>{post.loves}<span> Loves</span></li>
                     <li ><span className="counter-icon claps"></span>{post.claps}<span> Claps</span></li>
                     <li><span className="counter-icon whistles"></span>{post.whistiles}<span> Whistles</span></li>
                  </ul>
                  <ul className="card-actions-count">
                     {(post.likes != null && post?.likes != 0) && <li><span></span>{post.likes} <span> Like</span></li>}
                     {post.comments != null && post.comments.length != 0 && <li><span></span>{post.comments.length} <span> Comment(s)</span></li>}
                     {/* <li><span></span>2 <span> Shares</span></li> */}
                  </ul>
               </div>
               {(post.tags != null && post.tags?.length > 0) && <div className="post-tag">
                  {post.tags?.map((tag, index) => {
                     return <Tag key={index}><Link to="/commingsoon">{`${tag.Name}`}</Link></Tag>
                  })}
               </div>}
            </div>
         </Card>
         {this.state.commentselection.indexOf(post.id) > -1 && <Comments postId={post.id} comments={post.comments} submitting={this.state.submitting} value={this.state.value}
            submitted={this.handleSubmit} changed={this.handleChange} />}
         {<PostCardModal postData={postObj}   visible={this.state.showModal} closed={() =>  this.closed() } /> }
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
         {this.state.loading && <Loader className="loader-top-middle" />}
         {!this.state.loading && (!this.state.allPosts || this.state.allPosts?.length == 0) && <Empty />}
      </div>
   }
}
const mapStateToProps = ({ oidc }) => {
   return { profile: oidc.profile }
}
export default connect(mapStateToProps)(Postings);