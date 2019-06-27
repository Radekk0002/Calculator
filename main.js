const input = document.getElementById("area")

input.value = "";

// let figure;

let signs = [];

// Every character except number and dot
let ecen = []

let dots = []

let number = ""

insert = (figure) =>{
    // figure;
    // var number;
    // var Sign;
    // var sign;
    // Sign = figure
    // number = NaN;
    // sign = "";
    const signReg = /[(.)√]/;
    if (isNaN(figure) && !figure.match(signReg)) {
        const sign = {
            sign: figure,
            place: input.value.length
        }
        signs.push(sign)
    } 
    if (isNaN(figure) && figure !== ".") {
        console.log("object")
        const sign = {
            sign: figure,
            place: input.value.length
        }
        ecen.push(sign)
    }

    if(figure === "."){
        const dot = {
            place: input.value.length
        }
        dots.push(dot)
    }
    console.log(ecen)
    console.log(figure)
    // else {
    //     number = figure;
    // }
    if(validation(signs, figure)) {
        input.value += figure;
        getNumber()
    }
    
    console.log(number)

        
}

getNumber = () =>{
    // if (!isNaN(figure) || figure === ".") {
        const value = input.value;
        const ecenLength = ecen.length
        const lastEcen = (ecen[ecenLength - 1] ? ecen[ecenLength - 1].place : -1);

        number = value.slice(lastEcen+1)

        // If first char in number is dot then place 0 before dot ( .98 => 0.98 )
        if (number[0] === ".") input.value = value.slice(0, value.length-1) + "0" + value.slice(value.length-1)
        console.log(number)
        
    // }
}

back = () =>{
    const value = input.value;
    const valueLength = value.length;
    const signsLength = signs.length;
    const ecenLength = ecen.length
    input.value = value.substring(0, valueLength-1);

    //If last char is a sign
    if (signs[signsLength - 1] !== undefined && valueLength - 1 === signs[signsLength - 1].place) {
        signs.pop()
        if (signs[signsLength - 1] !== undefined && signs[signsLength - 1].sign === ".") dots.pop()
        
    }

    if (ecen[ecenLength - 1] !== undefined && valueLength - 1 === ecen[ecenLength - 1].place) {
        ecen.pop()
    }

    getNumber()
    console.log(signs)
}

clean = ()=>{
    signs = [];
    ecen = [];
    dots = [];
    input.value = ""
}

AC = () =>{
    signs = [];
    ecen = [];
    dots = [];
    input.value = ""
}

//VALIDATION

validation = (signs, figure)=>{
    // for(el in signs){
        const signsLength = signs.length
        const lastSign = (signs[signsLength - 1] ? signs[signsLength - 1].place : 0);
        let nextToLastSign = -2;
        if(signsLength > 1) nextToLastSign = signs[(signsLength - 2)].place;
        
        console.log(lastSign, nextToLastSign, signs)
        if (lastSign === nextToLastSign + 1) {
            signs.pop()
            return false
        }

        // Check Dots
        const countDots = number.length - number.replace(/[.]/g, "").length
        console.log(countDots, dots)
        if (countDots > 0 && figure === ".") {
            dots.pop()
            return false
        }
    // }
    return true
}

result = () =>{
    input.value = eval(input.value)
}