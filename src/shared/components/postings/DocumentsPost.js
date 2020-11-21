import React from 'react';
import { Avatar, Button, Card, List, Typography } from 'antd';
import user from '../../../styles/images/user.jpg';
import SideAction from './Actions/SideActions';
import EmojiAction from './Actions/EmojiActions';
import CommentAction from './Actions/CommentAction';
import ShareAction from './Actions/ShareActions';
import Comments from './Comments/Comments';
import moment from 'moment';



const { Meta } = Card;
const { Title, Paragraph } = Typography;

const privategrp = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="CSC Champions Group"
    description={<div><a className="mr-8 grp-type"><span className="grp-type-icon private mr-4"></span>Private Group</a><span>24-10-2020 09:50 am</span></div>}
/>

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

class DocumentPost extends React.Component {

    state = {
        groupposts: this.props.groups,
        documentCard: {
            post: privategrp,
            docs: docs,
            postTitle: 'IT And Engineering(CSE) Mini Projects - Engineering',
            postDescription: `Although social distancing has created many changes with CBU courses, we are still offering a
            wide range of classes virtually.  You read correctly`,
            lovesCount: 10,
            clapsCount: 0,
            whistlesCount: 0,
            postTags: [
                { tagname: '#CSC Tech' },
                { tagname: '#Computer' },
                { tagname: '#Techee' }
            ]
        },
        commentsection: false,
        submitting: false,
        value: ''
    }

    componentDidMount = ()=>{ //temporary code
        const allposts = [...this.state.groupposts];
        allposts.map(post=>{
            post.comments.map(comment=>{
                comment['author'] = comment.Firstname;
                comment['avatar'] = comment.Image;
                comment['content'] = comment.Comment;
                comment['datetime'] = moment().fromNow(comment.CreatedDate)
                comment.Replies.map(reply=>{
                reply['author'] = reply.Firstname;
                reply['avatar'] = reply.Image;
                reply['content'] = reply.Comment;
                reply['datetime'] = moment().fromNow(reply.CreatedDate)
                })
            })
        })
        this.setState({grouppost:allposts})
    }

    handleSubmit = () => {

    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleDeletePost = () => {
        this.setState({ submitting: true });
    }

    handleEvent = (event, name) => {
        if (name == 'Delete') {
            this.handleDeletePost();
        }
        // switch (name) {
        //     case 'Save Post':
        //         handleSavePost();
        //         break;
        //     case 'Edit':
        //         handleEditPost();
        //         break;
        //     case 'Turn on Notifications':
        //         handleNotifications();
        //         break;
        //     case 'Delete':
        //         handleDeletePost();
        //         break;
        //     default:
        //         handleSavePost();
        // }
    }

    handleEmojiEvent = (event, name, count) => {
        switch (name) {
            case 'Love':
                this.updateLoveCount(count);
                break;
            case 'Claps':
                this.updateClapsCount(count);
                break;
            case 'Whistles':
                this.updateWhistlesCount(count);
                break;
            default:
                break;
        }
    }

    updateLoveCount = (lovescount) => {
        this.setState({
            documentCard: {
                ...this.state.documentCard,
                lovesCount: lovescount
            }
        })
    }

    updateClapsCount = (clapscount) => {
        this.setState({
            documentCard: {
                ...this.state.documentCard,
                clapsCount: clapscount
            }
        })
    }

    updateWhistlesCount = (whistlescount) => {
        this.setState({
            documentCard: {
                ...this.state.documentCard,
                whistlesCount: whistlescount
            }
        })
    }

    showComment = () => {
        this.setState({ commentsection: true })
    }

    render() {

        const { groupposts, documentCard, commentsection, submitting, value } = this.state;

        return (
            groupposts.map(grouppost => {
                return <div className="post-card comment-show">
                    <Card title={
                        <Meta
                            avatar={
                                <Avatar src={grouppost.userdetails.Image} />
                            }
                            title={grouppost.meassage}
                            description={<div><a className="mr-8 grp-type"><span className="grp-type-icon private mr-4"></span>Private Group</a><span>24-10-2020 09:50 am</span></div>}
                        />
                    } style={{ width: '100%', borderRadius: 10 }} bordered={false} extra={
                        <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
                    }
                        actions={[<EmojiAction key="emoji" mystate={documentCard} clickedEvent={(event, name, count) => this.handleEmojiEvent(event, name, count)} />,
                        <CommentAction key="comment" clickedEvent={() => this.showComment()} />,
                        <ShareAction key="share" />
                        ]}
                    >
                        <div>
                        </div>
                        <div className="p-16">
                            <Title level={5} className="post-title f-16">{documentCard.postTitle}</Title>
                            <Paragraph className="f-14 post-desc">{documentCard.postDescription}</Paragraph>
                            <div className="docs mb-16">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={documentCard.docs}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={item.avatar}
                                                title={item.title}
                                                description={<div className="file-size f-12">{item.fileSize}</div>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <ul className="card-actions-count pl-0">
                                <li><span className="counter-icon loves"></span>{documentCard.lovesCount}<span> Loves</span></li>
                                <li><span className="counter-icon claps"></span>{documentCard.clapsCount}<span> Claps</span></li>
                                <li><span className="counter-icon whistles"></span>{documentCard.whistlesCount}<span> Whistles</span></li>
                            </ul>
                            <div className="join-grp">
                                <Avatar.Group
                                    maxCount={4}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                </Avatar.Group>
                                <Button type="primary">Join Group</Button>
                            </div>
                        </div>
                    </Card>
                    {(commentsection || grouppost.comments.length > 0) ? <Comments comments={grouppost.comments} submitting={submitting} value={value}
                        submitted={this.handleSubmit} changed={this.handleChange} /> : null}
                </div>
            })
        )
    }
}

export default DocumentPost;