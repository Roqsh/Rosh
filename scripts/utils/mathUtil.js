export function tag_system(player) {
    player.runCommandAsync(`tag @a[m=!c] remove gmc`);
    player.runCommandAsync(`tag @a[m=!s] remove gms`);
    player.runCommandAsync(`tag @a[m=!a] remove gma`);
    player.runCommandAsync(`tag @a[m=!spectator] remove spec`);

    player.runCommandAsync(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`);
    player.runCommandAsync(`tag @a[hasitem={item=trident,location=slot.weapon.mainhand}] add trident`);
    player.runCommandAsync(`tag @a[hasitem={item=bow,location=slot.weapon.mainhand}] add bow`);
    player.runCommandAsync(`tag @a[m=c] add gmc`);
    player.runCommandAsync(`tag @a[m=s] add gms`);
    player.runCommandAsync(`tag @a[m=a] add gma`);
    player.runCommandAsync(`tag @a[m=spectator] add spec`);

    player.runCommandAsync(`scoreboard players add @a[tag=right,scores={right=..1000}] right 1`);
    player.runCommandAsync(`scoreboard players add @a[tag=!moving,scores={last_move=..1000}] last_move 1`);
}


export function getAbsoluteGcd(current, last) {
    const EXPANDER = 1.6777216E7;

    let currentExpanded = Math.floor(current * EXPANDER);
    let lastExpanded = Math.floor(last * EXPANDER);

    return gcd(currentExpanded, lastExpanded);
}


export function gcd(a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
}


export function getDistanceY(one, two) {
    return Math.sqrt(Math.pow(two.location.y - one.location.y, 2));
}


export function hVelocity_2(player) {
    return Math.abs(player.getVelocity().x - player.getVelocity().z);
}


export function getAverage(data) {
    return data.reduce((acc, val) => acc + val, 0) / data.length;
}


export function getStandardDeviation(data) {
    const variance = getVariance(data);
    return Math.sqrt(variance);
}


export const EXPANDER = Math.pow(2, 24);


export function getVariance(data) {
    let count = 0;
    let sum = 0.0;
    let variance = 0.0;
    let average;

    data.forEach(number => {
        sum += number;
        ++count;
    });

    average = sum / count;

    data.forEach(number => {
        variance += Math.pow(number - average, 2.0);
    });

    return variance;
}