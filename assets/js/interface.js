let defaultTitle = "Adam Franco, Game Programmer";
let modals;
(() =>
{
	/*
	 *
	 * CONTACT FORM
	 *
	 */
	let textarea = document.getElementById("contact").getElementsByTagName("textarea")[0];
	textarea.addEventListener('input', () =>
	{
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
				$(notifications).text("Thank you! Your message has been sent.");
				$(form).remove();
			}).fail((data) =>
			{
				$(notifications).removeClass("success");
				$(notifications).addClass("error");
				$(notifications).text("Something went wrong and your message could not be sent.");
			});
	});
	/*
	 *
	 * SLIDESHOW
	 *
	 */
	function Slideshow(element, slides)
	{
		this.element = element;
		this.slides = slides;
		this.slidesHtml = "";
		for (let i = 0; i < this.slides.length; i++)
		{
			this.slidesHtml += "<div class='slide" + (i == 0 ? " active" : "") + "'>" + this.slides[i] + "</div>";
		}
		this.html = "<div class='slideshow-outer'><div class='slideshow-inner'>" + this.slidesHtml + "</div><button class='nav-button left'></button><button class='nav-button right'></button></div>";
		this.element.className = 'slideshow';
		this.element.removeAttribute("data-slides");
		this.element.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) =>
		{
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
		this.element.innerHTML = this.html;
		this.navLeft = this.element.querySelector(".nav-button.left");
		this.navRight = this.element.querySelector(".nav-button.right");
		this.navLeft.onclick = () => this.Navigate(-1);
		this.navRight.onclick = () => this.Navigate(1);
	}
	Slideshow.prototype.Navigate = function (direction)
	{
		let iframes = this.element.querySelectorAll("iframe");
		for (let iframe of iframes)
		{
			iframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
		}
		let querySlides = Array.from(this.element.querySelectorAll(".slide"));
		let queryActiveSlide = this.element.querySelector(".slide.active");
		let activeSlideIndex = querySlides.indexOf(queryActiveSlide);
		if (activeSlideIndex < 0) activeSlideIndex = 0;
		querySlides[activeSlideIndex].classList.remove("active");
		let newSlideIndex = activeSlideIndex + direction;
		if (newSlideIndex > querySlides.length - 1) newSlideIndex = 0;
		else if (newSlideIndex < 0) newSlideIndex = querySlides.length - 1;
		querySlides[newSlideIndex].classList.add("active");
	};
	var slideshowElements = document.getElementsByClassName("slideshow");
	for (let i = 0; i < slideshowElements.length; i++)
	{
		let slides = slideshowElements[i].getAttribute('data-slides');
		if (slides)
		{
			let slideshow = new Slideshow(slideshowElements[i], slides.split(", "));
		}
	}
	/*
	 *
	 * MODALS
	 *
	 */
	modals = $(".modal");
	SetCurrentPage(window.location.href);
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
				document.title = targetTitle == null ? defaultTitle : targetTitle + " | " + defaultTitle;
				window.history.pushState({ url: targetUrl }, document.title, targetUrl);
				SetCurrentPage(targetUrl);
			}
		}
	});
	window.onpopstate = (event) =>
	{
		SetCurrentPage(event.state ? event.state.url : null);
	};
	$(".close").click((event) => 
	{
		let iframes = $(event.target).parent().find('iframe');
		for (let iframe of iframes)
		{
			iframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
		}
	});
	function SetCurrentPage(url)
	{
		for (let modal of modals)
		{
			$(modal).removeClass("active");
			$("body").removeClass("modal-active");
		}
		let subdirectory = url || "/";
		if (subdirectory != "/")
		{
			let found = false;
			for (let modal of modals)
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
	/*
	 *
	 * TXTROTATE
	 * Courtesy of Gregory Schier: https://codepen.io/gschier/pen/jkivt
	 *
	 */
	var TxtRotate = function (el, toRotate, period)
	{
		this.toRotate = toRotate;
		this.el = el;
		this.loopNum = 0;
		this.period = parseInt(period, 10) || 2000;
		this.txt = '';
		this.tick();
		this.isDeleting = false;
	};
	TxtRotate.prototype.tick = function ()
	{
		var i = this.loopNum % this.toRotate.length;
		var fullTxt = this.toRotate[i];
		if (this.isDeleting)
		{
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else
		{
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}
		this.el.innerHTML = this.txt;
		var that = this;
		var delta = 150 - Math.random() * 100;
		if (this.isDeleting) { delta /= 2; }
		if (!this.isDeleting && this.txt === fullTxt)
		{
			delta = this.period;
			this.isDeleting = true;
		} else if (this.isDeleting && this.txt === '')
		{
			this.isDeleting = false;
			this.loopNum++;
			delta = 500;
		}
		setTimeout(function ()
		{
			that.tick();
		}, delta);
	};
	var elements = document.getElementsByClassName('txt-rotate');
	for (var i = 0; i < elements.length; i++)
	{
		var toRotate = elements[i].getAttribute('data-rotate');
		var period = elements[i].getAttribute('data-period');
		if (toRotate)
		{
			new TxtRotate(elements[i], JSON.parse(toRotate), period);
		}
	}
})();