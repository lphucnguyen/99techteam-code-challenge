# Problem 4

## Requirement
Provide 3 unique implementations of the following function in TypeScript.
- Comment on the complexity or efficiency of each function.
**Input**: `n` - any integer
*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.
**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## Solution:
### Solution 1: Using the for loop to calculate the sum
```
// Time complexity: O(n)
// Space complexity: O(1)
function sum_to_n_a(n: number): number {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}
```

### Solution 2: Using mathematical formula to calculate the sum of [1, n]
```
// Time complexity: O(1)
// Space complexity: O(1)
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}
```

### Solution 3: Using recursive the calculate the sum
```
// Time complexity: O(n)
// Space complexity: O(n)
function sum_to_n_c(n: number): number {
    if (n <= 1) {
        return n;
    }

    return n + sum_to_n_c(n - 1);
}
```