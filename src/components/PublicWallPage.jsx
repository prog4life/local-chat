import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

// import AppBar from 'components/AppBar';
import AppBarContainer from 'containers/AppBarContainer';
import PublicWallContainer from 'containers/PublicWallContainer';
import AddPostForm from 'containers/AddPostForm';

const PublicWallPage = () => (
  <Fragment>
    <AppBarContainer />
    <Container>
      <Row>
        <Col>
          <PublicWallContainer />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddPostForm />
        </Col>
      </Row>
    </Container>
  </Fragment>
);

export default PublicWallPage;
