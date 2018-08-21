import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

import Post from './Post';

class PublicWall extends React.Component {
  static propTypes = {
    deletePost: PropTypes.func.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    fetchWallId: PropTypes.func.isRequired,
    isFetchingPosts: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
    signInIfNeeded: PropTypes.func.isRequired,
    uid: PropTypes.string,
    wallId: PropTypes.string,
  }

  static defaultProps = {
    posts: null,
    uid: null,
    wallId: null,
  };

  // TODO: leave only posts, joinWallConditionally (as it is specific
  // for this component) and action creators/thunks

  componentDidMount() {
    const {
      wallId, posts, signInIfNeeded, fetchWallId, fetchPosts, isFetchingPosts,
    } = this.props;

    signInIfNeeded();
    // TODO: || prevCity !== currentCity
    // TRY to use for this getSnapshotBeforeUpdate
    if (!wallId) {
      fetchWallId('Miami');
      return;
    }
    this.joinWallConditionally(wallId);

    // posts.length === 0 is optional
    if (!isFetchingPosts && (!posts || posts.length === 0)) {
      fetchPosts({ wallId });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { wallId, signInIfNeeded } = this.props;

    console.log('PublicWall UPDATE, prevProps and this.props: ', prevProps, this.props);

    // TODO: check for error presence to prevent retry loop
    signInIfNeeded();
    this.joinWallConditionally(wallId);
  }

  componentWillUnmount() {
    const { uid, wallId, leaveWall } = this.props;

    leaveWall(uid, wallId);
  }

  // signInIfNotLoggedIn() {
  //   const { uid, signInIfNeeded } = this.props;

  //   if (!uid) {
  //     signInIfNeeded(); // TODO: add backoff
  //   }
  // }

  handleDeletePost = postId => () => {
    const { wallId, deletePost } = this.props;

    deletePost(postId, wallId);
  }

  joinWallConditionally(wallId) { // TODO: rename to maybe...
    const { isSubscribed, joinWall, isSubscribing, uid } = this.props;

    // TODO: check for error presence to prevent retry loop
    // if (joinWallError) {
    //   return;
    // }
    if (uid && wallId && !isSubscribed && !isSubscribing) {
      joinWall(uid, wallId); // TODO: add backoff
    }
  }

  renderListGroup = contents => (
    <ListGroup>
      {contents}
    </ListGroup>
  )

  render() {
    const {
      posts, uid, isSubscribing, isSubscribed, isFetchingPosts,
    } = this.props;
    let listContent = null;
    let listItemContent = null;

    switch (true) {
      case (isSubscribing || !isSubscribed):
      // case (isFetchingPosts && !isSubscribed): // TEMP
        listItemContent = 'Connecting to wall...';
        break;
      case (isFetchingPosts && posts && posts.length > 0):
        // must be loading indicator on top of visible posts
        listItemContent = 'Updating posts...';
        break;
      case (isFetchingPosts):
        listItemContent = 'Loading posts...';
        break;
      case (posts && posts.length === 0):
        listItemContent = 'No posts to show. Try to change filter';
        break;
      case (!posts):
        listItemContent = 'Posts are not loaded yet';
        break;
      default:
        listItemContent = 'Nothing to show. Try to refresh wall or page';
    }

    if (posts && posts.length > 0) {
      listContent = posts.map((post) => {
        return (
          <ListGroupItem key={post.id}>
            <Post uid={uid} {...post} onDelete={this.handleDeletePost} />
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
