import React from "react"
import { firestoreConnect, isEmpty } from "react-redux-firebase"
import { connect } from "react-redux"

import { Grid } from "semantic-ui-react"

import UserDetailHeader from "./UserDetailHeader"
import UserDetailSidebar from "./UserDetailSidebar"
import UserDetailPhotos from "./UserDetailPhotos"
import UserDetailPosts from './UserDetailPosts'
import UserDetailDescription from "./UserDetailDescription"
import { userDetailQuery } from "../userQueries"
import Loading from "./Loading"

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0]
    userUid = ownProps.match.params.id
  }

  return {
    profile,
    userUid,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting
  }
}

const UserDetailPage = ({ profile, photos, auth, match, requesting }) => {
  const isCurrentUser = auth.uid === match.params.id
  const loading = Object.values(requesting).some(a => a === true)

  if (loading) return <Loading />

  return (
    <Grid>
      <UserDetailHeader profile={profile} />
      <UserDetailDescription profile={profile} />
      <UserDetailSidebar isCurrentUser={isCurrentUser} />
      {photos && <UserDetailPhotos photos={photos} />}
      <UserDetailPosts />
    </Grid>
  )
}


export default connect(mapState)(
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))(
    UserDetailPage
  )
)
