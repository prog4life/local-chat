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
    isFetchingPosts: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
    signInIfNeed: PropTypes.func.isRequired,
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
    const { wallId, posts, signInIfNeed, fetchWallId, fetchPosts } = this.props;
    
    if (!wallId) { // TODO: || prevCity !== currentCity
      fetchWallId('Miami');
      return;
    }

    signInIfNeed();
    this.joinWallConditionally(wallId);
  
    if (!posts || posts.length === 0) { // 2nd is optional
      fetchPosts({ wallId });
    }
  }

  componentDidUpdate() {
    const { wallId, signInIfNeed } = this.props;

    console.log('PUBLIC WALL UPDATE');

    signInIfNeed();
    this.joinWallConditionally(wallId);
  }

  componentWillUnmount() {
    const { leaveWall } = this.props;

    leaveWall();
  }
  
  // signInIfNotLoggedIn() {
  //   const { clientUid, signInIfNeed } = this.props;
    
  //   if (!clientUid) {
  //     signInIfNeed(); // TODO: add backoff
  //   }
  // }

  joinWallConditionally(wallId) {
    const { isSubscribed, joinWall, isSubscribing, clientUid } = this.props;

    if (clientUid && wallId && !isSubscribed && !isSubscribing) {
      joinWall(clientUid, wallId); // TODO: add backoff
    }
  }
  
  renderListGroup(contents) {
    return (
      <ListGroup>
        {contents}
      </ListGroup>
    );
  }

  render() {
    const { posts, isSubscribing, isFetchingPosts } = this.props;
    let listContent = null;
    let listItemContent = null;
    
    switch (true) {
      case (isSubscribing):
        listItemContent = 'Connecting to wall...';
        break;
      case (isFetchingPosts && posts && posts.length > 0):
        listItemContent = 'Updating posts...';
        break;
      case (isFetchingPosts):
        listItemContent = 'Loading posts...';
        break;
      case (posts && posts.length === 0):
        listItemContent = 'No posts to show. Try to change filter parameters';
        break;
      case (!posts):
        listItemContent = 'Posts are not loaded yet';
        break;
      default:
        listItemContent = 'Nothing to show. Try to refresh wall';
    }
    
    if (posts && posts.length > 0) {
      listContent = posts.map(({ id, author, nickname, text, createdAt }) => {
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
            <Link to={`/chats/${author}`}>
              {'Chat'}
            </Link>
          </ListGroupItem>
        );
      });
      return this.renderListGroup(listContent);
    }

    listContent = (
      <ListGroupItem>
        {listItemContent}
      </ListGroupItem>
    );
    return this.renderListGroup(listContent);

    // return (
    //   <ListGroup>
    //     {posts && posts.map(({
    //       id, authorId, nickname, text, createdAt
    //     }, index) => {
    //       return (
    //         <ListGroupItem key={id}>
    //           {/* {`List Item ${index + 1}`} */}
    //           <div style={{ backgroundColor: '#fdececa3' }}>
    //             {`Author: ${nickname}`}
    //           </div>
    //           <div style={{ backgroundColor: '#fffdfd' }}>
    //             {text}
    //           </div>
    //           <div style={{ backgroundColor: 'lemonchifon' }}>
    //             {`Created at: ${(new Date(createdAt)).toLocaleString('en-GB')}`}
    //           </div>
    //           {' '}
    //           <Link to={`/chats/${authorId}`}>
    //             {'Chat'}
    //           </Link>
    //         </ListGroupItem>
    //       );
    //     })}
    //   </ListGroup>
    // );
  }
}

export default PublicWall;
