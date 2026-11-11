import Run from "./run.js";
import { generateVisualCard, playCardVisual } from "./cardFrontend.js";

// The game entry point creates one run and starts its first stage when the
// player arrives from the main menu.
const run = new Run("basic", "basic", 2);
const stage = run.createNextStage();
let pendingCard = null;

function renderCard(card) {
  return generateVisualCard(card);
}

function renderHand(deck, containerId, label) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.replaceChildren();

  const heading = document.createElement("h2");
  heading.classList.add("hand-title");
  heading.textContent = label;
  container.appendChild(heading);

  deck.getSortedCards(deck.hand).forEach((card, index) => {
    const cardElement = renderCard(card);
    if (deck === stage.player.cardDeck) {
      cardElement.classList.add("can-play");
      cardElement.addEventListener("click", () => handleCardClick(card));
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
  deckElement.style.backgroundImage = 'url("./assets/card_back.jpg")';

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
    ? deck.getSortedCards(deck.drawPile).map((card) => card.name).join("\n")
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

  stage.player.currentMove.forEach((move, index) => {
    const entry = document.createElement("div");
    entry.classList.add("code-entry");

    const number = document.createElement("span");
    number.classList.add("code-entry-number");
    number.textContent = `${index + 1}.`;
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

    entry.appendChild(details);
    codeZone.appendChild(entry);
  });

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
      button.textContent = `Position ${index + 1}`;
      button.addEventListener("click", () => selectCodePosition(position));
      options.appendChild(button);
    });

    codeZone.appendChild(options);
  }
}

function cardRequiresTarget(card) {
  if (["self", "all", "allEnemies"].includes(card.target)) {
    return false;
  }

  return cardCanTargetEnemy(card) || cardCanTargetPlayer(card);
}

function cardCanTargetEnemy(card) {
  return card.target === "enemy" || card.target === "a" || card.effects?.damage != null;
}

function cardCanTargetPlayer(card) {
  return card.target === "player"
    || card.target === "ally"
    || card.target === "a"
    || card.effects?.damage != null;
}

function handleCardClick(card) {
  if (pendingCard) {
    return;
  }

  const cardIndex = stage.player.cardDeck.hand.indexOf(card);
  if (cardIndex < 0) {
    return;
  }

  if (cardRequiresTarget(card)) {
    pendingCard = {
      card,
      cardIndex,
      positions: getCardPositions(card),
    };
    turnIndicator.textContent = `Choose where to place ${card.name}`;
    renderCode();
    return;
  }

  pendingCard = {
    card,
    cardIndex,
    positions: getCardPositions(card),
  };
  renderCode();
}

function getCardPositions(card) {
  const positionType = {s: "statement", r: "ritual", l: "statement"}[card.type] ?? card.type;
  return stage.player.getValidPositions(positionType);
}

function selectCodePosition(position) {
  if (!pendingCard) {
    return;
  }

  pendingCard.position = position;

  if (cardRequiresTarget(pendingCard.card)) {
    turnIndicator.textContent = `Select a target for ${pendingCard.card.name}`;
    if (cardCanTargetEnemy(pendingCard.card)) {
      enemyViews.forEach(({element, character}) => {
        if (!character.isDead()) {
          element.classList.add("targetable");
          element.style.pointerEvents = "auto";
        }
      });
    }
    if (cardCanTargetPlayer(pendingCard.card)) {
      playerView.classList.add("targetable");
      playerView.style.pointerEvents = "auto";
    }
    renderCode();
    return;
  }

  playCard(pendingCard.cardIndex, pendingCard.card.target === "self" ? stage.player : null, position);
}

