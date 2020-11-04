import React, { Component } from 'react';
import { Card, Avatar, Typography, Image, Tag } from 'antd';
// import FbImageLibrary from 'react-fb-image-grid';
import user from '../../styles/images/user.jpg';
import PostImage from '../../styles/images/postimage.jpg';
import './post.css';
import '../../index.css'
import '../../styles/theme.css'

const { Meta } = Card;
const { Title, Paragraph } = Typography;
const images = [
    PostImage,
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bmbf.de%2Fen%2Fmicrosystems-technology-2445.html&psig=AOvVaw3IZ3jCI96_Zpxt01NjnV45&ust=1604478377148000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLDsou_55ewCFQAAAAAdAAAAABAD',
]

const title =  <Meta
avatar={
    <Avatar src={user} />
}
title="Nora Briggs"
description="24-10-2020 09:50 am"
/>
class  PostCard extends Component {
    render() {
        return (
            <div>
                <Card className="post-card" title={title} style={{ width: '100%', borderRadius: 10 }} bordered={false} extra={<a href="#">More</a>}
                    actions={[
                        <a><span className="post-icons like-icon like-emojis"></span>Like</a>,
                        <a><span className="post-icons comment-icon"></span>Comment</a>,
                        <a><span className="post-icons share-icon"></span>Share</a>
                    ]}
                >
                    <div>
                        <Image src={PostImage} />
                    {/* <FbImageLibrary
                        images={images}
                        countFrom={5}
                    /> */}
                    </div>
                    <div className="p-16">
                        <Title level={5} className="post-title f-14">Do you miss seeing the friendly faces of your fellow Colony Brands’ employees?</Title>
                        <Paragraph className="f-12 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a
wide range of classes virtually.  You read correctly</Paragraph>
                        <div className="post-tag">
                            <Tag className="f-12 px-16">#CSC Tech</Tag>
                            <Tag className="f-12 px-16">#Computer</Tag>
                            <Tag className="f-12 px-16">#Techee</Tag>
                        </div>
                        <likeButton><a>L</a></likeButton>
                    </div>
                </Card>
            </div>
        )
    }
}
export default PostCard;