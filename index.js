var height = 150;

var digit1_pos = new Point(0, -1500);
var digit2_pos = new Point(0, -1500);
var digit3_pos = new Point(0, -1500);
var digit4_pos = new Point(0, -1500);

var allDigits = null;
var digits = [];
var digits_pos = [digit1_pos, digit2_pos, digit3_pos, digit4_pos];

function Point(x, y) {
	this.x = x;
	this.y = y;
}

var duration = 100;
var easing = "swing";

var isRunning = false;

var func = [];

$(function () {
	digits[0] = $("#firstDigits");
	digits[1] = $("#secondDigits");
	digits[2] = $("#thirdDigits");
	digits[3] = $("#fourthDigits");
	allDigits = $("#firstDigits,#secondDigits,#thirdDigits,#fourthDigits");
	
	function reset() {
		for (var i = 0; i < digits_pos.length; ++i) {
			digits_pos[i].y = -1500;
		}
		allDigits.animate({"top": "-1500px"});
		document.title = getNumber();
	}

	function slideGen(gt, limit, val) {
		return function (elem, p) {
			isRunning = true;
			elem.animate({"top": p.y + "px"}, duration, easing, function () {
				if (gt && p.y >= limit || !gt && p.y <= limit) {
					p.y = val;
					elem.css("top", p.y + "px");
				}
				isRunning = false;
			});
		};
	}

	function countGen(plus, limit, val) {
		var slide = slideGen(plus, limit, val);

		return function (digit) {
			if (isRunning) {
				return;
			}
			if (digit <= 0 || digit >= 5) {
				return;
			}

			var ul = digits[digit-1];
			var p = digits_pos[digit-1];

			p.y += (plus ? height : -height);

			if (plus && p.y >= limit) {
				countUp(digit+1);
			} else if (!plus && p.y <= limit) {
				countDown(digit+1);
			}

			func.push([slide, ul, p]);
		};
	}

	function run() {
		for (var i = 0; i < func.length; ++i) {
			var e = func[i];
			var f = e[0];
			var ul = e[1];
			var p = e[2];
			f(ul, p);
		}
		func = [];

		document.title = getNumber();
	}

	function getNumber() {
		var d1 = (digit1_pos.y + height * 10) / 150;
		var d2 = (digit2_pos.y + height * 10) / 150;
		var d3 = (digit3_pos.y + height * 10) / 150;
		var d4 = (digit4_pos.y + height * 10) / 150;

		d1 = d1 < 0 ? 9 : (d1 > 9 ? 0 : d1);
		d2 = d2 < 0 ? 9 : (d2 > 9 ? 0 : d2);
		d3 = d3 < 0 ? 9 : (d3 > 9 ? 0 : d3);
		d4 = d4 < 0 ? 9 : (d4 > 9 ? 0 : d4);

		return d4 * 1000 + d3 * 100 + d2 * 10 + d1;
	}
	
	var countUp = countGen(true, 0, -1500);
	var countDown = countGen(false, -1650, -150);

	$("#plus1").click(function () {
		countUp(1);
		run();
	});
	$("#minus1").click(function () {
		countDown(1);
		run();
	});
	$("#reset").click(function () {
		reset();
	});
	$("#copy").click(function () {
		var text = document.getElementById("clip");
		text.value = getNumber();
		text.focus();
		text.select();
		document.execCommand("copy", false, null);

		$("#counter").removeClass("copy");
		setTimeout(function () {
			$("#counter").addClass("copy");
		}, 1);
	});

	$("body").keydown(function (e) {
		if (e.which == 38) {
			countUp(1);
			run();
		} else if (e.which == 40) {
			countDown(1);
			run();
		}
	});

	reset();
});
