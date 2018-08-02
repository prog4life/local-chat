import { connect } from 'react-redux';

import { signIn } from 'state/auth';
import { joinWall, leaveWall, checkClientId } from 'state/wall';
import { getUid, getPosts, isSubscribedToWall, isConnectingToWall } from 'state/selectors';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  clientUid: getUid(state),
  posts: getPosts(state),
  isSubscribed: isSubscribedToWall(state),
  isConnecting: isConnectingToWall(state),
});

export default connect(mapStateToProps, {
  signIn,
  joinWall,
  leaveWall,
  checkClientId,
})(PublicWall);
