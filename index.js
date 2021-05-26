var options = ["15% DE DESC. EN TARIFA", "ASCENSO DE CATEGORÍA", "CHOFER ADICIONAL", "5% DE DESC. EN TARIFA", "SILLA DE BEBÉ GRATIS", "10% DE DESC. EN TARIFA"];

var startAngle = -2.08;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var das_cookie = 'winner_winner';

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n)
{
	var nybHexString = "0123456789ABCDEF";

	return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b)
{
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem)
{
	if (item % 2 === 0)
	{
		return RGB2Color(34, 184, 224);
	}
	else
	{
		return RGB2Color(12, 40, 63);
	}
}

// Get the last index by cookie and draw it first by swapping its index->value to 0 position.
var last_win = getCookie(das_cookie);
if (last_win)
{
	// Move the last win index to the beginning of the array.
	options.switch(last_win, 0);

	prize_label = document.getElementById('prize');
	prize_label.textContent = options[0];
}

function drawRouletteWheel()
{
	var outsideRadius, textRadius, insideRadius;
	var canvas = document.getElementById("canvas");
	var s = getComputedStyle(canvas);
	var w = s.width;
	var h = s.height;
	canvas.width = w.split("px")[0];
	canvas.height = h.split("px")[0];
	canvas.height = canvas.width * 1;

	if (canvas.getContext)
	{
		ctx = canvas.getContext("2d");

		outsideRadius = canvas.width / 2; // 90% of radius
		textRadius    = canvas.width * .28; // 22% of canvas width;
		insideRadius  = canvas.width * .05;

		if (screen.width < 300)
    {
      ctx.font = '600 .45rem Montserrat, Arial';
    } else if (screen.width >= 300 && screen.width < 480)
		{
			ctx.font = '600 .55rem Montserrat, Arial';
		} else if (screen.width >= 480 && screen.width <= 1024)
		{
			ctx.font = '600 1rem Montserrat, Arial';
		}
		else
		{
			outsideRadius = canvas.width / 3; // 90% of radius
			textRadius    = canvas.width * .20; // 22% of canvas width;
			insideRadius  = canvas.width * .05;
			ctx.font      = '600 1.2rem Montserrat, Arial';
		}

		ctx.strokeStyle = "white";
		ctx.lineWidth   = 2;

		for (var i in options)
		{
			i = (+i);

			if (isNaN(i))
				continue;

			var angle     = startAngle + i * arc;
			ctx.fillStyle = getColor(i, options.length);

			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.width / 2, outsideRadius, angle, angle + arc, false);
			ctx.arc(canvas.width / 2, canvas.width / 2, insideRadius, angle + arc, angle, true);
			ctx.stroke();
			ctx.fill();

			ctx.save();
			ctx.fillStyle = "white";
			ctx.translate(
				(canvas.width / 2) + Math.cos(angle + arc / 2) * textRadius,
				(canvas.width / 2) + Math.sin(angle + arc / 2) * textRadius
			);

			ctx.rotate(angle + arc / 2);

			var text = options[i];
			ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
			ctx.restore();
		}

		//Arrow
		ctx.fillStyle = "#333";
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2 - 4, canvas.width / 2 - (outsideRadius + 5));
		ctx.lineTo(canvas.width / 2 + 4, canvas.width / 2 - (outsideRadius + 5));
		ctx.lineTo(canvas.width / 2 + 4, canvas.width / 2 - (outsideRadius - 5));
		ctx.lineTo(canvas.width / 2 + 9, canvas.width / 2 - (outsideRadius - 5));
		ctx.lineTo(canvas.width / 2 + 0, canvas.width / 2 - (outsideRadius - 13));
		ctx.lineTo(canvas.width / 2 - 9, canvas.width / 2 - (outsideRadius - 5));
		ctx.lineTo(canvas.width / 2 - 4, canvas.width / 2 - (outsideRadius - 5));
		ctx.lineTo(canvas.width / 2 - 4, canvas.width / 2 - (outsideRadius + 5));
		ctx.fill();
	}
}

function spin()
{
	if (!navigator.cookieEnabled)
	{
		alert('¡Las cookies necesitan estar habilitadas!');

		window.location.reload(true);
	}

	if (getCookie(das_cookie))
	{
		return;
	}

	spinAngleStart = Math.random() * 10 + 10;
	spinTime = 0;
	spinTimeTotal = Math.random() * 3 + 4 * 1000;
	rotateWheel();
}

function rotateWheel()
{
	spinTime += 30;

	if (spinTime >= spinTimeTotal)
	{
		stopRotateWheel();

		return;
	}

	var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
	startAngle += (spinAngle * Math.PI / 180);
	drawRouletteWheel();
	spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel()
{
	var canvas = document.getElementById("canvas");
	var prize = document.getElementById("prize");
	var degrees = startAngle * 180 / Math.PI + 90;
	var arcd = arc * 180 / Math.PI;
	var index = Math.floor((360 - degrees % 360) / arcd);

	clearTimeout(spinTimeout);
	ctx.save();

	setCookie(das_cookie, index, 365);

	var text = options[index];
	prize.textContent = text;

	ctx.restore();
}

function easeOut(t, b, c, d)
{
	var ts = (t /= d) * t;
	var tc = ts * t;

	return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
