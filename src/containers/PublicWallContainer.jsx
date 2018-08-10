import { connect } from 'react-redux';

import { signInIfNeed } from 'state/auth';
import { joinWall, leaveWall, fetchWallId } from 'state/wall';
import { fetchPosts, deletePost } from 'state/posts';
import {
  getUid, getWallId, getPosts, getDeletedPosts,
  isSubscribedToWall, isSubscribingToWall, isFetchingPosts,
} from 'state/selectors';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  uid: getUid(state),
  wallId: getWallId(state),
  posts: getPosts(state),
  deletedPosts: getDeletedPosts(state),
  isFetchingPosts: isFetchingPosts(state),
  isSubscribed: isSubscribedToWall(state),
  isSubscribing: isSubscribingToWall(state),
});

export default connect(mapStateToProps, {
  signInIfNeed,
  joinWall,
  leaveWall,
  fetchWallId,
  deletePost,
  fetchPosts,
})(PublicWall);
