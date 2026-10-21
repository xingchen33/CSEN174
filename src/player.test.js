const player = require('./player');
const card = require('./card');
const player1 = new player();
const card1 = new card("e", "Card 1", "Test Card 1", "Fire", 1, customization={}, tags={});
const card2 = new card("l", "Card 2", "Test Card 2", "Shock", 2, customization={}, tags={});
const card3 = new card("e", "Card 3", "Test Card 3", "Fire", 1, customization={}, tags={});
const card4 = new card("l", "Card 4", "Test Card 4", "Shock", 2, customization={}, tags={});
const card5 = new card("l", "Card 5", "Test Card 5", "Shock", 2, customization={}, tags={});



test("adding card1 should add to the effect cards pile", () => {
    player1.addCard(card1);
    expect(player1.EffectCards.cards).toContain(card1);
    expect(player1.LogicCards.cards).not.toContain(card1);
})

test("adding card2 should add to the logic cards pile", () => {
    player1.addCard(card2);
    expect(player1.EffectCards.cards).not.toContain(card2);
    expect(player1.LogicCards.cards).toContain(card2);
})

test("adding card3 and card4 should add to the effect and logic cards pile", () => {
    player1.addCards([card3, card4]);
    expect(player1.EffectCards.cards).toContain(card3);
    expect(player1.LogicCards.cards).not.toContain(card3);
    expect(player1.LogicCards.cards).toContain(card4);
    expect(player1.EffectCards.cards).not.toContain(card4);
})

test("initially testing with an empty pile and then adding card 1 and then drawing card 1 should work", () =>{
    player1.draw();
    expect(player1.drawPile.cards.length).toBe(0);
    player1.addCard(card1, true);
    expect(player1.drawPile.cards.length).toBe(1);
})

test("adding card 2 and card 3 to the pile and then drawing card 3 should work", () => {
    player1.addCards([card2, card3], true);
    player1.draw();
    expect(player1.drawPile.cards).toContain(card2);
    expect(player1.drawPile.cards).not.toContain(card3);
})

test("reviving cards should move cards from discard to draw pile", () => {
    player1.discardPile.addCards([card4,card5]);
    player1.reviveCards();
    expect(player1.discardPile.cards.length).toBe(0);
})

test("set location should set the location correctly", () => {
    player1.setLocation([10, 40]);
    expect(player1.coords).toEqual([10, 40]);
})

test("update display should work", () => {
    player1.updateAllCardDisplays();
    expect(player1.EffectCards.length).toBe(2);
    expect(player1.LogicCards.length).toBe(3);

    
})




