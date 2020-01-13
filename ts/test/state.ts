import { strict as assert } from 'assert';
import { Enumify } from '../src';

export class State extends Enumify {
  static start = new State({
    done: false,
    accept(x: string) {
      if (x === '1') {
        return State.one;
      } else {
        return State.start;
      }
    },
  });
  static one = new State({
    done: false,
    accept(x: string) {
      if (x === '1') {
        return State.two;
      } else {
        return State.start;
      }
    },
  });
  static two = new State({
    done: false,
    accept(x: string) {
      if (x === '1') {
        return State.three;
      } else {
        return State.start;
      }
    },
  });
  static three = new State({
    done: true,
  });
  static _ = State.closeEnum();

  //#################### Instance

  done!: boolean;
  accept(x: string): State {
    throw new Error('Must be overridden');
  }

  constructor(props: {[k: string]: any}) {
    super();
    Object.defineProperties(
      this, Object.getOwnPropertyDescriptors(props));
  }
}

function run(state: State, inputString: string) {
  const trace = [];
  for (const ch of inputString) {
    if (state.done) {
      break;
    }
    state = state.accept(ch);
    trace.push(`${ch} --> ${state}`);
  }
  return trace;
}

test('run', () => {
  assert.deepEqual(
    run(State.start, '01011100'),
    [
      '0 --> State.start',
      '1 --> State.one',
      '0 --> State.start',
      '1 --> State.one',
      '1 --> State.two',
      '1 --> State.three',
    ]
  );
});
