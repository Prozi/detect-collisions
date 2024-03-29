# Detect-Collisions

[<img src="https://img.shields.io/npm/v/detect-collisions?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/detect-collisions?activeTab=versions)
[<img src="https://img.shields.io/npm/dw/detect-collisions.svg?style=for-the-badge&color=success" alt="npm downloads per week" />](https://www.npmjs.com/package/detect-collisions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/detect-collisions/master?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/detect-collisions)

## Introduction

Detect-Collisions is a robust TypeScript library for detecting collisions among various entities. It employs Bounding Volume Hierarchy (BVH) and the Separating Axis Theorem (SAT) for efficient collision detection. Unique features include managing rotation, scale of bodies, and supporting the decomposition of concave polygons into convex ones. It optimizes detection with body padding, making it ideal for gaming, simulations, or projects requiring advanced collision detection with customization and fast performance.

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

[Detect-Collisions API Documentation](https://prozi.github.io/detect-collisions/)

## Usage

### Step 1: Initialize Collision System

Initialize a unique collision system using Detect-Collisions:

```ts
const { System } = require("detect-collisions");
const system = new System();
```

### Step 2: Understand Body Attributes

Bodies possess various properties:

- **Position**: `pos: Vector`, `x: number`, `y: number`.
- **Scale**: Use `setScale(x: number, y: number)` for setting and `scale: Vector` for getting scale
- **Rotation**: Use `setAngle(radians: number)` for setting and `angle: number` for getting and `deg2rad(degrees: number)` to convert to radians.
- **Offset**: Use `setOffset(offset: Vector)` for setting and `offset: Vector` for getting offset from the body center.
- **AABB Bounding Box**: Use `aabb: BBox` for inserted or `getAABBAsBBox(): BBox` for non inserted bodies to get the bounding box.
- **Padding**: Use `padding: number` and set to nonzero value to reduce costly reinserts on attributes' change.
- **Body Options**: Use `isStatic: boolean` to mark body as non movable and `isTrigger: boolean` to set body as ghost.

### Step 3: Create and Manage Bodies

Create bodies of various types and manage them:

```ts
const {
  Box,
  Circle,
  Ellipse,
  Line,
  Point,
  Polygon,
} = require("detect-collisions");

// Example: Create and insert box1 body
const box1 = system.createBox(position, width, height, options);
// Example: Create box2 body
const box2 = new Box(position, width, height, options);
// Example: Insert box2 body
system.insert(box2);
```

### Step 4: Manipulate Bodies

Manipulate body attributes and update the collision system:

```ts
box.setPosition(x, y);
box.setScale(scaleX, scaleY);
box.setAngle(angle);
box.setOffset({ x, y });
system.update(); // Update the system after manipulation
```

### Step 5: Collision Detection and Resolution

Detect collisions and respond accordingly:

```ts
if (system.checkAll()) {
  // Handle collision
  system.separate(); // Separate bodies after collision
}
```

### Step 6: Cleaning Up

Remove bodies when they're no longer needed:

```ts
system.remove(body);
```

And that's it! You're now ready to utilize the Detect-Collisions library in your project.

## Visual Debugging with Rendering

To facilitate debugging, Detect-Collisions allows you to visually represent the collision bodies. By invoking the `draw()` method and supplying a 2D context of a `<canvas>` element, you can draw all the bodies within a collision system.

```ts
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

context.strokeStyle = "#FFFFFF";
context.beginPath();
system.draw(context);
context.stroke();
```

You can also opt to draw individual bodies.

```ts
context.strokeStyle = "#FFFFFF";
context.beginPath();
// draw specific body
body.draw(context);
// draw whole system
system.draw(context);
context.stroke();
```

To assess the [Bounding Volume Hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy), you can draw the BVH.

```ts
context.strokeStyle = "#FFFFFF";
context.beginPath();
// draw specific body bounding box
body.drawBVH(context);
// draw bounding volume hierarchy of the system
system.drawBVH(context);
context.stroke();
```

## Raycasting

Detect-Collisions provides the functionality to gather raycast data. Here's how:

```ts
const start = { x: 0, y: 0 };
const end = { x: 0, y: -10 };
const hit = system.raycast(start, end);

if (hit) {
  const { point, body } = hit;

  console.log({ point, body });
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

This will provide you with the results of both the insertion test benchmark and a headless [Stress Demo](https://prozi.github.io/detect-collisions/demo/?stress) benchmark, featuring moving bodies, with increasing amounts in each step.

```bash
$ git clone https://github.com/Prozi/detect-collisions.git
$ cd detect-collisions
$ npm i && npm run build # will build & run tests & run benchmarks
```

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
```

```bash
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
