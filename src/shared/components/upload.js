import React from 'react';
import 'antd/dist/antd.css';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import openNotificationWithIcon from './toastNotify';
import { connect } from 'react-redux';
const UploadComp = ({ auth, values }) => {
    const configObj = {
        name: 'file',
        action: values.url,
        showUploadList: false,
        headers: {
            //  authorization: auth.token_type + " " + auth.access_token,
            AuthInformation: 'e066eb926b22e6839792ee3960fc2738ae3a2ab2a41016d5acbc494dde6b67adhE9Bqr51kwF3kEjybRYrUiROfYMZP5M4vIhonYA/idU=',
            authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE2MDQyOTIzNDMsImV4cCI6MTYwNDM3ODc0MywiaXNzIjoiaHR0cHM6Ly9sb2dpbi5zbWFydGN1cnNvcnMubmV0IiwiYXVkIjpbImh0dHBzOi8vbG9naW4uc21hcnRjdXJzb3JzLm5ldC9yZXNvdXJjZXMiLCJyb2xlIiwiY29tcGFueUlkIiwicGFydG5lcklkIiwiVHdvRmFjdG9yRW5hYmxlZCJdLCJjbGllbnRfaWQiOiJTbWFydEN1cnNvclRlbXBQUkQiLCJzdWIiOiJiMzZkMGRlNy00YzI0LTQxMmItYTYwMS1jYzcxNTMzMjQzMGEiLCJhdXRoX3RpbWUiOjE2MDQyOTIyOTUsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiY3VzdG9tLnByb2ZpbGUiLCJyb2xlIiwiY29tcGFueUlkIiwicGFydG5lcklkIiwiVHdvRmFjdG9yRW5hYmxlZCJdLCJhbXIiOlsicHdkIl19.d-fXCLaP4-kpCRpXTNJdadi5u9P-fmn4EJ9weQffDNAD0UtXdSWqCIH9CUHQyH47ZYOnOVu2XygsVii_NbWfVDyvSk7cFLgyav3jy3GlK9q2Vu6iGU7FZjaFpWi1pjwOJzAhO2ezs0s4NaURbgxSItY7zmMq4PCrihmmNPDUkIqfJ9Pdrkw490cMTKka2jq4qbYjCXlUc4O5qrCwrEHjwWdGsA8F1vEt7ggdnNH7KCMVL7JEaL93xPMp9yYzuvvTLeCCWzatYQqM0MRWOTQWPFOfxAjmrLpco7bl9mX5ejjY1slCRvsBY5CnsdhAOU2tJpFGCYdwVRcWKIJItkQIBA'
        },
        onChange(info) {
            if (info.file.status === 'done') {
                openNotificationWithIcon({ title: 'Success', notType: 'success', message: `${info.file.name} file uploaded successfully` });
                values.onFileUploadSuccess(info.fileList)
            } else if (info.file.status === 'error') {
                openNotificationWithIcon({ title: 'Error', notType: 'error', message: `${info.file.name} file uploaded ` });
            }
        },
    };
    return (
        <Upload {...configObj}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    )
}

const mapStateToProps = ({ auth, config }) => {
    return { auth, config }
}
export default connect(mapStateToProps)(UploadComp);
