import Entity from "./entity.js";


test('entities start at full health', () => {
  const defaultEnt = new Entity(100);
  expect(defaultEnt.health).toEqual(defaultEnt.maxHealth);
});

test('damaging entities reduces health but not max health', () => {
  const defaultEnt = new Entity(100);
  defaultEnt.damage(25);

  expect(defaultEnt.health).toBe(75);
  expect(defaultEnt.maxHealth).toBe(100);
});

test('entities cannot be healed past max health', () => {
  const defaultEnt = new Entity(100);
  defaultEnt.damage(25);
  let gain = defaultEnt.heal(40);

  expect(defaultEnt.maxHealth).toBe(100);
  expect(defaultEnt.health).toBe(defaultEnt.maxHealth);
  expect(gain).toBe(25);
});

test('boosting health increases health and maximum health', () => {
  const defaultEnt = new Entity(100);
  defaultEnt.boostHealth(35);

  expect(defaultEnt.maxHealth).toBe(135);
  expect(defaultEnt.health).toBe(defaultEnt.maxHealth);
});

test('entities with no health are dead', () => {
  const defaultEnt = new Entity(100);
  defaultEnt.damage(100);

  expect(defaultEnt.isDead()).toBe(true);
});
