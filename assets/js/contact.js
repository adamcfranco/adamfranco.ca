(function()
{
	let textarea = document.getElementById("contact").getElementsByTagName("textarea")[0];
	textarea.addEventListener('input',
	() => {
		let length = textarea.value.length;
		document.getElementById("contact_charcount").innerText = 2000 - length;
	});
	
})();