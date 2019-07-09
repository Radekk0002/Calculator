// Polyfill for repeat()
String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};

const input = document.getElementById("area")
const prevInput = document.getElementById("prevOperation")

prevInput.value = ""
input.value = "0";

// Check if user is pasting valid data
paste = (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    input.value = ""
    try {
        if (/[a-zA-Z]/g.test(pastedData)) {
            setTimeout(() => {
                input.value = "Invalid input data"
            }, 1)
            return
        }
        eval(pastedData)
    } catch (err) {
        setTimeout(() => {
            input.value = "Invalid input data"
        }, 1)
    }
}

press = (e) => {

    const figure = String.fromCharCode(e.keyCode);
    if (!figure.match(/[.\d]/) && e.keyCode !== 8) return e.preventDefault();
    
    // Check if user can type number ( Example " Invalid input data " then remove value from input )
    try{
        eval(input.value)
        getNumber()
        // Check dots
        if (figure === ".") {
            const countDots = number.length - number.replace(/[.]/g, "").length

            if (countDots > 0 && figure === ".") return e.preventDefault();

        }
        getAllChars()
    }catch(_) {
        input.value = ""
    }   
}

let signs = [];

// Every character except number and dot
let ecen = []

let dots = []

let bracketsOpen = [];
let bracketsClose = [];

let number = ""

insert = (figure) => {
    if (input.value === "0" && (!isNaN(figure) || figure === "(" || figure === "√") || /[a-zA-Z]/g.test(input.value)) input.value = figure
    else {
        input.value += figure;
    }

    getAllChars()

    getNumber()
    validation(signs, figure)

    input.scrollLeft = input.scrollWidth;

}

// Get all figures except numbers
getAllChars = () => {
    signs = [];
    ecen = []
    dots = []
    bracketsOpen = [];
    bracketsClose = [];
    let i;

    const value = input.value;
    const signReg = /[().√]/;
    for (i = 0; i < value.length; i++) {
        const figure = value[i];
        if (isNaN(figure) && !figure.match(signReg)) {
            const sign = {
                sign: figure,
                place: i
            }
            signs.push(sign)
        }
        if (isNaN(figure) && figure !== ".") {
            const sign = {
                sign: figure,
                place: i
            }
            ecen.push(sign)

            // Brackets
            if (figure.match(/[()]/)) {
                if (figure === "(") {
                    const sign = {
                        sign: figure,
                        place: i
                    }
                    bracketsOpen.push(sign)
                } else {
                    const sign = {
                        sign: figure,
                        place: i
                    }
                    bracketsClose.push(sign)
                }
            }
        }
        if (figure === ".") {

            const dot = {
                place: i
            }
            dots.push(dot)
        }
    }
}

//VALIDATION

