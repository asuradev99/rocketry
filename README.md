# Rocketry
![Logo](res/TitleImage.png "Logo")

https://asuradev99.github.io/CP2-Project/

- A simple and light two-dimensional gravitation simulator featuring a controllable rocket and a planet editor
- Specifically designed to run on Chromebooks and other computationally-challenged devices
- Load and save configurations to create and share levels and configurations on the fly

## Controls

| Key      | Function |
| :----------- | -----------: |
| `w`      | Zoom in       |
| `s`   | Zoom out        |
| `space`| Play/pause the simulation while it is running|
| `x` | Delete the selected object (Only in Editor mode)|
| `LM Drag` | Drag the camera (only in Editor mode) |


## Settings Explanation

| Name      | Function |
| :----------- | -----------: |
| `gravitationalConstant`      | strength of the gravitational force between massive objects      |
| `deltaT`   | Speed of the simulation (faster = less accurate)     |
| `newPlanetMass`| Set the mass of the new planet|
| `isDynamic`| If checked, the planet is dynamic and can accelerate based on it's attraction to other planets and dynamic entities.|
| `Add_Planet` | Add a new planet (Only in Editor mode)|
| `Camera x/y` | Camera x and y coordinates (only in Editor mode) |
| `Toggle Follow Player` | Toggle whether the camera follows the player or can move around freely |
| `Toggle Show Velocity` | Show the velocity vectors of moving objects |
| `Toggle Show Forces` | Show the forces acting on objects with mass |
| `Toggle Trace Positions` | If true, tracks the player's (and other moving entities') positions over time using markers. |
