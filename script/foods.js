/**
 * FOODS.JS
 * Contains all food-related functionality.
 * @author: Jaedon Braun
 */

 /** Number of different kinds of food. */
let foodTypes = 50;

/**
 * Current shopping list.
 * Will be populated with Food objects.
 */
let list = [];

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
 * Populates the shopping list with random food items.
 * CALL ON GAME START/RESTART!!
 */
function initList(newLength) {
    let listValues = [];
    let newItem = Math.floor(Math.random() * foodTypes);

    // Generate random items.
    for (let i = 0; i < newLength; i++) {

        while (listValues.includes(newItem)) {
            newItem = Math.floor(Math.random() * foodTypes);
        }

        listValues.push(newItem);
        console.log("Added value " + newItem);

        list.push(new Food(newItem));
    }
}
/**
 * Populates the shopping list for tutorial
 */
function initTutList(newLength) {
    for (let i = 0; i < newLength; i++) {

        let newItem = i;
        let itemAlreadyContained = true;

        do {
            // Generate a random (valid) item index.
            newItem = i;
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
    }
}

/**
 * Behavior when the player touches a shelf.
 * @param {Food} shelfFood Food attached to the shelf that was touched.
 * @returns true if the Food is on the list.
 */
function CheckList(shelfFood) {
    let isOnList = false;
    for (let i = 0; i < list.length; i++) {
        // Check if Food on shelf is on the shopping list, and has not already been collected.
        if (list[i].getValue() == shelfFood.getValue() && !list[i].getCollected()) {
            UpdateList(i);
            isOnList = true;
            break;
        }
    }
    return isOnList;
}

function onList(shelfFood){
    let isOnList = false;
    for (let i = 0; i < list.length; i++) {
        if (list[i].getValue() == shelfFood.getValue() && !list[i].getCollected()) {
            isOnList = true;
            break;
        }
    }
    return isOnList;
}

/**
 * Crosses an item off the shopping list.
 * @param {number} index Index of item to cross off of the list.
 */
function UpdateList(index) {
    list[index].setCollected();

    // Repeats back your shopping list. Remove after debugging.
    let uncrossedEntries = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].getCollected()) {
            uncrossedEntries++;
        }
    }

    if (uncrossedEntries == list.length) {
        win();
    }
}