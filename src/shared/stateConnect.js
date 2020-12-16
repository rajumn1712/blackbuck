import { profileSuccess } from "../reducers/auth"

const { connect } = require("react-redux")

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile, user: oidc.user }
}
const mapDispatchToProps = dispath => {
    return {
        updateProfile: (info) => dispath(profileSuccess(info))
    }
}
const connectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default connectStateProps;