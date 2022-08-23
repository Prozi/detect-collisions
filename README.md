# Introduction

**Detect-Collisions** is TypeScript (compiled to JavaScript, fully typed) library for quickly and accurately detecting collisions between Points, Lines, Boxes, Polygons, Ellipses and Circles, also with rotation. It combines the efficiency of a [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) (BVH) for broad-phase searching and the accuracy of the [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for narrow-phase collision testing.

[<img src="https://img.shields.io/npm/v/detect-collisions?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/detect-collisions?activeTab=versions)
[<img src="https://img.shields.io/npm/dw/detect-collisions.svg?style=for-the-badge&color=success" alt="npm downloads per week" />](https://www.npmjs.com/package/detect-collisions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/detect-collisions/master?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/detect-collisions)

[<img src="https://img.shields.io/npm/l/detect-collisions.svg?style=for-the-badge&color=success" alt="license: MIT" />](https://github.com/Prozi/detect-collisions/blob/master/LICENSE)
[<img src="https://img.shields.io/npm/types/typescript?style=for-the-badge&color=success" alt="typescript" />](https://github.com/Prozi/detect-collisions/blob/master/package.json#L6)
[<img src="https://img.shields.io/snyk/vulnerabilities/github/Prozi/detect-collisions?style=for-the-badge" alt="vulnerabilities" />](https://snyk.io/test/github/Prozi/detect-collisions)

## Demos

- [Tank](https://prozi.github.io/detect-collisions/demo/)
- [Stress Test](https://prozi.github.io/detect-collisions/demo/?stress)

## Install

```bash
$ yarn add detect-collisions
```

## API Documentation

https://prozi.github.io/detect-collisions/modules.html

## Usage

### 1. Creating a System

`System` extends `RBush` so it has [all of its functionalities](https://github.com/mourner/rbush).

To start, create a unique collisions system:

```typescript
const physics: System = new System();
```

### 2. Creating, Inserting, Moving, Removing Bodies

- `Circle & Polygon` extend their respective `SAT` counterparts so they have [all of its functionalities](https://github.com/jriecken/sat-js).
- all bodies have `x & y` properties, setting those **will** update *bounding box*
- all bodies have `setPosition(x, y)`, using it **will** update *bounding box*
- all bodies have `pos` with `x & y` properties, setting those **will not** update *bounding box*
- all bodies have `angle` and `setAngle()` method to rotate (useless for `Circle` but stores value)
- all bodies have `scale` and `setScale()` method to scale (for `Circle` takes 1 parameter, `x, y` for rest)
- all bodies have `center()` method for centering anchor (useless for `Circle, Ellipse, Point`)
- `Box` has `width & height` properties

---

**[Circle](https://github.com/jriecken/sat-js#satcircle)** - Shape with infinite sides equidistant of radius from its center position

**[Ellipse](https://prozi.github.io/detect-collisions/classes/Ellipse.html)** - Flattened circle (implemented as polygon)

**[Polygon](https://github.com/jriecken/sat-js#satpolygon)** - Shape made up of finite number of line segments

**[Box](https://prozi.github.io/detect-collisions/classes/Box.html)** - Rectangle (implemented as polygon)

**[Line](https://prozi.github.io/detect-collisions/classes/Line.html)** - Line (implemented as 2-point polygon)

**[Point](https://prozi.github.io/detect-collisions/classes/Point.html)** - A single coordinate (implemented as tiny box)

---

#### Create bodies:

Last optional parameter for body creation is always [BodyOptions](https://prozi.github.io/detect-collisions/interfaces/BodyOptions.html):

```typescript
const circle: Circle = new Circle(position, radius, options);
const polygon: Polygon = new Polygon(position, points, options);
```

#### Insert bodies to system:

```typescript
physics.insert(circle);
physics.insert(polygon);
```

#### Create and insert to system in one step:

Last optional parameter for body creation with insertion is always [BodyOptions](https://prozi.github.io/detect-collisions/interfaces/BodyOptions.html):

```typescript
const circle: Circle = physics.createCircle(position, radius, options);
const polygon: Polygon = physics.createPolygon(position, points, options);
```

#### Moving bodies:

`setPosition`: this modifies the `element.pos.x` and `element.pos.y` and updates its bounding box in collision physics.

```typescript
circle.setPosition(x, y);
polygon.setPosition(x, y);
```

#### Remove bodies from system:

```typescript
physics.remove(circle);
physics.remove(polygon);
```

### 3. Updating the Collisions System

- After body moves, its bounding box in collision tree needs to be updated.

- This is done under-the-hood automatically when you use setPosition().

Collisions systems need to be updated when the bodies within them change. This includes when bodies are inserted, removed, or when their properties change (e.g. position, angle, scaling, etc.). Updating a collision system can be done by calling `update()` which should typically occur once per frame. Updating the `System` by after each position change is **required** for `System` to detect `BVH` correctly.

```typescript
physics.updateBody(body);
```

Update all bodies (use 0-1 times per frame):

```typescript
physics.update();
```

### 4. Testing for Collisions

The **preferred method** is once-in-a-gameloop checkAll and then handler:

```typescript
physics.checkAll(handleCollisions);
```

If you really need to check one body then use:

```typescript
physics.checkOne(body, handleCollisions);
```

When testing for collisions on a body, it is generally recommended that a broad-phase search be performed first by calling `getPotentials(body)` in order to quickly rule out bodies that are too far away to collide. **Detect-Collisions** uses a [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) (BVH) for its broad-phase search. Calling `getPotentials(body)` on a body traverses the BVH and builds a list of potential collision candidates. Skipping the broad-phase search is not recommended. When testing for collisions against large numbers of bodies, performing a broad-phase search using a BVH is _much_ more efficient.

```typescript
const potentials: Body[] = physics.getPotentials(body);
```

Once a list of potential collisions is acquired, loop through them and perform a narrow-phase collision test using `checkCollision()`. **Detect-Collisions** uses the [Separating Axis Theorem](https://en.wikipedia.org/wiki/Separating_axis_theorem) (SAT) for its narrow-phase collision tests.

```typescript
physics.getPotentials(body).forEach((collider: Body) => {
  if (physics.checkCollision(body, collider)) {
    handleCollisions(physics.response);
  }
});
```

It is also possible to skip the broad-phase search entirely and call `checkCollision()` directly on two bodies.

```typescript
if (physics.checkCollision(polygon, line)) {
  console.log("Collision detected!", physics.response);
}
```

### 5. Getting Detailed Collision Information

There is often a need for detailed information about a collision in order to react to it appropriately. This information is stored inside `physics.response` object. The `Response` ([documentation](https://github.com/jriecken/sat-js#satresponse)) object has several properties set on them when a collision occurs:

- `a` - The first object in the collision.
- `b` - The second object in the collison.
- `overlap` - Magnitude of the overlap on the shortest colliding axis.
- `overlapN` - The shortest colliding axis (unit-vector)
- `overlapV` - The overlap vector (i.e. overlapN.scale(overlap, overlap)). If this vector is subtracted from the position of a, a and b will no longer be colliding.
- `aInB` - Whether the first object is completely inside the second.
- `bInA` - Whether the second object is completely inside the first.

### 6. Negating Overlap

A common use-case in collision detection is negating overlap when a collision occurs (such as when a player hits a wall). This can be done using the collision information in a `Response` object (see [Getting Detailed Collision Information](#anchor-getting-detailed-collision-information)).

The three most useful properties on a `Response` object are `overlapV`, `a`, and `b`. Together, these values describe how much and in what direction the source body is overlapping the target body. More specifically, `overlapV.x` and `overlapV.y` describe the scaled direction vector. If this vector is subtracted from the position of a, a and b will no longer be colliding.

These values can be used to "push" one body out of another using the minimum distance required. More simply, subtracting this vector from the source body's position will cause the bodies to no longer collide. Here's an example:

```typescript
if (physics.checkCollision(player, wall)) {
  const { overlapV }: Response = physics.response;

  player.setPosition(player.x - overlapV.x, player.y - overlapV.y);
}
```

### 7. Detecting collision after insertion

```typescript
// create self-destructing collider
function testCollision(position: Vector, radius: number = 10): boolean {
  const circle: Circle = physics.createCircle(position, radius);
  const potentials: Body[] = physics.getPotentials(circle);
  const collided: boolean = potentials.some((body: Body) =>
    physics.checkCollision(circle, body)
  );

  physics.remove(circle);

  return collided;
}
```

## Concave Polygons

Hollow / non-convex polygons are fully supported since v6.3.0!

## Rendering

For debugging, it is often useful to be able to visualize the collision bodies. All of the bodies in a Collision system can be drawn to a `<canvas>` element by calling `draw()` and passing in the canvas' 2D context.

```typescript
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

context.strokeStyle = "#FFFFFF";
context.beginPath();

physics.draw(context);

context.stroke();
```

Bodies can be individually drawn as well.

```typescript
context.strokeStyle = "#FFFFFF";
context.beginPath();

polygon.draw(context);
circle.draw(context);

context.stroke();
```

The BVH can also be drawn to help test [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy).

```typescript
context.strokeStyle = "#FFFFFF";
context.beginPath();

physics.drawBVH(context);

context.stroke();
```

## Only using SAT

Some projects may only have a need to perform SAT collision tests without broad-phase searching. This can be achieved by avoiding collision systems altogether and only using the `checkCollision()` function.

```typescript
const circle: Circle = new Circle(position, radius);
const polygon: Polygon = new Polygon(position, points);

if (physics.checkCollision(polygon, circle)) {
  console.log(physics.result);
}
```

## Raycast

To get raycast information use

```typescript
const start: Vector = { x: 0, y: 0 };
const end: Vector = { x: 0, y: -10 };
const hit: RaycastResult = physics.raycast(start, end);

if (hit) {
  const { point, collider } = hit;

  console.log({ point, collider });
}
```

- point is the `Vector { x, y }` with coordinates of (closest) intersection
- collider is the reference to body of the (closest) collider

## FAQ

### Why shouldn't I just use a physics engine?

Projects requiring physics are encouraged to use one of the several physics engines out there (e.g. [Matter.js](https://github.com/liabru/matter-js), [Planck.js](https://github.com/shakiba/planck.js)). However, many projects end up using physics engines solely for collision detection, and developers often find themselves having to work around some of the assumptions that these engines make (gravity, velocity, friction, etc.). **Detect-Collisions** was created to provide robust collision detection and nothing more. In fact, a physics engine could easily be written with **Detect-Collisions** at its core.

### Sometimes bodies can "squeeze" between two other bodies. What's going on?

This isn't caused by faulty collisions, but rather how a project handles its collision responses. There are several ways to go about responding to collisions, the most common of which is to loop through all bodies, find their potential collisions, and negate any overlaps that are found one at a time. Since the overlaps are negated one at a time, the last negation takes precedence and can cause the body to be pushed into another body.

One workaround is to resolve each collision, update the collision system, and repeat until no collisions are found. Keep in mind that this can potentially lead to infinite loops if the two colliding bodies equally negate each other. Another solution is to collect all overlaps and combine them into a single resultant vector and then push the body out, but this can get rather complicated.

There is no perfect solution. How collisions are handled depends on the project.
