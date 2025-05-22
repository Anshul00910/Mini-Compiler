document.addEventListener('DOMContentLoaded', function () {
    const codeTextarea = document.getElementById('code-textarea');
    const lineNumbers = document.getElementById('line-numbers');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const outputContent = document.getElementById('output-content');
    const phaseIndicator = document.getElementById('phase-indicator');
    const loader = document.getElementById('loader');
    const statusMessage = document.getElementById('status-message');
    const compilerButtons = document.querySelectorAll('.compiler-button');
    const modal = document.getElementById('output-modal');
    const modalOutput = document.getElementById('modal-output');
    const modalTitle = document.getElementById('modal-title');
    const closeModal = document.getElementById('close-modal');

    // Sample initial code
    const initialCode = `// Sample C++ code
#include <iostream>

int main() {
    int x = 10;
    int y = 20;
    
    std::cout << "Sum: " << x + y << std::endl;
    
    return 0;
}`;
    codeTextarea.value = initialCode;

    // Update line numbers
    function updateLineNumbers() {
        const lines = codeTextarea.value.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    }

    // Initialize line numbers
    updateLineNumbers();

    // Event listeners
    codeTextarea.addEventListener('input', updateLineNumbers);
    codeTextarea.addEventListener('scroll', function () {
        lineNumbers.scrollTop = codeTextarea.scrollTop;
    });

    codeTextarea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;

            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            updateLineNumbers();
        }
    });

    // Handle file uploads
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;

            const reader = new FileReader();
            reader.onload = function (e) {
                codeTextarea.value = e.target.result;
                updateLineNumbers();
            };
            reader.readAsText(file);
        }
    });

    // Handle compiler button clicks
    compilerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const phase = this.getAttribute('data-phase');
            processCode(phase);
        });
    });

    // Close modal when clicking the X or outside the modal
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Process code based on selected phase
    function processCode(phase) {
        const code = codeTextarea.value;
        if (!code.trim()) {
            statusMessage.textContent = 'Please enter some code first.';
            return;
        }

        // Reset messages and show loader
        statusMessage.textContent = '';
        loader.style.display = 'block';

        // Update phase indicator on RHS
        let phaseText = '';
        switch (phase) {
            case 'lexical':
                phaseText = 'Lexical Analysis';
                break;
            case 'syntax':
                phaseText = 'Syntax Analysis';
                break;
            case 'semantic':
                phaseText = 'Semantic Analysis';
                break;
            case 'intermediate':
                phaseText = 'Intermediate Code';
                break;
        }
        phaseIndicator.textContent = phaseText;

        // Simulated backend call 
        setTimeout(() => {
            simulateBackendResponse(phase, code)
                .then(result => {
                    loader.style.display = 'none';
                    outputContent.textContent = result;

                    // Also update modal content
                    modalTitle.textContent = phaseText + ' Output';
                    modalOutput.textContent = result;

                })
                .catch(error => {
                    loader.style.display = 'none';
                    outputContent.textContent = 'Error: ' + error.message;
                    statusMessage.textContent = 'An error occurred during processing.';
                });
        }, 1000); // Simulated 1 second delay
    }

    // This function simulates backend responses
    function simulateBackendResponse(phase, code) {
        return new Promise((resolve, reject) => {
            try {
                let result = '';
                switch (phase) {
                    case 'lexical':
                        result = simulateLexicalAnalysis(code);
                        break;
                    case 'syntax':
                        result = simulateSyntaxAnalysis(code);
                        break;
                    case 'semantic':
                        result = simulateSemanticAnalysis(code);
                        break;
                    case 'intermediate':
                        result = simulateIntermediateCode(code);
                        break;
                }
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    // These functions simulate the compiler phases
 function simulateLexicalAnalysis(code) {
    const tokens = [];

    // Define token categories
   const keywords = new Set([
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
    'inline', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof',
    'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile',
    'while'
    ]);


    const operators = new Set([
        '==', '!=', '<=', '>=', '++', '--', '+=', '-=', '*=', '/=', '%=',
        '+', '-', '*', '/', '=', '<', '>', '%', '<<', '>>', '::'
    ]);

    const symbols = {
        ';': 'SEMICOLON',
        '{': 'BRACE',
        '}': 'BRACE',
        '(': 'PARENTHESIS',
        ')': 'PARENTHESIS',
        ',': 'COMMA',
        ':': 'COLON',
        '#': 'PREPROCESSOR',
        '"': 'QUOTE',
        "'": 'QUOTE'
    };

    // Remove comments (both single-line and multi-line)
    code = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Tokenize with priority for multi-character tokens
    const pattern = /(::|<<|>>|==|!=|<=|>=|\+=|-=|\*=|\/=|%=|--|\+\+|[a-zA-Z_][a-zA-Z0-9_]*|\d+|"[^"]*"|'[^']*'|[{}();,#:<>\[\]=+\-*/%&|^!~?])/g;
    const matches = code.match(pattern) || [];

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        let type = 'IDENTIFIER';

        if (keywords.has(match)) {
            type = 'KEYWORD';
        } else if (operators.has(match)) {
            type = 'OPERATOR';
        } else if (!isNaN(match)) {
            type = 'NUMBER';
        } else if (match.startsWith('"') && match.endsWith('"')) {
            type = 'STRING_LITERAL';
        } else if (match.startsWith("'") && match.endsWith("'")) {
            type = 'CHAR_LITERAL';
        } else if (symbols[match]) {
            type = symbols[match];
        }

        tokens.push({ token: match, type });
    }

    return tokens.map((t, i) => `${i + 1}. ${t.token.padEnd(15)} - ${t.type}`).join('\n');
}


function simulateSyntaxAnalysis(code) {
  const lines = code.split('\n');

  let result = 'Syntax Analysis Results:\n\nParse Tree:\n';

  function isPreprocessor(line) {
    return line.trim().startsWith('#');
  }

  function isFunctionDef(line) {
    return /^\s*(int|void|float|double|char)\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*\{?/.test(line);
  }

  function getFunctionHeaderParts(line) {
    const funcMatch = line.match(/^\s*(int|void|float|double|char)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/);
    if (!funcMatch) return null;
    return {
      returnType: funcMatch[1],
      name: funcMatch[2],
      params: funcMatch[3].trim()
    };
  }

  function isVarDecl(line) {
    return /^\s*(int|float|double|char)\s+/.test(line);
  }

  function getVarDeclarations(line) {
    const typeMatch = line.match(/^\s*(int|float|double|char)\s+(.*);/);
    if (!typeMatch) return [];
    const type = typeMatch[1];
    const declPart = typeMatch[2];
    const parts = declPart.split(',');
    return parts.map(part => {
      const p = part.trim();
      const eqIdx = p.indexOf('=');
      if (eqIdx !== -1) {
        const name = p.slice(0, eqIdx).trim();
        const value = p.slice(eqIdx + 1).trim();
        return { type, name, value };
      } else {
        return { type, name: p, value: undefined };
      }
    });
  }

  function isStatementNeedingSemicolon(line) {
    return (
      isVarDecl(line) ||
      line.startsWith('return') ||
      (line.includes('=') && !line.includes('==') && !line.startsWith('if') && !line.startsWith('while'))
    );
  }

  let insideFunction = false;
  let currentFunction = null;
  let braceStack = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) continue;

    if (isPreprocessor(line)) {
      result += `  |- Preprocessor Directive: ${line}\n`;
      continue;
    }

    if (isFunctionDef(line)) {
      const header = getFunctionHeaderParts(line);
      if (header) {
        insideFunction = true;
        currentFunction = header.name;
        result += `  |- Function Definition: ${header.returnType} ${header.name}(${header.params})\n`;
        result += `      |- Parameters:\n`;
        if (header.params === '') {
          result += `          (none)\n`;
        } else {
          const params = header.params.split(',').map(p => p.trim());
          for (const param of params) {
            result += `          |- ${param}\n`;
          }
        }
        result += `      |- Body:\n`;
        if (line.endsWith('{')) {
          braceStack.push('{');
        }
        continue;
      }
    }

    if (insideFunction) {
      if (line.includes('{')) {
        braceStack.push('{');
      }

      if (line.includes('}')) {
        if (braceStack.length === 0) {
          result += `  |-  Error: Unmatched closing brace at line ${i + 1}: "${line}"\n`;
        } else {
          braceStack.pop();
        }
        if (braceStack.length === 0) {
          insideFunction = false;
          currentFunction = null;
          continue;
        }
      }

      if (isVarDecl(line)) {
        if (!line.endsWith(';')) {
          result += `          |-  Error: Missing semicolon at end of statement: "${line}"\n`;
        }
        const decls = getVarDeclarations(line + (line.endsWith(';') ? '' : ';')); // artificially add ; to parse properly
        for (const decl of decls) {
          if (decl.value !== undefined) {
            result += `          |- Variable Declaration: ${decl.type} ${decl.name} = ${decl.value}\n`;
          } else {
            result += `          |- Variable Declaration: ${decl.type} ${decl.name}\n`;
          }
        }
      } else if (line.startsWith('return')) {
        if (!line.endsWith(';')) {
          result += `          |-  Error: Missing semicolon at end of return statement: "${line}"\n`;
        }
        result += `          |- Return Statement: ${line}\n`;
      } else if (line.includes('=')) {
        if (!line.endsWith(';')) {
          result += `          |-  Error: Missing semicolon at end of expression: "${line}"\n`;
        }
        result += `          |- Expression Statement: ${line}\n`;
      } else {
        result += `          |- Statement: ${line}\n`;
      }
    } else {
      if (line.includes('}')) {
        result += `  |- Error: Unmatched closing brace at line ${i + 1}: "${line}"\n`;
      } else {
        result += `  |- Statement: ${line}\n`;
      }
    }
  }

  if (braceStack.length > 0) {
    result += ` Error: Missing closing brace(s) for function block(s).\n`;
  }

  result += 'Syntax analysis completed successfully.\n';
  return result;
}


function simulateSemanticAnalysis(code) {
    let result = 'Semantic Analysis Results:\n\n';

    // Symbol Table
    result += 'Symbol Table:\n';
    result += '----------------------------------------\n';
    result += 'Name        Type       Scope     Line\n';
    result += '----------------------------------------\n';

    const lines = code.split('\n');
    const declarations = [];
    const scopeStack = ['global'];
    let currentScope = 'global';

    const functionRegex = /\b(?:int|void|float|double|char)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/;

    // Track function names to avoid undefined variable warnings for them
    const declaredFunctions = new Set();

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('#')) return; // skip preprocessor

        // Function declaration
        const funcMatch = trimmed.match(functionRegex);
        if (funcMatch) {
            const funcName = funcMatch[1];
            declaredFunctions.add(funcName);
            const params = funcMatch[2].split(',').map(p => p.trim()).filter(Boolean);
            currentScope = funcName;
            scopeStack.push(funcName);

            // Add function parameters to symbol table
            params.forEach(param => {
                const [type, name] = param.trim().split(/\s+/);
                if (type && name) {
                    declarations.push({
                        type,
                        name,
                        value: 'undefined',
                        scope: currentScope,
                        line: idx + 1
                    });
                    result += `${name.padEnd(12)} ${type.padEnd(10)} ${currentScope.padEnd(8)} ${idx + 1}\n`;
                }
            });
            return; // Don't continue parsing this line for variables (avoid adding function name as variable)
        }

        if (trimmed.includes('{')) {
            scopeStack.push(currentScope);
        }

        if (trimmed.includes('}')) {
            scopeStack.pop();
            currentScope = scopeStack[scopeStack.length - 1] || 'global';
        }

        // Match variable declarations
        const typeMatch = trimmed.match(/\b(int|float|double|char)\b/);
        if (typeMatch) {
            const type = typeMatch[1];
            const decls = trimmed
                .replace(/.*?\b(int|float|double|char)\b/, '')
                .split(',')
                .map(s => s.trim().replace(/;$/, ''));

            decls.forEach(decl => {
                const [name, value] = decl.split('=').map(s => s?.trim());
                if (name) {
                    const existing = declarations.find(d => d.name === name && d.scope === currentScope);
                    if (existing) {
                        result += `Warning: Line ${idx + 1} - Variable '${name}' redeclared in same scope\n`;
                    } else {
                        declarations.push({
                            type,
                            name,
                            value: value || 'undefined',
                            scope: currentScope,
                            line: idx + 1
                        });
                        result += `${name.padEnd(12)} ${type.padEnd(10)} ${currentScope.padEnd(8)} ${idx + 1}\n`;
                    }
                }
            });
        }
    });

    result += '\nType Checking:\n';
    result += '---------------\n';

    declarations.forEach(decl => {
        if (decl.value !== 'undefined') {
            let valueType = 'unknown';
            const val = decl.value;

            if (!isNaN(val) && !val.includes('.')) {
                valueType = 'int';
            } else if (!isNaN(val) && val.includes('.')) {
                valueType = 'float';
            } else if (val.startsWith('"') && val.endsWith('"')) {
                valueType = 'string';
            } else if (val.startsWith("'") && val.endsWith("'") && val.length === 3) {
                valueType = 'char';
            }

            if (decl.type === 'int' && valueType !== 'int') {
                result += `Warning: Line ${decl.line} - Assigning ${valueType} to int variable '${decl.name}'\n`;
            } else if (decl.type === 'float' && !['float', 'int'].includes(valueType)) {
                result += `Warning: Line ${decl.line} - Assigning ${valueType} to float variable '${decl.name}'\n`;
            } else if (decl.type === 'char' && valueType !== 'char') {
                result += `Warning: Line ${decl.line} - Assigning ${valueType} to char variable '${decl.name}'\n`;
            }
        }
    });

    result += '\nUndefined Variables:\n';
    result += '---------------------\n';

    const declaredNames = declarations.map(d => d.name).concat([...declaredFunctions]);
    const ignoredWords = new Set([
        'int', 'float', 'double', 'char', 'void', 'if', 'else', 'while', 'for', 'return',
        'include', 'iostream', 'stdio', 'main', 'printf', 'scanf', 'cout', 'cin', 'endl',
        // common words that might appear but aren't variables
        'no', 'error', 'h',
    ]);

    const usedVars = [...code.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g)]
        .map(match => match[1])
        .filter(name => !ignoredWords.has(name));

    const uniqueUsed = new Set(usedVars);
    uniqueUsed.forEach(name => {
        if (!declaredNames.includes(name)) {
            result += `Warning: Variable '${name}' used but not declared\n`;
        }
    });

    return result;
}

