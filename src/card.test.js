const Card = require("./card");

const defaultCard = new Card("e", "exampleName", "This is the description.", [], 1);

test('energy works as expected unmodified', () => {
  expect(defaultCard.getActualEnergy()).toBe(1);
});

test('energy works as expected unmodified', () => {
  expect(defaultCard.getActualEnergy()).toBe(1);
});
