import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect, useFirebase } from "react-redux-firebase";

import { Grid } from "semantic-ui-react";

import UserDetailDescription from "./UserDetailDescription";
import UserDetailEvents from "./UserDetailEvents";
import UserDetailHeader from "./UserDetailHeader";
import UserDetailPhotos from "./UserDetailPhotos";
import UserDetailSidebar from "./UserDetailSidebar";
import { getUserEvents } from "../userActions";

const UserDetailedPage = ({ match: { params } }) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const isCurrentUser = firebase.auth().currentUser.uid === params.id;

  const userProfileQuery = useMemo(
    () => ({
      collection: "users",
      doc: params.id,
      storeAs: "userProfile",
    }),
    [params.id]
  );

  const userPhotosQuery = useMemo(
    () => ({
      collection: "users",
      doc: params.id,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos",
    }),
    [params.id]
  );

  useFirestoreConnect(userProfileQuery);
  useFirestoreConnect(userPhotosQuery);

  const profile = useSelector(
    (state) =>
      (state.firestore.ordered.userProfile &&
        state.firestore.ordered.userProfile[0]) ||
      {}
  );

  const photos = useSelector(
    (state) => state.firestore.ordered.photos && state.firestore.ordered.photos
  );

  const userEvents = useSelector((state) => state.user.events) || [];

  const loading = useSelector((state) => state.async.loading);

  useEffect(() => {
    dispatch(getUserEvents(params.id));
  }, [dispatch, params]);

  const handleChangeTab = async (e, data) => {
    console.log(data);
    dispatch(getUserEvents(params.id, data.activeIndex));
  };

  return (
    <Grid>
      <UserDetailHeader profile={profile} />

      <UserDetailDescription profile={profile} />
      <UserDetailSidebar isCurrentUser={isCurrentUser} />

      {photos && photos.length > 0 && <UserDetailPhotos photos={photos} />}

      <UserDetailEvents
        changeTab={handleChangeTab}
        events={userEvents}
        loading={loading}
      />
    </Grid>
  );
};

export default UserDetailedPage;
