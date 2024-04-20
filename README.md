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
$ npm i detect-collisions --save
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
- **Collision Filtering**: Use `group: number` for collision filtering, with a range within 0x0 ~ 0x7fffffff.
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
box.group = group; // Immediate effect, no system.update needed
```

### Step 5: Collision Detection and Resolution

Detect collisions and respond accordingly:

```ts
if (system.checkAll()) {
  // Do something yourself
}

// Or separate bodies based on isStatic/isTrigger
system.separate();
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

```
> detect-collisions@9.5.5 benchmark-insertion
> node -e 'require(`./dist/benchmarks`).insertionBenchmark()'

┌─────────┬─────────────────────────────┬──────────────────┬────────────────────────┬───────────┬─────────┬──────────┐
│ (index) │          Task Name          │ Average Time (s) │ Standard Deviation (s) │    hz     │ p99 (s) │ p995 (s) │
├─────────┼─────────────────────────────┼──────────────────┼────────────────────────┼───────────┼─────────┼──────────┤
│    0    │  'non overlapping circles'  │      0.017       │         0.024          │ 59546.672 │  0.036  │  0.179   │
│    1    │    'overlapping circles'    │      0.017       │         0.019          │ 57398.492 │  0.031  │  0.194   │
│    2    │ 'non-overlapping triangles' │      0.057       │         0.033          │ 17646.738 │  0.263  │  0.271   │
│    3    │   'overlapping triangles'   │       0.06       │         0.031          │ 16580.923 │  0.266  │  0.275   │
│    4    │   'non-overlapping quad'    │      0.063       │         0.032          │ 15993.04  │  0.268  │  0.287   │
│    5    │     'overlapping quad'      │      0.062       │         0.031          │ 16138.151 │  0.267  │  0.277   │
└─────────┴─────────────────────────────┴──────────────────┴────────────────────────┴───────────┴─────────┴──────────┘

> detect-collisions@9.5.5 benchmark-stress
> node -r pixi-shim -e 'require(`./dist/benchmarks`).stressBenchmark()'

┌─────────┬────────────────────────────┬─────────┬────────────────────┬───────────┬─────────┐
│ (index) │         Task Name          │ ops/sec │ Average Time (ns)  │  Margin   │ Samples │
├─────────┼────────────────────────────┼─────────┼────────────────────┼───────────┼─────────┤
│    0    │ 'stress test, items=1000'  │  '328'  │ 3040152.9968011347 │ '±1.53%'  │   329   │
│    1    │ 'stress test, items=2000'  │  '142'  │ 7036809.1396310115 │ '±1.24%'  │   143   │
│    2    │ 'stress test, items=3000'  │  '89'   │ 11138342.555860678 │ '±1.40%'  │   90    │
│    3    │ 'stress test, items=4000'  │  '51'   │ 19251488.80753953  │ '±1.92%'  │   52    │
│    4    │ 'stress test, items=5000'  │  '42'   │ 23662193.696686003 │ '±2.82%'  │   43    │
│    5    │ 'stress test, items=6000'  │  '29'   │ 34045372.166484594 │ '±3.89%'  │   30    │
│    6    │ 'stress test, items=7000'  │  '22'   │ 43783659.75090613  │ '±4.48%'  │   24    │
│    7    │ 'stress test, items=8000'  │  '14'   │ 69103674.99937613  │ '±1.96%'  │   15    │
│    8    │ 'stress test, items=9000'  │  '11'   │ 89361312.33225267  │ '±43.04%' │   12    │
│    9    │ 'stress test, items=10000' │  '12'   │ 78276474.53947708  │ '±2.32%'  │   13    │
└─────────┴────────────────────────────┴─────────┴────────────────────┴───────────┴─────────┘
```
