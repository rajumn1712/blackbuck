import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Loader = ()=>{
    return <div style={{alignItems:"center",flex:1}}><Spin indicator={antIcon}  /></div>
}

export default Loader;