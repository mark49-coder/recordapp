// js/modules/petGamification.js

const PET_POINTS_STORAGE_KEY = 'recordapp_pet_points';

/**
 * Updates the pet's points by adding pointsEarned.
 * @param {number} pointsEarned - The number of points to add.
 * @returns {number} The new total points.
 */
export function updatePetPoints(pointsEarned) {
    let currentPoints = parseInt(localStorage.getItem(PET_POINTS_STORAGE_KEY), 10) || 0;
    currentPoints += pointsEarned;
    localStorage.setItem(PET_POINTS_STORAGE_KEY, currentPoints.toString());
    console.log(`Pet points updated. Earned: ${pointsEarned}, New Total: ${currentPoints}`);
    return currentPoints;
}

/**
 * Retrieves the current pet points from Local Storage.
 * @returns {number} The current total points (defaults to 0).
 */
export function getPetPoints() {
    const points = parseInt(localStorage.getItem(PET_POINTS_STORAGE_KEY), 10) || 0;
    return points;
}
