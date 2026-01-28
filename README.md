# LTG STEM - Blockly Visual Programming for STEM Education

![Blockly STEM](https://img.shields.io/badge/Blockly-12.3.1-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)

A visual programming editor built with Blockly for STEM education, featuring Bluetooth connectivity to ESP32 microcontrollers and IoT devices.

## 🌟 Features

- **🧩 Visual Block Programming**: Drag-and-drop block-based programming interface powered by Blockly
- **📱 Bluetooth Connectivity**: Connect to ESP32 and other BLE-enabled devices via Web Bluetooth API
- **🔄 Multi-Language Code Generation**: Convert visual blocks to Python or JavaScript code
- **💾 Project Management**: Save and load projects using browser localStorage
- **⚡ Real-time Execution**: Run programs directly on connected hardware devices
- **🎨 Modern UI**: Responsive interface built with React, Tailwind CSS, and Radix UI components
- **🌐 Cross-Platform**: Works in any modern web browser with Bluetooth support

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser with Web Bluetooth support (Chrome, Edge, Opera)

### Installation

```bash
# Clone the repository
git clone https://github.com/TranNgocTanDat/ltg-stem.git
cd ltg-stem

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing

### Visual Programming
- **Blockly 12.3.1** - Visual programming library
- Custom block definitions for STEM education
- Python and JavaScript code generators

### Hardware Communication
- **Web Bluetooth API** - Direct browser-to-device communication
- ESP32 microcontroller support
- BLE service/characteristic handling

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **shadcn/ui** style components

## 📁 Project Structure

```
ltg-stem/
├── src/
│   ├── blockly/              # Blockly editor and runtime
│   │   ├── BlocklyEditor.tsx # Main editor component
│   │   ├── theme/           # Custom Blockly themes
│   │   └── runtime/         # Code execution engine
│   ├── bluetooth/           # Bluetooth device management
│   │   └── bleManager.ts    # BLE connection handler
│   ├── components/          # Reusable React components
│   │   └── ui/             # UI components (buttons, popovers, etc.)
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MasterLayout.tsx
│   ├── route/              # React Router configuration
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Static resources
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
├── public/                 # Static files
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔌 Bluetooth Connection

The application uses the Web Bluetooth API to connect to ESP32 devices:

1. Click the Bluetooth connect button
2. Select your ESP32 device from the browser dialog
3. Once connected, you can run programs on the device

**Note**: Web Bluetooth is only available in secure contexts (HTTPS or localhost) and requires user interaction.

### Supported Devices
- ESP32 with BLE support
- Custom BLE characteristics for RGB control and data transfer

See `readmetest.md` for example BLE connection code.

## 🎓 Educational Use

This platform is designed for STEM education, allowing students to:
- Learn programming concepts through visual blocks
- Control real hardware devices
- Experiment with IoT and embedded systems
- Transition from visual to text-based programming

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source. Please add a LICENSE file to specify terms.

## 🌐 Browser Compatibility

- ✅ Chrome 56+ (recommended)
- ✅ Edge 79+
- ✅ Opera 43+
- ❌ Firefox (Web Bluetooth not supported)
- ❌ Safari (Web Bluetooth not supported)

## 📚 Documentation

For more detailed information about what can be done with this repository, see [CAPABILITIES.md](./CAPABILITIES.md).

## 🐛 Known Issues

- Web Bluetooth is not supported in all browsers
- Device reconnection may require page refresh
- localStorage has storage limitations for large projects

## 📞 Support

If you have questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for STEM Education**
