import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';

import { signInWithEmail } from 'state/auth';

import AppBarContainer from 'containers/AppBarContainer';

const LoginPage = ({ signInWithEmail: signIn }) => (
  <Fragment>
    <AppBarContainer />
    <Form
      inline
      onSubmit={(event) => {
        event.preventDefault();
        const { login, password } = event.target;

        // TODO: clear inputs

        signIn(login.value, password.value);
      }}
    >
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        {/* NOTE: hidden !!! */}
        <Label for="email-login" className="mr-sm-2" hidden>
          {'Email'}
        </Label>
        <Input type="email" name="login" id="email-login" placeholder="email" />
      </FormGroup>
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="password" className="mr-sm-2" hidden>
          {'Password'}
        </Label>
        <Input type="password" name="password" id="password" placeholder="********" />
      </FormGroup>
      <Button>
        {'Login'}
      </Button>
      {/* <input name="login" type="email" placeholder="Write your login" />
      <input name="password" type="password" placeholder="Write your login" />
      <input type="submit" value="Login" /> */}
      {/* <button type="submit">
        {'Login'}
      </button> */}
    </Form>
  </Fragment>
);

LoginPage.propTypes = {
  signInWithEmail: PropTypes.func.isRequired,
};

export default connect(null, { signInWithEmail })(LoginPage);
