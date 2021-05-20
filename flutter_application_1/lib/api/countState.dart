
enum ActionState { 
  Increment
}

CounterState counterReducer(CounterState state, dynamic action) {
  if (action == ActionState.Increment) {
    return CounterState(state.count + 1);
  }

  return state;
}


class CounterState {
  int _count;
  get count => _count;
  CounterState(this._count);
}