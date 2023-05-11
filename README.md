# Detect-Collisions

[<img src="https://img.shields.io/npm/v/detect-collisions?style=for-the-badge&color=success" alt="npm version" />](https://www.npmts.com/package/detect-collisions?activeTab=versions)
[<img src="https://img.shields.io/npm/dw/detect-collisions.svg?style=for-the-badge&color=success" alt="npm downloads per week" />](https://www.npmts.com/package/detect-collisions)
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

https://prozi.github.io/detect-collisions/modules.html

## Usage

### Step 1: Initialize Collision System

Detect-Collisions extends functionalities from RBush. To begin, establish a unique collision system.

```ts
const { System } = require("detect-collisions")
const system = new System()
```

### Step 2: Understand Body Attributes

Bodies have various properties:

- **Position Attributes**: `pos: Vector`, `x: number`, `y: number`. Setting `body.pos.x` or `body.pos.y` doesn't update the bounding box while setting `body.x` or `body.y` directly does. To set position and update bounding box use `setPosition(x, y)`.

- **Scale, Offset**: Bodies have `scale: number` shorthand property and `setScale(x, y)` method for scaling. The `offset: Vector` property and `setOffset({ x, y }: Vector)` method are for offset from body center for rotation purposes.

- **AABB Bounding Box**: You can get the bounding box even on non-inserted bodies with `getAABBAsBBox(): BBox` method.

Bodies contain additional properties (`BodyOptions`) that can be set in runtime or during creation:

- `angle: number`: Angle in radians, use `deg2rad(degrees: number)` for conversion.
- `isStatic: boolean`: If set to true, the body won't separate.
- `isTrigger: boolean`: If set to true, the body won't trigger collisions.
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

Move a body using `body.setPosition(x, y)`. Remove it with `system.remove(body)`. When a body moves, its bounding box in the collision tree needs an update, which is automatically done using `body.setPosition(x, y)`.

### Step 5: Collision Detection and Resolution

Check collisions for all bodies or a single body:

```ts
system.checkAll((response: Response) => {
  /* ... */
})
system.checkOne(body, (response: Response) => {
  /* ... */
})
```

For a direct collision check without broad-phase search, use `system.checkCollision(body1,  body2)`. However, this isn't recommended due to efficiency loss.

Access detailed collision information in the system.response object, which includes properties like `a, b, overlap, overlapN, overlapV, aInB, and bInA`.

In case of overlap during collision, subtract the overlap vector from the position of the body to eliminate the collision. This can be achieved as follows:

```ts
if (system.checkCollision(player, wall)) {
  const { overlapV } = system.response
  player.setPosition(player.x - overlapV.x, player.y - overlapV.y)
}
```

### Step 6: Collision Response

After detecting a collision, you may want to respond or "react" to it in some way. This could be as simple as stopping a character from moving through a wall, or as complex as calculating the resulting velocities of a multi-object collision in a physics simulation.

Here's a simple example:

```ts
system.checkAll((response: Response) => {
  if (response.a.isPlayer && response.b.isWall) {
    // Player can't move through walls
    const { overlapV } = response
    response.a.setPosition(response.a.x - overlapV.x, response.a.y - overlapV.y)
  } else if (response.a.isBullet && response.b.isEnemy) {
    // Bullet hits enemy
    system.remove(response.a) // Remove bullet
    response.b.takeDamage() // Damage enemy
  }
})
```

### Step 7: System Separation

There is an easy way to handle overlap and separation of bodies during collisions. Use system.separate() after updating the system. This function takes into account `isTrigger` and `isStatic` flags on bodies.

```ts
system.separate()
```

This function provides a simple way to handle collisions without needing to manually calculate and negate overlap.

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
  let collided = false

  system.checkOne(circle, () => {
    // mark as true
    collided = true
    // ends iterating after first collision
    return true
  })

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

will show you the [Stress Demo](https://prozi.github.io/detect-collisions/demo/?stress) results without drawing,
only using Detect-Collisions and with different _N_ amounts of dynamic, moving bodies

typical output:

```bash
┌─────────┌─────────┬─────┐
│ (index) │  items  │ FPS │
├─────────┼─────────┼─────┤
│    0    │ 'total' │ 659 │
│    1    │  1000   │ 244 │
│    2    │  2000   │ 133 │
│    3    │  3000   │ 87  │
│    4    │  4000   │ 55  │
│    5    │  5000   │ 40  │
│    6    │  6000   │ 31  │
│    7    │  7000   │ 22  │
│    8    │  8000   │ 18  │
│    9    │  9000   │ 16  │
│   10    │  10000  │ 13  │
└─────────┴─────────┴─────┘
Done in 14.58s.
```ts
