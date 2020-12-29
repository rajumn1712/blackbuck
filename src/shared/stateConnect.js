import { profileSuccess, updateSearchValue } from "../reducers/auth"

const { connect } = require("react-redux")

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile, user: oidc.user, search_value: oidc.search_value }
}
const mapDispatchToProps = dispath => {
    return {
        updateProfile: (info) => dispath(profileSuccess(info)),
        updateSearchValue: (info) => dispath(updateSearchValue(info))
    }
}
const connectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default connectStateProps;