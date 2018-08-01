import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';

import { createPost } from 'state/wall';

class WallPostForm extends React.Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const { createNewPost } = this.props;

    createNewPost(event.target.elements['new-post'].value);
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

export default connect(null, { createNewPost: createPost })(WallPostForm);
