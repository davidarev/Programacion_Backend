const array: number[] = [9, 76, 34, 2, 56, 19, 7, 3, 8, 0, 45, 345, 6, 6, 855, 76];

function quicksort(arr: number[]): number[] {
    let sortedArray: number[] = [];
    
    function quicksortPartition(arr: number[]){
        if (arr.length <= 1) {
            sortedArray = sortedArray.concat(arr);
            return 0;
        }
        const pivot = arr[0];
        const L1 = arr.filter((elem: number) => elem < pivot);
        const L2 = arr.filter((elem: number)  => elem > pivot);
        quicksortPartition(L1);
        sortedArray.push(pivot);
        quicksortPartition(L2);
    }

    quicksortPartition(arr);

    return sortedArray;
}

console.log(quicksort(array));
