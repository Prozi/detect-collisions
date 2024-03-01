# Detect-Collisions

[<img src="https://img.shields.io/npm/v/detect-collisions?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/detect-collisions?activeTab=versions)
[<img src="https://img.shields.io/npm/dw/detect-collisions.svg?style=for-the-badge&color=success" alt="npm downloads per week" />](https://www.npmjs.com/package/detect-collisions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/detect-collisions/master?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/detect-collisions)

## Introduction

Detect-Collisions is a robust TypeScript library for detecting collisions among varied entities. It uses Bounding Volume Hierarchy (BVH) and the Separating Axis Theorem (SAT) for efficient collision detection. Uniquely, it manages rotation, scale of bodies, and supports decomposing concave polygons into convex ones. It also optimizes detection with body padding. Ideal for gaming, simulations, or projects needing advanced collision detection, Detect-Collisions offers customization and fast performance.

## Demos

- [Tank](https://prozi.github.io/detect-collisions/demo/)
- [Stress Test](https://prozi.github.io/detect-collisions/demo/?stress)
- [Stackblitz](https://stackblitz.com/edit/detect-collisions)

## Installation

```bash
$ npm install detect-collisions
```

## API Documentation

For detailed documentation on the library's API, refer to the following link:

https://prozi.github.io/detect-collisions/

## Usage

### Step 1: Initialize Collision System

Detect-Collisions extends functionalities from RBush. To begin, establish a unique collision system.

```ts
const { System } = require("detect-collisions")
const system = new System()
```

### Step 2: Understand Body Attributes

Bodies have various properties:

- **Position Attributes**: `pos: Vector`, `x: number`, `y: number`. Setting `body.pos.x` or `body.pos.y` doesn't update the bounding box while setting `body.x` or `body.y` directly does. To set both at the same time, use `setPosition(x, y)`.

- **Scale, Offset**: Bodies have `scale: number` shorthand property and `setScale(x, y)` method for scaling. The `offset: Vector` property and `setOffset({ x, y }: Vector)` method are for offset from body center for rotation purposes.

- **AABB Bounding Box**: You can get the bounding box even on non-inserted bodies with `getAABBAsBBox(): BBox` method.

Bodies contain additional properties (`BodyOptions`) that can be set in runtime or during creation:

- `angle: number`: Use `setAngle(angle: number)` to change it during runtime.
- `isStatic: boolean`: If set to true, the body won't move during `system.separare()`. For walls.
- `isTrigger: boolean`: If set to true, the body won't move during `system.separate()`. For projectiles.
- `isCentered: boolean`: If set to true, offset is set to center for rotation purposes.
- `padding: number`: Bounding box padding, optimizes costly updates.

Use `isConvex: boolean` and `convexPolygons: Vector[][]` to check if the `Polygon` is convex.

Each body type has specific properties, for example, a `Box` has `width` & `height` properties.

### Step 3: Create and Manage Bodies

Use `BodyOptions` as the last optional parameter during body creation.

```ts
const { deg2rad } = require("detect-collisions")
const options = {
  angle: deg2rad(90),
  isStatic: false,
  isTrigger: false,
  isCentered: false,
  padding: 0,
}
```

Create body of various types using:

```ts
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

Insert a body into the system:

```ts
// insert any of the above
system.insert(body)
```

Create and insert body in one step:

```ts
// create with options, and insert
const box = system.createBox(position, width, height, options)
const circle = system.createCircle(position, radius, options)
const ellipse = system.createEllipse(position, radiusX, radiusY, step, options)
const line = system.createLine(start, end, options)
const point = system.createPoint(position, options)
const polygon = system.createPolygon(position, points, options)
```

### Step 4: Manipulate Bodies

Notice the last parameter of each of the below 4 functions defaults to `true` if omitted.

- `setPosition(x: number, y: number, update = true)`:

  - Sets the position of the body to the specified `(x, y)` coordinates in the 2D space.

- `setScale(x: number, y = x, update = true)`:

  - Sets the scale of the body along the x-axis and y-axis (optional).
  - Allows resizing the body.

- `setAngle(angle: number, update = true)`:

  - Sets the rotation angle of the body to the specified value.
  - Used for rotating the body around its center.
  - Angle in radians, use `deg2rad(degrees: number)` for conversion.

- `setOffset(offset: { x: number, y: number }, update = true)`:

  - Sets the offset of the body from its center.
  - Used to position the body's collision shape more accurately.

- `updateBody()`:
  - Updates body AABB in collision tree, please call this after all manipulations are done

Depending on your use case:

- If you use only position updates stick to `setPosition(x, y)` and don't use `system.update()` or `body.updateBody()`. Since the last parameter of each manipulation function (`update`) defaults to `true`, this way will make that body bounding box update after that `setPosition` call,

- If you use 2 or more manipulation methods, like position plus any other aspect like scale/angle/offset, you should call manipulation functions with last parameter set to `false` (for example: `setPosition(x, y, false)`)
  - After all of those manipulations are done, call once `body.updateBody()` to update the bounding box once. This method is most efficient.
  - Alternatively, after all updates of bodies in this frame are finished, call once `system.update()` which will iterate over all bodies and update their bounding box. This method is slightly less efficient.

### Step 5: Collision Detection and Resolution

Check collisions for all bodies or a single body:

```ts
// check if any body collides, end after first collision and return true
const collided = system.checkAll(() => true)

// check if 1 body collides, end after first collision and return true
const collided = system.checkOne(body, () => true)
```

For a direct collision check without broad-phase search, use `system.checkCollision(body1, body2)`. However, this isn't recommended due to efficiency loss.

Access detailed collision information in the system.response object, which includes properties like `a, b, overlap, overlapN, overlapV, aInB, and bInA`.

### Step 6: Collision Response

After detecting a collision, you may want to respond or "react" to it in some way. This could be as simple as stopping a character from moving through a wall, or as complex as calculating the resulting velocities of a multi-object collision in a physics simulation.

Here's a simple example:

```ts
system.checkAll(({ a: body, b: collider }: Response) => {
  if (body.isPlayer && collider.isWall) {
    // Player can't move through walls
    system.separateBody(body)
  } else if (body.isBullet && collider.isEnemy) {
    // Bullet hits enemy
    system.remove(body) // Remove bullet
    collider.takeDamage() // Damage enemy
  }
})
```

### Step 7: Body Separation

There is an easy way to handle overlap and separation of bodies during collisions. Use system.separate() after updating the system. This function takes into account `isTrigger` and `isStatic` flags on bodies.

```ts
system.separate()
```

This function provides a simple way to handle collisions of whole system, without needing to manually calculate and negate overlap.

```ts
system.separateBody(body)
```

This function provides a simple way to handle collisions of one body, without needing to manually calculate and negate overlap.

### Step 8: Cleaning Up

When you're done with a body, you should remove it from the system to free up memory and keep the collision checks efficient. You can do this with the remove method:

```ts
system.remove(body)
```

This will remove the body from the system's internal data structures, preventing it from being included in future collision checks. If you keep a reference to the body, you can insert it again later with `system.insert(body)`.

Remember to always keep your collision system as clean as possible. This means removing bodies when they're not needed, and avoiding unnecessary updates. Following these guidelines will help ensure your project runs smoothly and efficiently.

And that's it! You're now ready to use the Detect-Collisions library in your project. Whether you're making a game, a simulation, or any other kind of interactive experience, Detect-Collisions provides a robust, efficient, and easy-to-use solution for collision detection. Happy coding!

## Detecting collision after insertion

```ts
// create self-destructing collider
const testCollision = ({ x, y }, radius = 10) => {
  // create and add to tree
  const circle = system.createCircle({ x, y }, radius)
  // init as false
  const collided = system.checkOne(circle, () => true)

  // remove from tree
  system.remove(circle)

  return collided ? system.response : null
}
```

## Handling Concave Polygons

As of version 6.8.0, Detect-Collisions fully supports non-convex or hollow polygons\*, provided they are valid. Learn more about this feature from [GitHub Issue #45](https://github.com/Prozi/detect-collisions/issues/45) or experiment with it on [Stackblitz](https://stackblitz.com/edit/detect-collisions).

## Visual Debugging with Rendering

To facilitate debugging, Detect-Collisions allows you to visually represent the collision bodies. By invoking the `draw()` method and supplying a 2D context of a `<canvas>` element, you can draw all the bodies within a collision system.

```ts
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")

context.strokeStyle = "#FFFFFF"
context.beginPath()
system.draw(context)
context.stroke()
```

You can also opt to draw individual bodies.

```ts
context.strokeStyle = "#FFFFFF"
context.beginPath()
// draw specific body
body.draw(context)
// draw whole system
system.draw(context)
context.stroke()
```

To assess the [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy), you can draw the BVH.

```ts
context.strokeStyle = "#FFFFFF"
context.beginPath()
// draw specific body bounding box
body.drawBVH(context)
// draw bounding volume hierarchy of the system
system.drawBVH(context)
context.stroke()
```

## Raycasting

Detect-Collisions provides the functionality to gather raycast data. Here's how:

```ts
const start = { x: 0, y: 0 }
const end = { x: 0, y: -10 }
const hit = system.raycast(start, end)

if (hit) {
  const { point, body } = hit

  console.log({ point, body })
}
```

In this example, `point` is a `Vector` with the coordinates of the nearest intersection, and `body` is a reference to the closest body.

## Contributing to the Project

We welcome contributions! Feel free to open a merge request. When doing so, please adhere to the following code style guidelines:

- Execute the `npm run precommit` script prior to submitting your merge request
- Follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard
- Refrain from using the `any` type

## Additional Considerations

### Why not use a physics engine?

While physics engines like [Matter-js](https://github.com/liabru/matter-js) or [Planck.js](https://github.com/shakiba/planck.js) are recommended for projects that need comprehensive physics simulation, not all projects require such complexity. In fact, using a physics engine solely for collision detection can lead to unnecessary overhead and complications due to built-in assumptions (gravity, velocity, friction, etc.). Detect-Collisions is purpose-built for efficient and robust collision detection, making it an excellent choice for projects that primarily require this functionality. It can also serve as the foundation for a custom physics engine.

## Benchmark

```bash
$ git clone https://github.com/Prozi/detect-collisions.git
$ cd detect-collisions
$ yarn
$ yarn benchmark [milliseconds=1000]
```

- will show you the results of insertion test, and
- [Stress Demo](https://prozi.github.io/detect-collisions/demo/?stress) live (moving bodies)

with different _N_ amounts of bodies

typical output:

```bash
┌─────────┬─────────────────────────────┬──────────────────┬────────────────────────┬───────────┬─────────┬──────────┐
│ (index) │          Task Name          │ Average Time (s) │ Standard Deviation (s) │    hz     │ p99 (s) │ p995 (s) │
├─────────┼─────────────────────────────┼──────────────────┼────────────────────────┼───────────┼─────────┼──────────┤
│    0    │  'non overlapping circles'  │      0.017       │         0.034          │ 57315.994 │  0.044  │  0.187   │
│    1    │    'overlapping circles'    │      0.017       │         0.028          │ 57394.929 │  0.036  │  0.201   │
│    2    │ 'non-overlapping triangles' │      0.059       │         0.034          │ 16929.778 │  0.27   │  0.294   │
│    3    │   'overlapping triangles'   │      0.064       │         0.033          │ 15602.581 │  0.275  │  0.288   │
│    4    │   'non-overlapping quad'    │      0.065       │         0.033          │ 15404.47  │  0.274  │  0.285   │
│    5    │     'overlapping quad'      │      0.064       │         0.032          │ 15572.344 │  0.276  │  0.311   │
└─────────┴─────────────────────────────┴──────────────────┴────────────────────────┴───────────┴─────────┴──────────┘

┌─────────┬────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │         Task Name          │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │ 'stress test, items=1000'  │  '317'  │  3148675.97799631  │ '±1.58%' │   318   │
│    1    │ 'stress test, items=2000'  │  '157'  │ 6330735.7974397605 │ '±1.52%' │   158   │
│    2    │ 'stress test, items=3000'  │  '75'   │ 13327073.447455307 │ '±0.99%' │   76    │
│    3    │ 'stress test, items=4000'  │  '57'   │ 17520130.72403597  │ '±2.13%' │   58    │
│    4    │ 'stress test, items=5000'  │  '40'   │ 24748692.02477176  │ '±3.33%' │   41    │
│    5    │ 'stress test, items=6000'  │  '30'   │ 32862712.38771658  │ '±2.96%' │   31    │
│    6    │ 'stress test, items=7000'  │  '19'   │ 51916039.55030441  │ '±2.22%' │   20    │
│    7    │ 'stress test, items=8000'  │  '18'   │ 55266960.577941254 │ '±2.34%' │   19    │
│    8    │ 'stress test, items=9000'  │  '14'   │ 66757363.86602123  │ '±1.59%' │   15    │
│    9    │ 'stress test, items=10000' │  '12'   │ 77764442.38424301  │ '±3.07%' │   13    │
└─────────┴────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
```
