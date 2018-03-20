let modals;
function setCurrentPage(url)
{
	for(let modal of modals)
	{
		$(modal).removeClass("active");
		$("body").removeClass("modal-active");
	}
	let subdirectory = url || "/";
	if (subdirectory != "/")
	{
		let found = false;
		for(let modal of modals)
		{
			if (url.includes($(modal).attr('id')))
			{
				$(modal).addClass("active");
				$("body").addClass("modal-active");
				found = true;
			}
		}
		if (!found)
		{
			console.log("That URL doesn't exist.");
			window.history.back();
		}
	}
}
(() =>
{
	modals = $(".modal");
	$("a").click((event) => 
	{
		let link = $(event.target);
		if (link.attr('href'))
		{
			if (!link.attr('href').includes("http"))
			{
				event.preventDefault();
				let targetUrl = link.attr('href');
				let targetTitle = link.attr('title');
				window.history.pushState({url: "" + targetUrl + ""}, targetTitle, targetUrl);
				setCurrentPage(targetUrl);
			}
		}
	});
	window.onpopstate = (event) =>
	{
		setCurrentPage(event.state ? event.state.url : null);
	};
	/*
	 *
	 * CONTACT FORM
	 *
	 */
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
	/*
	 *
	 * MODAL
	 *
	 */
	$(".modal .close").click((event) =>
	{
		window.history.back();
	});
	/*
	 *
	 * IMAGE SLIDESHOW
	 *
	 */
	$(".slideshow .navbutton").click((event) =>
	{
		let slideshow = $(event.target).parent();
		let images = slideshow.children("img");
		let currentIndex = 0;
		let found = false;
		for (let i = 0; i < images.length && !found; i++)
		{
			if ($(images[i]).hasClass("active"))
			{
				currentIndex = i;
				$(images[i]).removeClass("active");
				found = true;
			}
		}
		let direction = $(event.target).hasClass("left") ? -1 : 1;
		let nextIndex = (((currentIndex + direction) % images.length) + images.length) % images.length;
		$(images[nextIndex]).addClass("active");
	});

})();