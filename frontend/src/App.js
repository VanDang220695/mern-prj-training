import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import User from './user/pages/Users';
import Auth from './user/pages/Auth';

import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const login = useCallback(() => {
    setIsLogin(true);
  }, []);
  const logout = useCallback(() => {
    setIsLogin(false);
  }, []);

  let routes;

  if (isLogin) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <User />
        </Route>
        <Route path='/:userId/places'>
          <UserPlaces />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/places/:placeId' exact>
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <User />
        </Route>
        <Route path='/:userId/places'>
          <UserPlaces />
        </Route>
        <Route path='/auth' exact>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn: isLogin, login, logout }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
