// Time complexity: O(n)
// Space complexity: O(1)
function sum_to_n_a(n: number): number {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

// Time complexity: O(1)
// Space complexity: O(1)
function sum_to_n_b(n: number): number {
    return Math.floor((n * (n + 1)) / 2);
}

// Time complexity: O(n)
// Space complexity: O(n)
function sum_to_n_c(n: number): number {
    if (n <= 1) {
        return n;
    }

    return n + sum_to_n_c(n - 1);
}
