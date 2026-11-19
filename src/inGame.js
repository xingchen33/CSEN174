import Run from "./run.js";
import { generateVisualCard, playCardVisual } from "./cardFrontend.js";
import Player from "./player.js";

// The game entry point creates one run and starts its first stage when the
// player arrives from the main menu.
const run = new Run("basic", "basic", 2);
let stage = run.createNextStage();
let pendingCard = null;
let playerView = null;
let enemyViews = [];

function renderCard(card) {
  return generateVisualCard(card);
}

function renderHand(deck, containerId, label) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  container.replaceChildren();

  const heading = document.createElement("h2");
  heading.classList.add("hand-title");
  heading.textContent = label;
  container.appendChild(heading);

  deck.getSortedCards(deck.hand).forEach((card, index) => {
    const cardElement = renderCard(card);
    if (deck === stage.player.cardDeck || deck === stage.player.logicDeck) {
      cardElement.classList.add("can-play");
      cardElement.addEventListener("click", () => handleCardClick(card, deck));
    }
    playCardVisual(cardElement);
    cardElement.style.position = "relative";
    cardElement.style.left = "";
    cardElement.style.top = "";
    cardElement.style.zIndex = String(index + 1);
    container.appendChild(cardElement);
  });
}

function renderDeck(deck, containerId, label) {
  const container = document.getElementById(containerId);
  container.replaceChildren();

  const deckElement = document.createElement("div");
  deckElement.classList.add("draw-deck");
  deckElement.tabIndex = 0;
  deckElement.style.backgroundImage = 'url("./assets/cardBack1.png")';

  const title = document.createElement("strong");
  title.textContent = label;
  deckElement.appendChild(title);

  const count = document.createElement("span");
  count.textContent = `${deck.drawPile.length} cards`;
  deckElement.appendChild(count);

  const tooltip = document.createElement("div");
  tooltip.classList.add("deck-tooltip");
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = deck.drawPile.length
    ? deck
        .getSortedCards(deck.drawPile)
        .map((card) => card.name)
        .join("\n")
    : "Empty";
  deckElement.appendChild(tooltip);

  container.appendChild(deckElement);
}

function renderHands() {
  renderHand(stage.player.logicDeck, "logic-card-play-hand", "Logic hand");
  renderHand(stage.player.cardDeck, "action-card-play-hand", "Card hand");

  renderDeck(stage.player.logicDeck, "logic-card-draw-pile", "Logic deck");
  renderDeck(stage.player.cardDeck, "action-card-draw-pile", "Card deck");
}

