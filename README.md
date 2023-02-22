# Detect-Collisions

[<img src="https://img.shields.io/npm/v/detect-collisions?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/detect-collisions?activeTab=versions)
[<img src="https://img.shields.io/npm/dw/detect-collisions.svg?style=for-the-badge&color=success" alt="npm downloads per week" />](https://www.npmjs.com/package/detect-collisions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/detect-collisions/master?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/detect-collisions)

## Introduction

Fast TypeScript library for detecting collisions between bodies: Points, Lines, Boxes, Polygons (Concave too), Ellipses and Circles. Also RayCasting. All bodies can have offset, rotation, scale, bounding box padding, can be static (non moving) or be trigger bodies (non colliding).

This library combines:

- efficiency of [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) (BVH) for broad-phase searching
- accuracy of [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for narrow-phase collision testing
- decomposing of [Concave Polygons](https://mpen.ca/406/bayazit) into convex ones so you can use concave polygons

## Demos

- [Tank](https://prozi.github.io/detect-collisions/demo/)
- [Stress Test](https://prozi.github.io/detect-collisions/demo/?stress)
- [Stackblitz](https://stackblitz.com/edit/detect-collisions)

## Installation

```bash
$ npm install detect-collisions
```

## API Documentation

https://prozi.github.io/detect-collisions/modules.html

## Usage

### 1. Create System

`System` extends `RBush` so it has [all of its functionalities](https://github.com/mourner/rbush).

To start, create a unique collisions system:

```javascript
const { System } = require("detect-collisions")
const system = new System()
```

### 2. Body Information

#### each body has:

- `pos: Vector` - position
- `x: number` - x position
- `y: number` - y position

setting `body.pos.x` or `body.pos.y` doesn't update the bounding box. setting `body.x` or `body.y` directly does cause bounding box update, which is the most costly operation cpu wise in collision-detection. if you wan't to set position and update bounding box, you'd better use:

- `setPosition(x, y)`

#### bodies also have:

- `scale: number` prop & `setScale(x, y)` method - to scale (for `Circle` takes 1 parameter, `x, y` for rest)
- `offset: Vector` prop & `setOffset({ x, y })` method - for offset from center of body for rotation purpouses
- `getAABBAsBBox(): BBox` method - for getting bbox even on non inserted bodies

by calling `system.separate()` once a frame your bodies will separate from each other.
bodies have properties that can be set in runtime or during creation by using `BodyOptions`:

- `isStatic: boolean` - body won't separate
- `isTrigger: boolean` - body won't trigger collisions
- `isCentered: boolean` - offset is set to center for rotation purpouses
- `angle: number` - angle in radians, use `deg2rad` for conversion
- `padding: number` - bounding box padding, optimizes costly updates

#### you can also check if body is convex or not:

- `isConvex: boolean` - body is convex (may be false only for `Polygon`)
- `convexPolygons: Vector[][]` - if `Polygon` is concave it has its points split into convex polygons here

#### some bodies:

- `Box` has `width` & `height` properties

#### each body after inserted to system has:

- `bbox = { minX, minY, maxX, maxY }` prop - without padding
- `minX, minY, maxX, maxY` props - bbox plus padding
- `system` prop - to use `body.system.updateBody(body)` internally during `body.setPosition(x, y)`

#### body types:

- **[Circle](https://github.com/jriecken/sat-js#satcircle)** - Shape with infinite sides equidistant of radius from its center position
- **[Ellipse](https://prozi.github.io/detect-collisions/classes/Ellipse.html)** - Flattened circle (implemented as polygon)
- **[Polygon](https://github.com/jriecken/sat-js#satpolygon)** - Shape made up of finite number of line segments
- **[Box](https://prozi.github.io/detect-collisions/classes/Box.html)** - Rectangle (implemented as polygon)
- **[Line](https://prozi.github.io/detect-collisions/classes/Line.html)** - Line (implemented as 2-point polygon)
- **[Point](https://prozi.github.io/detect-collisions/classes/Point.html)** - A single coordinate (implemented as tiny box)

### 3. Create and insert Body

Last optional parameter for body creation is always [BodyOptions](https://prozi.github.io/detect-collisions/interfaces/BodyOptions.html)

```javascript
const { deg2rad } = require("detect-collisions")
const options = {
  angle: deg2rad(90), // defaults to 0
  isCentered: false,
  isStatic: false,
  isTrigger: false,
  padding: 0,
}
```

#### Only create Body

```javascript
const {
  Box,
  Circle,
  Ellipse,
  Line,
  Point,
  Polygon,
} = require("detect-collisions")
// create with options, without insert
const box = new Box(position, width, height, options)
const circle = new Circle(position, radius, options)
const ellipse = new Ellipse(position, radiusX, radiusY, step, options)
const line = new Line(start, end, options)
const point = new Point(position, options)
const polygon = new Polygon(position, points, options)
```

#### Only insert Body

```javascript
// insert any of the above
system.insert(body)
```

#### Create and insert Body

you can do create + insert in one step by using `system.create*` functions with create followed by body class name. the `system.create*` functions take the exact same parameters as when creating bodies without insert.

```javascript
// create with options, and insert
const box = system.createBox(position, width, height, options)
const circle = system.createCircle(position, radius, options)
const ellipse = system.createEllipse(position, radiusX, radiusY, step, options)
const line = system.createLine(start, end, options)
const point = system.createPoint(position, options)
const polygon = system.createPolygon(position, points, options)
```

### 4. Move Body

```javascript
body.setPosition(x, y)
```

### 5. Remove Body

```javascript
system.remove(body)
```

### 6. Update Body or System

- After body moves, its bounding box in collision tree needs to be updated.

- This is done under-the-hood automatically when you use `body.setPosition(x, y)`.

Collisions systems need to be updated when the bodies within them change. This includes when bodies are inserted, removed, or when their properties change (e.g. position, angle, scaling, etc.). Updating a collision system can be done by calling `update()` which should typically occur once per frame. Updating the `System` by after each position change is **required** for `System` to detect `BVH` correctly.

```javascript
// move and update one body (use 0-1 times per frame):
body.setPostion(x, y)
```

```javascript
// update one body (use 0-1 times per frame):
system.updateBody(body)
```

```javascript
// update all bodies (use 0-1 times per frame):
system.update()
```

```javascript
// separate all bodies (use 0-1 times per frame):
system.separate()
```

### 7. Collision Detection

The **preferred method** is once-in-a-gameloop checkAll and then handler:

```typescript
system.checkAll((response: Response) => {
  console.log(
    response.a,
    response.b,
    response.aInB,
    response.bInA,
    response.overlapV
  )
})
```

If you really need to check one body then use:

```typescript
system.checkOne(body, (response: Response) => {
  console.log(
    response.a, // === body
    response.b,
    response.aInB,
    response.bInA,
    response.overlapV
  )
})
```

It is possible to skip the broad-phase search entirely and call `checkCollision()` directly on two bodies. Although this is **very not recommended** as the BVH (rbush) broad-phase-search with bounding boxes makes the collision checking **a lot more efficient**.

```javascript
if (system.checkCollision(polygon, line)) {
  console.log("Collision detected!", system.response)
}
```

You can provide last additional parameter which is `const response = new Response()` if you need, to any of above `system.check*` functions

#### Getting Detailed Collision Information

There is often a need for detailed information about a collision in order to react to it appropriately. This information is stored inside `system.response` object. The `Response` ([documentation](https://github.com/jriecken/sat-js#satresponse)) object has several properties set on them when a collision occurs:

- `a` - The first object in the collision.
- `b` - The second object in the collison.
- `overlap` - Magnitude of the overlap on the shortest colliding axis.
- `overlapN` - The shortest colliding axis (unit-vector)
- `overlapV` - The overlap vector (i.e. overlapN.scale(overlap, overlap)). If this vector is subtracted from the position of a, a and b will no longer be colliding.
- `aInB` - Whether the first object is completely inside the second.
- `bInA` - Whether the second object is completely inside the first.

#### Negating Overlap

A common use-case in collision detection is negating overlap when a collision occurs (such as when a player hits a wall). This can be done using the collision information in a `Response` object (see [Getting Detailed Collision Information](#anchor-getting-detailed-collision-information)).

The three most useful properties on a `Response` object are `overlapV`, `a`, and `b`. Together, these values describe how much and in what direction the source body is overlapping the target body. More specifically, `overlapV.x` and `overlapV.y` describe the scaled direction vector. If this vector is subtracted from the position of a, a and b will no longer be colliding.

These values can be used to "push" one body out of another using the minimum distance required. More simply, subtracting this vector from the source body's position will cause the bodies to no longer collide. Here's an example:

```javascript
// check collision between player and wall and negate overlap manually
if (system.checkCollision(player, wall)) {
  const { overlapV } = system.response

  player.setPosition(player.x - overlapV.x, player.y - overlapV.y)
}
```

```javascript
// this is easier to use and takes into account isTrigger and isStatic flags on bodies
system.separate()
```

## Detecting collision after insertion

```javascript
// create self-destructing collider
const testCollision = ({ x, y }, radius = 10) => {
  const circle = system.createCircle({ x, y }, radius)
  const potentials = system.getPotentials(circle)
  const collided = potentials.some((body) =>
    system.checkCollision(circle, body)
  )

  system.remove(circle)

  return collided
}
```

## Concave Polygons

Hollow / non-convex polygons are fully supported since v6.3.0

the `System.response.aInB` and `System.response.bInA` is currently because of complexity and speed reasons only checking the bounding boxes of compared bodies. for more informations relate to [this issue on github](https://github.com/Prozi/detect-collisions/issues/33) and [this merged pull request](https://github.com/Prozi/detect-collisions/pull/34)

## Rendering

For debugging, it is often useful to be able to visualize the collision bodies. All of the bodies in a Collision system can be drawn to a `<canvas>` element by calling `draw()` and passing in the canvas' 2D context.

```javascript
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")

context.strokeStyle = "#FFFFFF"
context.beginPath()
system.draw(context)
context.stroke()
```

Bodies can be individually drawn as well.

```javascript
context.strokeStyle = "#FFFFFF"
context.beginPath()
// draw specific body
body.draw(context)
// draw whole system
system.draw(context)
context.stroke()
```

The BVH can also be drawn to help test [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy).

```javascript
context.strokeStyle = "#FFFFFF"
context.beginPath()
// draw bounding volume hierarchy of the system
system.drawBVH(context)
context.stroke()
```

## Only using SAT

Some projects may only have a need to perform SAT collision tests without broad-phase searching. This can be achieved by avoiding collision systems altogether and only using the `checkCollision()` function. Note that unless a use-case really requires this, I strongly advise to use the normal flow.

```javascript
const circle = new Circle(position, radius)
const polygon = new Polygon(position, points)

if (system.checkCollision(polygon, circle)) {
  console.log(system.response)
}
```

## Raycast

To get raycast information use

```javascript
const start = { x: 0, y: 0 }
const end = { x: 0, y: -10 }
const hit = system.raycast(start, end)

if (hit) {
  const { point, body } = hit

  console.log({ point, body })
}
```

- point is the `Vector { x, y }` with coordinates of (closest) intersection
- body is the reference to the closest body

## Contribute

Feel free to contribute, open a merge request. Some code style pointers:

- use `npm run precommit` script before commiting your merge request
- use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
- avoid the use of `any`

## FAQ

### Why shouldn't I just use a physics engine?

Projects requiring physics are encouraged to use one of the several physics engines out there (e.g. [Matter.js](https://github.com/liabru/matter-js), [Planck.js](https://github.com/shakiba/planck.js)). However, many projects end up using physics engines solely for collision detection, and developers often find themselves having to work around some of the assumptions that these engines make (gravity, velocity, friction, etc.). **Detect-Collisions** was created to provide robust collision detection and nothing more. In fact, a physics engine could easily be written with **Detect-Collisions** at its core.

### Sometimes bodies can "squeeze" between two other bodies. What's going on?

This isn't caused by faulty collisions, but rather how a project handles its collision responses. There are several ways to go about responding to collisions, the most common of which is to loop through all bodies, find their potential collisions, and negate any overlaps that are found one at a time. Since the overlaps are negated one at a time, the last negation takes precedence and can cause the body to be pushed into another body.

One workaround is to resolve each collision, update the collision system, and repeat until no collisions are found. Keep in mind that this can potentially lead to infinite loops if the two colliding bodies equally negate each other. Another solution is to collect all overlaps and combine them into a single resultant vector and then push the body out, but this can get rather complicated.

There is no perfect solution. How collisions are handled depends on the project.

## Benchmark

```bash
$ git clone https://github.com/Prozi/detect-collisions.git
$ cd detect-collisions
$ yarn
$ yarn benchmark [milliseconds=1000]
```

will show you the [Stress Demo](https://prozi.github.io/detect-collisions/demo/?stress) results without drawing,
only using Detect-Collisions and with different _N_ amounts of dynamic, moving bodies

typical output:

```bash
┌─────────┬─────────┬─────┐
│ (index) │  items  │ FPS │
├─────────┼─────────┼─────┤
│    0    │ 'total' │ 365 │
│    1    │  1000   │ 119 │
│    2    │  2000   │ 68  │
│    3    │  3000   │ 48  │
│    4    │  4000   │ 34  │
│    5    │  5000   │ 24  │
│    6    │  6000   │ 20  │
│    7    │  7000   │ 16  │
│    8    │  8000   │ 13  │
│    9    │  9000   │ 13  │
│   10    │  10000  │ 10  │
└─────────┴─────────┴─────┘
Done in 14.58s.
```
