export default class Entity {
  constructor (maxHealth, image="./assets/missing.jpg", customization={}, attribute=null){
    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.image = image;
    this.customization = customization;
    this.attribute = attribute;

    // Status name: list starting with length (can have other elements as well)
    // Statues:
    // ASK fr min 0?
    // - Power: do this much less damage (min 0)
    // - Defense : Take this much less damage (min 0)
    this.statuses = {};
  }

  heal(n) {
    if (this.isDead()) {
      return;
    }

    let old = this.health;
    this.health = Math.min(this.maxHealth, this.health + n);
    return this.health - old;
  }

  damage(n) {
    if (this.isDead()) {
      return;
    }

    if (this.statuses["reckless"]) {
      n *= 2;
    }

    // TEST defense
    n = Math.max(0, n - this.statuses["defense"] ?? 0);

    let old = this.health;
    this.health = Math.max(0, this.health - n);
    return old - this.health;
  }

  boostHealth(n) {
    this.maxHealth += n;
    this.health += n;
  }

  isDead() {
    return this.health <= 0;
  }

  // TEST this hasn't been updated in a billion years
  buff(status, level) {
    if (!this.statuses[status]) {
      this.statuses[status] = 0;
    }

    this.statuses[status] += level;
  }
}
