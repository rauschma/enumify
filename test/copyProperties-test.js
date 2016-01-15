/* global test */
/* global suite */

import * as assert from 'assert';
import {copyProperties} from '../src/enumify';

//-------------------------------------------------
suite('copyProperties');

test('Simple', () => {
    assert.deepStrictEqual(
        copyProperties({foo:1}, {foo:2, bar:2}),
        {foo:2, bar:2}
    );
});
test('Getter', () => {
    const target = {};
    const source = { get foo() { return 1; }};
    const getter = Object.getOwnPropertyDescriptor(source, 'foo').get;
    copyProperties(target, source);
    assert.deepStrictEqual(
        Object.getOwnPropertyDescriptor(target, 'foo'),
        {get:getter, set:undefined, enumerable:true, configurable:true}
    );
});
test('Setter', () => {
    const target = {};
    const source = { set foo(value) {}};
    const setter = Object.getOwnPropertyDescriptor(source, 'foo').set;
    copyProperties(target, source);
    assert.deepStrictEqual(
        Object.getOwnPropertyDescriptor(target, 'foo'),
        {set:setter, get:undefined, enumerable:true, configurable:true}
    );
});
