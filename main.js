var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleBigUpgrader = require('role.bigupgrader'); 

var maxHarvesters = 2;
var maxBuilders = 1;
var maxUpgraders = 4;
var maxBigUpgraders = 2;

var currentRoom = 'E22N36'

module.exports.loop = function () {
    // TEST BEGIN
    // TEST END
    
    // Setup room memory
    if(!Game.rooms[currentRoom].memory.sourceCount)
    {
        var sourceCount = Game.rooms[currentRoom].find(FIND_SOURCES).length;
        Game.rooms[currentRoom].memory.sourceCount = sourceCount;
        console.log('Room: Setting sourceCount to ' + sourceCount);
    }
    
    // Auto build routine
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var bigUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'bigUpgrader');

    if (harvesters.length < maxHarvesters) {
        if (Game.spawns['Spawn1'].energy >= 200) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
            console.log('Spawning new harvester: ' + newName);
        }
    }
    else if (builders.length < maxBuilders) {
        if (Game.spawns['Spawn1'].energy >= 200) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'builder' });
            console.log('Spawning new builder: ' + newName);
        }
    }
    else if (upgraders.length < maxUpgraders) {
        if (Game.spawns['Spawn1'].energy >= 200) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
            console.log('Spawning new upgrader: ' + newName);
        }
    }
    else if (bigUpgraders.length < maxBigUpgraders) {
        // if (Game.spawns['Spawn1'].energy >= 300) {
        if (Game.rooms[currentRoom].energyAvailable >= 300) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'bigUpgrader' });
            console.log('Spawning new bigUpgrader: ' + newName);
        }
    }

    var tower = Game.getObjectById('1b8709dce28eaa2e7466422c');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    //var countAll = _.filter(Game.creeps, function (c) { return c });
    // var countAll = _.filter(Game.creeps, (creep) => creep);
    // console.log("Count: " + countAll.length);

    // Clean up dead creeps' memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'bigUpgrader') {
            roleBigUpgrader.run(creep);
        }
    }
}