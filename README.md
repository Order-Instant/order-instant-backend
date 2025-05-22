# Order Instant Backend

## Overview

This repository contains the main source code for the Order Instant Backend.

## Getting Started

### Requirements

- Node.js (version 16 or higher recommended)
- MongoDB (version 8 or higher recommended)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/order-instant/order-instant-backend.git
    cd order-instant-backend
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

3. **Run the project:**
    ```sh
    node src/index.mjs
    ```

## Configuration

- Create a `.env` file in the root directory to configure environment variables.
- Copy the example file `.env.example` (if available) or define your own variables such as:
```env
GMAIL_USER=''
GMAIL_PASS=''
CLIENT_IP='https://orderinstantmultipurpose.com/'
```
- Make sure to add .env to your .gitignore to keep sensitive information secure.
- Adjust other configuration files if needed, depending on your project setup.

## Contributing

Contributions are welcome! Please fork the repo, make changes, and submit pull requests. Open issues for bugs or feature requests.
