import { message } from "antd";
import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import Loader from "../../common/loader";
import { profileSuccess } from "../../reducers/auth";
import { fetchProfile } from "../api/apiServer";
import { userManager } from "./auth";
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/messaging'
import { addToken } from "../../db/db";
class CallbackPage extends React.Component {
    handleSuccess = async (user) => {
        const profileResponse = await fetchProfile(user.profile.email);
        if (profileResponse.ok) {
            this.props.updateProfile(profileResponse.data[0]);
            firebase.messaging().getToken().then(token => {
                addToken(token, profileResponse.data[0].Id);
                this.handleRedirect(profileResponse);
            }).catch(error => {
                this.handleRedirect(profileResponse);
            });
        } else {
            message.error("Something went wrong:)")
        }
    }
    handleRedirect = (profileResponse) => {
        if (!profileResponse.data[0]?.IsOnBoardProcess) {
            this.props.history.push("/student_onboard")
        } else {
            const url = localStorage.getItem("__url");
            localStorage.removeItem("__url");
            this.props.history.push(url && url !== "/callback" ? url : "/")
        }
    }
    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                successCallback={(user) => this.handleSuccess(user)}
                errorCallback={error => {
                    console.error(error);
                }}
            >
                <Loader className="loader-middle" />
            </CallbackComponent>
        );
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
const mapDispatchToProps = dispatch => {
    return { updateProfile: (info) => { dispatch(profileSuccess(info)) } }
}
export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);