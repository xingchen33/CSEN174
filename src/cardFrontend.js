// The card markup used by the original card UI.  Keeping this in one place
// makes cards rendered in the game use the same structure and CSS as cards
// rendered elsewhere in the project.
function addClasses(element, ...classes) {
  element.classList.add(...classes);
  return element;
}

function cardItem(cardBase, name) {
  if (name === "base") return cardBase;
  if (name === "contents") return cardBase.querySelector(".card-front-contents");
  if (name === "block") return cardBase.querySelector(".card-block-base");
  return cardBase.querySelector(`.card-${name}`);
}

function assetPath(path) {
  // Card data historically used paths relative to the old HTML location.
  // The Vite pages are served from the project root.
  return path?.startsWith("../") ? path.replace("../", "./") : path;
}

export function generateVisualCard(card) {
  const base = addClasses(document.createElement("div"), "card-base");
  base.id = String(card.id);

  const contents = addClasses(document.createElement("div"), "card-front-contents", "card-item");
  const name = addClasses(document.createElement("div"), "card-name", "card-item");
  const image = addClasses(document.createElement("img"), "card-image", "card-item");
  const type = addClasses(document.createElement("div"), "card-type", "card-item");
  const description = addClasses(document.createElement("div"), "card-description", "card-item");
  const energy = addClasses(document.createElement("div"), "card-energy", "card-item");
  const back = addClasses(document.createElement("img"), "card-back", "card-item");
  const block = addClasses(document.createElement("div"), "card-block-base", "card-item");

  contents.append(name, image, type, description, energy);
  base.append(contents, back, block);

  name.textContent = card.name;
  description.textContent = card.getDescription();
  energy.textContent = card.getEnergy();
  if (card.type === "l") {
    energy.classList.add("hidden");
  }
  const typeLabel = { r: "Ritual", s: "Spell", l: "Logic" }[card.type] ?? card.type;
  type.textContent = card.tags?.attribute
    ? `${typeLabel}, ${card.tags.attribute}`
    : typeLabel;
  image.src = assetPath(card.getImage());
  back.src = assetPath(card.customization?.back_img ?? "./assets/card_back.jpg");

  const customization = card.customization ?? {};
  for (const elementName of ["name", "type", "description", "energy", "block"]) {
    const element = cardItem(base, elementName);
    for (const [modification, value] of Object.entries(customization[elementName] ?? {})) {
      if (modification === "bg-color") element.style.background = value;
      if (modification === "text-color") element.style.color = value;
      if (modification === "b-color") element.style.borderColor = value;
    }
  }

  // A hand card is playable; draw piles use the same card with its back shown.
  base.classList.add("card-selectable");
  block.classList.add("hidden");
  return base;
}

export function drawCardVisual(cardElement) {
  cardElement.classList.remove("card-selectable", "hidden");
  cardElement.classList.add("scaled-down", "flipped");
}

export function playCardVisual(cardElement) {
  cardElement.classList.remove("scaled-down", "flipped", "hidden");
  cardElement.classList.add("card-selectable");
}
