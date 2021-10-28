console.log("Tick: " + tick)
console.log("spirits: " + memory['spirits'])
console.log("spirits energy: " + memory['spirits_energy'])

// reset variables every loop
memory['spirits'] = 0
memory['spirits_energy'] = 0

// main game loop
for (spirit of my_spirits) {
    if(spirit.hp == 1) {
        energize_spirit(spirit)
        set_spirit_mark(spirit)
        take_spirit_action(spirit)

        memory['spirits'] += 1
        memory['spirits_energy'] += spirit.energy
    }
}

function energize_spirit(spirit) {
    if(spirit.sight.friends.length > 0) {
        for(friendly_id of spirit.sight.friends) {
            spirit_friend = spirits[friendly_id]
            if(unit_distance(spirit, spirit_friend) <= 200 && spirit.energy != spirit.energy_capacity 
            && spirit_friend.mark == 'harvest stars queue' && spirit.mark != 'energize home base'
            && spirit_friend.energy > 0
            && unit_distance(spirit_friend, base) > unit_distance(spirit, base)) {
                    spirit_friend.shout('energize')
                    spirit_friend.energize(spirit)
                    break
            } 
        }
    }
}

function set_spirit_mark(spirit) {
    if (spirit.energy == 0) {
		spirit.set_mark("harvest stars queue") 
	} else if(spirit.sight.enemies.length > 0) {
	    set_engagament_protocol(spirit)
	} else if (spirit.energy == spirit.energy_capacity) {
        if(initiate_offensive_strategy(spirit)) {
            set_offensive_strategy(spirit)
        } else {
            spirit.set_mark("energize home base")
        }
	}
}

function take_spirit_action(spirit) {
    if (spirit.mark == "energize home base") {
        energize_home_base(spirit)
	} else if (spirit.mark == "harvest stars queue") {
	   harvest_stars_queue(spirit)
	} else if(spirit.mark == "attack closest enemy") {
        attack_closest_enemy(spirit)
    } else if (spirit.mark == "attack enemy star") {
       attack_enemy_star(spirit)
	}
}

function attack_enemy_star(spirit){
    enemy_star = star_zxq
    if(unit_distance(enemy_base, star_a1c) < unit_distance(enemy_base, star_zxq)){
        enemy_star = star_a1c
    }
	   
	if(spirit.sight.enemies.length == 0) {
	    spirit.move(enemy_base.position)
	    spirit.energize(enemy_base)
	} else {
	    spirit.move(enemy_star.position)
        spirit.energize(spirit)
	}
}

function energize_home_base(spirit) {
    // outpost
    if(unit_distance(spirit, outpost) <= unit_distance(spirit, base)){
        if(outpost.energy < 1000) {
            if(unit_distance(spirit, outpost) >= 200){
                spirit.move(outpost.position)
            }
            spirit.energize(outpost)
        } else if(spirit.energy != spirit.energy_capacity){
            spirit.set_mark('harvest stars queue')        
        } else{
            spirit.set_mark("attack closest enemy")
            attack_closest_enemy(spirit)
        }
    } else {
        if(unit_distance(spirit, base) >= 200) {
            spirit.move(base.position)
        }
        spirit.energize(base)
    }
}


function set_engagament_protocol(spirit){
    if(spirit.energy == spirit.energy_capacity) {
        spirit.set_mark("attack closest enemy")
    } else if (spirit.energy == 0) {
        spirit.set_mark("harvest stars queue")
    } else if (unit_distance(spirit, find_closest_enemy(spirit)) > 200) {
        if(spirit.energy > find_closest_enemy(spirit).energy) {
            spirit.set_mark("attack closest enemy")
        }
        else {
            spirit.set_mark("harvest stars queue")
        } // enemy territory 
    } else if(unit_distance(spirit, enemy_base) < unit_distance(spirit, base)) {
        spirit.set_mark('attack closest enemy')
    }
}

