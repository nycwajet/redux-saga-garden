import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {put, takeEvery} from 'redux-saga/effects';
import logger from 'redux-logger';
import axios from 'axios';

import App from './App';

// this startingPlantArray should eventually be removed

function* deletePlantSaga(action){
  try {
    console.log('deleting', action.payload)
    yield axios.delete('/api/plant/' + action.payload)
    yield put({ type: 'FETCH_PLANTS'})
  }
  catch(error) {
    console.log(`error deleting`, error)
  }
}

function* addPlantSaga(action){
  try{
    console.log('in addPlantSaga');
    yield axios.post('/api/plant', action.payload)
    yield put({type:'FETCH_PLANTS'})
  }catch(error){
    console.log('error in post', error);
  }
}

function* getPlantSaga(action){
  try{
    const response = yield axios.get('/api/plant')
    yield put({type:'SET_PLANT', payload:response.data})
  }catch{
    console.log('errro in getPlantsaga');
  }
}

const plantList = (state = [], action) => {
  switch (action.type) {
    case 'SET_PLANT':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};

function* watcherSaga() {
    yield takeEvery('FETCH_PLANTS', getPlantSaga);
  yield takeEvery('ADD_PLANT', addPlantSaga);
  yield takeEvery('DELETE_PLANT', deletePlantSaga);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger)
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react-root'));
