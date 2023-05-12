import { random, randomRange, randomRangeInt } from "cc"

export const rando = Array.from({ length: 20 }, () => randomRangeInt(0x0001, 0xFFFF + 1));
export const randomTime = rando.map((val, i, arr) =>
{
	let count = 0;
	let x = val;
    while(x != 0)
    {
        if((x & 1) != 0) count++;
        x = x >> 1;
    }
    return count * 0.75;
})

export const PredefinedWaves =
{
    singleTargetWave: {
        possibleTargets: [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080, 0x0100, 0x0200, 0x0400, 0x0800, 0x1000, 0x2000, 0x4000, 0x8000],
        preDelay: 0,
        baseTime: 2.5,
        difficulty: 1
	},
    duoTargetWave:
    {
        possibleTargets: [0x0003, 0x0006, 0x000C, 0x0030, 0x0060, 0x00C0, 0x0300, 0x0600, 0x0C00, 0x3000, 0x6000, 0xC000],
        preDelay: 0,
        baseTime: 3.5,
        difficulty: 2
	},
	verticalDuoTargetWave:
    {
        possibleTargets: [0x0011, 0x0022, 0x0044, 0x0088, 0x0110, 0x0220, 0x0440, 0x0880, 0x1100, 0x2200, 0x4400, 0x8800],
        preDelay: 0,
        baseTime: 3.5,
        difficulty: 2
    },
    trioTargetWave:
    {
        possibleTargets: [0x0007, 0x000E, 0x0070, 0x00E0, 0x0700, 0x0E00, 0x7000, 0xE000],
        preDelay: 0,
        baseTime: 4.5,
        difficulty: 3
	},
	verticalTrioTargetWave:
    {
        possibleTargets: [0x0111, 0x0222, 0x0444, 0x0888, 0x1110, 0x2220, 0x4440, 0x8880],
        preDelay: 0,
        baseTime: 4.5,
        difficulty: 2
    },
    horizonalLineTargetWave:
    {
        possibleTargets: [0x000F, 0x00F0, 0x0F00, 0xF000],
        preDelay: 0,
        baseTime: 5.5,
        difficulty: 4
	},
	verticalTargetWave:
    {
        possibleTargets: [0x1111, 0x2222, 0x4444, 0x8888],
        preDelay: 0,
        baseTime: 5.5,
        difficulty: 4
	},
	square2TargetWave:
    {
        possibleTargets: [0x0033, 0x0066, 0x00CC, 0x0330, 0x0660, 0x0CC0, 0x3300, 0x6600, 0xCC00],
        preDelay: 0,
        baseTime: 3.5,
        difficulty: 4
	},
	square3TargetWave:
    {
        possibleTargets: [0x0777, 0x0EEE, 0x7770, 0xEEE0],
        preDelay: 0,
        baseTime: 8.5,
        difficulty: 8
	},
	diagLineWave:
    {
        possibleTargets: [0x8421, 0x1248],
        preDelay: 0,
        baseTime: 3.5,
        difficulty: 4
	},
	jaggedWave:
    {
        possibleTargets: [0x00C6, 0x0063, 0x006C, 0x0036, 0x0C60, 0x0630, 0x06C0, 0x0360, 0xC600, 0x6300, 0x6C00, 0x3600],
        preDelay: 0,
        baseTime: 4.5,
        difficulty: 4
    },
	vWave:
    {
		possibleTargets: [0xAA40, 0x5520, 0x0AA40, 0x0552],
        preDelay: 0,
        baseTime: 5,
        difficulty: 4
	},
	xWave:
    {
		possibleTargets: [0xA4A0, 0xA4A1, 0x5250, 0x5258, 0x0A4A, 0x1A4A, 0x0525, 0x8525],
        preDelay: 0,
        baseTime: 5,
        difficulty: 4
	},
	randomWave:
	{
		possibleTargets: rando,
        preDelay: 0,
        baseTime: -1,
        difficulty: 4
	},
}

export const PredefinedGuns = 
{
	handgun: {
		name: "Hangun",
		reticles: 0b000010000,
		reloadTime: 0.75,
		sliderConfig: {
			hitZoneLeft: 0.3,
			hitZoneRight: 0.7,
			sliderCycleTime: 1
		}
	},
	shotgun: {
		name: "Shotgun",
		reticles: 0b000111000,
		reloadTime: 2.25,
		sliderConfig: {
			hitZoneLeft: 0.3,
			hitZoneRight: 0.7,
			sliderCycleTime: 1.5
		}
	},
	dualHanguns: {
		name: "Dual Handguns",
		reticles: 0b000101000,
		reloadTime: 0.75,
		sliderConfig: {
			hitZoneLeft: 0.3,
			hitZoneRight: 0.7,
			sliderCycleTime: 1.25
		}
	},
	crossbow: {
		name: "Crossbow",
		reticles: 0b010010010,
		reloadTime: 1,
		sliderConfig: {
			hitZoneLeft: 0.35,
			hitZoneRight: 0.65,
			sliderCycleTime: 2
		}
	},
	rifle: {
		name: "Rifle",
		reticles: 0b010101010,
		reloadTime: 3.5,
		sliderConfig: {
			hitZoneLeft: 0.4,
			hitZoneRight: 0.6,
			sliderCycleTime: 1.25
		}
	},
	rpg: {
		name: "RPG",
		reticles: 0b111111111,
		reloadTime: 5,
		sliderConfig: {
			hitZoneLeft: 0.25,
			hitZoneRight: 0.75,
			sliderCycleTime: 1.5
		}
	},

}