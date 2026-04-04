import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizPage = () => {
const { courseId } = useParams();
const navigate = useNavigate();
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [showScore, setShowScore] = useState(false);

const quizData = {
python: [
{ q: "What is the correct file extension for Python files?", options: [".py", ".pt", ".pyt", ".pw"], answer: ".py" },
{ q: "Which function is used to output text in Python?", options: ["echo", "print", "display", "printf"], answer: "print" },
{ q: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], answer: "#" },
{ q: "Which data type is used for 'True' or 'False'?", options: ["int", "bool", "str", "float"], answer: "bool" },
{ q: "What is the output of 2 ** 3?", options: ["6", "8", "9", "5"], answer: "8" },
{ q: "Which of these is a Python Tuple?", options: ["[1, 2]", "{1, 2}", "(1, 2)", "<1, 2>"], answer: "(1, 2)" },
{ q: "How do you create a function in Python?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"], answer: "def myFunc():" },
{ q: "Which keyword is used for loops?", options: ["for", "repeat", "loop", "each"], answer: "for" },
{ q: "What is the method to add an element to a list?", options: ["add()", "insert()", "append()", "push()"], answer: "append()" },
{ q: "Which operator is used for division?", options: ["/", "//", "%", "div"], answer: "/" },
{ q: "How do you start an 'if' statement?", options: ["if x > y then:", "if (x > y)", "if x > y:", "if: x > y"], answer: "if x > y:" },
{ q: "What is the command to install libraries?", options: ["npm", "get", "pip", "install"], answer: "pip" },
{ q: "Which of these is NOT a keyword?", options: ["pass", "eval", "assert", "nonlocal"], answer: "eval" },
{ q: "What does 'len()' do?", options: ["Counts words", "Returns length", "Finds letters", "Lowercases"], answer: "Returns length" },
{ q: "Which module is used for random numbers?", options: ["math", "random", "os", "sys"], answer: "random" }
],
java: [
{ q: "Which component is used to compile, debug and execute Java?", options: ["JRE", "JIT", "JDK", "JVM"], answer: "JDK" },
{ q: "Which keyword is used to create a class?", options: ["className", "class", "struct", "void"], answer: "class" },
{ q: "What is the default value of boolean?", options: ["true", "false", "0", "null"], answer: "false" },
{ q: "Which of these is NOT a primitive type?", options: ["int", "double", "String", "char"], answer: "String" },
{ q: "Which method is the starting point of a Java program?", options: ["start()", "init()", "main()", "run()"], answer: "main()" },
{ q: "Which keyword is used for inheritance?", options: ["implements", "extends", "inherits", "import"], answer: "extends" },
{ q: "What is the size of double in Java?", options: ["4 bytes", "8 bytes", "2 bytes", "16 bytes"], answer: "8 bytes" },
{ q: "Which package contains the Scanner class?", options: ["java.lang", "java.io", "java.util", "java.net"], answer: "java.util" },
{ q: "Which keyword prevents a method from being overridden?", options: ["static", "final", "const", "private"], answer: "final" },
{ q: "How do you access the length of an array 'arr'?", options: ["arr.len()", "arr.length()", "arr.length", "arr.size()"], answer: "arr.length" },
{ q: "Which access modifier is most restrictive?", options: ["public", "protected", "default", "private"], answer: "private" },
{ q: "Which operator is used for objects comparison?", options: ["==", "===", ".equals()", "compare()"], answer: ".equals()" },
{ q: "What is a constructor?", options: ["A variable", "A method", "A class", "A loop"], answer: "A method" },
{ q: "Which keyword refers to the current object?", options: ["parent", "self", "this", "super"], answer: "this" },
{ q: "Which of these is used to handle exceptions?", options: ["try-catch", "if-else", "switch", "for"], answer: "try-catch" }
],
c: [
{ q: "Who is the father of C language?", options: ["Steve Jobs", "James Gosling", "Dennis Ritchie", "Bjarne Stroustrup"], answer: "Dennis Ritchie" },
{ q: "What is the size of 'int' in C?", options: ["2 Bytes", "4 Bytes", "Compiler dependent", "1 Byte"], answer: "Compiler dependent" },
{ q: "Which symbol is used for pointers?", options: ["&", "*", "#", "@"], answer: "*" },
{ q: "Which function is used for input?", options: ["print()", "input()", "scanf()", "get()"], answer: "scanf()" },
{ q: "How do you define a constant in C?", options: ["const", "#define", "Both", "final"], answer: "Both" },
{ q: "What is the index of the first element in an array?", options: ["1", "0", "-1", "Any"], answer: "0" },
{ q: "Which keyword is used to exit a loop?", options: ["stop", "exit", "break", "return"], answer: "break" },
{ q: "What is a 'string' in C?", options: ["A primitive type", "An array of chars", "A class", "A pointer"], answer: "An array of chars" },
{ q: "Which header file is used for printf()?", options: ["conio.h", "stdlib.h", "stdio.h", "math.h"], answer: "stdio.h" },
{ q: "What is the value of EOF?", options: ["0", "1", "-1", "NULL"], answer: "-1" },
{ q: "Which operator is used for address of a variable?", options: ["*", "&", "->", "."], answer: "&" },
{ q: "Which function allocates memory dynamically?", options: ["malloc()", "alloc()", "new()", "create()"], answer: "malloc()" },
{ q: "What is the result of 5 % 2?", options: ["2.5", "2", "1", "0"], answer: "1" },
{ q: "Which loop is guaranteed to execute at least once?", options: ["for", "while", "do-while", "if"], answer: "do-while" },
{ q: "Which keyword is used for structure definition?", options: ["struct", "class", "union", "type"], answer: "struct" }
]
};

