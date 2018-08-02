import { connect } from 'react-redux';
import { getUid, isAnonymousSelector } from 'state/selectors';
import { signOut } from 'state/auth';
import AppBar from 'components/AppBar';

const mapDispatchToProps = state => ({
  clientUid: getUid(state),
  isAnonymous: isAnonymousSelector(state),
});

export default connect(mapDispatchToProps, { signOut })(AppBar);