function renderCode() {
  const codeZone = document.getElementById("code-zone");
  if (!codeZone) {
    return;
  }

  codeZone.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "Code";
  codeZone.appendChild(heading);

  if (stage.player.currentMove.length === 0) {
    if (!pendingCard) {
      const empty = document.createElement("p");
      empty.textContent = "No code assembled";
      codeZone.appendChild(empty);
    }
  }

  function appendMove(move, path, parent) {
    const entry = document.createElement("div");
    entry.classList.add("code-entry");

    const number = document.createElement("span");
    number.classList.add("code-entry-number");
    number.textContent = `${path.join(".")}.`;
    entry.appendChild(number);

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = move.name ?? "Unnamed action";
    details.appendChild(name);

    const description = document.createElement("small");
    description.textContent = move.description ?? "";
    details.appendChild(description);

    if (move.target && typeof move.target === "object") {
      const target = document.createElement("small");
      target.classList.add("code-entry-target");
      target.textContent = `Target: ${move.target.name ?? "Player"}`;
      details.appendChild(target);
    }

    const isConditionalBlock = move.name === "If" || move.name === "While";
    if (isConditionalBlock || move.condition != null) {
      const condition = document.createElement("small");
      condition.classList.add("code-entry-condition");
      condition.textContent = `Condition: ${formatCodeValue(
        move.condition ?? false,
      )}`;
      details.appendChild(condition);
    }

    entry.appendChild(details);
    parent.appendChild(entry);

    if (Array.isArray(move.block)) {
      const block = document.createElement("div");
      block.classList.add("code-entry-block");
      move.block.forEach((nestedMove, nestedIndex) => {
        appendMove(nestedMove, [...path, nestedIndex + 1], block);
      });
      if (move.block.length === 0) {
        const emptyBlock = document.createElement("small");
        emptyBlock.classList.add("code-entry-empty-block");
        emptyBlock.textContent = "Empty block";
        block.appendChild(emptyBlock);
      }
      parent.appendChild(block);
    }
  }

  stage.player.currentMove.forEach((move, index) => {
    appendMove(move, [index + 1], codeZone);
  });

  function formatCodeValue(value) {
    if (value && typeof value === "object") {
      if (value.trigger) {
        const target =
          value.target?.name ?? (value.target ? "selected target" : "");
        return target ? `${value.trigger} (${target})` : value.trigger;
      }
      return value.name ?? value.description ?? JSON.stringify(value);
    }
    return String(value);
  }

  if (pendingCard) {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.classList.add("cancel-card-button");
    cancelButton.textContent = "Cancel Card";
    cancelButton.addEventListener("click", cancelPendingCard);
    codeZone.appendChild(cancelButton);
  }

  if (pendingCard && !pendingCard.position) {
    const options = document.createElement("div");
    options.classList.add("code-placement-options");

    const prompt = document.createElement("p");
    prompt.textContent = `Place ${pendingCard.card.name}:`;
    options.appendChild(prompt);

    pendingCard.positions.forEach((position, index) => {
      const button = document.createElement("button");
      button.type = "button";
      const displayPosition = position.index.map((part) => part + 1).join(".");
      button.textContent =
        position.type === "condition"
          ? `Condition for ${displayPosition}`
          : `Position ${displayPosition || index + 1}`;
      button.addEventListener("click", () => selectCodePosition(position));
      options.appendChild(button);
    });

    codeZone.appendChild(options);
  }
}

function cardRequiresTarget(card, location = null) {
  if (location?.type === "condition") {
    return card.counters?.requiresTarget === true;
  }

  if (["self", "all", "allEnemies"].includes(card.target)) {
    return false;
  }

  return cardCanTargetEnemy(card) || cardCanTargetPlayer(card);
}

function cardCanTargetEnemy(card, location = null) {
  if (location?.type === "condition" && card.counters?.requiresTarget) {
    return true;
  }

  return (
    card.target === "enemy" ||
    card.target === "a" ||
    card.effects?.damage != null
  );
}

function cardCanTargetPlayer(card, location = null) {
  if (location?.type === "condition" && card.counters?.requiresTarget) {
    return true;
  }

  return (
    card.target === "player" ||
    card.target === "ally" ||
    card.target === "a" ||
    card.effects?.damage != null
  );
}

function handleCardClick(card, deck = stage.player.cardDeck) {
  if (pendingCard) {
    return;
  }

  const cardIndex = deck.hand.indexOf(card);
  if (cardIndex < 0) {
    return;
  }

  if (cardRequiresTarget(card)) {
    pendingCard = {
      card,
      deck,
      cardIndex,
      positions: getCardPositions(card),
    };
    turnIndicator.textContent = `Choose where to place ${card.name}`;
    renderCode();
    return;
  }

  pendingCard = {
    card,
    deck,
    cardIndex,
    positions: getCardPositions(card),
  };
  renderCode();
}

function getCardPositions(card) {
  const positionType =
    { s: "statement", r: "ritual", l: "statement" }[card.type] ?? card.type;
  return stage.player.getValidPositions(positionType);
}

function selectCodePosition(position) {
  if (!pendingCard) {
    return;
  }

  pendingCard.position = position;

  if (cardRequiresTarget(pendingCard.card, position)) {
    turnIndicator.textContent = `Select a target for ${pendingCard.card.name}`;
    if (cardCanTargetEnemy(pendingCard.card, position)) {
      enemyViews.forEach(({ element, character }) => {
        if (!character.isDead()) {
          element.classList.add("targetable");
          element.style.pointerEvents = "auto";
        }
      });
    }
    if (cardCanTargetPlayer(pendingCard.card, position)) {
      playerView.classList.add("targetable");
      playerView.style.pointerEvents = "auto";
    }
    renderCode();
    return;
  }

  playCard(
    pendingCard.cardIndex,
    pendingCard.card.target === "self" ? stage.player : null,
    position,
    pendingCard.deck,
  );
}

