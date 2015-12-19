var maxParts = 8;

var partsNumber = 2;
var partsChars = new Array(maxParts);
var totalLength = 1;
var finalProfileNormalized = function (x) { return Math.sin(x / 3.1415); };
var finalSpeedNormalized = function (x) { return 1; };

var onePartTravelTime = 1; // в секундах
var leftControlType = 1;
var rightControlType = 1;
var controlTime = partsNumber + 1;
var currentTime = 0;
var stepsInS = 2000;
var step = onePartTravelTime / stepsInS; // для производных и интегралов.
var muUnderlinedData = new Array(0);
var nuUnderlinedData = new Array(0);

var munuControlData;
var muData;
var nuData;

var C; // matrix
var animationSpeed = 0.5;

var MaxControlTime = 10;


function assure(x) {
    if (!isFinite(x)) {
        throw "value " + x;
    }
}


function interpolateValue(data, t, dataStep) {
    if (t < 0) return data[0];
    var n = Math.floor(t / dataStep);
    if (n + 1 >= data.length) return data[data.length - 1];
    var x = t / dataStep - n;
    return data[n] * (1 - x) + data[n + 1] * x;
}

function leftControlFunction(t) {
    return interpolateValue(muData, t, step);
}

function rightControlFunction(t) {
    return interpolateValue(nuData, t, step);
}

function finalProfile(x) {
    return finalProfileNormalized(x / totalLength);
}


function finalSpeed(x) {
    return finalSpeedNormalized(x / totalLength);
}


function T(i, j) {
    var zi = Math.sqrt(partsChars[i].rho * partsChars[i].k);
    var zj = Math.sqrt(partsChars[j].rho * partsChars[j].k);
    return zi * 2.0 / (zi + zj);
}

function R(i, j) {
    var zi = Math.sqrt(partsChars[i].rho * partsChars[i].k);
    var zj = Math.sqrt(partsChars[j].rho * partsChars[j].k);
    return (zi - zj) * 1.0 / (zi + zj);
}


function stringToFormula(text) {
    var replaced = text.replace('sin', 'Math.sin')
		.replace('cos', 'Math.cos')
		.replace('exp', 'Math.exp')
		.replace('atan', 'atnreplaces')
		.replace('tan', 'Math.tan')
		.replace('atnreplaces', 'Math.atan')
		.replace('sqrt', 'Math.sqrt')
		.replace('log', 'Math.log')
		.replace('pow', 'Math.pow');
    return "return " + replaced;
}

function compileFinalProfile() {
    finalProfileNormalized = new Function("x", stringToFormula($("#finalFormula").val()));
}


function compileFinalSpeed() {
    finalSpeedNormalized = new Function("x", stringToFormula($("#finalSpeedFormula").val()));
}


function buildCMatrix() {
    var leftCoeff = Math.pow(-1, leftControlType);
    var rightCoeff = Math.pow(-1, rightControlType);
    var n = partsNumber;

    var template = new Array(2 * n);
    for (var i = 0; i < 2 * n; i++) {
        template[i] = 0;
    }

    var els = new Array(2 * n);
    for (var i = 0; i < 2 * n; i++) {
        els[i] = template.slice(0);
    }

    for (var i = 0; i < 2 * n; i++) {
        var part = Math.floor(i / 2);
        if (i == 0) {
            els[1][0] = leftCoeff;
        } else if (i == 2 * n - 1) {
            els[2 * n - 2][2 * n - 1] = rightCoeff;
        } else if (i % 2 == 1) {
            els[i - 1][i] = R(part, part + 1);
            els[i + 2][i] = T(part, part + 1);
        } else if (i % 2 == 0) {
            els[i - 2][i] = T(part, part - 1);
            els[i + 1][i] = R(part, part - 1);
        }
    }
    var C = Matrix.create(els);
    return C;
}


function recountIntegrals() {
    //var totalTime = controlTime * onePartTravelTime + 0.5;
    var N = stepsInS * controlTime;
    muUnderlinedData = new Array(N);
    nuUnderlinedData = new Array(N);
    muUnderlinedData[0] = 0;
    nuUnderlinedData[0] = 0;
    for (var i = 1; i < N; i++) {
        muUnderlinedData[i] = muUnderlinedData[i - 1] + step * leftControlFunction((i - 0.5) * step);
        nuUnderlinedData[i] = nuUnderlinedData[i - 1] + step * rightControlFunction((i - 0.5) * step);
        assure(muUnderlinedData[i]);
        assure(nuUnderlinedData[i]);
    }
}

