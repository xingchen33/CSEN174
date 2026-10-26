This should lay out the general architecture. Things have changed a little bit from our

Run: The series of stages that a player is doing. Stores stats about the run in total.
Stage: The specific stage that a player is tackling.
Deck: The player's deck that they take with them from stage to stage. Also stores info about cards in hand vs deck vs graveyard for a stage.
Card: A specific card, including effects and the like. Might need to be split into multiple subclasses.
Enemy: An enemy, including the attacks they can do.
Player: A player, including the state of thier attacks.
Entity: Parent class of Enemy and Player.
