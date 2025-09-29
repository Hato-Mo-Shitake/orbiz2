export function getRandomFromArray<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined; // 空配列対策
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function arraysEqual(a: Array<any>, b: Array<any>) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}