// Includes min and max
export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// Shuffles in place
export function shuffle(arr) {
    for (let i=0; i<arr.length; i++) {
	let j=randomInt(i, arr.length - 1);
	swap(arr, i, j);
    }
}
