(function()
{
	for (let sectionLink of document.getElementById("navigation").getElementsByTagName("a"))
	{
		sectionLink.onclick = () => SetSection(sectionLink.dataset.section);
	}
})();

function SetSection(name)
{
	if (document.getElementById(name).classList.contains("active")) return;
	console.log(name);
	for (let section of document.getElementsByTagName("section"))
	{
		section.classList.remove("active");
	}
	for (let sectionLink of document.getElementById("navigation").getElementsByTagName("a"))
	{
		sectionLink.classList.remove("active");
		if (sectionLink.dataset.section == name) sectionLink.classList.add("active");
	}
	setTimeout(() => document.getElementById(name).classList.add("active"), 500);
}