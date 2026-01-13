import { writable } from 'svelte/store';

export const droneFrequency = writable(55.0)
export const filterCutoff = writable(800.0)
export const isPlaying = writable(false)

/*
set -> one argument which is the value to be set. 

update -> one argument which is a callback. The callback takes the existing
 store value as its argument and returns the new value to be set to the store.


count.subscribe((value) => {
	console.log(value);
}); // logs '0'

count.set(1); // logs '1'

count.update((n) => n + 1); // logs '2'

 */