function clearTargetSelection() {
  pendingCard = null;
  enemyViews.forEach(({element}) => {
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

function playCard(cardIndex, target, location) {
  const played = stage.player.playCard(cardIndex, target, location);
  clearTargetSelection();

  if (played) {
    renderHands();
    renderCode();
    window.refreshHealthBars();
    turnIndicator.textContent = "Player Action";
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

  const healthBar = document.createElement("div");
  healthBar.classList.add("health-bar-base");

  const healthFill = document.createElement("div");
  healthFill.classList.add("health-bar-fill");
  healthBar.appendChild(healthFill);

  const healthLabel = document.createElement("span");
  healthLabel.classList.add("health-bar-label");
  healthBar.appendChild(healthLabel);
  characterBase.appendChild(healthBar);

  characterBase.healthBar = {fill: healthFill, label: healthLabel};

  if (baseClass === "player-base") {
    let playScreen = document.getElementById("play-screen")
    const energy = document.createElement("div");
    energy.id = "player-energy";
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

  const percentage = Math.max(0, Math.min(100, (character.health / character.maxHealth) * 100));
  characterBase.healthBar.fill.style.width = `${percentage}%`;
  characterBase.healthBar.label.textContent = `${character.health} / ${character.maxHealth}`;

  let active_energy = document.getElementById("player-energy")

  if (active_energy) {
    active_energy.textContent = `Energy: ${character.energy} / ${character.maxEnergy}`;
  }
}

function renderEnemies(enemies) {
  const container = document.getElementById("enemies-container");
  const views = [];

  enemies.forEach((enemy, index) => {
    const enemyBase = renderCharacter(enemy, container, "enemy-base", "enemy-image", enemy.name);
    enemyBase.style.right = "8%";
    // enemyBase.style.top = `${12 + index * 24}%`;
    enemyBase.style.top = "12%"
    const action = document.createElement("p");
    action.classList.add("enemy-action");
    enemyBase.appendChild(action);
    enemyBase.actionLabel = action;
    updateEnemyAction(enemy, enemyBase);
    enemyBase.addEventListener("click", () => {
      if (pendingCard && !enemy.isDead() && cardCanTargetEnemy(pendingCard.card)) {
        playCard(pendingCard.cardIndex, enemy, pendingCard.position);
      }
    });
    views.push({character: enemy, element: enemyBase});
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
    actionParts.push(`Attack ${move.damage}${move.hits > 1 ? ` x${move.hits}` : ""}`);
  }

  if (move.selfEffects) {
    for (const [stat, amount] of Object.entries(move.selfEffects)) {
      const label = stat.charAt(0).toUpperCase() + stat.slice(1);
      actionParts.push(`${label} ${amount >= 0 ? "+" : ""}${amount}`);
    }
  }

  enemyElement.actionLabel.textContent = actionParts.join(" · ") || "Unknown action";
}

const playerView = renderCharacter(
  stage.player,
  document.getElementById("player-container"),
  "player-base",
  "player-image",
  "Player",
);
playerView.addEventListener("click", () => {
  if (pendingCard && cardCanTargetPlayer(pendingCard.card)) {
    playCard(pendingCard.cardIndex, stage.player, pendingCard.position);
  }
});
const enemyViews = renderEnemies(stage.enemies);

window.refreshHealthBars = () => {
  updateHealthBar(stage.player, playerView);
  enemyViews.forEach(({character, element}) => updateHealthBar(character, element));
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
if (endTurnButton) {
  endTurnButton.textContent = "End Turn";
  endTurnButton.addEventListener("click", () => {
    const result = stage.passTurn();
    window.refreshHealthBars();
    window.refreshHands();
    window.refreshCode();

    enemyViews.forEach(({character, element}) => {
      element.hidden = character.isDead();
      updateEnemyAction(character, element);
    });

    if (result === "win") {
      turnIndicator.textContent = "Victory";
      endTurnButton.disabled = true;
    } else if (result === "loss") {
      turnIndicator.textContent = "Defeat";
      endTurnButton.disabled = true;
    } else {
      turnIndicator.textContent = `Player Action · Turn ${stage.turnCount + 1}`;
    }
  });
}

window.refreshHands();
window.refreshCode();
