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