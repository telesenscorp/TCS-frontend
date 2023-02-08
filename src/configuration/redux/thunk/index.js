const asyncReducer = (kind, next) => (state, action) => {
  if (next) {
    next(state, action);
  }
  switch (kind) {
    case "pending":
      state.isLoading = true;
      state.error = null;
      break;
    case "fulfilled":
      state.isLoading = false;
      state.error = null;
      break;
    case "rejected":
      state.isLoading = false;
      state.error = action.error;
      break;
    default:
      break;
  }
};
export default asyncReducer;
export const createAsyncReducersForThunk = (thunk, onFulfilled = undefined, onReject = undefined) => {
  return {
    [thunk.pending]: asyncReducer("pending"),
    [thunk.rejected]: asyncReducer("rejected", onReject),
    [thunk.fulfilled]: asyncReducer("fulfilled", onFulfilled),
  };
};
export const stateUpdate = (state, { payload }) => {
  Object.assign(state, payload);
};
