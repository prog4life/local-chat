import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';

import { addPost } from 'state/posts';
import { getUid } from 'state/selectors';

class AddPostForm extends React.Component {
  static propTypes = {
    createPost: pt.func.isRequired,
    // uid: pt.string.isRequired,
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { createPost, uid } = this.props;

    createPost({
      author: uid,
      nickname: 'Spooky',
      text: event.target.elements['new-post'].value,
      createdAt: Date.now(),
    });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="new-post" hidden>
            {'New Post'}
          </Label>
          <Input
            type="textarea"
            name="new-post"
            id="new-post-message"
            placeholder="Write your message here"
          />
        </FormGroup>
        <Button>
          {'Create Post'}
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  uid: getUid(state),
});

const toDispatch = { createPost: addPost };

export default connect(mapStateToProps, toDispatch)(AddPostForm);
