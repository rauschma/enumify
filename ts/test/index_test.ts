import { strict as assert } from 'assert';
import { Enumify } from '../src';

test('Color: basic features', () => {
  class Color extends Enumify {
    static red = new Color();
    static orange = new Color();
    static yellow = new Color();
    static green = new Color();
    static blue = new Color();
    static purple = new Color();
    static _ = Color.closeEnum();
  }

  // Instance properties
  assert.equal(
    Color.red.enumKey, 'red');
  assert.equal(
    Color.red.enumOrdinal, 0);
  
  // Prototype methods
  assert.equal(
    'Color: ' + Color.red, // .toString()
    'Color: Color.red');
  
  // Static `.enumKeys` and static `.enumValues`
  assert.deepEqual(
    Color.enumKeys,
    ['red', 'orange', 'yellow', 'green', 'blue', 'purple']);
  assert.deepEqual(
    Color.enumValues,
    [ Color.red, Color.orange, Color.yellow,
      Color.green, Color.blue, Color.purple ]);

  // Static `.enumValueOf()`
  assert.equal(
    Color.enumValueOf('yellow'),
    Color.yellow);
  
  // Iterability
  const result = [];
  const iterated = [...Color];
  for (const c of Color) {
    result.push('Color: ' + c);
  }
  assert.deepEqual(
    iterated, [
      Color.red,
      Color.orange,
      Color.yellow,
      Color.green,
      Color.blue,
      Color.purple,
    ]);
});

test('Instance properties', () => {
  class Weekday extends Enumify {
    static monday = new Weekday(true);
    static tuesday = new Weekday(true);
    static wednesday = new Weekday(true);
    static thursday = new Weekday(true);
    static friday = new Weekday(true);
    static saturday = new Weekday(false);
    static sunday = new Weekday(false);
    static _ = Weekday.closeEnum();

    isWorkDay: boolean;
    constructor(isWorkDay: boolean) {
      super();
      this.isWorkDay = isWorkDay;
    }
  }
  assert.equal(Weekday.sunday.isWorkDay, false);
  assert.equal(Weekday.wednesday.isWorkDay, true);
});

test('switch', () => {
  class Weekday extends Enumify {
    static monday = new Weekday();
    static tuesday = new Weekday();
    static wednesday = new Weekday();
    static thursday = new Weekday();
    static friday = new Weekday();
    static saturday = new Weekday();
    static sunday = new Weekday();
    static _ = Weekday.closeEnum();
  }
  function nextDay(weekday: Weekday) {
    switch (weekday) {
      case Weekday.monday:
        return Weekday.tuesday;
      case Weekday.tuesday:
        return Weekday.wednesday;
      case Weekday.wednesday:
        return Weekday.thursday;
      case Weekday.thursday:
        return Weekday.friday;
      case Weekday.friday:
        return Weekday.saturday;
      case Weekday.saturday:
        return Weekday.sunday;
      case Weekday.sunday:
        return Weekday.monday;
      default:
        throw new Error();
      }
  }
  assert.equal(
    nextDay(Weekday.tuesday), Weekday.wednesday);
  assert.equal(
    nextDay(Weekday.sunday), Weekday.monday);
});

test('Instance getters', () => {
  class Weekday extends Enumify {
    static monday = new Weekday({
      get nextDay() { return Weekday.tuesday }
    });
    static tuesday = new Weekday({
      get nextDay() { return Weekday.wednesday }
    });
    static wednesday = new Weekday({
      get nextDay() { return Weekday.thursday }
    });
    static thursday = new Weekday({
      get nextDay() { return Weekday.friday }
    });
    static friday = new Weekday({
      get nextDay() { return Weekday.saturday }
    });
    static saturday = new Weekday({
      get nextDay() { return Weekday.sunday }
    });
    static sunday = new Weekday({
      get nextDay() { return Weekday.monday }
    });
    static _ = Weekday.closeEnum();
    nextDay!: Weekday;
    constructor(props: {[k: string]: any}) {
      super();
      Object.defineProperties(
        this, Object.getOwnPropertyDescriptors(props));
    }
  }
  assert.equal(
    Weekday.friday.nextDay, Weekday.saturday);
  assert.equal(
    Weekday.sunday.nextDay, Weekday.monday);
});

test('Arbitrary enum values', () => {
  class Mode extends Enumify {
    static user_r = new Mode(0b100000000);
    static user_w = new Mode(0b010000000);
    static user_x = new Mode(0b001000000);
    static group_r = new Mode(0b000100000);
    static group_w = new Mode(0b000010000);
    static group_x = new Mode(0b000001000);
    static all_r = new Mode(0b000000100);
    static all_w = new Mode(0b000000010);
    static all_x = new Mode(0b000000001);
    static _ = Mode.closeEnum();

    constructor(public n: number) {
      super();
    }
  }
  assert.equal(
    Mode.user_r.n | Mode.user_w.n | Mode.user_x.n |
    Mode.group_r.n | Mode.group_x.n |
    Mode.all_r.n | Mode.all_x.n,
    0o755);
  assert.equal(
    Mode.user_r.n | Mode.user_w.n | Mode.user_x.n |
    Mode.group_r.n,
    0o740);  
})