function clearTargetSelection() {
  pendingCard = null;
  enemyViews.forEach(({ element }) => {
    element.classList.remove("targetable");
    element.style.pointerEvents = "";
  });
  if (playerView) {
    playerView.classList.remove("targetable");
    playerView.style.pointerEvents = "";
  }
}

function cancelPendingCard() {
  if (!pendingCard) {
    return;
  }

  clearTargetSelection();
  renderCode();
  turnIndicator.textContent = "Player Action";
}

function playCard(cardIndex, target, location, deck = stage.player.cardDeck) {
  const played = stage.player.playCard(cardIndex, target, location, deck);

  if (played) {
    clearTargetSelection();
    renderHands();
    renderCode();
    window.refreshHealthBars();
    turnIndicator.textContent = "Player Action";
  } else {
    // Keep the card pending so the player can try again or use Cancel Card.
    turnIndicator.textContent =
      stage.player.lastPlayError ??
      "The card could not be played. Choose again or cancel.";
  }
}

window.refreshHands = renderHands;
window.refreshCode = renderCode;

function renderCharacter(character, container, baseClass, imageClass, label) {
  if (!container) {
    return;
  }

  const characterBase = document.createElement("article");
  characterBase.classList.add(baseClass);

  const image = document.createElement("img");
  image.classList.add(imageClass);
  image.src = character.image;
  image.alt = label;
  characterBase.appendChild(image);

  const name = document.createElement("p");
  name.classList.add(`${baseClass}-name`);
  name.textContent = label;
  characterBase.appendChild(name);

  const attribute = document.createElement("p");
  attribute.classList.add("entity-attribute");
  attribute.textContent = character.attribute
    ? character.attribute.charAt(0).toUpperCase() + character.attribute.slice(1)
    : "Unknown attribute";
  characterBase.appendChild(attribute);

  const statuses = document.createElement("div");
  statuses.classList.add("entity-statuses");
  characterBase.appendChild(statuses);

  const healthBar = document.createElement("div");
  healthBar.classList.add("health-bar-base");

  const healthFill = document.createElement("div");
  healthFill.classList.add("health-bar-fill");
  healthBar.appendChild(healthFill);

  const healthLabel = document.createElement("span");
  healthLabel.classList.add("health-bar-label");
  healthBar.appendChild(healthLabel);
  characterBase.appendChild(healthBar);

  characterBase.healthBar = { fill: healthFill, label: healthLabel };
  characterBase.statusDisplay = statuses;

  if (baseClass === "player-base") {
    document.getElementById("player-energy")?.remove();
    let playScreen = document.getElementById("play-screen");
    const energy = document.createElement("div");
    energy.id = "player-energy";
    const energyLabel = document.createElement("p");
    energyLabel.innerHTML = "Energy";
    energy.appendChild(energyLabel);
    playScreen.appendChild(energy);
  }

  updateHealthBar(character, characterBase);

  container.appendChild(characterBase);
  return characterBase;
}

function updateHealthBar(character, characterBase) {
  if (!characterBase?.healthBar) {
    return;
  }

  const percentage = Math.max(
    0,
    Math.min(100, (character.health / character.maxHealth) * 100),
  );
  characterBase.healthBar.fill.style.width = `${percentage}%`;
  characterBase.healthBar.label.textContent = `${character.health} / ${character.maxHealth}`;
  updateStatusDisplay(character, characterBase);

  let active_energy = document.getElementById("player-energy");

  if (character instanceof Player) {
    active_energy.textContent = `${character.energy} / ${character.maxEnergy}`;
  }
}