validation = (signs, figure) => {
    const value = input.value
    const signsLength = signs.length
    const lastSign = (signs[signsLength - 1] ? signs[signsLength - 1].place : 0);
    const bracketOpen = (bracketsOpen[bracketsOpen.length - 1] ? bracketsOpen[bracketsOpen.length - 1].place : -2);
    const nextToLastSign = (signs[(signsLength - 2)] ? signs[(signsLength - 2)].place : -2)

    // Example "  ++  " then "  +  "
    if (lastSign === nextToLastSign + 1 || lastSign === bracketOpen + 1) {
        return back()
    }

    checkDots(figure)

    // Example "  *  " then "  0*  "
    if (/[+/%^*-]/.test(figure) && value.length === 1) {
        input.value = "0" + figure
    } else if (/[\d()√]/.test(figure)) {

        const bracketsOpenLength = bracketsOpen.length;
        const bracketsCloseLength = bracketsClose.length

        // Example "  8(  " then "  8*(  "
        if ((figure === "(" && (!isNaN(value[value.length - 2]) && value[value.length - 2] != ".")) ||
            (figure === "(" && value[value.length - 2] === ")") ||
            (!isNaN(figure) && value[value.length - 2] === ")")
        ) {
            input.value = input.value.slice(0, value.length - 1) + "*" + figure


        }
        // Example "  0.(  " then "  0.0*(  "
        else if (figure === "(" && (value[value.length - 2] === "." || value[value.length - 2] === "√")) {
            input.value = input.value.slice(0, value.length - 1) + "0*" + figure
        }
        // Example "  0.)  " then "  0.0)  "
        else if (figure === ")" && (value[value.length - 2] === "." || value[value.length - 2] === "(" || value[value.length - 2] === "√")) {
            input.value = input.value.slice(0, value.length - 1) + "0" + figure
        }
        // Example "  )  " then "  (0)  "
        else if (figure === ")" && value[0] === undefined) {
            input.value = input.value.slice(0, value.length - 1) + "(0" + figure
        }
        // Example "  )  " then "  (0)  "
        if (figure === ")" && bracketsCloseLength > bracketsOpenLength) {

            if (value.length === 1) input.value = "0" + input.value

            input.value = "(" + input.value

        }

    } // Example "  √+  " then "  √  "
    if (!/[\d().√]/.test(figure) && value[value.length - 2] === "√") {
        input.value = value.substring(0, value.length - 1);



    }
    // Example "  5√  " then "  5*√  "
    if (/[\d).]/.test(value[value.length - 2]) && figure === "√") {

        if (value[value.length - 2] === ".") {

            input.value = input.value.slice(0, value.length - 1) + "0*" + figure

        } else {
            input.value = input.value.slice(0, value.length - 1) + "*" + figure
        }
    }

    // Example "  ).  " then "  )*0.  "
    if ((figure === "." && value[value.length - 3] === ")")) {
        input.value = input.value.slice(0, value.length - 2) + "*" +
            input.value.slice(value.length - 2)
    }
}

getNumber = () => {

    const value = input.value;

    const ecenLength = ecen.length
    const lastEcen = (ecen[ecenLength - 1] ? ecen[ecenLength - 1].place : -1);

    number = value.slice(lastEcen + 1)

    // If first char in number is dot then place 0 before dot ( .98 => 0.98 )
    if (number[0] === ".") input.value = value.slice(0, value.length - 1) + "0" + value.slice(value.length - 1)

}

back = () => {
    const value = input.value;
    const valueLength = value.length;
    const nan = isNaN(value[value.length - 1])
    input.value = value.substring(0, valueLength - 1);

    if (nan) getAllChars()

    getNumber()

}

clean = () => {
    signs = [];
    ecen = [];
    dots = [];
    input.value = "0"
    getNumber()
}

AC = () => {
    signs = [];
    ecen = [];
    dots = [];
    input.value = "0"
    prevInput.value = ""
    getNumber()
}


// Brackets Validation

bracketsValid = () => {
    // Example " (((((990) " then " (((((990))))) "
    const value = input.value
    if (bracketsOpen.length > bracketsClose.length) {
        const count = bracketsOpen.length - bracketsClose.length
        if (value[value.length - 1] === "(") input.value = value + "0"
        input.value = input.value + ")".repeat(count)
    }
    // Example " (990))))) " then " (((((990))))) "
    else if (bracketsOpen.length < bracketsClose.length) {
        const count = bracketsClose.length - bracketsOpen.length
        input.value = "(".repeat(count) + value
    }
}

checkDots = (figure) => {
    // Check Dots
    const countDots = number.length - number.replace(/[.]/g, "").length

    if (countDots > 1 && figure === ".") {
        return back()
    }
}

let num = "";

