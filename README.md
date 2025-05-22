# 🚀 SynLex: Web-Based C/C++ Code Analyzer

**SynLex** is a browser-based tool that helps users understand how a compiler processes C/C++ code by visually simulating its key phases. It provides a user-friendly interface to input code and observe the transformation at each stage of compilation.

---

## 📖 Project Overview

The project is divided into two main parts:

### 🌐 Front Page
- Describes each compiler phase with simple explanations.
- Helps users understand what happens during each phase before they begin.
- Acts as an introduction and navigation portal to the code analyzer.

### 💻 Code Analyzer Page
- A fully functional code editor where users can type or paste C/C++ code.
- Simulates the following **four main compiler phases**:

  #### 🔍 Lexical Analysis
  - Breaks the source code into meaningful tokens.
  - Identifies keywords, identifiers, operators, and literals.

  #### 🧩 Syntax Analysis
  - Parses the token sequence to ensure correct syntax.
  - Detects grammatical structure and highlights syntax errors.

  #### 🧠 Semantic Analysis
  - Validates the meaning of the code.
  - Detects undeclared variables, type mismatches, and scope issues.

  #### ⚙️ Intermediate Code Generation
  - Translates code into Three-Address Code (TAC).
  - Shows how complex expressions are broken into simpler operations using temporary variables.

---

## ✨ Key Features

- Simple and clean code editor for C/C++
- Visual output for each compiler phase
- Real-time feedback and error reporting
- Great for students learning compiler design
- Lightweight and runs entirely in the browser (no backend)

---
---

## 🙌 Final Note

SynLex was built to make compiler theory **interactive, visual, and approachable**. Whether you're a student, educator, or just curious about how compilers work under the hood, we hope this tool makes your learning experience smoother and more engaging.

Happy compiling! 💻✨

