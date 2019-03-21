/*	
	Reactive Grid
	Version 5.0
	Adam Franco (www.adamfranco.ca)
*/

let reactiveGrid = function (sketch)
{

	let nodes = [];
	let triangles = [];
	let points = [];
	let parent, mouse, bounds, size, resolution, colorTriangle, colorLine, colorHover, resizeTimer, deltaTime, prevTime;

	sketch.setup = function ()
	{
		colorTriangle = sketch.color(20);
		colorLine = sketch.color(40);
		colorHover = sketch.color(0, 127, 255);
		parent = document.getElementById("reactive-grid-wrapper");
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
		{
			colorTriangle = sketch.color(0);
			colorLine = sketch.color(50);
			size = 1920;
		}
		else size = 3840;
		sketch.generatePoints();
		sketch.generateTriangles();
		bounds = new Rectangle(size / 2, size / 2, parent.clientWidth, parent.clientHeight, Rectangle.PositionMode.CENTER);
		sketch.windowResized();
		resizeTimer = 0;
		prevTime = Date.now();
		deltaTime = 0;
		parent.classList.remove("hidden");
	};

	sketch.draw = function ()
	{
		let time = Date.now();
		deltaTime = time - prevTime;
		prevTime = time;
		sketch.background(20);
		let newW = (sketch.width / 2) - (size / 2);
		let newH = (sketch.height / 2) - (size / 2);
		mouse = sketch.createVector(sketch.mouseX - newW, sketch.mouseY - newH);
		sketch.translate(newW, newH);
		nodes.forEach(node =>
		{
			if (bounds.contains(node.initial)) node.update();
		});
		triangles.forEach(triangle =>
		{
			if (!triangle.outsideBounds(bounds))
			{
				triangle.update();
				triangle.render();
			}
		});
		if (resizeTimer >= 2000)
		{
			resizeTimer = 0;
			sketch.windowResized();
		}
		else
		{
			resizeTimer += deltaTime;
		}
	};

	sketch.windowResized = function ()
	{
		sketch.resizeCanvas(parent.offsetWidth, parent.offsetHeight);
		bounds.resize(parent.clientWidth, parent.clientHeight);
	};

	sketch.generatePoints = function () 
	{
		points = [];
		points.push([0, 0]);
		points.push([size, 0]);
		points.push([0, size]);
		points.push([size, size]);
		let n = Math.floor(size / 100 * size / 100);
		for (let i = 0; i < n; i++)
		{
			let x = sketch.getRandomInt(0, size);
			let y = sketch.getRandomInt(0, size);
			points.push([x, y]);
		}
	};

	sketch.generateTriangles = function ()
	{
		triangles = [];
		nodes = [];
		let delaunay = Delaunay.triangulate(points);
		for (let i = 0; i < delaunay.length; i += 3)
		{
			let n1 = new Node(points[delaunay[i]][0], points[delaunay[i]][1]);
			let n2 = new Node(points[delaunay[i + 1]][0], points[delaunay[i + 1]][1]);
			let n3 = new Node(points[delaunay[i + 2]][0], points[delaunay[i + 2]][1]);
			let color = Math.random() <= 0.02 ? colorLine : colorTriangle;
			triangles.push(new Triangle(n1, n2, n3, color));
			nodes.push(n1);
			nodes.push(n2);
			nodes.push(n3);
		}
	};

	sketch.getRandomInt = function (min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	class Node
	{
		constructor(x, y)
		{
			this.initial = sketch.createVector(x, y);
			this.position = sketch.createVector(x, y);
			this.target = null;
			this.interactRadius = 100;
			this.maxDistance = 25;
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
	};

	class Rectangle
	{
		constructor(x, y, width, height, positionMode = Rectangle.PositionMode.CORNER)
		{
			this.position = sketch.createVector(x, y);
			this.size = sketch.createVector(width, height);
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
			sketch.push();
			switch (this.positionMode)
			{
				case Rectangle.PositionMode.CORNER:
					{
						sketch.noFill();
						sketch.stroke(255, 0, 0);
						sketch.strokeWeight(1);
						sketch.rect(this.position.x, this.position.y, this.size.x, this.size.y);
						break;
					}
				case Rectangle.PositionMode.CENTER:
					{
						sketch.noFill();
						sketch.stroke(255, 0, 0);
						sketch.strokeWeight(1);
						sketch.rect(this.position.x - (this.size.x / 2), this.position.y - (this.size.y / 2), this.size.x, this.size.y);
						break;
					}
			}
			sketch.pop();
		}
		resize(width, height)
		{
			this.size = sketch.createVector(width, height);
		}
	};

	Rectangle.PositionMode = {
		CORNER: 0,
		CENTER: 1
	};

	class Triangle
	{
		constructor(node0, node1, node2, startColor)
		{
			this.n0 = node0;
			this.n1 = node1;
			this.n2 = node2;

			this.startColor = startColor;
			this.currentColor = startColor;
			this.targetColor = startColor;
		}
		update()
		{
			this.targetColor = this.contains(mouse) ? colorHover : this.startColor;
		}
		render()
		{
			sketch.push();
			this.currentColor = sketch.lerpColor(this.currentColor, this.targetColor, 0.5);
			sketch.fill(this.currentColor);
			sketch.strokeWeight(0.8);
			sketch.stroke(colorLine);
			sketch.triangle(this.n0.p.x, this.n0.p.y, this.n1.p.x, this.n1.p.y, this.n2.p.x, this.n2.p.y);
			sketch.pop();
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
	};

};

var grid = new p5(reactiveGrid, 'reactive-grid-wrapper');