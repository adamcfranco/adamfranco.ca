(function()
{
	let textarea = document.getElementById("contact").getElementsByTagName("textarea")[0];
	textarea.addEventListener('input',
	() => {
		let length = textarea.value.length;
		document.getElementById("contact_charcount").innerText = 2000 - length;
	});
	let form = $("#contact-form");
	let notifications = $("#contact-notifications");
	$(form).submit((e) =>
	{
		e.preventDefault();
		let messageData = $(form).serialize();
		$.ajax(
		{
			type: "POST",
			url: $(form).attr("action"),
			data: messageData
		}).done((response) =>
		{
			$(notifications).removeClass("error");
			$(notifications).addClass("success");
			$(notifications).text(response);
			$(form).remove();
		}).fail((data) =>
		{
			$(notifications).removeClass("success");
			$(notifications).addClass("error");
			if (data.responseText !== '')
			{
				$(notifications).text(data.responseText);
			}
			else
			{
				$(notifications).text("Something went wrong and your message could not be sent.");
			}
		});
	});
})();