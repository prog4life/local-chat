import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { subscribeToWall } from 'state/wall';

test('subscribeToWall saga test', (assert) => {
  const testAction = { type: 'TEST_TYPE' };
  const gen = subscribeToWall();

  // gen.next(); // => { done: false, value: <value returned by first put(...)> }
  // gen.next(); // => { done: false, value: <value returned by api call(Promise)> }
  // gen.next(); // => { done: false, value: <value returned by last put(...)> }
  // gen.next(); // => {
  //   done: false,
  //   value: undefined (since no more yield and no return'ed value)
  // }

  // expect(gen.next().value).toDeepEqual(call(delay, 1000));

  expect(gen.next().value).toDeepEqual(put({
    type: 'subscribeToWall SAGA started',
    testAction,
  }));
  expect(gen.next().value).toEqual({ done: true, value: undefined });
});
