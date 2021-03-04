import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import dmsReducer from './dmsReducer';
import groupsReducer from './groupsReducer';
import peopleReducer from './peopleReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    dms: dmsReducer,
    groups: groupsReducer,
    people: peopleReducer
  },
});
