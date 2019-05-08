import debugFactory from 'debug';
import cameras from './cameras';
const debug = debugFactory('cam-cluster:store');
const _models = {
  cameras
};

function reducer(models, state, modelName, actionName, data) {
  const model = models[modelName];

  if (model) {
    const modelState = model.reducer(state[modelName], actionName, data);

    if (modelState !== state[modelName]) {
      const newState = { ...state,
        [modelName]: modelState
      };
      debug('new state: ', newState);
      return newState;
    }
  }

  const initialState = Object.keys(models).reduce((modelStates, modelName) => {
    const model = models[modelName];
    modelStates[modelName] = model.reducer();
    return modelStates;
  }, {});
  debug('initial state: ', initialState);
  return initialState;
}

function mapActions(models, dispatch) {
  return Object.keys(models).reduce((actions, modelName) => {
    actions[modelName] = mapModelActions(modelName, models[modelName].actions, dispatch);
    return actions;
  }, {});
}

function mapModelActions(modelName, actions, dispatch) {
  return Object.keys(actions).reduce((mappedActions, actionName) => {
    mappedActions[actionName] = (...args) => dispatch(modelName, actionName, actions[actionName](...args));

    return mappedActions;
  }, {});
}

function createStore(models = _models) {
  debug('creating store');
  const actions = mapActions(models, dispatch);
  let state = reducer(models, undefined, undefined, '%%INIT%%');

  function getState() {
    return state;
  }

  function getActions() {
    return actions;
  }

  function dispatch(modelName, actionName, data) {
    state = reducer(models, state, modelName, actionName, data);
  }

  return {
    getState,
    getActions
  };
}

export default createStore();