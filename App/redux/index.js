export function updateSumValueFirst(num) {
  return {
    type: types.CALCULATOR_UPDATE_SUM_FIRST,
    payload: num,
  };
}

export function updateSumValueSecond(num) {
  return {
    type: types.CALCULATOR_UPDATE_SUM_SECOND,
    payload: num,
  };
}

const ActionCreators = Object.assign({
  updateSumValueFirst,
  updateSumValueSecond,
});

const types = {
  CALCULATOR_UPDATE_SUM_FIRST: "CALCULATOR_UPDATE_SUM_FIRST",
  CALCULATOR_UPDATE_SUM_SECOND: "CALCULATOR_UPDATE_SUM_SECOND",
};

const defaultState = {
  result: 0,
  sumInfo: {
    frist: 0,
    second: 0,
  },
};

export default calculator = (state = defaultState, action) => {
  // For Debugger
  // console.log('payload:' + action.payload);

  switch (action.type) {
    case types.CALCULATOR_UPDATE_SUM_FIRST:
      return {
        // ...state,
        result: action.payload + state.sumInfo.second,
        sumInfo: {
          frist: action.payload,
          second: state.sumInfo.second,
        },
      };
    case types.CALCULATOR_UPDATE_SUM_SECOND:
      return {
        // ...state,
        result: action.payload + state.sumInfo.frist,
        sumInfo: {
          frist: state.sumInfo.frist,
          second: action.payload,
        },
      };
    default:
      return state;
  }
};

import { combineReducers, createStore } from "redux";
import CalculatorReducer from "./calculatorReducer";

export default combineReducers({
  calculator: CalculatorReducer,
});

import reducers from "../reducers";

export default function initStore() {
  const store = createStore(
    reducers,
    applyMiddleware()
    // Middleware will not be applied to this sample.
  );
  return store;
}
