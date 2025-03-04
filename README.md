# AI-Powered Troubleshooting and Guided Learning System for Automobile Industry

## Overview

This project aims to develop a web-based platform that leverages a Large Language Model (LLM) to provide instant solutions for vehicle issues. The platform includes an interactive repair learning path with step-by-step tutorials, an issue severity indicator to classify problems as minor or major, real-time visualization using D3.js or Three.js, AR-based guidance, and integration with OBD-II sensor data for diagnostics. User-reported issues are collected for data-driven vehicle insights.

## Key Features

- **Instant Solutions:** Leverage LLM integration to provide instant solutions for vehicle issues.
- **Interactive Repair Learning Path:** Step-by-step tutorials for vehicle repair.
- **Issue Severity Indicator:** Classify problems as minor or major.
- **Real-time Visualization:** Use D3.js or Three.js for real-time visualization.
- **AR-Based Guidance:** Support AR-based guidance using ARCore.
- **Data-Driven Insights:** Collect user-reported issues for data-driven vehicle insights.
- **OBD-II Sensor Data Integration:** Integrate with OBD-II sensor data for diagnostics.

## Tech Stack

- **Frontend:**
  - React.js
  - Tailwind CSS
  - D3.js / Three.js
  - ARCore

- **Backend:**
  - Flask / FastAPI
  - Ollama / Hugging Face for LLM integration
  - MongoDB
  - ChromaDB

## Getting Started

### Prerequisites

- Node.js
- Python 3.x
- MongoDB
- OBD-II Adapter

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/auto-troubleshoot.git
    cd auto-troubleshoot
    ```

2. **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm start
    ```

3. **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    python app.py
    ```

4. **Database Setup**
    - Ensure MongoDB is running locally or use a cloud MongoDB service.
    - Configure the database connection in the backend configuration.

### Usage

- Access the web application at `http://localhost:3000`.
- Use the interactive repair learning path for vehicle repair tutorials.
- Report issues and classify them using the issue severity indicator.
- Visualize vehicle diagnostics in real-time using D3.js or Three.js.
- Use AR-based guidance for hands-on repair assistance.
- Connect to the OBD-II adapter for real-time vehicle diagnostics.

### Directory Structure

```
auto-troubleshoot/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   ├── controllers/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── ...
└── README.md
```

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Flask](https://flask.palletsprojects.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Ollama](https://ollama.com/)
- [Hugging Face](https://huggingface.co/)
- [MongoDB](https://www.mongodb.com/)
- [ChromaDB](https://chromadb.org/)
- [ARCore](https://developers.google.com/ar)