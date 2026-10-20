const Card = require("./cardClass")

const defaultCard = new Card("e", "exampleName", "This is the description.", [], 1);

test('energy works as expected unmodified', () => {
  expect(defaultCard.getActualEnergy()).toBe(1);
});

test('energy works as expected unmodified', () => {
  expect(defaultCard.getActualEnergy()).toBe(1);
});
