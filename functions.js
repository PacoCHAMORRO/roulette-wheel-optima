Array.prototype.switch = function (old_index, new_index)
{
	if (new_index >= this.length)
	{
		var k = new_index - this.length + 1;
		while (k--)
		{
			this.push(undefined);
		}
	}

	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};


function setCookie(name, value, expire)
{
	var date = new Date();
	var expires;

	date.setTime(date.getTime() + (expire*24*60*60*1000));
	expires = "expires="+ date.toUTCString();

	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
	var name          = name + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca            = decodedCookie.split(';');

	for (var i = 0; i <ca.length; i++)
	{
		var c = ca[i];

		while (c.charAt(0) == ' ')
		{
			c = c.substring(1);
		}

		if (c.indexOf(name) == 0)
		{
			return c.substring(name.length, c.length);
		}
	}

	return false;
}
