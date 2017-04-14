/* global test */
/* global suite */

import * as assert from 'assert';
import {Enum} from '../src/enumify';

//-------------------------------------------------
suite('Enum: simple');

class Color extends Enum {}
Color.initEnum(['RED', 'GREEN', 'BLUE']);

test('instanceof', () => {
    assert.ok(Color.RED instanceof Color);
});

test('toString', () => {
    assert.strictEqual(String(Color.RED), 'Color.RED');
});

test('ordinal', () => {
    assert.strictEqual(Color.GREEN.ordinal, 1);
});
test('fromOrdinal', () => {
    assert.strictEqual(Color.fromOrdinal(1), Color.GREEN);
});
test('enumValueOf', () => {
    assert.strictEqual(Color.enumValueOf('BLUE'), Color.BLUE);
});
test('enumValues', () => {
    assert.deepStrictEqual(Color.enumValues, [Color.RED, Color.GREEN, Color.BLUE]);
});
test('Class is closed (can’t be instantiated)', () => {
    assert.throws(() => {
        new Color();
    });
});

//-------------------------------------------------
suite('Enum: custom constructor and instance method');

class TicTacToeColor extends Enum {}

// Alas, data properties don’t work, because the enum
// values (TicTacToeColor.X etc.) don’t exist when
// the object literals are evaluated.
TicTacToeColor.initEnum({
    O: {
        get inverse() { return TicTacToeColor.X },
    },
    X: {
        get inverse() { return TicTacToeColor.O },
    },
});

test('Custom instance method', () => {
    assert.strictEqual(TicTacToeColor.X.inverse, TicTacToeColor.O);
    assert.strictEqual(TicTacToeColor.O.inverse, TicTacToeColor.X);
});
test('toString', () => {
    assert.strictEqual(String(TicTacToeColor.O), 'TicTacToeColor.O');
});
test('ordinal', () => {
    assert.strictEqual(TicTacToeColor.O.ordinal, 0);
    assert.strictEqual(TicTacToeColor.X.ordinal, 1);
});
test('fromOrdinal', () => {
    assert.strictEqual(TicTacToeColor.fromOrdinal(1),TicTacToeColor.X);
});

//-------------------------------------------------
suite('Enum: custom prototype method')

class Weekday extends Enum {
    isBusinessDay() {
        switch (this) {
            case Weekday.SATURDAY:
            case Weekday.SUNDAY:
                return false;
            default:
                return true;
        }
    }
}
Weekday.initEnum([
    'MONDAY', 'TUESDAY', 'WEDNESDAY',
    'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
test('Custom prototype method', () => {
    assert.strictEqual(Weekday.SATURDAY.isBusinessDay(), false);
    assert.strictEqual(Weekday.MONDAY.isBusinessDay(), true);
});

//-------------------------------------------------
suite('Enum: flags')

class Mode extends Enum {}
Mode.initEnum({
    USER_R: {
        n: 0b100000000,
    },
    USER_W: {
        n: 0b010000000,
    },
    USER_X: {
        n: 0b001000000,
    },
    GROUP_R: {
        n: 0b000100000,
    },
    GROUP_W: {
        n: 0b000010000,
    },
    GROUP_X: {
        n: 0b000001000,
    },
    ALL_R: {
        n: 0b000000100,
    },
    ALL_W: {
        n: 0b000000010,
    },
    ALL_X: {
        n: 0b000000001,
    },
});
test('Using the flags', () => {
    assert.strictEqual(
        Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n |
        Mode.GROUP_R.n | Mode.GROUP_X.n |
        Mode.ALL_R.n | Mode.ALL_X.n,
        0o755);
    assert.strictEqual(
        Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n | Mode.GROUP_R.n,
        0o740);
});
