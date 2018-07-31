import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class PublicWall extends React.Component {
  static propTypes = {
    // checkClientId: PropTypes.func.isRequired,
    clientUid: PropTypes.string,
    isConnecting: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    signIn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    clientUid: null,
  };

  componentDidMount() {
    const { clientUid, signIn } = this.props;
    // prepareWebsocketAndClientId();
    if (clientUid) {
      this.joinWallConditionally();
    } else {
      signIn(); // TODO: add backoff
    }
  }

  componentDidUpdate() {
    const { clientUid, signIn } = this.props;

    console.log('PUBLIC WALL UPDATE');

    if (clientUid) {
      this.joinWallConditionally();
    } else {
      signIn(); // TODO: add backoff
    }
  }

  componentWillUnmount() {
    const { leaveWall } = this.props;

    leaveWall();
  }

  joinWallConditionally() {
    const { isSubscribed, joinWall, isConnecting, checkClientId } = this.props;

    // if (!isSubscribed && checkClientId(clientId)) {
    if (!isSubscribed && !isConnecting) {
      joinWall();
      // joinWall(clientId);
    }
  }

  render() {
    const { posts } = this.props;

    return (
      <ListGroup>
        {posts.map(({ authorId, nickname, createdAt }, index) => {
          return (
            <ListGroupItem key={authorId}>
              {`List Item ${index + 1}`}
              <div style={{ backgroundColor: 'violet' }}>
                {`Author: ${nickname}`}
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
