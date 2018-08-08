import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class PublicWall extends React.Component {
  static propTypes = {
    // checkClientId: PropTypes.func.isRequired,
    clientUid: PropTypes.string,
    fetchPosts: PropTypes.func.isRequired,
    fetchWallId: PropTypes.func.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
    signIn: PropTypes.func.isRequired,
    wallId: PropTypes.string,
  }

  static defaultProps = {
    clientUid: null,
    posts: null,
    wallId: null,
  };
  
  // TODO: leave only posts, joinWallConditionally (as it is specific
  // for this component) and action creators/thunks

  componentDidMount() {
    const { wallId, posts, signIn, fetchWallId, fetchPosts } = this.props;
    
    if (!wallId) { // TODO: || prevCity !== currentCity
      fetchWallId('Miami');
      return;
    }
  
    if (!posts || posts.length === 0) { // 2nd is optional
      fetchPosts({ wallId });
    }
    
    // this.signInIfNotLoggedIn();
    signIn();
    this.joinWallConditionally(wallId);

  }

  componentDidUpdate() {
    const { wallId, signIn } = this.props;

    console.log('PUBLIC WALL UPDATE');

    // this.signInIfNotLoggedIn();
    signIn();
    this.joinWallConditionally(wallId);
  }

  componentWillUnmount() {
    const { leaveWall } = this.props;

    leaveWall();
  }
  
  signInIfNotLoggedIn() {
    const { clientUid, signIn } = this.props;
    
    if (!clientUid) {
      signIn(); // TODO: add backoff
    }
  }

  joinWallConditionally(wallId) {
    const { isSubscribed, joinWall, isConnecting, clientUid } = this.props;

    if (clientUid && wallId && !isSubscribed && !isConnecting) {
      joinWall(clientUid, wallId); // TODO: add backoff
    }
  }

  render() {
    const { posts } = this.props;

    return (
      <ListGroup>
        {posts && posts.map(({
          id, authorId, nickname, text, createdAt
        }, index) => {
          return (
            <ListGroupItem key={id}>
              {/* {`List Item ${index + 1}`} */}
              <div style={{ backgroundColor: '#fdececa3' }}>
                {`Author: ${nickname}`}
              </div>
              <div style={{ backgroundColor: '#fffdfd' }}>
                {text}
              </div>
              <div style={{ backgroundColor: 'lemonchifon' }}>
                {`Created at: ${(new Date(createdAt)).toLocaleString('en-GB')}`}
              </div>
              {' '}
              <Link to={`/chats/${authorId}`}>
                {'Chat'}
              </Link>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
}

export default PublicWall;
