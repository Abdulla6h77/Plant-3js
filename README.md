# World Trees Globe Visualization

This project visualizes world tree data on a 3D globe using React and Three.js. Users can interact with the globe, select regions, and view detailed information about tree plantations at various locations.

## Features

- 🌍 **3D Globe Visualization:** Explore tree data on an interactive globe.
- 📊 **Region Selection:** Choose different regions to view specific tree data.
- 🗺️ **Tree Locations:** Click on locations to see detailed plantation information.
- 🎨 **Modern UI:** Styled with custom CSS for a clean, dark-themed interface.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/world-trees-globe.git
   cd world-trees-globe/my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

```
my-app/
├── public/
├── src/
│   ├── App.js
│   ├── App.css
│   ├── worldtreeglobe.js
│   └── ...
├── package.json
└── ...
```

- **App.js:** Main React component.
- **App.css:** Custom styles for the app.
- **worldtreeglobe.js:** 3D globe visualization component.

## Customization

- **Add or update tree data** in `worldtreeglobe.js` as needed.
- **Modify styles** in `App.css` to change the look and feel.

## Deployment

To build the app for production:
```bash
npm run build
```
The optimized build will be in the `build/` folder.

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Made with ❤️ using React and Three.js*