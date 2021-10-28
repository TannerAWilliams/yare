if (s1.energy == s1.energy_capacity) {
	s1.move(base.position)
	s1.energize(base)
}


/*
Good, but you'll notice a problem. 
When the spirit transfers a little bit of energy to the base, 
the if statement returns false (the code runs top to bottom every second) 
and the command to energize the base is ignored.

Let’s fix this. 
With the set_mark() method, 
you can mark the spirit with a short string. 
*/
if (s1.energy == s1.energy_capacity){
	s1.set_mark("charging")
} else if (s1.energy == 0){
	s1.set_mark("harvesting")
}

if (s1.mark == "charging"){
	s1.move(base.position)
	s1.energize(base)
} else {
	s1.move(star_zxq.position)
	s1.energize(s1)
}


/*
Perfect, now the spirit is properly harvesting energy from the star and 
giving it to the base.

Once your base’s energy reaches 100, 
it will be used to automatically create a new spirit.

While you wait for that to happen, 
feel free to zoom in and out and pan around with your mouse. 
You are not alone, 
there is an enemy in the bottom right corner of the map.
*/
for (spirit of my_spirits){
    if (spirit.energy == spirit.energy_capacity){
		spirit.set_mark("charging") 
	} else if (spirit.energy == 0){
		spirit.set_mark("harvesting")
	}

	if (spirit.mark == "charging"){
    	spirit.move(base.position)
    	spirit.energize(base)
	} else if (spirit.mark == "harvesting"){
    	spirit.move(star_zxq.position)
		spirit.energize(spirit)
	}
}


/*
Well done, 
all your spirits should now autonomously harvest energy. 
But wait! You are under attack!

The spirits and 
the base have a sight property that contains other objects within 400 radius.
 What’s stored in sight are the ids, not the objects themselves.
  You can access the actual spirit object with spirits[id].

One spirit should be enough to deal with the invader.
*/
for (spirit of my_spirits){
    if (spirit.energy == spirit.energy_capacity){
		spirit.set_mark("charging") 
	} else if (spirit.energy == 0){
		spirit.set_mark("harvesting")
	}

	if (spirit.mark == "charging"){
    	spirit.move(base.position)
    	spirit.energize(base)
	} else if (spirit.mark == "harvesting"){
    	spirit.move(star_zxq.position)
		spirit.energize(spirit)
	}
	
	if (base.sight.enemies.length > 0){
	    var invader = spirits[base.sight.enemies[0]]
	    if (s1.energy > 25) 
            s1.set_mark("attacker")
	    if (s1.mark == "attacker") {
		    s1.move(invader.position)
		    s1.energize(invader)
	    }
    }
}


/*
Amazing! 
Now you should have a solid grasp of the game’s mechanics. 
You can always learn more in the documentation.

To conclude the tutorial, 
attack the enemy base with all of your spirits by adding at the end (
    or replacing your entire code with):



Make sure that they have enough energy to destroy the base! 
If they don’t, you can also use the star_a1c next to the enemy base to harvest energy.

*/

for (spirit of my_spirits){
    if (spirit.energy == spirit.energy_capacity){
		spirit.set_mark("charging") 
	} else if (spirit.energy == 0){
		spirit.set_mark("harvesting")
	}

	if (spirit.mark == "charging"){
    	spirit.move(base.position)
    	spirit.energize(base)
	} else if (spirit.mark == "harvesting"){
    	spirit.move(star_zxq.position)
		spirit.energize(spirit)
	}
	
	if (base.sight.enemies.length > 0) {
	    var invader = spirits[base.sight.enemies[0]]
	    if (s1.energy > 25) 
	        s1.set_mark("attacker")
	    if (s1.mark == "attacker") {
		    s1.move(invader.position)
		    s1.energize(invader)
	    }
    }
    
  spirit.move(enemy_base.position)
  spirit.energize(enemy_base)
}