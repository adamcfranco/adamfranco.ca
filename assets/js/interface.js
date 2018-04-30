let modals;
let defaultTitle = "Adam Franco, Game Programmer";
function SetCurrentPage(url)
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
			if (!link.attr('href').includes("//"))
			{
				event.preventDefault();
				let targetUrl = link.attr('href');
				let targetTitle = link.attr('title');
				console.log(targetTitle);
				document.title = targetTitle == null ? defaultTitle : targetTitle + " | " + defaultTitle;
				window.history.pushState({url: targetUrl }, document.title, targetUrl);
				SetCurrentPage(targetUrl);
			}
		}
	});
	window.onpopstate = (event) =>
	{
		SetCurrentPage(event.state ? event.state.url : null);
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

	SetCurrentPage(window.location.href);

})();

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = this.txt;

  var that = this;
  var delta = 150 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
};