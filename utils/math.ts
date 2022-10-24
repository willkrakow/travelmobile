export const sum = (arr: number[]) => arr.reduce((a,b) => a + b, 0);

export const average = (arr: number[]) => sum(arr) / arr.length

export const smallestByKey = <T>(arr: T[], key: keyof T) => {
    let smallest = Infinity;
    for (const item of arr){
        if(!isNumber(item[key])) {
            throw new Error("Must be of type number");
        }
        if(item[key] < smallest){
            // @ts-ignore
            smallest = item[key]
        }
    }
    return smallest
}

export const largestByKey = <T>(arr: T[], key: keyof T) => {
    let largest = -Infinity;
    for (const item of arr) {
      if (!isNumber(item[key])) {
        throw new Error("Must be of type number");
      }
      if (item[key] > largest) {
        // @ts-ignore
        largest = item[key];
      }
    }
    return largest;
}

export const isNumber = (val: any): val is number => {
    return typeof val === 'number'
}