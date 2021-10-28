console.log("Tick: " + tick)
console.log("spirits: " + memory['spirits'])
console.log("spirits energy: " + memory['spirits_energy'])
console.log("max size: " + memory['max_size'])
// set once at the beginning of the game
if(tick == 0) {
    memory['star_zxq_harvest'] = new Map()
    memory['star_p89_harvest'] = new Map()
    memory['star_a1c_harvest'] = new Map()
    memory['defense'] = new Array()
}

// reset variables every loop
memory['spirits'] = 0
memory['spirits_energy'] = 0
memory['max_size'] = 2

// main game loop
for (spirit of my_spirits) {
    if(spirit.hp == 1) {
        energize_and_merge_spirit(spirit)
        set_spirit_mark(spirit)
        take_spirit_action(spirit)
        check_for_defense(spirit)
    
        memory['spirits'] += 1
        memory['spirits_energy'] += spirit.energy

        try {
            if(memory['defense'].length == 3)
                console.log(memory['defense'][0].id + " ~ " + memory['defense'][0].mark)
        }
        catch(error){
            memory['defense'] = new Array()
        }
    }
}

function set_spirit_mark(spirit1) {
    try {
        if(memory['defense'].length <= 3) {
            spirit1.set_mark("defense")
        } else if (spirit1.energy == 0) {
    		spirit1.set_mark("harvest stars queue") 
    	} else if(spirit1.sight.enemies.length > 0) {
    	    set_engagament_protocol(spirit1)
    	} else if (spirit1.energy == spirit1.energy_capacity) {
            if(initiate_offensive_strategy(spirit1)) {
                set_offensive_strategy(spirit1)
            } else {
                spirit1.set_mark("energize home base")
            }
    	}
    } catch(error) {
        console.log('set_mark ->' + error.toString())
        spirit1.shout('set_mark')
    }
}

function take_spirit_action(spirit1) {
    if (spirit1.mark == "defense") {
        add_to_defense(spirit1)
    } else if (spirit1.mark == "energize home base") {
        if(unit_distance(spirit1, base) > 200) {
    	    spirit1.move(base.position)
        }
    	spirit1.energize(base)
	} 
	
	else if (spirit1.mark == "harvest stars queue") {
	   harvest_stars_queue(spirit1)
	}
	
	else if(spirit1.mark == "attack closest enemy") {
        attack_closest_enemy(spirit1)
    } else if (spirit1.mark == "attack enemy base") {
	   spirit1.move(enemy_base.position)
       spirit1.energize(enemy_base)
       log_attack_enemy(spirit1, enemy_base)
	}
	
	if(spirit1.mark != 'harvest stars queue' && spirit1.mask !== undefined) {
	    memory['star_zxq_harvest'].delete(spirit1.id)
        memory['star_p89_harvest'].delete(spirit1.id)
        memory['star_a1c_harvest'].delete(spirit1.id)
	}
}

function set_engagament_protocol(){
    if(spirit1.energy == spirit1.energy_capacity) {
        spirit1.set_mark("attack closest enemy")
    } else if (spirit1.energy == 0) {
        spirit1.set_mark("harvest stars queue")
    } else if (unit_distance(spirit1, find_closest_enemy(spirit1)) > 200) {
        if(spirit1.energy > find_closest_enemy(spirit1).energy) {
            spirit1.set_mark("attack closest enemy")
        }
        else {
            spirit1.set(" harvest stars queue")
        } // eneemy territory 
    } else if(unit_distance(spirit1, enemy_base) < unit_distance(spirit1, base)) {
        spirit1.set_mark('attack closest enemy')
    }
}

function initiate_offensive_strategy(spirit1) {
    if(spirit1.size >= 2) {
        spirit1.set_mark("attack enemy base")
        return true
    }
    return false
}

function set_offensive_strategy(spirit1){
    spirit1.set_mark("attack enemy base")
}

function check_for_defense() {
     // removre from defense
    for( var i = 0; i < memory['defense'].length; i++) { 
        spirit = memory['defense'][i]
        if(spirit.hp == 0 || spirit.mark != 'defense' || spirit.energy < spirit.energy_capacity/4) {
            memory['defense'].splice(i, 1); 
            i--;
        }
    }
}

function add_to_defense(spirit1) {
    try {
        // add to defense
        if (memory['defense'].length <= 3) {
            spirit1.move(base.position)
            spirit1.set_mark("defense")
            memory['defense'].push(spirit1)
            console.log('push->' + memory['defense'].length)
        }
        
        // move and defend
        if(spirit1.mark == 'defense'){
            spirit1.move(base.position)
            attack_base_intruders(spirit1)
        }
        
    } catch(error) {
        console.log(error)
        spirit1.shout('add to def')
        memory['defense'] = new Array()
    }
}

function harvest_stars_queue(spirit1) {
    try {
        // already been added
        if(memory['star_p89_harvest'].has(spirit1.id)) {
            if(memory['star_zxq_harvest'].get(spirit1.id) != 0){
                if(unit_distance(spirit1, star_zxq) > 200)
                    spirit1.move(star_zxq.position)
                spirit1.energize(spirit1)
            } else if(memory['star_a1c_harvest'].get(spirit1.id) != 0) {
                if(unit_distance(spirit1, star_a1c) > 200)
                    spirit1.move(star_a1c.position)
                spirit1.energize(spirit1)
            } else if(memory['star_p89_harvest'].get(spirit1.id) != 0) {
                if(unit_distance(spirit1, star_p89) > 200)
                    spirit1.move(star_p89.position)
                spirit1.energize(spirit1)
            } else {
	            clear_harvest_queue(spirit1)
            }
        } 
        else {
            move_based_on_star_fuel(spirit1)
        }
    }
    catch(error) {
        console.log('harvest ->' + error)
        spirit1.shout('harvest')
        move_based_on_star_fuel(spirit1)
    }
}