function integralOfLeftControlFunction(t) {
    return interpolateValue(muUnderlinedData, t, step);
}

function integralOfRightControlFunction(t) {
    return interpolateValue(nuUnderlinedData, t, step);
}

function MuUnderlined(t) {
    if (leftControlType == 1) {
        return leftControlFunction(t);
    } else {
        return integralOfLeftControlFunction(t);
    }
}

function NuUnderlined(t) {
    if (rightControlType == 1) {
        return rightControlFunction(t);
    } else {
        return integralOfRightControlFunction(t);
    }
}

function upArrow() {
    var n = partsNumber;
    var arr = new Array(2 * n);
    for (var i = 0; i < 2 * n; i++) {
        arr[i] = 0;
    }
    arr[1] = 1;
    return Vector.create(arr);
}

function downArrow() {
    var n = partsNumber;
    var arr = new Array(2 * n);
    for (var i = 0; i < 2 * n; i++) {
        arr[i] = 0;
    }
    arr[2 * n - 2] = 1;
    return Vector.create(arr);
}

function makeRVector() {
    var n = partsNumber;
    var arr = new Array(2 * n);
    for (var i = 0; i < 2 * n; i++) {
        arr[i] = 0;
    }
    arr[0] = 1;
    arr[1] = 1;
    return Vector.create(arr);
}

function makeEMatrix(k) {
    var up = upArrow();
    var down = downArrow();

    var result = Matrix.create(up);
    var helper = C.multiply(up);

    for (var i = 1; i < k; i++) {
        result = result.augment(helper);
        helper = C.multiply(helper);
    }

    helper = down;
    for (var i = 0; i < k; i++) {
        result = result.augment(helper);
        helper = C.multiply(helper);
    }
    return result;
}


function makegVector(k) {
    var up = upArrow();
    var down = downArrow();
    var r = makeRVector();

    var els = new Array(2 * k);
    var n = partsNumber;

    var result = Matrix.create(up);

    var rightVector;
    rightVector = up;
    for (var i = 0; i < k; i++) {
        els[i] = r.dot(rightVector);
        rightVector = C.multiply(rightVector).add(up);
    }

    rightVector = down;
    for (var i = 0; i < k; i++) {
        els[k + i] = r.dot(rightVector);
        rightVector = C.multiply(rightVector).add(down);
    }

    return Vector.create(els);
}


function computeTotalShift() {
    var a = partsChars[0].a;
    var x1 = partsChars[0].l;

    var integral = 0;
    for (var i = 0; i < stepsInS; i++) {
        integral += finalSpeed(x1 / stepsInS * (i + 0.5));
    }
    integral *= x1 / stepsInS;

    return finalProfile(0) / 2 + finalProfile(x1) / 2 + integral / (2 * a);
}


function alphaVector(tau) {
    var n = partsNumber;
    var xx = recountBounds();

    var result = new Array(2 * n);

    for (var i = 0; i < 2 * n; i++) {
        var part = Math.floor(i / 2);
        var a = partsChars[part].a;
        var x = xx[part] + tau * a;
        if (i % 2 == 0) {
            x = xx[part + 1] - tau * a;
        }
        var canonize = function (y) {
            return Math.floor(2 * y / step / a + 0.5) * step * a / 2;
        };
        var phiDer = (finalProfile(canonize(x + a * step / 2)) - finalProfile(canonize(x - a * step / 2) )) / step / a;
        if (Math.abs(finalProfile(canonize(x + step / 2)) - finalProfile(canonize(x - step / 2))) > 0.5) {
            var trash = 1;
        }
        result[i] = 0.5 * (finalSpeed(x) + Math.pow(-1, i) * a * phiDer);
    }
    return Vector.create(result);
}


