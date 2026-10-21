const cardGroup = require('./cardGroup');
const cardgroup = new cardGroup("hand", visuals={"spread": 40, "h": 5, "w": 20, "origin": [50,70]});
const cardgroup2 = new cardGroup("pile", visuals={"spread": 40, "h": 5, "w": 20, "origin": [50,70]});

const card = require('./card');
const card1 = new card("e", "Card 1", "Test Card 1", "Fire", 1, customization={}, tags={});
const card2 = new card("e", "Card 2", "Test Card 2", "Shock", 2, customization={}, tags={});


test("addCard adds Card 1 and Card 2 to cardgroup hand", () => {
    cardgroup.addCards([card1, card2]);
    expect(cardgroup.cards).toContain(card1);
    expect(cardgroup.cards).toContain(card2);
})

test("the displays should be updated in the hand after cards are added", () => {
    cardgroup.updateDisplay();
    expect(cardgroup.cards[0].name).toBe("Card 1");
    expect(cardgroup.cards[1].name).toBe("Card 2");

})
test("The cards should be added to the hand", () => {
    cardgroup2.addCards([card1, card2]);
    expect(cardgroup2.cards).toContain(card1);
    expect(cardgroup2.cards).toContain(card2);
})
test("the displays should be updated in the hand after cards are added", () => {
    cardgroup2.updateDisplay();
    expect(cardgroup.cards[0].name).toBe("Card 1");
    expect(cardgroup.cards[1].name).toBe("Card 2");

})


test("discarded cards should return the discarded cards", () =>{
    card1.discarded = true;
    cardgroup.discarded();
    cardgroup2.discarded();
    expect(cardgroup.cards).toEqual([card2]);
    expect(cardgroup2.cards).toEqual([card2]);
})

test("take top should take the top card from the pile", () => {
    cardgroup.takeTop();
    cardgroup2.takeTop();
    expect(cardgroup.cards).toEqual([]);
    expect(cardgroup2.cards).toEqual([]);
})




