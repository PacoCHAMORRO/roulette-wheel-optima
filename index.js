var options = ["15% DE DESCUENTO EN TARIFA", "ASCENSO DE CATEGORÍA GRATIS", "CHOFER ADICIONAL", "5% DE DESCUENTO EN TARIFA", "SILLA DE BEBÉ GRATIS", "10% DE DESCUENTO EN TARIFA"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

/* function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
} */

function getColor(item, maxitem) {
  if (item % 2 === 0) {
    return RGB2Color(34, 184, 224);
  } else {
    return RGB2Color(12, 40, 63);
  }
}



function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 300;
    var textRadius = 170;
    var insideRadius = 48;
    canvas.height = canvas.width * 1;

    ctx = canvas.getContext("2d");
    /* ctx.fillRect(0,10,800,800); */
    /* ctx.clearRect(100,30000,3000,300); */

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.font = '600 14px Montserrat, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.width / 2, outsideRadius, angle, angle + arc, false);
      ctx.arc(canvas.width / 2, canvas.width / 2, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      /* ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1; */
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "white";
      ctx.translate((canvas.width /2) + Math.cos(angle + arc / 2) * textRadius, 
      (canvas.width /2) + Math.sin(angle + arc / 2) * textRadius);
      // ctx.rotate(angle + arc / 2 +  Math.PI / 2);
      ctx.rotate(angle + arc / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(400 - 4, 400 - (outsideRadius + 5));
    ctx.lineTo(400 + 4, 400 - (outsideRadius + 5));
    ctx.lineTo(400 + 4, 400 - (outsideRadius - 5));
    ctx.lineTo(400 + 9, 400 - (outsideRadius - 5));
    ctx.lineTo(400 + 0, 400 - (outsideRadius - 13));
    ctx.lineTo(400 - 9, 400 - (outsideRadius - 5));
    ctx.lineTo(400 - 4, 400 - (outsideRadius - 5));
    ctx.lineTo(400 - 4, 400 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  var canvas = document.getElementById("canvas");
  var prize = document.getElementById("prize");
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = '900 44px Montserrat, Arial';  
  var text = options[index];
  ctx.fillStyle = '#333';
  console.log(text);
  prize.textContent = text;
 
  //ctx.fillStyle = 'white';
  //ctx.fillText(text, 400 - ctx.measureText(text).width / 2, 400 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();