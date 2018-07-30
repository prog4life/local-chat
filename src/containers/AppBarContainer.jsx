import { connect } from 'react-redux';
import { getUid, isAnonymousSelector } from 'reducers';
import { signOut } from 'state/auth';
import AppBar from 'components/AppBar';

const mapDispatchToProps = state => ({
  clientUid: getUid(state),
  isAnonymous: isAnonymousSelector(state),
});

export default connect(mapDispatchToProps, { signOut })(AppBar);
