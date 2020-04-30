/**
 * FOODS.JS
 * Contains all food-related functionality.
 * @author: Jaedon Braun
 */

/** Array of all food images. */
let foodImages = [];
/** Array of all food names. EACH NAME SHOULD CORRESPOND TO THE SAME IMAGE ABOVE.*/
let foodNames = [];

/**
 * Array of all possible shopping lists.
 * Should be populated with numbers that match an index from foodImages and foodNames.
 */
let listsPossible = [
    []
];
/**
 * Current shopping list.
 * Should be populated with Food objects.
 */
let list = [];

/**
 * Food Object
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
}

/**
 * Sets the current shopping list to a random list.
 * CALL ON GAME START/RESTART!!
 */
function initList() {
    let listToUse = listsPossible[Math.floor(Math.random() * listsPossible.length)];

    // Add Food instances to the shopping list.
    for (let i = 0; i < listToUse.length; i++) {
        list[i] = new Food(listToUse[i]);
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
    //TODO: Cross off item from visual/HTML version of shopping list.
}