/**
 * FOODS.JS
 * Contains all food-related functionality.
 * @author: Jaedon Braun
 */

/** Array of all food frames.*/
let foodImages = [0];
/** Array of all food names. EACH NAME SHOULD CORRESPOND TO THE SAME IMAGE ABOVE.*/
let foodNames = ["Banana"];

/**
 * Current shopping list.
 * Will be populated with Food objects.
 */
let list = [];

/** Number of items on shopping list. */
let listLength = 10;

/**
 * FOOD OBJECT
 */
class Food {

    /**
     * Creates a Food instance.
     * @constructor
     * @param {number} value Index of image and value to use for this Food.
     */
    constructor(value) {
        this.image = foodImages[value];
        this.name = foodNames[value];
        this.value = value;
        this.isCollected = false;
    }

    /**
     * Check if this Food has been collected.
     * @return isCollected
     */
    getCollected() {
        return this.isCollected;
    }

    /**
     * Sets isCollected to true. (Food cannot be un-collected)
     */
    setCollected() {
        this.isCollected = true;
    }

    /**
     * Get the value of this food.
     * @return value
     */
    getValue() {
        return this.value;
    }

    /**
     * Get the name of this food.
     * @return name
     */
    getName() {
        return this.name;
    }
}

/**
 * Populates the shopping list with random food items.
 * CALL ON GAME START/RESTART!!
 */
function initList() {
    for (let i = 0; i < listLength; i++) {

        let newItem;
        let itemAlreadyContained = true;

        do {
            // Generate a random (valid) item index.
            newItem = Math.floor(Math.random * foodNames.length);
            // Assume this random item isn't already on the list.
            itemAlreadyContained = false;

            // Iterate through the list to make sure it's not already there.
            for (let j = 0; j < list.length; j++) {
                if (list[j] == newItem) {
                    itemAlreadyContained = true;
                    break;
                }
            }
        } while (itemAlreadyContained);

        // Since we broke the "is already on the list" loop, the item can be added.
        list[i] = new Food(newItem);
        console.log("Added " + foodNames[newItem] + " to shopping list.");

    }
}

/**
 * Behavior when the player touches a shelf.
 * @param {Food} shelfFood Food attached to the shelf that was touched.
 */
function CheckList(shelfFood) {
    for (let i = 0; i < list.length; i++) {
        // Check if Food on shelf is on the shopping list, and has not already been collected.
        if (list[i].getValue() == shelfFood.getValue() && !list[i].getCollected()) {
            UpdateList(i);
            break;
        }
    }
}

/**
 * Crosses an item off the shopping list.
 * @param {number} index Index of item to cross off of the list.
 */
function UpdateList(index) {
    list[index].setCollected();
    console.log("Crossed off " + list[index].getName);
    //TODO: Cross off item from visual/HTML version of shopping list.
}