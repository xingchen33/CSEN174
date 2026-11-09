import Run from "./run.js";

// The game entry point creates one run and starts its first stage when the
// player arrives from the main menu.
const run = new Run("fireballer", "fireballer", 2);
const stage = run.createNextStage();

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
}

function renderEnemies(enemies) {
  const container = document.getElementById("enemies-container");
  const views = [];

  enemies.forEach((enemy, index) => {
    const enemyBase = renderCharacter(enemy, container, "enemy-base", "enemy-image", enemy.name);
    enemyBase.style.right = "8%";
    enemyBase.style.top = `${12 + index * 24}%`;
    views.push({character: enemy, element: enemyBase});
  });

  return views;
}

const playerView = renderCharacter(
  stage.player,
  document.getElementById("player-container"),
  "player-base",
  "player-image",
  "Player",
);
const enemyViews = renderEnemies(stage.enemies);

window.refreshHealthBars = () => {
  updateHealthBar(stage.player, playerView);
  enemyViews.forEach(({character, element}) => updateHealthBar(character, element));
};

// Keep these available while the frontend is being built so controls and
// renderers can use the active game state.
window.currentRun = run;
window.currentStage = stage;

const turnIndicator = document.getElementById("turn-indicator");
if (turnIndicator) {
  turnIndicator.textContent = "Player Action";
}
