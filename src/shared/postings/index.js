import React, { Component } from 'react'
import { Card, Avatar, Typography, Tooltip, Input, Tag, Empty, Tabs, Spin } from 'antd';
import SideAction from '../components/postings/Actions/SideActions';
import Comments from '../components/postings/Comments/Comments';
import CommentAction from '../components/postings/Actions/CommentAction';
import ShareAction from '../components/postings/Actions/ShareActions';
import EmojiAction from '../components/postings/Actions/EmojiActions';
import { deletePost, fetchPostReactions, getPosts, saveActions, saveUserPosts } from '../api/postsApi';
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
import dialog from '../components/dialog'
import notify from '../components/notification';
import { uuidv4 } from '../../utils';
import VisSenseFactory from 'vissense';
import { postUpdation } from '../../reducers/auth';
const VisSense = VisSenseFactory(window);
const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
let postObj = { tags: [], userdetails: {} };
class Postings extends Component {
   state = {
      allPosts: [],
      value: "",
      submitting: false,
      loading: true,
      commentselection: [],
      page: 1,
      pageSize: 200,
      showModal: false,
      reactionsLoading: false,
      loadMore: true
   }
   componentDidMount() {
      // document.addEventListener('scroll', (e) => {
      //    this.loadMore(e);
      // })
      this.loadPosts();
   }
   loadMore(e) {
      let element = e.target.scrollingElement
      if ((element.scrollHeight - element.scrollTop) === element.clientHeight) {
         if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page }, () => {
               this.loadPosts();
            })
         }
      }
   }
   async loadPosts(isFromSave) {
      this.setState({ ...this.state, loading: true });
      const posts = await getPosts((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.page, this.state.pageSize, this.props.postingsType);
      let { allPosts } = this.state;
      if (!isFromSave) {
         allPosts = allPosts.concat(posts.data);
      } else {
         allPosts = posts.data;
      }
      if (posts.ok) {
         this.setState({ ...this.state, loading: false, allPosts, loadMore: posts.data.length === this.state.pageSize }, () => {
            const videoElements = document.querySelectorAll("video");
            for (const i in videoElements) {
               if (typeof (videoElements[i]) == "object") {
                  this.enableVideoAutoPlay(videoElements[i])
               }
            }
         })
      }
   }
   enableVideoAutoPlay(myVideo) {
      var videoElementArea = VisSense(myVideo);
      var monitorBuilder = VisSense.VisMon.Builder(videoElementArea);
      monitorBuilder.on('fullyvisible', function () {
         myVideo.play(); // start playing the video (or keep playing)
      });
      monitorBuilder.on('hidden', function () {
         myVideo.pause();
      });
      var videoVisibilityMonitor = monitorBuilder.build();
      videoVisibilityMonitor.start();
   }
   titleAvatar = (user, date) => {
      return <Link to={"/profileview/" + user.UserId}>
         <Meta
            avatar={<Avatar src={user.Image || defaultUser} />}
            title={<span className="overflow-text post-title">{user.Firstname}</span>}
            description={<Moment fromNow>{date}</Moment>}
         />
      </Link>
   }
   closed = () => {
      this.setState({ showModal: false });
   }
   showModal = (post) => {
      postObj = post;
      this.setState({ showModal: true })
   }
   handleEvent = async (e, name, post) => {
      switch (name) {
         case "Delete":
            dialog({ title: 'Alert', icon: '', content: 'Are you sure want to delete post?', okText: 'Delete', cancelText: 'Cancel', onOk: () => this.deletePost(post) });
            //this.deletePost(post);
            break;
         case "Edit":
            break;
         case "Save Post":
            const obj = {
               "Id": uuidv4(),
               "PostId": post.id,
               "UserId": this.props?.profile?.Id,
               "CreatedDate": new Date()
            }
            const saveResponse = await saveUserPosts(obj);
            if (saveResponse.ok) {
               notify({ description: "Post saved in 'Saved Posts'", message: "Post save" });
            } else {
               notify({ description: "Something went wrong'", message: "Error", type: "error" })
            }
            break;
         default:
            break;
      }
   }
   editPost = (post) => {

   }
   handleSubmit = () => {

   }

   handleChange = () => {

   }
   dataRefreshed = () => {
      this.loadPosts(true)
      this.props.upadateProfile(this.props.profile, 'Increment');
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
            return <div className="video-post" >
               <video width="100%" controls>
                  <source src={imageObj} />
               </video>
               {/* <div className="play"></div> */}
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
               if (allPosts[i].IsUserLikes && type == allPosts[i].UserLikesType) {
                  const _type = allPosts[i].UserLikesType ? allPosts[i].UserLikesType.toLowerCase() : "likes";
                  if (allPosts[i][_type] > 0) {
                     allPosts[i][_type] = allPosts[i][_type] - 1;
                     allPosts[i].UserLikesType = null;
                  }
                  allPosts[i].IsUserLikes = !allPosts[i].IsUserLikes;
               } else {
                  if (allPosts[i].IsUserLikes) {
                     const _type = allPosts[i].UserLikesType.toLowerCase();
                     allPosts[i][_type] = allPosts[i][_type] - 1;
                  } else {
                     allPosts[i].IsUserLikes = !allPosts[i].IsUserLikes;
                  }
                  allPosts[i][type.toLowerCase()] = allPosts[i][type.toLowerCase()] ? allPosts[i][type.toLowerCase()] + 1 : 1;
                  allPosts[i].UserLikesType = type;
               }
               postObj = allPosts[i]//added for re usablity code
            }
         }
         this.setState({ ...this.state, allPosts })
      } else {
         notify({ message: "Error", description: "Something went wrong :)", type: "error" });
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
      deletePost(post.id, this.props?.profile?.Id).then(() => {
         let { allPosts } = this.state;
         allPosts = allPosts.filter(item => item.id !== post.id);
         this.setState({ ...this.state, allPosts, showModal: false });
         notify({ message: "Delete", description: "Post delete success" });
         this.props.upadateProfile(this.props.profile,'Decrement');
      })
   }
   fetchPostReactions = async (id) => {
      this.setState({ ...this.state, reactionsLoading: true });
      let actions = {};
      const reactionsResponse = await fetchPostReactions(id);
      if (reactionsResponse.ok) {
         const data = reactionsResponse.data[0].Likes;
         actions = {
            Likes: data.filter(item => item.Type === "Likes"),
            Claps: data.filter(item => item.Type === "Claps"),
            Loves: data.filter(item => item.Type === "Loves"),
            Whistiles: data.filter(item => item.Type === "Whistiles"),
         }
         this.setState({ reactionsLoading: false, postReactions: actions })
      }
   }
   renderPost = (post) => {

      return <div className={`post-card ${this.state.commentselection.indexOf(post.id) > -1 ? 'comment-show' : ""}`}>
         <Card title={this.titleAvatar(post.userdetails, post.date)} bordered={true} extra={
            <SideAction clickedEvent={(event, name) => this.handleEvent(event, name, post)} actionsList={this.fetchCardActions(post.userdetails)} />
         }
            actions={[<EmojiAction IsUserLikes={post.IsUserLikes} key="emoji" mystate={post} clickedEvent={(event, name) => this.handleActions(event, name, post)} />,
            <CommentAction key="comment" clickedEvent={() => this.showComment(post)} />,
            <ShareAction key="share" />
            ]}
         // cover={<div onClick={() => this.showModal(post)}>{this.renderPostImages(post.image, post.type, post)}</div>}
         >
            {/* <Title level={5} className="post-title">{post.title}</Title> */}
            <Paragraph className="post-desc">{post.meassage}</Paragraph>
            {(post.tags != null && post.tags?.length > 0) && <div className="post-tag">
               {post.tags?.map((tag, index) => {
                  return <>{(tag != undefined && tag != null) && <Tag key={index}><Link to="/commingsoon">{`#${tag?.Name || ""}`}</Link></Tag>}</>
               })}
            </div>}
            <Card.Meta
               className="post-image"
               avatar={<div onClick={() => this.showModal(post)}>{this.renderPostImages(post.image, post.type, post)}</div>}
            >
            </Card.Meta>
            <div className="d-flex justify-content-between mx-16 py-8">
               {<ul className="card-actions-count pl-0">
                  <li><span className="counter-icon likes"></span></li>
                  <li><span className="counter-icon loves"></span></li>
                  <li ><span className="counter-icon claps"></span></li>
                  <li><span className="counter-icon whistles"></span></li>
                  <li onMouseEnter={() => this.fetchPostReactions(post.id)}>
                     <Tooltip overlayStyle={{ color: "#ffff" }} title={<div className="likes-counters">{this.state.reactionsLoading ? <Spin /> : <Tabs defaultActiveKey="1" onChange={() => { }}>
                        <TabPane tab="Likes" key="1" style={{ floodColor: "#ffff", height: 200 }}>
                           {this.state.postReactions?.Likes?.map((item, indx) => <p style={{ color: 'var(--white)', marginBottom: 0 }} key={indx}>{item.Firstname}</p>)}
                        </TabPane>
                        <TabPane tab="Loves" key="2" style={{ floodColor: "#ffff", height: 200 }}>
                           {this.state.postReactions?.Loves?.map((item, indx) => <p style={{ color: 'var(--white)', marginBottom: 0 }} key={indx}>{item.Firstname}</p>)}
                        </TabPane>
                        <TabPane tab="Claps" key="3" style={{ floodColor: "#ffff", height: 200 }}>
                           {this.state.postReactions?.Claps?.map((item, indx) => <p style={{ color: 'var(--white)', marginBottom: 0 }} key={indx}>{item.Firstname}</p>)}
                        </TabPane>
                        <TabPane tab="Whistiles" key="4" style={{ floodColor: "#ffff", height: 200 }}>
                           {this.state.postReactions?.Whistiles?.map((item, indx) => <p style={{ color: 'var(--white)', marginBottom: 0 }} key={indx}>{item.Firstname}</p>)}
                        </TabPane>
                     </Tabs>}</div>}>
                        <a> {(post.loves || 0) + (post.claps || 0) + (post.whistiles || (post.likes || 0))}</a>
                     </Tooltip>
                  </li>
               </ul>}
               <ul className="card-actions-count">
                  {/* {(post.likes != null && post?.likes != 0) && <li><span></span>{post.likes} <span> Likes</span></li>} */}
                  {post.commentsCount != null && <li className="mr-0" onClick={() => this.showComment(post)}><span></span>{post.commentsCount} <span> Comments</span></li>}
                  {/* <li><span></span>2 <span> Shares</span></li> */}
               </ul>
            </div>
         </Card>
         {this.state.commentselection.indexOf(post.id) > -1 && <Comments onUpdate={(prop, value) => { this.updatePost(post, prop, value) }} count={post.commentsCount} postId={post.id} />}
         {/* {post.type !== 'text' && <PostCardModal postData={postObj} visible={this.state.showModal} closed={() => this.closed()} handleEvent={(e, name, post) => this.handleEvent(e, name, post)} handleActions={(event, type, post) => this.handleActions(event, type, post)} updatePost={(event, type, post) => this.updatePost(event, type, post)} />} */}
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
   updatePost = (post, prop, value) => {
      let { allPosts } = this.state;
      for (let i in allPosts) {
         if (allPosts[i].id === post.id) {
            allPosts[i][prop] = value
         }
      }
      this.setState({ ...this.state, allPosts });
   }
   render() {
      return <div onScroll={this.handleScroll}>
         {this.props.sharebox && <ShareBox  dataRefreshed={()=>this.dataRefreshed()}/>}
         {this.props.friendsSuggestions && <FriendSuggestions />}

         {this.state.allPosts?.map((post, indx) => this.renderPost(post))}
         {this.state.loading && <Loader className="loader-top-middle" />}
         {!this.state.loading && (!this.state.allPosts || this.state.allPosts?.length == 0) && <Empty />}
         <PostCardModal postData={postObj} visible={this.state.showModal} closed={() => this.closed()} handleEvent={(e, name, post) => this.handleEvent(e, name, post)} handleActions={(event, type, post) => this.handleActions(event, type, post)} updatePost={(event, type, post) => this.updatePost(event, type, post)} />
      </div>
   }
}
const mapStateToProps = ({ oidc }) => {
   return { profile: oidc.profile }
}
const mapDispatchToProps = dispatch => {
   return {
      upadateProfile: (info,type) => { dispatch(postUpdation(info,type)) }
   }
}
export default connect(mapStateToProps, mapDispatchToProps)(Postings);