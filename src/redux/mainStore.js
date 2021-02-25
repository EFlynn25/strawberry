import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import dmsReducer from './dmsReducer';
import groupsReducer from './groupsReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    dms: dmsReducer,
    groups: groupsReducer
  },
});
