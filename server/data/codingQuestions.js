/**
 * DSA coding question bank.
 *
 * Three questions (two-sum, valid-parentheses, longest-substring) ship with
 * full stdin/stdout driver code in all 5 languages PLUS real test cases, so
 * Run/Submit actually executes via Judge0. The other three (linked list /
 * tree / heap problems) are AI-review-only (supportsExecution: false) -
 * writing correct stdin-based drivers for linked-list/tree I/O across 5
 * languages needs more infra (e.g. a shared serialization format) than fits
 * here without risking shipping subtly wrong test cases.
 */
const questions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    companyTags: ["Google", "Amazon", "Adobe"],
    description:
      "Given a line of space-separated integers (nums) and a target on the next line, print the two indices (space-separated) whose values add up to target. Assume exactly one solution exists.",
    supportsExecution: true,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}\n\n// --- Driver code (do not modify) ---\nconst lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst nums = lines[0].trim().split(/\\s+/).map(Number);\nconst target = parseInt(lines[1].trim());\nconst result = twoSum(nums, target);\nconsole.log(result.join(' '));`,
      python: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n\n# --- Driver code (do not modify) ---\nimport sys\nlines = sys.stdin.read().strip().split('\\n')\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\nresult = two_sum(nums, target)\nprint(' '.join(map(str, result)))`,
      java: `import java.util.*;\n\npublic class Main {\n    static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) return new int[]{map.get(complement), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String[] numStrs = scanner.nextLine().trim().split("\\\\s+");\n        int[] nums = new int[numStrs.length];\n        for (int i = 0; i < numStrs.length; i++) nums[i] = Integer.parseInt(numStrs[i]);\n        int target = Integer.parseInt(scanner.nextLine().trim());\n        int[] result = twoSum(nums, target);\n        System.out.println(result[0] + " " + result[1]);\n    }\n}`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> seen;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) return {seen[complement], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n    int target;\n    cin >> target;\n    vector<int> result = twoSum(nums, target);\n    cout << result[0] << " " << result[1] << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main() {\n    int nums[1000];\n    int n = 0;\n    char line[4096];\n    fgets(line, sizeof(line), stdin);\n    char *token = strtok(line, " \\n");\n    while (token != NULL) {\n        nums[n++] = atoi(token);\n        token = strtok(NULL, " \\n");\n    }\n    int target;\n    scanf("%d", &target);\n\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}`,
    },
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1", hidden: false },
      { input: "3 2 4\n6", expectedOutput: "1 2", hidden: true },
      { input: "3 3\n6", expectedOutput: "0 1", hidden: true },
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    companyTags: ["Microsoft", "Facebook"],
    description:
      "Given a single line containing only '(', ')', '{', '}', '[' and ']', print 'true' if every bracket closes in the correct order, otherwise print 'false'.",
    supportsExecution: true,
    starterCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);\n    else if (stack.pop() !== map[ch]) return false;\n  }\n  return stack.length === 0;\n}\n\n// --- Driver code (do not modify) ---\nconst line = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\nconsole.log(isValid(line) ? 'true' : 'false');`,
      python: `def is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        else:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return len(stack) == 0\n\n# --- Driver code (do not modify) ---\nimport sys\nline = sys.stdin.readline().strip()\nprint('true' if is_valid(line) else 'false')`,
      java: `import java.util.*;\n\npublic class Main {\n    static boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');\n        for (char ch : s.toCharArray()) {\n            if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);\n            else if (stack.isEmpty() || stack.pop() != pairs.get(ch)) return false;\n        }\n        return stack.isEmpty();\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String line = scanner.nextLine().trim();\n        System.out.println(isValid(line) ? "true" : "false");\n    }\n}`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    unordered_map<char,char> pairs = {{')','('},{']','['},{'}','{'}};\n    for (char ch : s) {\n        if (ch=='('||ch=='['||ch=='{') st.push(ch);\n        else {\n            if (st.empty() || st.top() != pairs[ch]) return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[10000];\n    fgets(s, sizeof(s), stdin);\n    int len = strlen(s);\n    if (len > 0 && s[len-1]=='\\n') s[--len]=0;\n\n    char stack[10000];\n    int top = -1;\n    int valid = 1;\n    for (int i = 0; i < len; i++) {\n        char ch = s[i];\n        if (ch=='('||ch=='['||ch=='{') {\n            stack[++top] = ch;\n        } else {\n            if (top < 0) { valid = 0; break; }\n            char open = stack[top--];\n            if ((ch==')' && open!='(') || (ch==']' && open!='[') || (ch=='}' && open!='{')) { valid = 0; break; }\n        }\n    }\n    if (top != -1) valid = 0;\n    printf("%s\\n", valid ? "true" : "false");\n    return 0;\n}`,
    },
    testCases: [
      { input: "()[]{}", expectedOutput: "true", hidden: false },
      { input: "(]", expectedOutput: "false", hidden: true },
      { input: "([)]", expectedOutput: "false", hidden: true },
    ],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    companyTags: ["Amazon", "Bloomberg"],
    description:
      "Given a single line string s, print the length of the longest substring without repeating characters.",
    supportsExecution: true,
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, start = 0;\n  const seen = new Map();\n  for (let end = 0; end < s.length; end++) {\n    const ch = s[end];\n    if (seen.has(ch) && seen.get(ch) >= start) start = seen.get(ch) + 1;\n    seen.set(ch, end);\n    maxLen = Math.max(maxLen, end - start + 1);\n  }\n  return maxLen;\n}\n\n// --- Driver code (do not modify) ---\nconst line = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\nconsole.log(lengthOfLongestSubstring(line));`,
      python: `def length_of_longest_substring(s):\n    seen = {}\n    start = 0\n    max_len = 0\n    for end, ch in enumerate(s):\n        if ch in seen and seen[ch] >= start:\n            start = seen[ch] + 1\n        seen[ch] = end\n        max_len = max(max_len, end - start + 1)\n    return max_len\n\n# --- Driver code (do not modify) ---\nimport sys\nline = sys.stdin.readline().strip()\nprint(length_of_longest_substring(line))`,
      java: `import java.util.*;\n\npublic class Main {\n    static int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int start = 0, maxLen = 0;\n        for (int end = 0; end < s.length(); end++) {\n            char ch = s.charAt(end);\n            if (seen.containsKey(ch) && seen.get(ch) >= start) start = seen.get(ch) + 1;\n            seen.put(ch, end);\n            maxLen = Math.max(maxLen, end - start + 1);\n        }\n        return maxLen;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String line = scanner.nextLine().trim();\n        System.out.println(lengthOfLongestSubstring(line));\n    }\n}`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    unordered_map<char,int> seen;\n    int start = 0, maxLen = 0;\n    for (int end = 0; end < (int)s.size(); end++) {\n        char ch = s[end];\n        if (seen.count(ch) && seen[ch] >= start) start = seen[ch] + 1;\n        seen[ch] = end;\n        maxLen = max(maxLen, end - start + 1);\n    }\n    return maxLen;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    cout << lengthOfLongestSubstring(s) << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100000];\n    fgets(s, sizeof(s), stdin);\n    int len = strlen(s);\n    if (len > 0 && s[len-1]=='\\n') s[--len]=0;\n\n    int seen[256];\n    for (int i=0;i<256;i++) seen[i] = -1;\n    int start = 0, maxLen = 0;\n    for (int end = 0; end < len; end++) {\n        unsigned char ch = s[end];\n        if (seen[ch] >= start) start = seen[ch] + 1;\n        seen[ch] = end;\n        int curLen = end - start + 1;\n        if (curLen > maxLen) maxLen = curLen;\n    }\n    printf("%d\\n", maxLen);\n    return 0;\n}`,
    },
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", hidden: false },
      { input: "bbbbb", expectedOutput: "1", hidden: true },
      { input: "pwwkew", expectedOutput: "3", hidden: true },
    ],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    companyTags: ["Microsoft", "Apple"],
    description:
      "Given the head of a singly linked list, reverse the list and return the new head. (AI-reviewed only - no live execution for this one.)",
    supportsExecution: false,
    starterCode: {
      javascript: `function reverseList(head) {\n  // your code here\n}`,
      python: `def reverse_list(head):\n    # your code here\n    pass`,
      java: `// your code here`,
      cpp: `// your code here`,
      c: `// your code here`,
    },
    testCases: [],
  },
  {
    id: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["Tree", "BFS"],
    companyTags: ["Amazon", "LinkedIn"],
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values. (AI-reviewed only - no live execution for this one.)",
    supportsExecution: false,
    starterCode: {
      javascript: `function levelOrder(root) {\n  // your code here\n}`,
      python: `def level_order(root):\n    # your code here\n    pass`,
      java: `// your code here`,
      cpp: `// your code here`,
      c: `// your code here`,
    },
    testCases: [],
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Heap", "Divide and Conquer"],
    companyTags: ["Google", "Uber"],
    description:
      "Given an array of k linked lists, each sorted in ascending order, merge them into one sorted linked list. (AI-reviewed only - no live execution for this one.)",
    supportsExecution: false,
    starterCode: {
      javascript: `function mergeKLists(lists) {\n  // your code here\n}`,
      python: `def merge_k_lists(lists):\n    # your code here\n    pass`,
      java: `// your code here`,
      cpp: `// your code here`,
      c: `// your code here`,
    },
    testCases: [],
  },
  {
    id: "n-queens-count",
    title: "N-Queens - Count Solutions",
    difficulty: "Hard",
    tags: ["Backtracking", "Recursion"],
    companyTags: ["Google", "Microsoft"],
    description:
      "Given an integer n, print the number of distinct solutions to the N-Queens puzzle (placing n queens on an n x n board so no two attack each other).",
    supportsExecution: true,
    starterCode: {
      javascript: `function countNQueens(n) {\n  let count = 0;\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  function backtrack(row) {\n    if (row === n) { count++; return; }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || diag1.has(row-col) || diag2.has(row+col)) continue;\n      cols.add(col); diag1.add(row-col); diag2.add(row+col);\n      backtrack(row+1);\n      cols.delete(col); diag1.delete(row-col); diag2.delete(row+col);\n    }\n  }\n  backtrack(0);\n  return count;\n}\n\n// --- Driver code (do not modify) ---\nconst n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\nconsole.log(countNQueens(n));`,
      python: `def count_n_queens(n):\n    count = 0\n    cols, diag1, diag2 = set(), set(), set()\n    def backtrack(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row-col) in diag1 or (row+col) in diag2:\n                continue\n            cols.add(col); diag1.add(row-col); diag2.add(row+col)\n            backtrack(row+1)\n            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)\n    backtrack(0)\n    return count\n\n# --- Driver code (do not modify) ---\nimport sys\nn = int(sys.stdin.read().strip())\nprint(count_n_queens(n))`,
      java: `import java.util.*;\n\npublic class Main {\n    static int count = 0;\n    static int N;\n    static Set<Integer> cols = new HashSet<>(), diag1 = new HashSet<>(), diag2 = new HashSet<>();\n\n    static void backtrack(int row) {\n        if (row == N) { count++; return; }\n        for (int col = 0; col < N; col++) {\n            if (cols.contains(col) || diag1.contains(row-col) || diag2.contains(row+col)) continue;\n            cols.add(col); diag1.add(row-col); diag2.add(row+col);\n            backtrack(row+1);\n            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col);\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        N = Integer.parseInt(scanner.nextLine().trim());\n        backtrack(0);\n        System.out.println(count);\n    }\n}`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint n, count_ = 0;\nset<int> cols, diag1, diag2;\n\nvoid backtrack(int row) {\n    if (row == n) { count_++; return; }\n    for (int col = 0; col < n; col++) {\n        if (cols.count(col) || diag1.count(row-col) || diag2.count(row+col)) continue;\n        cols.insert(col); diag1.insert(row-col); diag2.insert(row+col);\n        backtrack(row+1);\n        cols.erase(col); diag1.erase(row-col); diag2.erase(row+col);\n    }\n}\n\nint main() {\n    cin >> n;\n    backtrack(0);\n    cout << count_ << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint n, count_ = 0;\nint colUsed[20], diag1Used[40], diag2Used[40];\n\nvoid backtrack(int row) {\n    if (row == n) { count_++; return; }\n    for (int col = 0; col < n; col++) {\n        int d1 = row - col + n;\n        int d2 = row + col;\n        if (colUsed[col] || diag1Used[d1] || diag2Used[d2]) continue;\n        colUsed[col] = diag1Used[d1] = diag2Used[d2] = 1;\n        backtrack(row+1);\n        colUsed[col] = diag1Used[d1] = diag2Used[d2] = 0;\n    }\n}\n\nint main() {\n    scanf("%d", &n);\n    backtrack(0);\n    printf("%d\\n", count_);\n    return 0;\n}`,
    },
    testCases: [
      { input: "4", expectedOutput: "2", hidden: false },
      { input: "1", expectedOutput: "1", hidden: true },
      { input: "8", expectedOutput: "92", hidden: true },
    ],
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    difficulty: "Easy",
    tags: ["Math", "Dynamic Programming"],
    companyTags: ["Amazon"],
    description: "Practice-only. Given n, return the nth Fibonacci number (F(0)=0, F(1)=1).",
    supportsExecution: false,
    starterCode: {
      javascript: `function fib(n) {\n  // your code here\n}`,
      python: `def fib(n):\n    # your code here\n    pass`,
      java: `// your code here`, cpp: `// your code here`, c: `// your code here`,
    },
    testCases: [],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    companyTags: ["LinkedIn", "Amazon"],
    description: "Practice-only. Given an integer array, find the contiguous subarray with the largest sum and return that sum (Kadane's algorithm).",
    supportsExecution: false,
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // your code here\n}`,
      python: `def max_sub_array(nums):\n    # your code here\n    pass`,
      java: `// your code here`, cpp: `// your code here`, c: `// your code here`,
    },
    testCases: [],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming"],
    companyTags: ["Adobe"],
    description: "Practice-only. You're climbing a staircase of n steps, taking 1 or 2 steps at a time. How many distinct ways can you climb to the top?",
    supportsExecution: false,
    starterCode: {
      javascript: `function climbStairs(n) {\n  // your code here\n}`,
      python: `def climb_stairs(n):\n    # your code here\n    pass`,
      java: `// your code here`, cpp: `// your code here`, c: `// your code here`,
    },
    testCases: [],
  },
];

module.exports = { questions };
