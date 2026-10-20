const Card = require("./card");

const defaultCard = new Card("e", "exampleName", "This is the description.", [], 1);
const damageCard = new Card("e", "damangeName", "This card does damage.", [], 1, {damage: 10});

test('energy works as expected unmodified', () => {
  expect(defaultCard.getActualEnergy()).toBe(1);
});

test('damage works as expected unmodified', () => {
  expect(damageCard.getActualDamage()).toBe(10);
});

test('no damage set returns null', () => {
  expect(defaultCard.getActualDamage()).toBe(null);
});

// Location tests

test('getting/setting location works', () => {
  defaultCard.setLocation(5,10);
  expect(defaultCard.getLocation()).toEqual([5, 10]);
});

test('shifting location works', () => {
  defaultCard.setLocation(5,10);
  defaultCard.shiftLocation([20, -5]);
  expect(defaultCard.getLocation()).toEqual([25, 5]);
});
