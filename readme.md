# Welcome to Social Distancing Simulator
This readme will tell you everything you need to know about getting started with the SDS game.

## Table of Contents:
- Gratitude List
- What's Included
- What You Need
- Getting Started
- Testing History

***

## Gratitude List:
First and foremost, we'd like to thank the following parties for their help:
- Photon Storm, for creating the Phaser 3 framework that this whole game is founded on.
    - https://photonstorm.github.io/phaser3-docs/
- Google, for the Firebase Authentication and Datastore products that allowed us to create a leaderboard of user scores.
    - https://firebase.google.com/docs
- DeWolfe Music, for the use of "Mr. Lucky" as our background music.
    - https://www.youtube.com/watch?v=ZZLyx_Owqec
- Bootstrap for modal styling
    - https://getbootstrap.com/docs/4.1/getting-started/introduction/
- Twitter docs for adding "tweet"
    - https://developer.twitter.com/en/docs
- Facebook docs for adding "share" button
    - https://developers.facebook.com/docs/


## What's Included:
We give you all the source code to the game, as well as our working files.
- HTML pages
- JavaScript scripts
- CSS stylesheets
- Firestore authentication and Firestore rules
- Image and icon files
- Audio files
- Aseprite working files

## What You Need:
- Javascript IDE (Visual Studio, Notepad++, etc)
- Image editing software (for creating or editing sprites)
- Phaser 3 knowledge (the [online documentation](https://photonstorm.github.io/phaser3-docs/index.html) will come in handy)
- Aseprite (*optional,* if you want to use the working files for player and enemy animations)

The developer will not need any API keys or downloaded frameworks. No special configuration is necessary. Everything you need to start out is included in this package.

If you need access to the Firebase database, please reach out to contributor [wueddyw.](https://github.com/wueddyw)(wueddyw@gmail.com)

## Getting Started:
Getting started with this package is really simple.
Game functionality is stored in *game.js*. This script holds functions for object creation, player movement, and enemy behaviours.

Currently, the game is split between two *scene* objects:
- *SceneA* is the Phaser scene that contains all the game objects. The player, enemies, food, and walls are created here.
- *SceneB* contains the UI. The pause menu and mobile controls are created here.

Each Phaser scene has a *preload(), create(),* and *update()* function.
- *preload()* loads all outside assets needed for the game, such as images and audio.
- *create()* creates ALL GAME OBJECTS, including players, enemies, walls, sprite animations, audio players, and more!
- *update()* is called every time a new frame is rendered, and should only be used for constant functions like object movement.

*tutorial.js* is fomatted in a similar fashion to *game.js*, and houses tutorial funcionality.

Food behaviour is stored in *foods.js*. This script handles Food data objects, building a shopping list, and checking if a food is on that list.

*menu.js* holds all the menu logic.

*addScore.js* *addToLeaderboard.js* *firebase.js* house all javascript needed for firebase user authentication and datbase

/audio holds all audio files
/images holds all images
/script holds all javascript files
/style holds all css files
/working-files holds aseprite files for annimations

## Testing History:
You can see our current testing history [on this spreadsheet.](https://docs.google.com/spreadsheets/d/1mr0khymjQXTGa3ddb4prcuiclrct1MMS4igVVIiYBxw/edit?usp=sharing)

