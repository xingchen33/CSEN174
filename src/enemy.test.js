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