const questions = quizData[courseId] || quizData.python;

const handleAnswerClick = (selectedOption) => {
if (selectedOption === questions[currentQuestion].answer) {
setScore(score + 1);
}

const nextQuestion = currentQuestion + 1;
if (nextQuestion < questions.length) {
setCurrentQuestion(nextQuestion);
} else {
const percentage = ((score + (selectedOption === questions[currentQuestion].answer ? 1 : 0)) / questions.length) * 100;
localStorage.setItem(`quiz_score_${courseId}`, percentage.toFixed(0));
setShowScore(true);
}
};

return (
<div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', width: '100vw' }}>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
<div style={{ background: '#1e1e1e', padding: '40px', borderRadius: '16px', width: '90%', maxWidth: '700px', textAlign: 'center', border: '1px solid #333' }}>
{showScore ? (
<div>
<h1 style={{ color: '#ffa116', fontSize: '40px' }}>Quiz Result</h1>
<div style={{ fontSize: '60px', margin: '20px 0', color: score > 10 ? '#2db55d' : '#ff4b4b' }}>
{((score / questions.length) * 100).toFixed(0)}%
</div>
<p style={{ fontSize: '24px' }}>Correct Answers: <strong>{score}</strong> out of {questions.length}</p>
<button onClick={() => navigate(`/course/${courseId}`)} style={{ marginTop: '30px', padding: '15px 40px', background: '#ffa116', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>Review Course</button>
</div>
) : (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#888' }}>
<span>Question {currentQuestion + 1} of {questions.length}</span>
<span>Score: {score}</span>
</div>
<div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', marginBottom: '30px' }}>
<div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: '100%', background: '#ffa116', borderRadius: '4px', transition: '0.3s' }}></div>
</div>
<h2 style={{ fontSize: '26px', marginBottom: '40px', lineHeight: '1.4' }}>{questions[currentQuestion].q}</h2>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
{questions[currentQuestion].options.map((opt, idx) => (
<button key={idx} onClick={() => handleAnswerClick(opt)} style={{ padding: '20px', background: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}>
{opt}
</button>
))}
</div>
</div>
)}
</div>
</div>
</div>
);
};

export default QuizPage;