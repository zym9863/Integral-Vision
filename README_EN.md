[中文版 (Chinese Version)](README.md)

# Integral Vision

An interactive double integral visualization app based on Three.js, designed to help understand the geometric meaning of integrals and the Riemann sum approximation process.

## Features

### 1. Dynamic 3D Visualization of Functions and Integration Domains
- Input bivariate function `f(x, y)` and the boundary of the integration region `D`
- Real-time rendering of the 3D surface `z = f(x, y)`
- Highlight the integration region on the xy-plane
- Support for 3D viewing and interaction from any angle

### 2. Visualization of Riemann Sum Approximation
- Control the partition fineness of the integration region with a slider
- Real-time display of Riemann sum cuboids
- Observe the convergence of the integral approximation as the number of partitions increases
- Intuitively demonstrate the integral concept of "partition, approximate, sum, and take the limit"

### 3. Preset Examples
- Paraboloid (circular domain)
- Wave function
- Gaussian function
- Saddle surface
- Cone surface
- Trigonometric combinations
- Simple linear function

## Tech Stack

- **Three.js**: 3D graphics rendering
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **pnpm**: Efficient package manager

## Supported Math Functions

- Basic operations: `+`, `-`, `*`, `/`, `^` (power)
- Trigonometric: `sin`, `cos`, `tan`
- Exponential/logarithmic: `exp`, `log`
- Others: `sqrt`, `abs`
- Logical: `&&` (and), `||` (or)
- Comparison: `<=`, `>=`, `<`, `>`, `=`

## Usage

1. Select a preset example or input a custom function and integration domain
2. Click the "Update Visualization" button to generate the 3D model
3. Drag with the mouse to rotate the view, scroll to zoom
4. Adjust the "Riemann Sum Partition" slider to observe the approximation process
5. Click "Show/Hide Riemann Sum" to toggle the display mode

## Development & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Example Inputs

### Function Examples
- `x*x + y*y` - Paraboloid
- `sin(x) * cos(y)` - Wave function
- `exp(-(x*x + y*y))` - Gaussian function
- `sqrt(x*x + y*y)` - Cone surface

### Domain Examples
- `x*x + y*y <= 1` - Unit circle
- `abs(x) <= 1 && abs(y) <= 1` - Square
- `x >= 0 && y >= 0 && x + y <= 2` - Triangle

## Project Structure

```
src/
├── main.ts              # Main application
├── IntegralVisualizer.ts # 3D visualization core class
├── FunctionParser.ts     # Function parser
├── examples.ts          # Preset examples
└── style.css           # Stylesheet
```

## Educational Value

This app is especially suitable for:
- Teaching integral concepts in mathematics education
- Helping students understand the geometric meaning of double integrals
- Visualizing the Riemann sum approximation process
- Exploring the effects of different functions and integration domains

## Browser Compatibility

Supports all modern browsers with WebGL support.
