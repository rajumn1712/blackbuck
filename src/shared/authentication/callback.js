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
class CallbackPage extends React.Component {
    handleSuccess = async (user) => {
        const profileResponse = await fetchProfile(user.profile.email);
        if (profileResponse.ok) {
            this.props.updateProfile(profileResponse.data[0]);
            firebase.messaging().getToken().then(token => {
                firebase.firestore().collection("devices").doc(profileResponse.data[0].Id).collection("tokens").add({
                    token
                });
                if (!profileResponse.data[0]?.IsOnBoardProcess) {
                    this.props.history.push("/student_onboard")
                } else {
                    const url = localStorage.getItem("__url");
                    localStorage.removeItem("__url");
                    this.props.history.push(url && url !== "/callback" ? url : "/")
                }
            })

        } else {
            message.error("Something went wrong:)")
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