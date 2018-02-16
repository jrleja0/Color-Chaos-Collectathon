import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Room } from './components';
// import { me, fetchUser } from './redux/user';

const Routes = (props) => {
  return (
    <Main>
      <Switch>
        <Route path="/lobby" component={Room} />
        <Redirect to="/lobby" />
      </Switch>
    </Main>
  );
};

export default Routes;