function computeDerivatives() {
    var E = makeEMatrix(controlTime);
    var EEinv = (E.multiply(E.transpose())).inv();
    var g = makegVector(controlTime);

    // Вычисления lmb1
    var integral = 0;
    var EtEEinv = E.transpose().multiply(EEinv);
    for (var i = 0; i < stepsInS; i++) {
        var tau = step * (i + 0.5);
        integral += EtEEinv.multiply(alphaVector(tau)).dot(g);
    }
    integral *= onePartTravelTime / stepsInS;

    var rightPart = computeTotalShift() - integral;
    var Eke = E.multiply(g);
    var leftCoeff = 0.5 * onePartTravelTime *
		(EEinv.multiply(Eke).dot(Eke) - g.dot(g));
    var lmb1 = rightPart / leftCoeff;
    if (controlTime == partsNumber) lmb1 = 0;
    // конец вычислений lmb1

    // var steps = Math.ceil(onePartTravelTime / step);
    munuControlData = new Array(stepsInS);
    var commonSummand = (EtEEinv.x(E).x(g).subtract(g)).multiply(0.5 * lmb1);
    for (var i = 0; i < stepsInS; i++) {
        var tau = step * (i + 0.5);
        munuControlData[i] = commonSummand.add(EtEEinv.x(alphaVector(tau))).elements;
        for (var j = 0; j < 2 * controlTime; j++) {
            assure(munuControlData[i][j]);
        }
    }
}


function computeControlsByDerivatives() {
    // var steps = Math.ceil(onePartTravelTime * controlTime / step);
    muData = new Array(stepsInS * controlTime);
    nuData = new Array(stepsInS * controlTime);
    // var sSteps = Math.ceil(onePartTravelTime / step);

    if (leftControlType == 1) {
        muData[0] = 0;
        var j = 1;
        for (var i = controlTime - 1; i >= 0; i--) {
            for (var tau = stepsInS - 1; tau >= 0; tau--) {
                muData[j] = muData[j - 1] + munuControlData[tau][i] * step;
                assure(muData[j]);
                j++;
            }
        }
    } else {
        var j = 0;
        for (var i = controlTime - 1; i >= 0; i--) {
            for (var tau = stepsInS - 1; tau >= 0; tau--) {
                muData[j] = munuControlData[tau][i];
                assure(muData[j]);
                j++;
            }
        }
    }

    if (rightControlType == 1) {
        nuData[0] = 0;
        var j = 1;
        for (var i = controlTime - 1; i >= 0; i--) {
            for (var tau = stepsInS - 1; tau >= 0; tau--) {
                nuData[j] = nuData[j - 1] + munuControlData[tau][controlTime + i] * step;
                assure(nuData[j]);
                j++;
            }
        }
    } else {
        var j = 0;
        for (var i = controlTime - 1; i >= 0; i--) {
            for (var tau = stepsInS - 1; tau >= 0; tau--) {
                nuData[j] = munuControlData[tau][controlTime + i];
                assure(nuData[j]);
                j++;
            }
        }
    }
}


function u(x, t) {
    // defining the part of rod
    var xcopy = x * 1.0;
    for (var part = 0; part < partsNumber; part++) {
        if (xcopy < partsChars[part].l) break;
        xcopy -= partsChars[part].l;
    }
    if (part == partsNumber) {
        part = partsNumber - 1;
        xcopy = partsChars[part].l;
    }
    // detecting distance to boundaries
    var toLeft = xcopy;
    var toRight = partsChars[part].l - xcopy;
    var a = partsChars[part].a;
    var result = uonedim(2 * part + 1, t - toRight / a)
		+ uonedim(2 * part + 2, t - toLeft / a);
    assure(result);
    return result;
}

/*
function uonedim(j, t) {
if (t < 0) return 0;
var n = partsNumber;
var result = 0;
for (var i = 1; i <= 2 * n; i++) {
if (C.e(j, i) != 0) {
var part = Math.floor((i - 1) / 2);
result += C.e(j, i) * uonedim(i, t - onePartTravelTime);
}
}
if (j == 2) result += MuUnderlined(t);
if (j == 2 * partsNumber - 1) result += NuUnderlined(t);

return result;
}
*/

// for agreement, для согласованности
utau = step;
uCache = [];

function getUCache(n) {
    if (uCache.length <= n) {
        for (i = uCache.length; i <= n + 50; i++) {
            uCache.push(uVector(i * utau))
        }
    }
    return uCache[n];
}

useOld = false;


