export default class Entity {
  constructor (maxHealth, image="./assets/missing.jpg", customization={}){
    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.image = image;
    this.customization = customization;

    // Status name: list starting with length (can have other elements as well)
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

  // TODO this should really take non-timed statuses into account
  statusDecay() {
    let thing = {};

    for (let key in this.statuses) {
      let e = this.statuses[key];
      let newlen = e[0] - 1;
      if (newlen > 0) {
        thing[key] = [e[0] - 1, ...e.slice(1)]
      }
    }
  }

  // TODO this should really take non-timed statuses into account
  buff(status, info) {
    if (!this.statuses[status]) {
      this.statuses[status] = info;
    }

    this.statuses[status] = this.statuses[status].map((e, i) => { return e + info[i]});
  }
}