result = () => {
    let check = 1;
    let value = input.value;
    getAllChars()
    bracketsValid()

    // Example " 0+ " then " 0 "
    if (!/[\d√())]/.test(value[value.length - 1])) input.value = value.substring(0, value.length - 1)

    // Example " √√√√√√ " then " √√√√√√0 "
    if (value[value.length - 1] === "√") input.value = value + "0"

    value = input.value;
    let operation = "";
    let openBrackets = 0;
    let closeBrackets = 0;

    // Conversion to mathematical operation
    for (let i = 0; i <= input.value.length - 1; i++) {

        // Conversion percentage char
        if (input.value[i] === "%") {
            input.value = input.value.split("%").join("*1/100*");
        }
        // Conversion power char
        else if (input.value[i] === "^") {
            input.value = input.value.split("^").join("**");
        }

        // Conversion root char
        else if (input.value[i] === "√") {
            let value = input.value;
            let count = 0;
            let slicedValueFrom = value.slice(0, i)
            let leftValue;
            let numbers = ""
            // let putBrackets;

            for (let x = i; x < input.value.length; x++) {

                if (input.value[x] === "√") {
                    count++
                } else if (input.value[x] !== "√" && (!isNaN(input.value[x]) || input.value[x] === ".")) {

                    value = input.value.slice(i, x).replace(/[√]/g, "Math.sqrt(")

                    for (let z = x; z <= input.value.length; z++) {
                        if (isNaN(input.value[z]) && input.value[z] != ".") {

                            leftValue = input.value.slice(z)
                            break;
                        }
                        numbers = input.value.slice(x, z + 1)
                    }

                    input.value = slicedValueFrom + value + numbers + ")".repeat(count) + leftValue
                    break;
                }
            }
            count = 0;
        }
    }

    for (let i = 0; i <= input.value.length - 1; i++) {

        // Checking if user is dividing by 0
        if (input.value[i] === "/") {
            operation = ""
            if (input.value[i + 1] === "(") {
                openBrackets = 1;
                operation = "("
                closeBrackets = 0;
                for (let x = i + 2; x <= input.value.length - 1; x++) {

                    if (input.value[x] === "(") openBrackets++
                    else if (input.value[x] === ")") closeBrackets++

                    operation += input.value[x]
                    if (openBrackets === closeBrackets) break;
                }

            } else if (input.value[i + 1] === "0") {
                operation = 0
            } else if(operation==="") operation="1"
            try {
                check = eval(operation)
                if (check === 0) {
                    if (!/[a-zA-Z]/g.test(input.value)) prevInput.value = value

                    input.value = "Do not divide by zero!"
                    break;
                }
            } catch (err) {
                if (err) {
                    if (!/[a-zA-Z]/g.test(input.value)) prevInput.value = value
                    input.value = "Invalid input data"
                }
            }
        }
    }

    if (check) {
        try {
            const result = (eval(input.value) ? eval(input.value) : "0")
            AC()
            if (!/[a-zA-Z]/g.test(input.value)) {
                createHistory(value, result)
                prevInput.value = value
            }
            
            input.value = result
            getNumber()
        } catch (err) {
            if (err) {
                if (!/[a-zA-Z]/g.test(input.value)) prevInput.value = value
                input.value = "Invalid input data"
            }
        }
    }
}


// History

const historyBox = document.getElementById("historyBox")

showHistory = () => {
    historyBox.classList.toggle("active")
}

createHistory = (operation, result) => {
    const div = document.createElement("div")
    div.setAttribute("id", "history")
    const operationField = document.createElement("p")
    operationField.setAttribute("id", "historyOperation")
    operationField.innerHTML = operation + " = " + result

    div.appendChild(operationField)

    historyBox.appendChild(div)
}

document.addEventListener("click", (e) => {
    if (e.target && (e.target.id === ("history") || e.target.id === ("historyOperation"))) {
        let histValue = e.target.innerText;
        histValue = histValue.replace(/\s/g, "")
        
        prevInput.value = histValue.substring(0, histValue.indexOf("="));
        
        histValue = histValue.substring(histValue.indexOf("=") + 1);
        input.value = histValue
        showHistory()
    } else if (e.target && e.target.id !== "undo") {
        historyBox.classList.remove("active")
    }
})