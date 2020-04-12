import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import SideDrawer from './SideDrawer';
import Backdrop from '../UI/Backdrop';

import './MainNavigation.css';

const MainNavigation = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onOpenDrawerHandler = () => {
    setDrawerOpen(true);
  };

  const onCloseDrawerHandler = () => {
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {drawerOpen && <Backdrop onClick={onCloseDrawerHandler} />}
      <SideDrawer show={drawerOpen}>
        <nav className='main-navigation__drawer-nav'>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className='main-navigation__menu-btn' onClick={onOpenDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className='main-navigation__title'>
          <Link to='/'>YourPlaces</Link>
        </h1>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
