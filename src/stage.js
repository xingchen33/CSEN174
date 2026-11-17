export default class Stage {
  constructor(player, enemies, rewards) {
    this.player = player;
    this.enemies = enemies;
    this.rewards = rewards;

    this.turnCount = 0;
    this.turn = "player";

    // TODO this should match the stats object in run
    this.stats = {
      damageDone: 0,
      damageTaken: 0,
      cardsPlayed: 0,
      hpHealed: 0,
    };
  }

  // Mostly for debug purposes
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  getTargets(target) {
    if (target === "all") {
      return [this.player, ...this.enemies];
    }
    if (target === "allEnemies") {
      return this.enemies;
    }
    if (target === "self") {
      return [this.player];
    }
    return target && typeof target === "object" ? [target] : [];
  }

  changeStatus(target, status, amount) {
    if (!target || typeof amount !== "number") {
      return;
    }

    target.buff(status, amount);
    if (status === "power" || status === "defense") {
      target[status] = (target[status] ?? 0) + amount;
    }
  }

  dealDamage(target, amount, hits = 1, actionType = "s") {
    if (!target || typeof target.damage !== "function") {
      return;
    }

    let totalDamage = 0;
    for (let hit = 0; hit < hits; hit++) {
      let damage = amount;
      if (target !== this.player) {
        damage += this.player.power ?? 0;
      }
      const bonus = this.player.spellDamageBonus;
      if (
        actionType === "s" &&
        bonus &&
        target !== this.player &&
        target.power < 0
      ) {
        damage += bonus.amount;
      }
      damage = Math.max(0, damage);

      const dealt = target.damage(damage) ?? 0;
      totalDamage += dealt;
      this.stats.damageDone += target === this.player ? 0 : dealt;
      this.stats.damageTaken += target === this.player ? dealt : 0;
    }
    return totalDamage;
  }

  healTarget(target, amount) {
    if (!target || typeof target.heal !== "function") {
      return;
    }

    const healed = target.heal(amount) ?? 0;
    if (target === this.player) {
      this.stats.hpHealed += healed;
    }
  }

  removeNegativeStatuses(target, layers) {
    if (!target?.statuses) {
      return;
    }

    for (const [status, value] of Object.entries(target.statuses)) {
      if (typeof value === "number" && value < 0) {
        const nextValue = Math.min(0, value + layers);
        target.statuses[status] = nextValue;
        if (status === "power" || status === "defense") {
          target[status] = nextValue;
        }
      }
    }
  }

  resolveAction(action) {
    const {key, value, target} = action;
    const targets = this.getTargets(target);

    if (key === "damage") {
      targets.forEach((entity) => this.dealDamage(entity, value, action.hits ?? 1, action.type));
    } else if (key === "allEnemiesDamage") {
      this.enemies.forEach((enemy) => this.dealDamage(enemy, value, 1, action.type));
    } else if (key === "healing") {
      targets.forEach((entity) => this.healTarget(entity, value));
    } else if (key === "heal") {
      this.healTarget(this.player, value);
    } else if (key === "healSelf") {
      this.healTarget(this.player, value);
    } else if (key === "selfDamage") {
      this.dealDamage(this.player, value, 1, "r");
    } else if (key === "block") {
      this.player.blockPts = (this.player.blockPts ?? 0) + value;
    } else if (key === "enemyPower" || key === "power") {
      targets.forEach((entity) => this.changeStatus(entity, "power", value));
    } else if (key === "enemyDefense" || key === "defense") {
      targets.forEach((entity) => this.changeStatus(entity, "defense", value));
    } else if (key === "enemyAttack") {
      targets.forEach((entity) => this.changeStatus(entity, "attack", value));
    } else if (key === "selfDefense") {
      this.changeStatus(this.player, "defense", value);
    } else if (key === "allEnemiesDefense") {
      this.enemies.forEach((enemy) => this.changeStatus(enemy, "defense", value));
    } else if (key === "changeAttribute") {
      this.player.attribute = value;
    } else if (key === "removeNegativeBuffLayers") {
      this.removeNegativeStatuses(this.player, value);
    } else if (key === "draw") {
      this.player.extraDraws += value;
    } else if (key === "trash") {
      const count = Math.min(value, this.player.cardDeck.hand.length);
      this.player.cardDeck.discard(count, Array.from({length: count}, (_, i) => i));
    } else if (key === "damagePerBlock") {
      const damage = Math.floor((this.player.blockPts ?? 0) / value.every) * value.amount;
      this.enemies.forEach((enemy) => this.dealDamage(enemy, damage, 1, action.type));
    } else if (key === "damagePerBattleHealing") {
      targets.forEach((entity) => this.dealDamage(entity, this.stats.hpHealed * value, 1, action.type));
    } else if (key === "spellDamageBonus") {
      this.player.spellDamageBonus = {
        amount: value,
        condition: action.condition,
        duration: action.duration ?? "turn",
      };
    } else if (key === "nextTurnEnergy") {
      this.player.nextTurnEnergy = (this.player.nextTurnEnergy ?? 0) + value;
    } else if (key === "onAttacked") {
      this.player.onAttackedEffects = value;
    } else if (key === "playFromTrash") {
      const index = this.player.cardDeck.graveyard.findIndex((card) =>
        card.tags?.attribute === value.attribute && card.type === value.type,
      );
      if (index >= 0) {
        this.player.cardDeck.hand.push(this.player.cardDeck.graveyard.splice(index, 1)[0]);
      }
    } else if (key === "playNatural") {
      const index = this.player.cardDeck.hand.findIndex(
        (card) => card.tags?.attribute === "natural",
      );
      if (index >= 0) {
        const card = this.player.cardDeck.hand.splice(index, 1)[0];
        this.player.cardDeck.graveyard.push(card);
        const nestedActions = this.player.useMove([{
          type: card.type,
          effects: card.effects,
          target,
        }]);
        nestedActions.forEach((nestedAction) => this.resolveAction(nestedAction));
      }
    }
  }

  passTurn() {
    const actions = this.player.useMove();
    actions.forEach((action) => this.resolveAction(action));

    this.enemies = this.enemies.filter((enemy) => !enemy.isDead());

    if (this.enemies.length === 0) {
      return "win";
    }

    this.enemies.forEach((enemy) => {
      const healthBeforeAttack = this.player.health;
      enemy.useMove(this.player);
      this.stats.damageTaken += Math.max(0, healthBeforeAttack - this.player.health);
      if (this.player.onAttackedEffects) {
        for (const [effect, amount] of Object.entries(this.player.onAttackedEffects)) {
          if (effect === "enemyPower") {
            this.changeStatus(enemy, "power", amount);
          } else if (effect === "power") {
            this.changeStatus(this.player, "power", amount);
          }
        }
      }
    });
    if (this.player.isDead()) {
      return "loss";
    }

    const extraEnergy = this.player.nextTurnEnergy ?? 0;
    this.player.passTurn();
    this.player.energy += extraEnergy;
    this.player.nextTurnEnergy = 0;
    this.player.onAttackedEffects = null;
    this.player.spellDamageBonus = null;
    this.player.extraDraws = 0;
    this.enemies.forEach((enemy) => enemy.passTurn());
    this.turnCount += 1;
    this.turn = "player";
    return "continue";
  }

  nextTurn() {
    return this.passTurn();
  }
}
