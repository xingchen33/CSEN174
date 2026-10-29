import Card from "./card.js";

const defaultCard = new Card("e", "exampleName", "This is the description.", {}, 1);
const damageCard = new Card("e", "damageName", "This card does damage.", {damage: 10}, 1);
const overchargedCard = new Card("e", "damageName", "This card does damage, and is overcharged.", {damage: 15, overcharged: true}, 1);


test('energy works as expected unmodified', () => {
  expect(defaultCard.getEnergy()).toBe(1);
});

test('damage works as expected unmodified', () => {
  expect(damageCard.getDamage()).toBe(10);
});

test('no damage set returns null', () => {
  expect(defaultCard.getDamage()).toBe(null);
});

test('overcharging increases damage', () => {
  expect(overchargedCard.getDamage()).toBe(30);
});

test('overcharging increases energy', () => {
  expect(overchargedCard.getEnergy()).toBe(2);
});
