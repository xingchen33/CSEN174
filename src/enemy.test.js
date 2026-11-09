import { ENEMYLIST } from "./enemy.js";

test('damaging/healing works as expected', () => {
  const enemy = ENEMYLIST.pick("Dummy");
  enemy.damage(20);
  expect(enemy.health).toBe(80);
  enemy.heal(15);
  expect(enemy.health).toBe(95);
});

test('dead enemies have no next move', () => {
  const enemy = ENEMYLIST.pick("Dummy");
  enemy.damage(100);
  enemy.getNextMove();

  expect(enemy.nextMove).toBe(null);
});

test('can pick attack', () => {
  const enemy = ENEMYLIST.pick("Dummy");
  enemy.getNextMove(0);
  expect(enemy.moves[0]).toEqual(enemy.nextMove);
  enemy.getNextMove(1);
  expect(enemy.moves[1]).toEqual(enemy.nextMove);
});

test('base attack damage works', () => {
  const enemy = ENEMYLIST.pick("Dummy");
  enemy.getNextMove(0);
  expect(enemy.getAttackDamage()).toBe(20);
});

test('attack damage takes status into account', () => {
  const enemy = ENEMYLIST.pick("Dummy");
  enemy.getNextMove(0);
  enemy.buff("reckless", [3]);
  expect(enemy.getAttackDamage()).toBe(40);
});

test('Slime has its configured health, attribute, and actions', () => {
  const slime = ENEMYLIST.pick("Slime");

  expect(slime.health).toBe(45);
  expect(slime.attribute).toBe("void");
  expect(slime.moves).toEqual([
    {damage: 4, selfEffects: {defense: -2, power: 2}},
    {damage: 3, hits: 2},
  ]);
});

test('Slime applies self effects and multi-hit damage', () => {
  const slime = ENEMYLIST.pick("Slime");
  const player = {health: 20, damage(amount) { this.health -= amount; }};

  slime.getNextMove(0);
  slime.useMove(player);
  expect(slime.defense).toBe(-2);
  expect(slime.power).toBe(2);
  expect(player.health).toBe(16);

  slime.getNextMove(1);
  slime.useMove(player);
  expect(player.health).toBe(10);
});
