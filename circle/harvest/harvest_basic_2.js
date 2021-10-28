// Version 2
// Tick: 250
//      Spirits:         76
//      Spritits Energy: 347 
// Tick: 500
//      Spirits:         150
//      Spritits Energy: 718

// Code Below
console.log("Tick: " + tick)
console.log('active_in: ' + star_p89.active_in)
console.log("spirits: " + memory['spirits'])
console.log("spirits energy: " + memory['spirits_energy'])

console.log

if (tick >= 250 && tick < 500) {
    console.log('NUMBER OF SPIRITS 250: ' + memory[250])
    console.log("MAX SPIRITS ENERGY 250: " + memory['max_spirits_energy_250'])
} 

if (tick >= 500) {
    console.log('NUMBER OF SPIRITS 500: ' + memory[500])
    console.log("MAX SPIRITS ENERGY 500: " + memory['max_spirits_energy_500'])
} 



if(tick <= 1) {
    memory['max_spirits_energy'] = 0
} 

// reset variables every loop
memory['spirits'] = 0
memory['spirits_energy'] = 0

// main game loop
for (spirit of my_spirits) {
    if(spirit.hp == 1) {
        // spirit_merge(spirit)
        spirit_set_mark(spirit)
        spirit_take_action(spirit)
    
        memory['spirits'] += 1
        memory['spirits_energy'] += spirit.energy
        memory[tick] = memory['spirits']
        if(memory['spirits_energy'] > memory['max_spirits_energy'] && tick <= 250){
            memory['max_spirits_energy_250'] = memory['spirits_energy']
        }
        if(memory['spirits_energy'] > memory['max_spirits_energy'] && tick <= 500){
            memory['max_spirits_energy_500'] = memory['spirits_energy']
        }
        
        if(tick >= 500) {
            spirit.shout('Resign')
        }
    }
}

function spirit_merge(spirit) {
    if(spirit.sight.friends.length > 0) {
        for(friendly_id of spirit1.sight.friends) {
            spirit_friend = spirits[friendly_id]
            if(unit_distance(spirit, spirit_friend) <= 10) {
                 spirit.merge(spirit_friend)
            } 
        }
    }
}

function spirit_set_mark(spirit) {
    if (spirit.energy == spirit.energy_capacity){
        spirit.set_mark("energize base") 
	} else if (spirit.energy == 0) {
		spirit.set_mark("harvest star")
	}
}

function spirit_take_action(spirit) {
   if (spirit.mark == "energize base") {
        energize_base(spirit)
	} else if (spirit.mark == "harvest star") {
	   harvest_star(spirit)
	}
}

function spirit_merge(spirit){
    if(spirit.sight.friends.length > 0) {
        for(friendly_id of spirit.sight.friends) {
            spirit_friend = spirits[friendly_id]

            if(distance(spirit, spirit_friend) <= 10) {
                 spirit.merge(spirit_friend)
            } 
        }
    }
}

function energize_base(spirit) {
    if(distance(spirit, base) >= 200) {
        spirit.move(base.position)
    }
    spirit.energize(base)
}

function harvest_star(spirit) {
    // Transfers (1 × spirit's size) energy unit from itself into target.
    closest_star = spirit_closest_star(spirit)

    // Max distance of the energy transfer is 200 units.
    if(distance(spirit, closest_star) >= 200) {
        spirit.move(closest_star.position)
    }
    spirit.energize(spirit)
}
  
function spirit_closest_star(spirit) {
    star_zxq_distance = distance(spirit, star_zxq) // player 1
    star_p89_distance = distance(spirit, star_p89) 
    star_a1c_distance = distance(spirit, star_a1c) // player 2
    
    memory['zxq_distance'] = star_zxq_distance
    memory['p89_distance'] = star_p89_distance
    memory['a1c_distance'] = star_a1c_distance

    if(star_p89_distance <= star_zxq_distance && star_p89_distance <= star_a1c_distance) {
        return star_p89
    } else if (star_zxq_distance <= star_p89_distance && star_zxq_distance <= star_a1c_distance) {
        return star_zxq
    } else {
        return star_a1c
    }
}

function distance(unit1, unit2) {
    x_plane = Math.pow(unit2.position[0] - unit1.position[0], 2)
    y_plane = Math.pow(unit2.position[1] - unit1.position[1], 2)
    return Math.sqrt(x_plane + y_plane)
}
