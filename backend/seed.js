// seed.js
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

const getTemplates = () => ({
    python: `import sys\n\ndef solve():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    print(input_data[0])\n\nif __name__ == "__main__":\n    solve()`,
    java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String input = sc.next();\n            System.out.println(input);\n        }\n    }\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    char input[100];\n    if (scanf("%s", input) != EOF) {\n        printf("%s\\n", input);\n    }\n    return 0;\n}`
});

const problemData = [
    { id: 1, title: "Two Sum", diff: "Easy", cat: "Arrays", acc: "50.1%", desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", constraints: ["2 <= nums.length <= 10^4"], tc: [{ input: "2 7 11 15\n9", exp: "[0,1]" }, { input: "3 2 4\n6", exp: "[1,2]" }] },
    { id: 2, title: "Add Two Numbers", diff: "Medium", cat: "Linked List", acc: "41.2%", desc: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.", constraints: ["0 <= Node.val <= 9"], tc: [{ input: "2 4 3\n5 6 4", exp: "[7,0,8]" }, { input: "0\n0", exp: "[0]" }] },
    { id: 3, title: "Longest Substring", diff: "Medium", cat: "Sliding Window", acc: "34.0%", desc: "Find the length of the longest substring without repeating characters.", constraints: ["0 <= s.length <= 5 * 10^4"], tc: [{ input: "abcabcbb", exp: "3" }, { input: "bbbbb", exp: "1" }] },
    { id: 4, title: "Reverse Integer", diff: "Medium", cat: "Math", acc: "28.1%", desc: "Given a signed 32-bit integer x, return x with its digits reversed.", constraints: ["-2^31 <= x <= 2^31 - 1"], tc: [{ input: "123", exp: "321" }, { input: "-123", exp: "-321" }] },
    { id: 5, title: "Palindrome Number", diff: "Easy", cat: "Math", acc: "55.2%", desc: "Given an integer x, return true if x is a palindrome, and false otherwise.", constraints: ["-2^31 <= x <= 2^31 - 1"], tc: [{ input: "121", exp: "true" }, { input: "-121", exp: "false" }] },
    { id: 6, title: "ZigZag Conversion", diff: "Medium", cat: "String", acc: "45.0%", desc: "The string 'PAYPALISHIRING' is written in a zigzag pattern on a given number of rows.", constraints: ["1 <= numRows <= 1000"], tc: [{ input: "PAYPALISHIRING\n3", exp: "PAHNAPLSIIGYIR" }, { input: "PAYPALISHIRING\n4", exp: "PINALSIGYAHRPI" }] },
    { id: 7, title: "Median of Two Arrays", diff: "Hard", cat: "Binary Search", acc: "37.5%", desc: "Return the median of the two sorted arrays.", constraints: ["0 <= m, n <= 1000"], tc: [{ input: "1 3\n2", exp: "2.0" }, { input: "1 2\n3 4", exp: "2.5" }] },
    { id: 8, title: "Longest Palindrome", diff: "Medium", cat: "String", acc: "33.1%", desc: "Given a string s, return the longest palindromic substring in s.", constraints: ["1 <= s.length <= 1000"], tc: [{ input: "babad", exp: "bab" }, { input: "cbbd", exp: "bb" }] },
    { id: 9, title: "String to Integer", diff: "Medium", cat: "Math", acc: "17.2%", desc: "Convert a string to a 32-bit signed integer (atoi).", constraints: ["0 <= s.length <= 200"], tc: [{ input: "42", exp: "42" }, { input: "   -42", exp: "-42" }] },
    { id: 10, title: "Regex Matching", diff: "Hard", cat: "DP", acc: "28.1%", desc: "Implement regular expression matching with support for '.' and '*'.", constraints: ["1 <= s.length <= 20"], tc: [{ input: "aa\na*", exp: "true" }, { input: "ab\n.*", exp: "true" }] },
    { id: 11, title: "Container With Water", diff: "Medium", cat: "Two Pointers", acc: "54.3%", desc: "Find two lines that form a container that holds the most water.", constraints: ["2 <= n <= 10^5"], tc: [{ input: "1 8 6 2 5 4 8 3 7", exp: "49" }, { input: "1 1", exp: "1" }] },
    { id: 12, title: "Integer to Roman", diff: "Medium", cat: "Math", acc: "62.1%", desc: "Convert an integer to a roman numeral string.", constraints: ["1 <= num <= 3999"], tc: [{ input: "58", exp: "LVIII" }, { input: "1994", exp: "MCMXCIV" }] },
    { id: 13, title: "Roman to Integer", diff: "Easy", cat: "Math", acc: "58.4%", desc: "Convert a roman numeral string to an integer.", constraints: ["1 <= s.length <= 15"], tc: [{ input: "LVIII", exp: "58" }, { input: "MCMXCIV", exp: "1994" }] },
    { id: 14, title: "Longest Prefix", diff: "Easy", cat: "String", acc: "41.2%", desc: "Find the longest common prefix string amongst an array of strings.", constraints: ["1 <= strs.length <= 200"], tc: [{ input: "flower flow flight", exp: "fl" }, { input: "dog racecar car", exp: "none" }] },
    { id: 15, title: "3Sum", diff: "Medium", cat: "Two Pointers", acc: "32.8%", desc: "Find all unique triplets in an array that sum to zero.", constraints: ["3 <= nums.length <= 3000"], tc: [{ input: "-1 0 1 2 -1 -4", exp: "[[-1,-1,2],[-1,0,1]]" }, { input: "0 1 1", exp: "[]" }] },
    { id: 16, title: "3Sum Closest", diff: "Medium", cat: "Two Pointers", acc: "45.7%", desc: "Find three integers in nums such that the sum is closest to target.", constraints: ["3 <= nums.length <= 500"], tc: [{ input: "-1 2 1 -4\n1", exp: "2" }, { input: "0 0 0\n1", exp: "0" }] },
    { id: 17, title: "Letter Combo", diff: "Medium", cat: "Backtracking", acc: "56.4%", desc: "Return all possible letter combinations that a 2-9 digit string could represent.", constraints: ["0 <= digits.length <= 4"], tc: [{ input: "23", exp: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" }, { input: "2", exp: "[\"a\",\"b\",\"c\"]" }] },
    { id: 18, title: "4Sum", diff: "Medium", cat: "Two Pointers", acc: "35.9%", desc: "Return all unique quadruplets that sum to a target.", constraints: ["1 <= nums.length <= 200"], tc: [{ input: "1 0 -1 0 -2 2\n0", exp: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" }, { input: "2 2 2 2 2\n8", exp: "[[2,2,2,2]]" }] },
    { id: 19, title: "Remove Nth Node", diff: "Medium", cat: "Linked List", acc: "40.5%", desc: "Remove the nth node from the end of the list.", constraints: ["1 <= n <= sz"], tc: [{ input: "1 2 3 4 5\n2", exp: "1 2 3 5" }, { input: "1 2\n1", exp: "1" }] },
    { id: 20, title: "Valid Parentheses", diff: "Easy", cat: "Stack", acc: "40.2%", desc: "Check if the bracket sequence is valid.", constraints: ["1 <= s.length <= 10^4"], tc: [{ input: "()[]{}", exp: "true" }, { input: "(]", exp: "false" }] },
    { id: 21, title: "Merge Sorted Lists", diff: "Easy", cat: "Linked List", acc: "62.8%", desc: "Merge two sorted linked lists.", constraints: ["Nodes in range [0, 50]."], tc: [{ input: "1 2 4\n1 3 4", exp: "1 1 2 3 4 4" }, { input: "1\n2", exp: "1 2" }] },
    { id: 22, title: "Generate Parentheses", diff: "Medium", cat: "Backtracking", acc: "73.1%", desc: "Generate all combinations of n pairs of well-formed parentheses.", constraints: ["1 <= n <= 8"], tc: [{ input: "3", exp: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" }, { input: "1", exp: "[\"()\"]" }] },
    { id: 23, title: "Merge k Lists", diff: "Hard", cat: "Linked List", acc: "50.2%", desc: "Merge k sorted linked-lists into one sorted linked-list.", constraints: ["0 <= k <= 10^4"], tc: [{ input: "1 4 5\n1 3 4\n2 6", exp: "[1,1,2,3,4,4,5,6]" }, { input: "1\n0", exp: "[0,1]" }] },
    { id: 24, title: "Swap Nodes", diff: "Medium", cat: "Linked List", acc: "62.4%", desc: "Swap every two adjacent nodes in a linked list.", constraints: ["0 <= nodes <= 100"], tc: [{ input: "1 2 3 4", exp: "[2,1,4,3]" }, { input: "1", exp: "[1]" }] },
    { id: 25, title: "Reverse k Group", diff: "Hard", cat: "Linked List", acc: "55.1%", desc: "Reverse the nodes of the list k at a time.", constraints: ["1 <= k <= n"], tc: [{ input: "1 2 3 4 5\n2", exp: "[2,1,4,3,5]" }, { input: "1 2 3 4 5\n3", exp: "[3,2,1,4,5]" }] },
    { id: 26, title: "Remove Duplicates", diff: "Easy", cat: "Two Pointers", acc: "52.3%", desc: "Remove duplicates in-place from a sorted array.", constraints: ["nums sorted in non-decreasing order."], tc: [{ input: "1 1 2", exp: "2" }, { input: "0 0 1 1 1 2 2 3 3 4", exp: "5" }] },
    { id: 27, title: "Remove Element", diff: "Easy", cat: "Two Pointers", acc: "55.0%", desc: "Remove all occurrences of val in nums in-place.", constraints: ["0 <= val <= 100"], tc: [{ input: "3 2 2 3\n3", exp: "2" }, { input: "0 1 2 2 3 0 4 2\n2", exp: "5" }] },
    { id: 28, title: "Find Substring", diff: "Hard", cat: "Sliding Window", acc: "31.2%", desc: "Find starting indices of concatenated substrings.", constraints: ["s.length <= 10^4"], tc: [{ input: "barfoothefoobarman\nfoo bar", exp: "[0,9]" }, { input: "wordgood\nword", exp: "[0]" }] },
    { id: 29, title: "Divide Integers", diff: "Medium", cat: "Math", acc: "17.1%", desc: "Divide two integers without using *, /, and %.", constraints: ["divisor != 0"], tc: [{ input: "10\n3", exp: "3" }, { input: "7\n-3", exp: "-2" }] },
    { id: 30, title: "Sliding Window Maximum", diff: "Hard", cat: "Queue", acc: "46.5%", desc: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.", constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"], tc: [{ input: "1 3 -1 -3 5 3 6 7\n3", exp: "[3,3,5,5,6,7]" }, { input: "1\n1", exp: "[1]" }] },
    { id: 31, title: "Next Permutation", diff: "Medium", cat: "Two Pointers", acc: "38.4%", desc: "Rearrange numbers into the lexicographically next greater permutation.", tc: [{ input: "1 2 3", exp: "1 3 2" }, { input: "3 2 1", exp: "1 2 3" }] },
    { id: 32, title: "Longest Valid Parentheses", diff: "Hard", cat: "Stack", acc: "32.1%", desc: "Find the length of the longest valid (well-formed) parentheses substring.", constraints: ["0 <= s.length <= 3 * 10^4"], tc: [{ input: "(()", exp: "2" }, { input: ")()())", exp: "4" }] },
    { id: 33, title: "Search Rotated Array", diff: "Hard", cat: "Binary Search", acc: "39.1%", desc: "Search for a target value in a sorted array that has been rotated.", constraints: ["1 <= nums.length <= 5000"], tc: [{ input: "4 5 6 7 0 1 2\n0", exp: "4" }, { input: "4 5 6 7 0 1 2\n3", exp: "-1" }] },
    { id: 34, title: "First/Last Position", diff: "Medium", cat: "Binary Search", acc: "41.5%", desc: "Find the starting and ending position of a given target value.", constraints: ["0 <= nums.length <= 10^5"], tc: [{ input: "5 7 7 8 8 10\n8", exp: "[3,4]" }, { input: "5 7 7 8 8 10\n6", exp: "[-1,-1]" }] },
    { id: 35, title: "Search Insert", diff: "Easy", cat: "Binary Search", acc: "43.2%", desc: "Return the index if the target is found. If not, return the index where it would be if it were inserted in order.", constraints: ["1 <= nums.length <= 10^4"], tc: [{ input: "1 3 5 6\n5", exp: "2" }, { input: "1 3 5 6\n2", exp: "1" }] },
    { id: 36, title: "Fibonacci Number", diff: "Easy", cat: "Dynamic Programming", acc: "70.1%", desc: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).", constraints: ["0 <= n <= 30"], tc: [{ input: "2", exp: "1" }, { input: "4", exp: "3" }, { input: "9", exp: "34" }] },
    { id: 37, title: "N-Queens Puzzle", diff: "Hard", cat: "Backtracking", acc: "36.8%", desc: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions.", constraints: ["1 <= n <= 9"], tc: [{ input: "4", exp: "2" }, { input: "1", exp: "1" }, { input: "8", exp: "92" }] },
    { id: 38, title: "Count and Say", diff: "Medium", cat: "String", acc: "52.4%", desc: "The count-and-say sequence is a sequence of digit strings defined by a recursive formula.", constraints: ["1 <= n <= 30"], tc: [{ input: "4", exp: "1211" }, { input: "1", exp: "1" }] },
    { id: 39, title: "Combination Sum", diff: "Medium", cat: "Backtracking", acc: "68.2%", desc: "Find all unique combinations in candidates where the candidate numbers sum to target.", constraints: ["1 <= candidates.length <= 30"], tc: [{ input: "2 3 6 7\n7", exp: "[[2,2,3],[7]]" }, { input: "2 3 5\n8", exp: "[[2,2,2,2],[2,3,3],[3,5]]" }] },
    { id: 40, title: "Combination Sum II", diff: "Medium", cat: "Backtracking", acc: "53.1%", desc: "Find all unique combinations in candidates where the numbers sum to target (each number used once).", constraints: ["1 <= candidates.length <= 100"], tc: [{ input: "10 1 2 7 6 1 5\n8", exp: "[[1,1,6],[1,2,5],[1,7],[2,6]]" }, { input: "2 5 2 1 2\n5", exp: "[[1,2,2],[5]]" }] },
    { id: 41, title: "First Missing Positive", diff: "Hard", cat: "Arrays", acc: "36.4%", desc: "Find the smallest positive integer that is not present in an unsorted integer array.", constraints: ["O(n) time and O(1) space."], tc: [{ input: "1 2 0", exp: "3" }, { input: "3 4 -1 1", exp: "2" }] },
    { id: 42, title: "Trapping Rain Water", diff: "Hard", cat: "Two Pointers", acc: "59.2%", desc: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", constraints: ["n == height.length", "0 <= n <= 2 * 10^4"], tc: [{ input: "0 1 0 2 1 0 1 3 2 1 2 1", exp: "6" }, { input: "4 2 0 3 2 5", exp: "9" }] },
    { id: 43, title: "Multiply Strings", diff: "Medium", cat: "Math", acc: "52.1%", desc: "Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.", constraints: ["num1 and num2 consist of digits only."], tc: [{ input: "2\n3", exp: "6" }, { input: "123\n456", exp: "56088" }] },
    { id: 44, title: "Wildcard Matching", diff: "Hard", cat: "DP", acc: "68.0%", desc: "Implement wildcard pattern matching with support for '?' and '*'.", constraints: ["s.length <= 2000", "p.length <= 2000"], tc: [{ input: "aa\n*", exp: "true" }, { input: "cb\n?a", exp: "false" }] },
    { id: 45, title: "Jump Game II", diff: "Hard", cat: "Greedy", acc: "58.0%", desc: "Find the minimum number of jumps to reach the last index in an array.", constraints: ["1 <= nums.length <= 10^4"], tc: [{ input: "2 3 1 1 4", exp: "2" }, { input: "2 3 0 1 4", exp: "2" }] },
    { id: 46, title: "Permutations", diff: "Medium", cat: "Backtracking", acc: "32.0%", desc: "Given an array nums of distinct integers, return all the possible permutations.", constraints: ["1 <= nums.length <= 6"], tc: [{ input: "1 2 3", exp: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }, { input: "0 1", exp: "[[0,1],[1,0]]" }] },
    { id: 47, title: "Permutations II", diff: "Easy", cat: "Backtracking", acc: "24.0%", desc: "Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations.", constraints: ["1 <= nums.length <= 8"], tc: [{ input: "1 1 2", exp: "[[1,1,2],[1,2,1],[2,1,1]]" }, { input: "1 2 3", exp: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }] },
    { id: 48, title: "Rotate Image", diff: "Hard", cat: "Matrix", acc: "42.0%", desc: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).", constraints: ["Rotate in-place."], tc: [{ input: "1 2 3\n4 5 6\n7 8 9", exp: "[[7,4,1],[8,5,2],[9,6,3]]" }, { input: "1 2\n3 4", exp: "[[3,1],[4,2]]" }] },
    { id: 49, title: "Group Anagrams", diff: "Easy", cat: "Hash Table", acc: "32.0%", desc: "Given an array of strings strs, group the anagrams together.", constraints: ["1 <= strs.length <= 10^4"], tc: [{ input: "eat tea tan ate nat bat", exp: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }, { input: "a", exp: "[[\"a\"]]" }] },
    { id: 50, title: "Pow(x, n)", diff: "Medium", cat: "Math", acc: "50.0%", desc: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).", constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1"], tc: [{ input: "2.00000\n10", exp: "1024.00000" }, { input: "2.10000\n3", exp: "9.26100" }] }
];

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coding_platform';

mongoose.connect(mongoURI).then(async () => {
    console.log("Connecting to Database for Seeding...");

    for (const p of problemData) {
        await Problem.findOneAndUpdate(
            { problemId: p.id },
            {
                title: p.title,
                difficulty: p.diff,
                category: p.cat,
                acceptance: p.acc,
                description: p.desc,
                constraints: p.constraints,
                templates: getTemplates(),
                testCases: p.tc.map(t => ({ input: t.input, expectedOutput: String(t.exp) }))
            },
            { upsert: true, new: true }
        );
    }

    console.log("✅ Seed complete. All 50 problems synced to the database.");
    process.exit();
}).catch(err => {
    console.error("Seed error:", err);
    process.exit(1);
});