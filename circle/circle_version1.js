console.log("Tick: " + tick)
console.log("spirits: " + my_spirits.length)
console.log("spirits energy: " + memory['spirits_energy'])

// set global variables
memory['closest_star_from_base_position'] = closest_star_from_base_position()
memory['spirits_energy'] = 0

for (spirit of my_spirits) {
    merge_spirit(spirit)
    set_spirit_mark(spirit)
    take_spirit_action(spirit)

    memory['spirits_energy'] += spirit.energy
}

function set_spirit_mark(spirit1) {
    if (spirit1.energy == 0) {
		spirit1.set_mark("harvest star") 
	} else if(spirit1.sight.enemies.length > 0) {
        spirit1.set_mark("attack closest enemy") 
    } else if (spirit1.energy == spirit1.energy_capacity) {
        spirit1.set_mark("energize home base")
        if(spirit1.energy_capacity >= 50) {
            spirit1.set_mark("attack enemy base")
        }
	}
}

function take_spirit_action(spirit1) {
     if(spirit1.mark == "attack closest enemy") {
        attack_closest_enemy(spirit1)
    } 
    
    else if (spirit1.mark == "energize home base"){
    	spirit1.move(base.position)
    	spirit1.energize(base)
	} 
	
	else if (spirit1.mark == "harvest star"){
	    if(spirit_id(spirit1) % 2 == 0 && star_p89.energy > 60) {
	        spirit1.move(star_p89.position)
	    } else {
	        spirit1.move(memory['closest_star_from_base_position'])
	    }
		spirit1.energize(spirit1)
	} 

	else if (spirit1.mark == "attack enemy base") {
	   spirit1.move(enemy_base.position)
       spirit1.energize(enemy_base)
	}
}

function attack_closest_enemy(spirit1) {
    if(spirit1.sight.enemies.length > 0) {
        closest_enemy = find_closet_enemy(spirit1)
	    spirit1.move(closest_enemy.position)
	    spirit1.energize(closest_enemy)
	    log_attack_closet_enemy(spirit1, closest_enemy)
    } else {
        spirit1.move(enemy_base.position)
        spirit1.energize(enemy_base)
    }
}

function find_closet_enemy(spirit1) {
    closest_enemy = spirits[spirit1.sight.enemies[0]]
    smallest_distance = unit_distance(spirit1, closest_enemy)
    for(enemy_id of spirit1.sight.enemies) {
        distance = unit_distance(spirit1, spirits[enemy_id])
        if(distance < smallest_distance){
            smallest_distance = distance
            closest_enemy = spirits[enemy_id]
        }
    }
    return closest_enemy
}

function log_attack_closet_enemy(spirit1, enemy_spirit) {
	console.log(spirit1.id + " is moving toward " + enemy_spirit.id)
	if(unit_distance(spirit1, enemy_spirit) <= 200) {
	    damage = spirit1.size * 2
	    console.log(spirit1.id + " is targeting " + enemy_spirit.id + " for " + damage + " damage")
	}
}

function log_spirit_movement(spirit1) {
	if(unit_distance(spirit1, base) <= 200) { 
        console.log(spirit.id + " is energizing base")
    } else {
        console.log(spirit.id + " is moving toward base")
    }
}

function unit_distance(unit1, unit2) {
    return Math.sqrt((Math.pow(unit1.position[0] - unit2.position[0], 2))
    + (Math.pow(unit1.position[1] - unit2.position[1], 2)))
}

function merge_spirit(spirit1) {
    if(spirit1.sight.friends.length > 0) {
        for(friendly_id of spirit1.sight.friends) {
            if(check_merge(spirit1, spirits[friendly_id])) {
                spirit1.merge(spirits[friendly_id])
            }
        }
    }
}

function check_merge(spirit1, spirit2) {
    distance = unit_distance(spirit1, spirit2)
    return distance <= 10
}

function spirit_id(spirit1) {
    return parseInt(spirit1.id.substring(spirit1.id.indexOf("_") + 1))
}

function next_spirit_id(spirit1){
    id_index = spirit1.id.indexOf('_') + 1
    spirit1_id_value = parseInt(spirit1.id.substring(index))
    next_spirit_id_value = spirit1_id_value + 1
    return  "TanMayne_" + next_spirit_id_value
}

function closest_star_from_base_position() {
    closest_star =  star_zxq // player 1
    if (base.position[0] == 2600) 
        closest_star = star_a1c // player 2
    return closest_star.position
}