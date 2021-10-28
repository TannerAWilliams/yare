// Version 1
// Spirits:         53
// Spritits Energy: 258 

console.log("Tick: " + tick)
console.log('active_in: ' + star_p89.active_in)
console.log("spirits: " + memory['spirits'])
console.log("spirits energy: " + memory['spirits_energy'])
console.log("max spirits energy: " + memory['max_spirits_energy'])

if (tick >= 250) {
    console.log('NUMBER OF SPIRTIS: ' + memory[250])
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
        spirit_set_mark(spirit)
        spirit_take_action(spirit)
    
        memory['spirits'] += 1
        memory['spirits_energy'] += spirit.energy
        
        if(memory['spirits_energy'] > memory['max_spirits_energy'] && tick <= 250){
            memory['max_spirits_energy'] = memory['spirits_energy']
        }
        
        memory[tick] = memory['spirits']
        memory['max_spirit_energy']
        
        console.log(spirit.id + " - zxq: " + memory['zxq_distance'] 
        + "\t p89: " + memory['p89_distance'] 
        + "\t a1c: " + memory['a1c_distance'])
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

function energize_base(spirit) {
    spirit.move(base.position)
    spirit.energize(base) // should be 
}

function harvest_star(spirit) {
    // Transfers (1 × spirit's size) energy unit from itself into target.
    // Max distance of the energy transfer is 200 units.
    closest_star = spirit_closest_star(spirit)

    spirit.move(closest_star.position)    
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
