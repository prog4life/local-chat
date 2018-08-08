import { connect } from 'react-redux';

import { signInIfNeed } from 'state/auth';
import {
  joinWall, leaveWall, fetchWallId, fetchPosts, checkClientId
} from 'state/wall';
import {
  getUid, getWallId, getPosts,
  isSubscribedToWall, isSubscribingToWall, isFetchingPosts,
} from 'state/selectors';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  clientUid: getUid(state),
  wallId: getWallId(state),
  posts: getPosts(state),
  isFetchingPosts: isFetchingPosts(state),
  isSubscribed: isSubscribedToWall(state),
  isSubscribing: isSubscribingToWall(state),
});

export default connect(mapStateToProps, {
  signInIfNeed,
  joinWall,
  leaveWall,
  fetchWallId,
  fetchPosts,
  checkClientId,
})(PublicWall);
