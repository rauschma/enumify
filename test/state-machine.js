/* global test */
/* global suite */

import * as assert from 'assert';
import {Enum} from '../src/enumify';

class Result extends Enum {}
Result.initEnum(['ACCEPTED', 'REJECTED']);

class State extends Enum {}
State.initEnum({
    START: {
        enter(iter) {
            const {value,done} = iter.next();
            if (done) {
                return Result.REJECTED;
            }
            switch (value) {
                case 'A':
                    return State.A_SEQUENCE;
                default:
                    return Result.REJECTED;
            }
        }
    },
    A_SEQUENCE: {
        enter(iter) {
            const {value,done} = iter.next();
            if (done) {
                return Result.REJECTED;
            }
            switch (value) {
                case 'A':
                    return State.A_SEQUENCE;
                case 'B':
                    return State.B_SEQUENCE;
                default:
                    return Result.REJECTED;
            }
        }
    },
    B_SEQUENCE: {
        enter(iter) {
            const {value,done} = iter.next();
            if (done) {
                return State.ACCEPT;
            }
            switch (value) {
                case 'B':
                    return State.B_SEQUENCE;
                default:
                    return Result.REJECTED;
            }
        }
    },
    ACCEPT: {
        enter(iter) {
            return Result.ACCEPTED;
        }
    },
});
function runStateMachine(str) {
    let iter = str[Symbol.iterator]();
    let state = State.START;
    while (true) {
        state = state.enter(iter);
        switch (state) {
            case Result.ACCEPTED:
                return true;
            case Result.REJECTED:
                return false;
        }
    }
}

//-------------------------------------------------
suite('Enum: state machine')

test('Accepts and rejects properly', () => {
    assert.strictEqual(runStateMachine('AABBB'), true, 'AABBB');
    assert.strictEqual(runStateMachine('AA'), false, 'AA');
    assert.strictEqual(runStateMachine('BBB'), false, 'BBB');
    assert.strictEqual(runStateMachine('AABBC'), false, 'AABBC');
    assert.strictEqual(runStateMachine(''), false, '');
});