function simulateIntermediateCode(code) {
    let result = 'Three-Address Code Intermediate Representation:\n\n';
    const lines = code.split('\n');
    let tempCounter = 1;

    // Recursive expression processor with operator precedence
    function processExpression(expr) {
        expr = expr.trim();

        // If expression is just a variable or number
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr) || /^[0-9]+(\.[0-9]+)?$/.test(expr)) {
            return { value: expr };
        }

        // Remove surrounding parentheses if any
        while (expr.startsWith('(') && expr.endsWith(')')) {
            // Check balanced parentheses inside
            let depth = 0, balanced = true;
            for (let i = 0; i < expr.length; i++) {
                if (expr[i] === '(') depth++;
                else if (expr[i] === ')') depth--;
                if (depth === 0 && i < expr.length - 1) {
                    balanced = false;
                    break;
                }
            }
            if (balanced) {
                expr = expr.slice(1, -1).trim();
            } else {
                break;
            }
        }

        // Operators by precedence (lowest to highest)
        const operatorsByPrecedence = [
            ['+', '-'],
            ['*', '/']
        ];

        for (let ops of operatorsByPrecedence) {
            let parts = splitAtOperatorOutsideParentheses(expr, ops);
            if (parts) {
                const leftExpr = processExpression(parts.left);
                const rightExpr = processExpression(parts.right);
                const tempVar = `t${tempCounter++}`;
                let codeLines = [];
                if (leftExpr.code) codeLines.push(leftExpr.code);
                if (rightExpr.code) codeLines.push(rightExpr.code);
                codeLines.push(`${tempVar} = ${leftExpr.temp || leftExpr.value} ${parts.operator} ${rightExpr.temp || rightExpr.value}`);
                return { code: codeLines.join('\n'), temp: tempVar };
            }
        }

        // If no operator found (just return as is)
        return { value: expr };
    }

    // Helper to split expression at the last occurrence of any of the operators outside parentheses
    function splitAtOperatorOutsideParentheses(expr, ops) {
        let depth = 0;
        for (let i = expr.length - 1; i >= 0; i--) {
            let ch = expr[i];
            if (ch === ')') depth++;
            else if (ch === '(') depth--;
            else if (depth === 0 && ops.includes(ch)) {
                return {
                    left: expr.substring(0, i),
                    right: expr.substring(i + 1),
                    operator: ch
                };
            }
        }
        return null;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#') || line.startsWith('//') || !line) continue;

        if (line.includes('main()') || line.includes('main ()')) {
            result += `FUNC_BEGIN main\n`;
            continue;
        }

        if (line.includes('return')) {
            const returnValue = line.replace('return', '').replace(';', '').trim();
            const expr = processExpression(returnValue);
            if (expr.temp) {
                result += `${expr.code}\n`;
                result += `RETURN ${expr.temp}\n`;
            } else {
                result += `RETURN ${expr.value}\n`;
            }
            continue;
        }

        // Variable declaration with initialization
        const declMatch = line.match(/\b(int|float|double|char)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);/);
        if (declMatch) {
            const type = declMatch[1];
            const name = declMatch[2];
            const value = declMatch[3].trim();

            result += `DECLARE ${type} ${name}\n`;

            const expr = processExpression(value);
            if (expr.temp) {
                result += `${expr.code}\n`;
                result += `${name} = ${expr.temp}\n`;
            } else {
                result += `${name} = ${expr.value}\n`;
            }
            continue;
        }

        // Simple variable declaration without initialization
        const simpleDeclMatch = line.match(/\b(int|float|double|char)\s+([a-zA-Z_][a-zA-Z0-9_]*);/);
        if (simpleDeclMatch) {
            const type = simpleDeclMatch[1];
            const name = simpleDeclMatch[2];
            result += `DECLARE ${type} ${name}\n`;
            continue;
        }

        // Assignment without declaration
        const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);$/);
        if (assignMatch) {
            const name = assignMatch[1];
            const value = assignMatch[2].trim();
            const expr = processExpression(value);
            if (expr.temp) {
                result += `${expr.code}\n`;
                result += `${name} = ${expr.temp}\n`;
            } else {
                result += `${name} = ${expr.value}\n`;
            }
            continue;
        }

        // Handle cout
        if (line.includes('cout')) {
            const parts = line.split('<<').slice(1);
            for (let part of parts) {
                part = part.replace(';', '').trim();

                if (part === 'endl' || part === 'std::endl') {
                    result += `PRINT NEWLINE\n`;
                } else if (/^".*"$/.test(part)) {
                    result += `PRINT ${part}\n`;
                } else {
                    const expr = processExpression(part);
                    if (expr.temp) {
                        result += `${expr.code}\n`;
                        result += `PRINT ${expr.temp}\n`;
                    } else {
                        result += `PRINT ${expr.value}\n`;
                    }
                }
            }
            continue;
        }
    }

    result += `FUNC_END main\n`;
    return result;
}

}
);