function interpolateU(t) {
    if (useOld) return uVector(t);

    if (t < 0) return getUCache(0);
    var n = Math.floor(t / utau);
    var x = t / utau - n;
    return (getUCache(n).x(1 - x).add(getUCache(n + 1).x(x)));

}

function uonedim(j, t) {
    // j starts from 1
    return interpolateU(t).e(j);
}

function uVector(t) {
    var n = partsNumber;
    if (t < utau / 2) return Vector.Zero(2 * n);
    if (useOld) {
        vec = uVector(t - onePartTravelTime)
    } else {
        vec = interpolateU(t - onePartTravelTime)
    }
    var result = C.x(vec);

    // здесь нумерация с нуля
    result.elements[1] += MuUnderlined(t);
    result.elements[2 * n - 2] += NuUnderlined(t);
    return result;
}


function generatePartsChars() {
    // генерирует формочки для характеристик.
    for (var i = 0; i < maxParts; i++) {
        x = $("#partPattern>div").clone();
        x.find(".partNumber").text(i + 1);
        x.attr('data-id', i).appendTo("#partsChars");
    }
    // generating parameters
    partsChars = new Array(maxParts);
    for (var i = 0; i < maxParts; i++) {
        partsChars[i] = { rho: 1, k: 1, l: 1, a: 1 };
    }
}


function updateNotification() {
    $("#noteTimeEqual").hide();
    $("#noteTimeLess").hide();
    if (controlTime == partsNumber) $("#noteTimeEqual").show();
    if (controlTime < partsNumber) $("#noteTimeLess").show();
}

function setControlTime(time) {
    if (time == undefined) return;
    controlTime = Math.floor(time * 1);
    $("#controlTime").val(time);
    updateNotification();
}

function setPartsNumber(n) {
    if (n == undefined) return;
    partsNumber = n;
    $("#partsNumber").val(n);
    $("#partsChars").find(".charWrapper").slice(n).hide();
    $("#partsChars").find(".charWrapper").slice(0, n).show();
    if (controlTime < n) setControlTime(n);
    updateNotification();
}


function setLeftType(leftType) {
    var selector = $("#leftType");
    if (selector.val() != leftType) selector.val(leftType);
    leftControlType = leftType;
}

function setRightType(rightType) {
    var selector = $("#rightType");
    if (selector.val() != rightType) selector.val(rightType);
    rightControlType = rightType;
}


function updateChars() {
    $("#partsChars").find(".charWrapper").each(function (i, o) {
        var rho = $(o).find(".partDensity").val();
        var k = $(o).find(".partYoung").val();
        partsChars[i].rho = rho;
        partsChars[i].k = k;
        partsChars[i].a = Math.sqrt(k / rho);
        partsChars[i].l = onePartTravelTime * partsChars[i].a;
    });
}


// Drawing

CanvasRenderingContext2D.prototype.clear =
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
      if (preserveTransform) {
          this.save();
          this.setTransform(1, 0, 0, 1, 0, 0);
      }

      this.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (preserveTransform) {
          this.restore();
      }
  };


function drawAxes(canvas, xmin, xmax) {
    var context = canvas.getContext("2d");
    var jCanvas = $(canvas);
    var height = jCanvas.height();
    var width = jCanvas.width();
    //var xpos = function (x) { return (x - xmin) * 1.0 / (xmax - xmin) * width; };
    var ypos = function (y) { return (0.5 - y / 5) * height; };
    context.lineWidth = 1;

    context.beginPath();
    // context.setLineDash([7,5]);

    context.moveTo(0, ypos(0));
    context.lineTo(width, ypos(0));
    context.strokeStyle = "rgba(0, 0, 0, 0.8)";
    context.stroke();

    context.strokeStyle = "rgba(100, 100, 120, .8)";
    context.beginPath();
    // context.setLineDash([7,5]);
    context.moveTo(1, ypos(1));
    context.lineTo(width, ypos(1));
    context.stroke();

    context.beginPath();
    // context.setLineDash([7,5]);
    context.moveTo(-1, ypos(-1));
    context.lineTo(width, ypos(-1));
    context.stroke();
}


