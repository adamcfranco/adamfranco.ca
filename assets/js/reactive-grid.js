/*	
	Reactive Grid
	Version 4.0
	Adam Franco (www.adamfranco.ca)
*/
let nodes = [];
let triangles = [];
let parent, mouse, bounds, size, resolution;
function setup()
{
	parent = document.getElementById("reactive-grid-wrapper");
	let canvas = createCanvas(parent.offsetWidth, parent.offsetHeight);
	canvas.parent("reactive-grid-wrapper");
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
	{
		GenerateNodes(128, 1920);
	}
	else
	{
		GenerateNodes(64, 3840);
	}
	GenerateTriangles();
	bounds = new Rectangle(size / 2, size  / 2, parent.clientWidth + (resolution * 2), parent.clientHeight + (resolution * 2), Rectangle.PositionMode.CENTER);
}
function draw()
{
	background(20);
	let newW = (width / 2) - (size / 2);
	let newH = (height / 2) - (size / 2);
	mouse = createVector(mouseX - newW, mouseY - newH);
	translate(newW, newH);
	for (let i = 0; i < nodes.length; i++)
	{
		for (let j = 0; j < nodes[i].length; j++)
		{
			let node = nodes[i][j];
			if (!bounds.contains(node.initial)) continue;
			nodes[i][j].update();
		}
	}
	for (let i = 0; i < triangles.length; i++)
	{
		let triangle = triangles[i];
		if (triangle.outsideBounds(bounds)) continue;
		triangle.update();
		triangle.render();
	}
}
function windowResized()
{
	resizeCanvas(parent.offsetWidth, parent.offsetHeight);
	bounds.resize(parent.clientWidth + (resolution * 2), parent.clientHeight + (resolution * 2));
}
function GenerateNodes(spacing, gridSize)
{
	resolution = spacing;
	size = (gridSize + (spacing * 2));
	let gridRC  = size / spacing;
	for (let x = 0; x <= gridRC; x++)
	{
		nodes[x] = [];
		for (let y = 0; y <= gridRC; y++)
		{
			let nodeX = (x * spacing) - ((Math.random() * 2) * (Math.random() * (spacing / 2.5)));
			let nodeY = (y * spacing) - ((Math.random() * -2) * (Math.random() * (spacing / 2.5)));
			nodes[x][y] = new Node(nodeX, nodeY);
		}		
	}
}
function GenerateTriangles()
{
	for (let i = 0; i < nodes.length - 1; i++)
	{
		for(let j = 0; j < nodes[i].length - 1; j++)
		{
			let triangle1 = new Triangle(
				nodes[i + 1][j + 1],
				nodes[i + 1][j],
				nodes[i][j],
				Math.random() >= 0.98 ? randomInt(4, 40) : 0);
			let triangle2 = new Triangle(
				nodes[i + 1][j + 1],
				nodes[i][j + 1],
				nodes[i][j],
				Math.random() <= 0.02 ? randomInt(4, 40) : 0);
			triangles.push(triangle1);
			triangles.push(triangle2);
		}
	}
}
function randomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
class Rectangle
{
	constructor(x, y, width, height, positionMode = Rectangle.PositionMode.CORNER)
	{
		this.position = createVector(x, y);
		this.size = createVector(width, height);
		this.positionMode = positionMode;
	}
	contains(point)
	{
		switch (this.positionMode)
		{
			case Rectangle.PositionMode.CORNER:
			{
				let minX = this.position.x;
				let maxX = this.position.x + this.size.x;
				let minY = this.position.y;
				let maxY = this.position.y + this.size.y;
				return (point.x >= minX && point.x <= maxX) && (point.y >= minY && point.y <= maxY);
				break;
			}
			case Rectangle.PositionMode.CENTER:
			{
				let minX = this.position.x - (this.size.x / 2);
				let maxX = this.position.x + (this.size.x / 2);
				let minY = this.position.y - (this.size.y / 2);
				let maxY = this.position.y + (this.size.y / 2);
				return (point.x >= minX && point.x <= maxX) && (point.y >= minY && point.y <= maxY);
				break;
			}
		}
		
	}
	render()
	{
		switch (this.positionMode)
		{
			case Rectangle.PositionMode.CORNER:
			{
				noFill();
				stroke(255, 0, 0);
				strokeWeight(1);
				rect(this.position.x, this.position.y, this.size.x, this.size.y);
				break;
			}
			case Rectangle.PositionMode.CENTER:
			{
				noFill();
				stroke(255, 0, 0);
				strokeWeight(1);
				rect(this.position.x - (this.size.x / 2), this.position.y - (this.size.y / 2), this.size.x, this.size.y);
				break;
			}
		}
	}
	resize(width, height)
	{
		this.size = createVector(width, height);
	}
}
Rectangle.PositionMode = {
	CORNER : 0,
	CENTER : 1	
}
class Node
{
	constructor(x, y)
	{
		this.initial = createVector(x, y);
		this.position = createVector(x, y);
		this.target = null;
		this.interactRadius = 100;
		this.maxDistance = 40;
		this.p = this.position;
	}
	update()
	{
		if (mouse.dist(this.initial) <= this.interactRadius)
		{
			this.target = this.limitDistance();
		}
		else
		{
			this.target = this.initial;
		}
		this.position = p5.Vector.lerp(this.position, this.target, 0.2);
		this.p = this.position;
	}
	limitDistance()
	{	
		let distance = mouse.dist(this.initial);
		if (distance > this.maxDistance)
		{
			let v = p5.Vector.sub(mouse, this.initial);
			v.mult(this.maxDistance / distance);
			return p5.Vector.add(this.initial, v);
		}
		else
		{
			return mouse;
		}
	}
}
class Triangle
{
	constructor(node0, node1, node2, startAlpha)
	{
		this.n0 = node0;
		this.n1 = node1;
		this.n2 = node2;
		this.fill = false;
		this.interactRadius = 50;
		this.alpha = startAlpha;
		this.startAlpha = startAlpha;
	}
	update()
	{
		this.fill = (this.contains(mouse));
	}
	render()
	{
		this.alpha = lerp(this.alpha, this.fill ? 200 : this.startAlpha, 0.15);
		fill(255, 255, 255, this.alpha);
		stroke(0, 60);
		triangle(this.n0.p.x, this.n0.p.y, this.n1.p.x, this.n1.p.y, this.n2.p.x, this.n2.p.y);
	}
	contains(point)
	{
		let p0 = this.n0.p;
		let p1 = this.n1.p;
		let p2 = this.n2.p;
		let s = p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * point.x + (p0.x - p2.x) * point.y;
		let t = p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * point.x + (p1.x - p0.x) * point.y;
		if ((s < 0) !== (t < 0)) return false;
		let A = -p1.y * p2.x + p0.y * (p2.x - p1.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y;
		if (A < 0.0)
		{
			s = -s;
			t = -t;
			A = -A;
		}
		return (s > 0) && (t > 0) && ((s + t) <= A);
	}
	outsideBounds(rectBounds)
	{
		return !(rectBounds.contains(this.n0.p) || rectBounds.contains(this.n1.p) || rectBounds.contains(this.n2.p));
	}
}