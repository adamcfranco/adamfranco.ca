var Slideshow = (element, slides) =>
{
	this.element = element;
	this.slides = slides;
	this.slidesHtml = "";
	for (let slide of this.slides)
	{
		this.slidesHtml += "<div class='slide'>" + slide + "</div>";
	}
	this.html = "<div class='slideshow-outer'><div class='slideshow-inner'>" + slidesHtml + "</div></div>";
	this.element.className = 'slideshow';
	this.element.id = this.getGUID();
	this.element.innerHTML = this.html;
};

Slideshow.prototype.getGUID = () =>
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) =>
	{
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

var slideshowElements = document.getElementsByClassName("slideshow");
for (let i = 0; i < slideshowElements.length; i++)
{
	let slides = slideshowElements[i].getAttribute('data-slides');
	if (slides)
	{
		new Slideshow(slideshowElements[i], JSON.parse(slides));
	}
}