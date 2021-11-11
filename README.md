# Introduction

**Detect-Collisions** is JavaScript library* for quickly and accurately detecting collisions between Polygons, Circles, Boxes, and Points. It combines the efficiency of a [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) (BVH) for broad-phase searching and the accuracy of the [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for narrow-phase collision testing.

*) since 3.0 powered by [RBush](https://github.com/mourner/rbush) and [SAT](https://github.com/jriecken/sat-js)

- [Installation](#anchor-installation)
- [Documentation](#anchor-documentation)
- [Demos](#anchor-demos)
- [Usage](#anchor-usage)
- [Getting Started](#anchor-getting-started)
  1.  [Creating a Collision System](#anchor-step-1)
  2.  [Creating, Inserting, Updating, and Removing Bodies](#anchor-step-2)
  3.  [Updating the Collision System](#anchor-step-3)
  4.  [Testing for Collisions](#anchor-step-4)
  5.  [Getting Detailed Collision Information](#anchor-step-5)
  6.  [Negating Overlap](#anchor-step-6)
  7.  [Detecting collision after insertion](#anchor-step-7)
- [Lines](#anchor-lines)
- [Concave Polygons](#anchor-concave-polygons)
- [Rendering](#anchor-rendering)
- [Only using SAT](#anchor-only-using-sat)
- [FAQ](#anchor-faq)

<a name="anchor-installation"></a>
Installation
=====

```bash
yarn add detect-collisions -D

# or

npm i detect-collisions --save-dev
```

<a name="anchor-documentation"></a>
Documentation
=====

View the [documentation](https://prozi.github.io/detect-collisions/) (this README is also there).

<a name="anchor-demos"></a>
Demos
=====

- [Tank](https://prozi.github.io/detect-collisions/demo/)
- [Stress Test](https://prozi.github.io/detect-collisions/demo/?stress)

<a name="anchor-usage"></a>
Usage
=====

```javascript
const { System } = require('detect-collisions');

// Create the collision system
const system = new System();

// Create the player (represented by a Circle)
const player = system.createCircle({ x: 100, y: 100 }, 10);

const points = [{ x: -60, y: -20 }, { x: 60, y: -20 }, { x: 60, y: 20 }, { x: -60, y: 20 }];
// Create some walls (represented by Polygons)
// Last parameter is angle - in radians
const wall1 = system.createPolygon({ x: 400, y: 500 }, points, 1.7);
const wall2 = system.createPolygon({ x: 200, y: 100 }, points, 2.2);
const wall3 = system.createPolygon({ x: 400, y: 50 }, points, 0.7);

// Update bounding boxes of collision tree
system.update();

// Check one collider
system.checkOne(player, ({ overlapV }) => {
  // Move it away from collision
  player.pos.x -= overlapV.x;
  player.pos.y -= overlapV.y;
});

// Check all colliders
system.checkAll(({ a, overlapV }) => {
  // Move them away from collision
  a.pos.x -= overlapV.x;
  a.pos.y -= overlapV.y;
});

// Check all colliders and move them away from collision
system.separate();
```

<a name="anchor-getting-started"></a>
Getting Started
=====

<a name="anchor-step-1"></a>

## 1. Creating a Collision System

**Detect-Collisions** provides functions for performing both broad-phase and narrow-phase collision tests. In order to take full advantage of both phases, bodies need to be tracked within a collision system.

Call the System constructor to create a collision system.

```javascript
const { System } = require('detect-collisions');

const system = new System();
```

<a name="anchor-step-2"></a>

## 2. Creating, Inserting, Updating, and Removing Bodies

**Detect-Collisions** supports the following body types:

- **Circle:** A shape with infinite sides equidistant from a single point
- **Polygon:** A shape made up of line segments
- **Box:** A shape like a rectangle
- **Point:** A single coordinate

To use them, require the desired body class, call its constructor, and insert it into the collision system using `insert()`.

```javascript
const { System, Circle, Polygon, Point } = require('detect-collisions');

const system = new System();
const circle = new Circle({ x: 100, y: 100 }, 10);
const polygon = new Polygon({ x: 50, y: 50 }, [{ x: 0, y: 0 }, { x: 20, y: 20}, { x: -10, y: 10 }]);
const line = new Polygon({ x: 200, y: 5 }, [{ x: -30, y: 0 }, { x: 10, y: 20 }]);
const point = new Point({ x: 10, y: 10 });

system.tree.insert(circle)
system.tree.insert(polygon);
system.tree.insert(line);
system.tree.insert(point);
```

Collision systems expose several convenience functions for creating bodies and inserting them into the system in one step. This also avoids having to require the different body classes.

```javascript
const { System } = require('detect-collisions');

const system = new System();
const circle = system.createCircle({ x: 100, y: 100 }, 10);
const polygon = system.createPolygon({ x: 50, y: 50 }, [{ x: 0, y: 0 }, { x: 20, y: 20}, { x: -10, y: 10 }]);
const line = system.createPolygon({ x: 200, y: 5 }, [{ x: -30, y: 0 }, { x: 10, y: 20 }]);
const point = system.createPoint({ x: 10, y: 10 });
```

All bodies have `pos` property with `x` and `y` properties that can be manipulated. Additionally, All bodies have an `angle` property to rotate their points around their current position (using radians). Use `setAngle` to alter the value and recalculate points.

```javascript
circle.pos.x = 20;
circle.pos.y = 30;
circle.r = 1.5;

polygon.pos.x = 40;
polygon.pos.y = 100;
polygon.setAngle(1.2);
```

And, of course, bodies can be removed when they are no longer needed.

```javascript
system.tree.remove(polygon)
system.tree.remove(point);
```

<a name="anchor-step-3"></a>

## 3. Updating the Collision System

Collision systems need to be updated when the bodies within them change. This includes when bodies are inserted, removed, or when their properties change (e.g. position, angle, scaling, etc.). Updating a collision system is done by calling `update()` and should typically occur once per frame.

```javascript
system.update();
```

The optimal time for updating a collision system is **after** its bodies have changed and **before** collisions are tested. For example, a game loop might use the following order of events:

```javascript
function gameLoop() {
  handleInput();
  processGameLogic();

  system.update();

  handleSystem();
  render();
}
```

<a name="anchor-step-4"></a>

## 4. Testing for Collisions

When testing for collisions on a body, it is generally recommended that a broad-phase search be performed first by calling `getPotentials(body)` in order to quickly rule out bodies that are too far away to collide. **Detect-Collisions** uses a [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) (BVH) for its broad-phase search. Calling `getPotentials(body)` on a body traverses the BVH and builds a list of potential collision candidates.

```javascript
const potentials = system.getPotentials(polygon);
```

Once a list of potential collisions is acquired, loop through them and perform a narrow-phase collision test using `collides()`. **Detect-Collisions** uses the [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for its narrow-phase collision tests.

```javascript
const potentials = system.getPotentials(polygon);

potentials.forEach((body) => {
  if (system.collides(polygon, body)) {
    console.log('Collision detected!', system.response);
  }
});
```

It is also possible to skip the broad-phase search entirely and call `collides()` directly on two bodies.

> **Note:** Skipping the broad-phase search is not recommended. When testing for collisions against large numbers of bodies, performing a broad-phase search using a BVH is _much_ more efficient.

```javascript
if (system.collides(polygon, line)) {
  console.log('Collision detected!', system.response);
}
```

<a name="anchor-step-5"></a>

## 5. Getting Detailed Collision Information

There is often a need for detailed information about a collision in order to react to it appropriately. This information is stored using a `Response` object. `Response` objects have several properties set on them when a collision occurs, all of which are described in the [documentation](https://prozi.github.io/detect-collisions/).

For convenience, there are several ways to create a `Response` object. `Response` objects do not belong to any particular collision system, so any of the following methods for creating one can be used interchangeably. This also means the same `Response` object can be used for collisions across multiple systems.

> **Note:** It is highly recommended that `Response` objects be recycled when performing multiple collision tests in order to save memory. You can access the last response from `system.response`.

<a name="anchor-step-6"></a>

## 6. Negating Overlap

A common use-case in collision detection is negating overlap when a collision occurs (such as when a player hits a wall). This can be done using the collision information in a `Response` object (see [Getting Detailed Collision Information](#anchor-getting-detailed-collision-information)).

The three most useful properties on a `Response` object are `overlap`, `overlap_x`, and `overlap_y`. Together, these values describe how much and in what direction the source body is overlapping the target body. More specifically, `overlap_x` and `overlap_y` describe the direction vector, and `overlap` describes the magnitude of that vector.

These values can be used to "push" one body out of another using the minimum distance required. More simply, subtracting this vector from the source body's position will cause the bodies to no longer collide. Here's an example:

```javascript
if (system.collides(player, wall)) {
  const result = system.response;

  player.x -= result.overlapV.X;
  player.y -= result.overlapV.y;
}
```

<a name="anchor-step-7"></a>

## 7. Detecting collision after insertion

```javascript
const { System } = require("detect-collisions")

const system = new System();
const collider = system.createCircle({ x: 100, y: 100 }, 10);
const potentials = system.getPotentials(collider);
const obj = { name: 'coin', collider };
const collided = potentials.some((body) => system.collides(collider, body));

if (collided) {
  system.remove(obj.collider);
  obj.collider = null;
}
```

<a name="anchor-lines"></a>
Lines
=====

Creating a line is simply a matter of creating a single-sided polygon (i.e. a polygon with only two coordinate pairs).

```javascript
const line = new Polygon({ x: 200, y: 5 }, [{ x: -30, y: 0 }, { x: 10, y: 20 }]);
```

<a name="anchor-concave-polygons"></a>
Concave Polygons
=====

**Detect-Collisions** uses the [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for its narrow-phase collision tests. One caveat to SAT is that it only works properly on convex bodies. However, concave polygons can be "faked" by using a series of [Lines](#anchor-lines). Keep in mind that a polygon drawn using [Lines](#anchor-lines) is "hollow".

Handling true concave polygons requires breaking them down into their component convex polygons (Convex Decomposition) and testing them for collisions individually. There are plans to integrate this functionality into the library in the future, but for now, check out [poly-decomp.js](https://github.com/schteppe/poly-decomp.js).

<a name="anchor-rendering"></a>
Rendering
=====

For debugging, it is often useful to be able to visualize the collision bodies. All of the bodies in a Collision system can be drawn to a `<canvas>` element by calling `draw()` and passing in the canvas' 2D context.

```javascript
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// ...
context.strokeStyle = '#FFFFFF';
context.beginPath();

system.draw(context);

context.stroke();
```

Bodies can be individually drawn as well.

```javascript
context.strokeStyle = '#FFFFFF';
context.beginPath();

polygon.draw(context);
circle.draw(context);

context.stroke();
```

The BVH can also be drawn to help test [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy).

```javascript
context.strokeStyle = '#FFFFFF';
context.beginPath();

system.drawBVH(context);

context.stroke();
```

<a name="anchor-only-using-sat"></a>
Only using SAT
=====

Some projects may only have a need to perform SAT collision tests without broad-phase searching. This can be achieved by avoiding collision systems altogether and only using the `collides()` function.

```javascript
const { Circle, Polygon, Response } = require('collisions');

const circle = new Circle({ x: 45, y: 45 }, 20);
const polygon = new Polygon({ x: 50, y: 50 }, [{ x: 0, y: 0 }, { x: 20, y: 20 }, { x: -10, y: 10 }]);

if (system.collides(polygon, circle)) {
  console.log(system.result);
}
```

<a name="anchor-faq"></a>
FAQ
=====

## Why shouldn't I just use a physics engine?

Projects requiring physics are encouraged to use one of the several physics engines out there (e.g. [Matter.js](https://github.com/liabru/matter-js), [Planck.js](https://github.com/shakiba/planck.js)). However, many projects end up using physics engines solely for collision detection, and developers often find themselves having to work around some of the assumptions that these engines make (gravity, velocity, friction, etc.). **Detect-Collisions** was created to provide robust collision detection and nothing more. In fact, a physics engine could easily be written with **Detect-Collisions** at its core.

## Sometimes bodies can "squeeze" between two other bodies. What's going on?

This isn't caused by faulty collisions, but rather how a project handles its collision responses. There are several ways to go about responding to collisions, the most common of which is to loop through all bodies, find their potential collisions, and negate any overlaps that are found one at a time. Since the overlaps are negated one at a time, the last negation takes precedence and can cause the body to be pushed into another body.

One workaround is to resolve each collision, update the collision system, and repeat until no collisions are found. Keep in mind that this can potentially lead to infinite loops if the two colliding bodies equally negate each other. Another solution is to collect all overlaps and combine them into a single resultant vector and then push the body out, but this can get rather complicated.

There is no perfect solution. How collisions are handled depends on the project.
