import React from 'react';

import Card from '../../shared/components/UI/Card';

import UserItem from './UserItem';

import './UserList.css';

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center '>
        <Card>No users found</Card>
      </div>
    );
  }
  return (
    <ul className='users-list'>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
