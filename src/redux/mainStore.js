import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appReducer';
import dmsReducer from './dmsReducer';
import groupsReducer from './groupsReducer';
import peopleReducer from './peopleReducer';

const mainStore = configureStore({
  reducer: {
    app: appReducer,
    dms: dmsReducer,
    groups: groupsReducer,
    people: peopleReducer
  },
});

export default mainStore;
