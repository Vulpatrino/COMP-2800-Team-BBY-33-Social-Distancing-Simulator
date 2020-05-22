# Welcome to Social Distancing Simulator
This readme will tell you everything you need to know about getting started with the SDS game.

## Table of Contents:
- What You Need
- Getting Started
- Testing History

***

## What You Need:
- Javascript IDE (Visual Studio, Notepad++, etc)
- Image editing software (for creating or editing sprites)
- Phaser 3 knowledge (the documentation will come in handy)
The developer will not need any API keys or downloaded frameworks. Everything you need to start out is included in this package.

## Getting Started:
Getting started with this package is really simple.
Game functionality is stored in *game.js*. This script holds functions for object creation, player movement, and enemy behaviours.
Food behaviour is stored in *foods.js*. This script handles Food data objects, building a shopping list, and checking if a food is on that list.

Currently, the game is split between two *scene* objects:
- *SceneA* is the Phaser scene that contains all the game objects. The player, enemies, food, and walls are created here.
- *SceneB* contains the UI. The pause menu and mobile controls are created here.

Each Phaser scene has a *preload(), create(),* and *update()* function.
- *preload()* loads all outside assets needed for the game, such as images and audio.
- *create()* creates ALL GAME OBJECTS, including players, enemies, walls, sprite animations, audio players, and more!
- *update()* is called every time a new frame is rendered, and should only be used for constant functions like object movement.



## Testing History:
You can see our current testing history [on this spreadsheet.](https://docs.google.com/spreadsheets/d/1mr0khymjQXTGa3ddb4prcuiclrct1MMS4igVVIiYBxw/edit?usp=sharing)