function initiate_offensive_strategy(spirit) {
    closest_star = stars_ordered_by_distance(spirit)[0] 
    if(memory['spirits'] > 50 && closest_star.energy < closest_star.energy_capacity/1.42) {
        spirit.set_mark("attack enemy star")
        return true
    } else if (memory['spirits_energy'] >= 700) {
         spirit.set_mark("attack enemy star")
        return true
    }
    return false
}

function set_offensive_strategy(spirit){
    spirit.set_mark("attack enemy star")
}


function harvest_stars_queue(spirit) {
    stars_by_distance = stars_ordered_by_distance(spirit)

    // go to middle star
    if(stars_by_distance[0] != star_p89 && memory['spirits'] >= 20 && spirit_id(spirit) % 4 == 0){
        if(unit_distance(spirit, stars_by_distance[0]) >= 200){ 
            spirit.move(star_p89.position)
        }
        spirit.energize(star_p89)
    } else {
        if(unit_distance(spirit, stars_by_distance[0]) >= 200){
            spirit.move(stars_by_distance[0].position)
        }
        spirit.energize(spirit)
    }
}
   
function attack_closest_enemy(spirit) {
    if(spirit.sight.enemies.length > 0) {
        closest_enemy = find_closest_enemy(spirit)
        distance_from_enemy = unit_distance(spirit, closest_enemy)

	    spirit.move(closest_enemy.position)
	    spirit.energize(closest_enemy)
    }
    else if(unit_distance(spirit, enemy_base) < 750) {
        spirit.move(enemy_base.position)
        spirit.energize(enemy_base)
    }
    else {
        enemy_star = star_zxq
        if( unit_distance(enemy_base, star_a1c) < unit_distance(enemy_base, star_zxq))
            enemy_star = star_a1c
            
        spirit.move(enemy_star.position)
        spirit.energize(enemy_star)
    }
}

function find_closest_enemy(unit) {
    closest_enemy = spirits[unit.sight.enemies[0]]
    smallest_distance = unit_distance(unit, spirits[unit.sight.enemies[0]])
    for(enemy_id of unit.sight.enemies) {
        distance = unit_distance(unit, spirits[enemy_id])
        if(distance < smallest_distance){
            smallest_distance = distance
            closest_enemy = spirits[enemy_id]
        }
    }
    return closest_enemy
}

function attack_base_intruders(spirit) {
    if(base.sight.enemies.length > 0) {
        closest_enemy = find_closest_enemy(base)
	    spirit.move(closest_enemy.position)
	    spirit.energize(closest_enemy)
    } 
}

function unit_distance(unit1, unit2) {
    x_plane = Math.pow(unit1.position[0] - unit2.position[0], 2)
    y_plane = Math.pow(unit1.position[1] - unit2.position[1], 2)
    return Math.sqrt(x_plane + y_plane)
}

function stars_ordered_by_distance(spirit) {
    zxq_distance = unit_distance(spirit, star_zxq)
    p89_distance = unit_distance(spirit, star_p89)
    a1c_distance = unit_distance(spirit, star_a1c)
    
    //left side
    if(zxq_distance <= p89_distance) {
        return [star_zxq, star_p89, star_a1c]
    } // middle
    else if(p89_distance <= zxq_distance && p89_distance <= a1c_distance) {
        if(zxq_distance < a1c_distance)
            return [star_p89, star_zxq, star_a1c]
        else
            return [star_p89, star_a1c, star_zxq]
    }// right
    else {
        return [star_a1c, star_p89, star_zxq]
    }
}

function spirit_id(spirit) {
    return parseInt(spirit.id.substring(spirit.id.indexOf("_") + 1))
}

function log_attack_enemy(spirit, unit) {
	console.log(spirit.id + " is moving toward " + unit.id)
	if(unit_distance(spirit, unit) <= 200) {
	    damage = spirit.size * 2
	    console.log(spirit.id + " is targeting " 
	    + unit.id + " for " + damage + " damage")
	}
}