function move_based_on_star_fuel(spirit1) {
   clear_harvest_queue(spirit1)

     // has not been added 
    star_zxq_energy_remaining = star_zxq.energy
    for (const value of memory['star_zxq_harvest'].values()) {
        star_zxq_energy_remaining -= value
    }
    
    star_a1c_energy_remaining = star_a1c.energy
    for (const value of memory['star_a1c_harvest'].values()) {
        star_a1c_energy_remaining -= value
    }
    
    star_p89_energy_remaining = star_p89.energy
    for (const value of memory['star_p89_harvest'].values()) {
        star_p89_energy_remaining -= value
    }
    
    ordered_star_distance = stars_ordered_by_distance(spirit1)
    spirit1_energy_to_fill = spirit1.energy_capacity - spirit1.energy
    
    if(ordered_star_distance[0].id == "star_zxq" 
    && star_zxq_energy_remaining - spirit1_energy_to_fill > 0) {
        memory['star_zxq_harvest'].set(spirit1.id, spirit1_energy_to_fill)
        spirit1.move(star_zxq.position)
    } else if(ordered_star_distance[0].id == "star_a1c" 
    && star_a1c_energy_remaining - spirit1_energy_to_fill > 0) {
        memory['star_a1c_harvest'].set(spirit1.id, spirit1_energy_to_fill)
        spirit1.move(star_a1c.position)
    } else if(star_p89_energy_remaining - spirit1_energy_to_fill > 0){
        memory['star_p89_harvest'].set(spirit1.id, spirit1_energy_to_fill)
        spirit1.move(star_p89.position)
    } else {
        map_name = ordered_star_distance[2].id + '_map'
        memory[map_name].set(spirit1.id, spirit1_energy_to_fill)
        spirit1.move(ordered_star_distance[2].position)
    }
    spirit1.energize(spirit1)
}
   
function attack_closest_enemy(spirit1) {
    if(spirit1.sight.enemies.length > 0) {
        spirit1.divide()
        closest_enemy = find_closest_enemy(spirit1)
	    spirit1.move(closest_enemy.position)
	    spirit1.energize(closest_enemy)
	    log_attack_enemy(spirit1, closest_enemy)
    } else {
        // on enemy side
        if(unit_distance(spirit1, enemy_base) < 700) {
            spirit1.move(enemy_base.position)
            spirit1.energize(enemy_base)
        } else {
            harvest_stars_queue(spirit1)
        }
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

function attack_base_intruders(spirit1) {
    if(base.sight.enemies.length > 0) {
        closest_enemy = find_closest_enemy(base)
	    spirit1.move(closest_enemy.position)
	    spirit1.energize(closest_enemy)
	    log_attack_enemy(spirit1, closest_enemy)
    } else {
        spirit1.set_mark('defense')
        spirit1.move(base.position)
    }
}

function log_attack_enemy(spirit1, unit) {
	console.log(spirit1.id + " is moving toward " + unit.id)
	if(unit_distance(spirit1, unit) <= 200) {
	    damage = spirit1.size * 2
	    console.log(spirit1.id + " is targeting " 
	    + unit.id + " for " + damage + " damage")
	}
}

function unit_distance(unit1, unit2) {
    x_plane = Math.pow(unit1.position[0] - unit2.position[0], 2)
    y_plane = Math.pow(unit1.position[1] - unit2.position[1], 2)
    return Math.floor(Math.sqrt(x_plane + y_plane))
}

function energize_and_merge_spirit(spirit1) {
    if(spirit1.sight.friends.length > 0) {
        for(friendly_id of spirit1.sight.friends) {
            spirit_friend = spirits[friendly_id]
            distance = unit_distance(spirit1, spirit_friend)
            if(distance <= 10 && spirit1.size + spirit_friend.size <= memory['max_size']) {
                spirit1.merge(spirit_friend)
            } else if (spirit_friend.energy >= spirit_friend.energy_capacity/2){
                spirit_friend.energize(spirit1)
            }
        }
    }
}

function stars_ordered_by_distance(spirit1) {
    zxq_distance = unit_distance(spirit1, star_zxq)
    p89_distance = unit_distance(spirit1, star_p89)
    a1c_distance = unit_distance(spirit1, star_a1c)
    
    //left side
    if(zxq_distance < p89_distance) {
        return [star_a1c, star_p89, star_zxq]
    }
    // middle
    if(p89_distance < zxq_distance && p89_distance < a1c_distance) {
        if(zxq_distance < a1c_distance)
            return [star_p89, star_zxq, star_a1c]
        else
            return [star_p89, star_a1c, star_zxq]
    }
    // right
    if(a1c_distance < p89_distance) {
        return [star_a1c, star_p89, star_zxq]
    }
}

function clear_harvest_queue(spirit1) {
     try {
        memory['star_zxq_harvest'].delete(spirit1.id)
        memory['star_p89_harvest'].delete(spirit1.id)
        memory['star_a1c_harvest'].delete(spirit1.id)
    } catch(e){
        memory['star_zxq_harvest'].set(spirit1.id, 0)
        memory['star_p89_harvest'].set(spirit1.id, 0) 
        memory['star_a1c_harvest'].set(spirit1.id, 0)    
    } finally {
        memory['star_zxq_harvest'] = new Map()
        memory['star_p89_harvest'] = new Map()
        memory['star_a1c_harvest'] = new Map()
    }
}