function formatStatusName(status) {
  return status
    .replace(/[-_]/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();
}

function getStatusLevel(value) {
  if (Array.isArray(value)) {
    return value[0] ?? 0;
  }

  if (value && typeof value === "object") {
    return value.level ?? value.value ?? value.amount ?? JSON.stringify(value);
  }

  return value;
}

function updateStatusDisplay(character, characterBase) {
  const display = characterBase?.statusDisplay;
  if (!display) {
    return;
  }

  display.replaceChildren();
  const statuses = Object.entries(character.statuses ?? {});
  display.classList.toggle("hidden", statuses.length === 0);

  statuses.forEach(([status, value]) => {
    const statusElement = document.createElement("span");
    statusElement.classList.add("entity-status");
    statusElement.textContent = `${formatStatusName(status)}: ${getStatusLevel(value)}`;
    display.appendChild(statusElement);
  });
}

function renderEnemies(enemies) {
  const container = document.getElementById("enemies-container");
  const views = [];

  enemies.forEach((enemy, index) => {
    const enemyBase = renderCharacter(
      enemy,
      container,
      "enemy-base",
      "enemy-image",
      enemy.name,
    );
    // enemyBase.style.right = "8%";
    enemyBase.style.right = `${12 + index * 24}%`;
    const action = document.createElement("p");
    action.classList.add("enemy-action");
    enemyBase.appendChild(action);
    enemyBase.actionLabel = action;
    updateEnemyAction(enemy, enemyBase);
    enemyBase.addEventListener("click", () => {
      if (
        pendingCard &&
        !enemy.isDead() &&
        cardCanTargetEnemy(pendingCard.card, pendingCard.position)
      ) {
        playCard(pendingCard.cardIndex, enemy, pendingCard.position);
      }
    });
    views.push({ character: enemy, element: enemyBase });
  });

  return views;
}

function updateEnemyAction(enemy, enemyElement) {
  const move = enemy.nextMove;
  if (!move) {
    enemyElement.actionLabel.textContent = "No action";
    return;
  }

  const actionParts = [];
  if (move.damage != null) {
    actionParts.push(
      `Attack ${move.damage}${move.hits > 1 ? ` x${move.hits}` : ""}`,
    );
  }

  if (move.selfEffects) {
    for (const [stat, amount] of Object.entries(move.selfEffects)) {
      const label = stat.charAt(0).toUpperCase() + stat.slice(1);
      actionParts.push(`Self: ${label} ${amount >= 0 ? "+" : ""}${amount}`);
    }
  }

  if (move.playerEffects) {
    for (const [stat, amount] of Object.entries(move.playerEffects)) {
      const label = stat.charAt(0).toUpperCase() + stat.slice(1);
      actionParts.push(`Player: ${label} ${amount >= 0 ? "+" : ""}${amount}`);
    }
  }

  if (move.heal) {
    actionParts.push(`Heal ${amount}`);
  }

  enemyElement.actionLabel.textContent =
    actionParts.join(" · ") || "Unknown action";
}

function renderStageViews() {
  const playerContainer = document.getElementById("player-container");
  const enemiesContainer = document.getElementById("enemies-container");
  playerContainer.replaceChildren();
  enemiesContainer.replaceChildren();

  playerView = renderCharacter(
    stage.player,
    playerContainer,
    "player-base",
    "player-image",
    "Player",
  );
  playerView.addEventListener("click", () => {
    if (
      pendingCard &&
      cardCanTargetPlayer(pendingCard.card, pendingCard.position)
    ) {
      playCard(
        pendingCard.cardIndex,
        stage.player,
        pendingCard.position,
        pendingCard.deck,
      );
    }
  });
  enemyViews = renderEnemies(stage.enemies);
}

renderStageViews();

window.refreshHealthBars = () => {
  updateHealthBar(stage.player, playerView);
  enemyViews.forEach(({ character, element }) =>
    updateHealthBar(character, element),
  );
};
window.refreshHands = renderHands;

// Keep these available while the frontend is being built so controls and
// renderers can use the active game state.
window.currentRun = run;
window.currentStage = stage;

const turnIndicator = document.getElementById("turn-indicator");
if (turnIndicator) {
  turnIndicator.textContent = "Player Action";
}

const endTurnButton = document.getElementById("end-turn-button");
const gameOverScreen = document.getElementById("game-over-screen");
const runStatsList = document.getElementById("run-stats-list");
const playAgainButton = document.getElementById("play-again-button");
const rewardScreen = document.getElementById("reward-screen");
const rewardOptions = document.getElementById("reward-options");
const rewardStatus = document.getElementById("reward-status");
const skipRewardsButton = document.getElementById("skip-rewards-button");

function showDefeatScreen() {
  if (!gameOverScreen || !runStatsList) {
    return;
  }

  const stats = {
    "Turns survived": stage.turnCount,
    "Damage dealt": stage.stats.damageDone,
    "Damage taken": stage.stats.damageTaken,
    "HP healed": stage.stats.hpHealed,
    "Cards played": stage.stats.cardsPlayed,
  };

  runStatsList.replaceChildren();
  for (const [label, value] of Object.entries(stats)) {
    const name = document.createElement("dt");
    name.textContent = label;
    const amount = document.createElement("dd");
    amount.textContent = value;
    runStatsList.append(name, amount);
  }

  gameOverScreen.hidden = false;
}

if (playAgainButton) {
  playAgainButton.addEventListener("click", () => {
    // Reloading the game entry point constructs a fresh Run and Stage.
    window.location.reload();
  });
}

function rewardLabel(reward) {
  if (reward?.card) {
    return reward.card.name;
  }
  if (reward?.item) {
    return reward.item.name ?? "Item";
  }
  return "Unknown reward";
}

function selectReward(reward, option) {
  if (stage.selectedReward) {
    return;
  }

  if (reward.card) {
    stage.player.cardDeck.drawPile.push(reward.card);
  } else if (reward.item) {
    stage.player.items[reward.item.name] = reward.item;
  }

  stage.selectedReward = reward;
  option.classList.add("selected");
  rewardStatus.textContent = `Selected: ${rewardLabel(reward)}`;
  [...rewardOptions.children].forEach((child) => {
    child.style.pointerEvents = "none";
  });
  startNextStage();
}

function startNextStage() {
  // A won stage has not called Player.passTurn(), so clear its active hand
  // before reusing the run's decks for the next stage.
  stage.player.cardDeck.discardHand();
  stage.player.logicDeck.reshuffleAll();
  clearTargetSelection();
  stage = run.createNextStage();

  gameOverScreen.hidden = true;
  rewardScreen.hidden = true;
  endTurnButton.disabled = false;
  turnIndicator.textContent = `Player Action · Turn ${stage.turnCount + 1}`;
  window.currentStage = stage;
  renderStageViews();
  window.refreshHealthBars();
  window.refreshHands();
  window.refreshCode();
}

function skipRewards() {
  if (!stage.selectedReward) {
    startNextStage();
  }
}

if (skipRewardsButton) {
  skipRewardsButton.addEventListener("click", skipRewards);
}

function showRewards() {
  if (!rewardScreen || !rewardOptions) {
    return;
  }

  rewardOptions.replaceChildren();
  rewardStatus.textContent = "";
  stage.rewards.forEach((reward) => {
    const option = document.createElement("div");
    option.classList.add("reward-option");
    option.tabIndex = 0;
    option.setAttribute("role", "button");

    if (reward.card) {
      const cardElement = generateVisualCard(reward.card);
      playCardVisual(cardElement);
      option.appendChild(cardElement);
    } else {
      const itemName = document.createElement("span");
      itemName.classList.add("reward-item-name");
      itemName.textContent = rewardLabel(reward);
      option.appendChild(itemName);
    }

    option.addEventListener("click", () => selectReward(reward, option));
    option.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectReward(reward, option);
      }
    });
    rewardOptions.appendChild(option);
  });

  rewardScreen.hidden = false;
}

if (endTurnButton) {
  endTurnButton.textContent = "End Turn";
  endTurnButton.addEventListener("click", () => {
    if (pendingCard) {
      clearTargetSelection();
    }
    const result = stage.passTurn();
    window.refreshHealthBars();
    window.refreshHands();
    window.refreshCode();

    enemyViews.forEach(({ character, element }) => {
      element.hidden = character.isDead();
      updateEnemyAction(character, element);
    });

    if (result === "win") {
      turnIndicator.textContent = "Victory";
      endTurnButton.disabled = true;
      showRewards();
    } else if (result === "loss") {
      turnIndicator.textContent = "Defeat";
      endTurnButton.disabled = true;
      showDefeatScreen();
    } else {
      turnIndicator.textContent = `Player Action · Turn ${stage.turnCount + 1}`;
    }
  });
}

window.refreshHands();
window.refreshCode();
