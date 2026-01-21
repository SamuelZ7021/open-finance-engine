# Open Finance Engine

## 🚀 The Future of Open Finance Infrastructure

**Open Finance Engine** is a high-performance, enterprise-grade financial core designed to power the next generation of fintech applications. Built with a robust **Java Spring Boot** backend and a sleek, responsive **React/TypeScript** frontend, this engine provides the essential building blocks for banking, investment, and analytics platforms.

---

### 🌟 Key Features

*   **💰 Investment Portfolio Management**: Real-time tracking of asset performance, buy/sell execution, and portfolio diversification analytics.
*   **📊 Advanced Analytics**: Interactive, charts for income vs. expenses and balance evolution, powered by dynamic data visualization.
*   **🔐 Bank-Grade Security**: Secure authentication (JWT), role-based access control, and encrypted data transmission.
*   **⚡ High Performance**: Optimized for low-latency transactions and scalable to millions of users.
*   **📱 Modern UX/UI**: A premium, intuitive interface designed for maximum user engagement and retention.

### 🛠️ Tech Stack

#### Backend (The Core)
*   **Java 17** & **Spring Boot**: Stability and speed.
*   **PostgreSQL**: Reliable transactional data storage.
*   **Docker**: Containerized for easy deployment.

#### Frontend (The Experience)
*   **React** & **TypeScript**: Type-safe, interactive UI.
*   **TailwindCSS**: Modern, responsive styling.
*   **Recharts**: Beautiful data visualization.
*   **Zustand**: Lightweight state management.

### 🚀 Getting Started

#### Option 1: Docker (Recommended for Mac, Windows, Linux)
The easiest way to run the application is using Docker. Ensure you have Docker installed.

1.  **Run the application**:
    ```bash
    docker-compose up --build
    ```
2.  **Access the application**:
    *   Frontend: [http://localhost:80](http://localhost:80)
    *   Backend: [http://localhost:8080](http://localhost:8080)

#### Option 2: Manual Setup

1.  **Clone the repository**
2.  **Start the Backend**:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
3.  **Start the Frontend**:
    ```bash
    cd openFinance-frontend
    npm install
    npm run dev
    ```

---