function drawFunction(func, canvas, xmin, xmax, steps, marginSteps, color, lineWidth) {
    if (color == undefined) color = "rgba(80, 100, 180, .8)";
    if (lineWidth == undefined) lineWidth = 1;
    // marginSteps - количество шагов справа и слева, которые можно не отрисовывать
    var context = canvas.getContext("2d");
    var jCanvas = $(canvas);
    var height = jCanvas.height();
    var width = jCanvas.width();

    var xpos = function (x) { return (x - xmin) * 1.0 / (xmax - xmin) * width; };
    var ypos = function (y) { return (0.5 - y / 5) * height; };

    // Draw the canvas shape
    var drawStep = (xmax - xmin) / steps;
    context.beginPath();
    context.moveTo(xpos(xmin + drawStep * marginSteps), ypos(func(xmin + drawStep * marginSteps)));
    for (var i = 1 + marginSteps; i <= steps - marginSteps; i++) {
        x = xmin + i * drawStep;
        context.lineTo(xpos(x), ypos(func(x)));
    }

    // Define the style of the canvas shape
    context.lineWidth = lineWidth;
    // context.fillStyle = "rgba(199, 73, 193, .2)";
    context.strokeStyle = color;
    // Close the path
    // context.closePath();
    // Fill the path with a colored outline
    // context.fill();
    context.stroke();
}


function recountBounds() {
    var parts = partsNumber;
    var bounds = new Array(parts + 1);
    bounds[0] = 0;
    for (var i = 0; i < parts; i++) {
        bounds[i + 1] = bounds[i] + partsChars[i].l;
    }
    totalLength = bounds[parts];
    return bounds;
}

function drawVerticalBounds(canvas, chars) {
    var context = canvas.getContext("2d");
    var jCanvas = $(canvas);
    var width = jCanvas.width();
    var height = jCanvas.height();


    var bounds = recountBounds();
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "rgba(180, 110, 110, .8)";

    var parts = chars.length;
    for (var i = 1; i < parts; i++) {
        context.moveTo(bounds[i] * width / totalLength, 0);
        context.lineTo(bounds[i] * width / totalLength, height);
        context.stroke();
    }
}

function drawVerticalTimeLine(canvas, time, timeMax) {
    var context = canvas.getContext("2d");
    var jCanvas = $(canvas);
    var width = jCanvas.width();
    var height = jCanvas.height();
    time = time * 1.0;

    context.beginPath();
    context.moveTo(time * width / timeMax, 0);
    context.lineTo(time * width / timeMax, height);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(180, 110, 110, .8)";
    context.stroke();
}



var startTime = 0;
var shouldStopAnimation = false;

function animationStep() {
    if (shouldStopAnimation) {
        shouldStopAnimation = false;
        return;
    }
    var totalTime = onePartTravelTime * controlTime;
    var currentTime = new Date().getTime();

    var t = (currentTime - startTime) * 0.001 * animationSpeed;
    var drawTime = Math.min(t, totalTime);
    DrawGraphs(drawTime);

    if ((currentTime - startTime) * animationSpeed > 1000 * totalTime) {
        return;
    }
    setTimeout(animationStep, 70);
}

function precalculate() {
    C = buildCMatrix();
    uCache = [];
    updateChars();
    recountBounds();
    computeDerivatives();
    computeControlsByDerivatives();
    recountIntegrals();
}


function animate() {
    shouldStopAnimation = false;
    precalculate();
    startTime = new Date().getTime();
    animationStep();
}

function stopAnimation() {
    shouldStopAnimation = true;
}

var eps = 2 * step;

function DrawGraphs(t) {
    var totalTime = onePartTravelTime * controlTime;
    funcCanvas.getContext('2d').clear();
    drawAxes(funcCanvas, 0, totalLength);
    drawFunction(function (x) { return u(x, t); }, funcCanvas, 0, totalLength, 200, 0, "rgba(20, 100, 20, .9)", 2);
    drawFunction(function (x) { return (u(x, t + eps / 2) - u(x, t - eps / 2)) / eps; }, funcCanvas, 0, totalLength, 200, 1, "rgba(100, 100, 100, .65)", 2);
    drawVerticalBounds(funcCanvas, partsChars.slice(0, partsNumber));

    leftControlCanvas.getContext('2d').clear();
    drawAxes(leftControlCanvas, 0, totalTime);
    drawFunction(leftControlFunction, leftControlCanvas, 0, totalTime, 100, 0);
    drawVerticalTimeLine(leftControlCanvas, t, totalTime);

    rightControlCanvas.getContext('2d').clear();
    drawAxes(rightControlCanvas, 0, totalTime);
    drawFunction(rightControlFunction, rightControlCanvas, 0, totalTime, 100, 0);
    drawVerticalTimeLine(rightControlCanvas, t, totalTime);
}

