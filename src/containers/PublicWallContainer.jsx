import { connect } from 'react-redux';

import { signIn } from 'state/auth';
import {
  joinWall, leaveWall, fetchWallId, fetchPosts, checkClientId
} from 'state/wall';
import {
  getUid, getWallId, getPosts, isSubscribedToWall, isConnectingToWall,
} from 'state/selectors';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  clientUid: getUid(state),
  wallId: getWallId(state),
  posts: getPosts(state),
  isSubscribed: isSubscribedToWall(state),
  isConnecting: isConnectingToWall(state),
});

export default connect(mapStateToProps, {
  signIn,
  joinWall,
  leaveWall,
  fetchWallId,
  fetchPosts,
  checkClientId,
})(PublicWall);
