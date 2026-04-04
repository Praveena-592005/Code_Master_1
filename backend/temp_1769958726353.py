class Solution:
    def solve(self, nums, target):
        seen = {}
        get = seen.get  # local binding (speed boost)

        for i, n in enumerate(nums):
            j = get(target - n)
            if j is not None:
                return [j, i]
            seen[n] = i


import json, sys
sol = Solution()
test_cases = [{"input":"[2,7,11,15], 9","expectedOutput":"[0,1]","_id":"697f5d691c0d7ac1b6fa3317"},{"input":"[3,2,4], 6","expectedOutput":"[1,2]","_id":"697f5d691c0d7ac1b6fa3318"}]
for tc in test_cases:
    try:
        raw_input = tc['input']
        input_data = eval(f"({raw_input})")
        actual = sol.solve(*input_data) if isinstance(input_data, tuple) else sol.solve(input_data)
        expected = eval(tc['expectedOutput'])
        if str(actual).replace(" ","") != str(expected).replace(" ",""):
            print(json.dumps({
                "status": "Wrong Answer",
                "failedCase": {
                    "input": raw_input,
                    "expected": tc['expectedOutput'],
                    "actual": str(actual)
                }
            }))
            sys.exit(0)
    except Exception as e:
        print(json.dumps({"status": "Runtime Error", "error": str(e)}))
        sys.exit(1)
print(json.dumps({"status": "Accepted"}))