function drawFinalProfile() {
    finalProfileCanvas.getContext('2d').clear();
    drawAxes(finalProfileCanvas, 0, totalLength);
    drawFunction(finalProfile, finalProfileCanvas, 0, totalLength, 100, 0);
}

function drawFinalSpeed() {
    finalSpeedCanvas.getContext('2d').clear();
    drawAxes(finalSpeedCanvas, 0, totalLength);
    drawFunction(finalSpeed, finalSpeedCanvas, 0, totalLength, 100, 0);
}

// generating random initial problem

function getRandomInt(afterMax, p) {
    if (p == undefined) p = 1;
    var result = Math.floor(Math.pow(Math.random(), p) * afterMax);
    if (result >= afterMax) result = afterMax - 1;
    return result;
}

function generateNewData() {
    stopAnimation();
    var parts = 1 + getRandomInt(maxParts, 1.6);
    setPartsNumber(parts);
    var controlTime = parts + 1 + getRandomInt(MaxControlTime - parts, 2);
    setControlTime(controlTime);
    var functions = ["sin(3.14*x)", "sin(2*3.14*x)", "sin(3*3.14*x)",
        "cos(x)", "sin(exp(3*x))", "atan(sin(10*x))", "pow(x,4)",
        "sin(4*3.14*x)", "1", "-1", "x-1", "4*x*(x-1)", "x>0.5", "(x>0.3)*(x<0.7)"];

    setFinalProfile(functions[getRandomInt(functions.length)]);
    setFinalSpeed(functions[getRandomInt(functions.length)]);
    setLeftType(1 + getRandomInt(2));
    setRightType(1 + getRandomInt(2));

    var chars = [];
    for (var i = 0; i < parts; i++) {
        var rho = 1 + getRandomInt(3, 3);
        var k = 1 + getRandomInt(3, 3);
        chars[i] = { rho: rho, k: k };
    }
    setChars(chars);
}

function setFinalProfile(formula) {
    var input = $("#finalFormula");
    if (input.val() != formula) input.val(formula);
    compileFinalProfile();
    drawFinalProfile();
}

function setFinalSpeed(formula) {
    var input = $("#finalSpeedFormula");
    if (input.val() != formula) input.val(formula);
    compileFinalSpeed();
    drawFinalSpeed();
}

function setChars(chars) {
    // Setting to inputs
    for (var i = 0; i < chars.length; i++) {
        var charElement = $("div[data-id='" + i + "']");
        var density = charElement.find("input.partDensity");
        var young = charElement.find("input.partYoung");
        characteristic = chars[i];
        if (young.val() != characteristic.k) young.val(characteristic.k);
        if (density.val() != characteristic.rho) density.val(characteristic.rho);
    }
    updateChars();
}


function onload() {
    generatePartsChars();
    setPartsNumber(1);
    precalculate();
    // setting global variables
    funcCanvas = document.getElementById('funcGraph');
    leftControlCanvas = document.getElementById('leftGraph');
    rightControlCanvas = document.getElementById('rightGraph');
    finalProfileCanvas = document.getElementById('finalGraph');
    finalSpeedCanvas = document.getElementById('finalSpeedGraph');

    // setting event listeners

    $(".partDensity,.partYoung").change(updateChars);
    $(".main.button").click(animate);
    $(".generate.button").click(generateNewData);
    $(".scroll.button").click(function () {
        var height = $("#whatisit").offset().top;
        $('html, body').animate({ scrollTop: height }, 'slow');
        return false;
    });

    $("#finalFormula").bind("change keyup", function () { setFinalProfile(this.value) });

    $("#finalSpeedFormula").bind("change keyup", function () { setFinalSpeed(this.value) });

    compileFinalProfile();
    drawFinalProfile();
    compileFinalSpeed();
    drawFinalSpeed();

    // drawFunction(Math.sin, funcCanvas, 0, 1, 20);
    drawAxes(funcCanvas, 0, 1);
    drawVerticalBounds(funcCanvas, partsChars.slice(0, partsNumber));
}

$(onload);
