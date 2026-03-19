# FraudGuard

> AI-powered document integrity verification — detect tampering and signature forgery before it costs you.

---

## Description

**FraudGuard** is a RESTful API service built with **Python** and **FastAPI**, designed to detect tampering and signature forgery in digital and scanned documents using image processing and machine learning techniques.

Document fraud — altered contracts, forged signatures, manipulated certificates — is increasingly difficult to catch manually. FraudGuard provides an automated, scalable backend pipeline that analyzes submitted documents, flags integrity violations, and returns structured forensic reports. It is built to integrate into any document verification workflow via a clean REST interface.

---

## Team Members

| Name                   | Roll No. |
| ---------------------- | -------- |
| Muhammad Luqman Arshad | 23L-0794 |

---

## Tech Stack

| Layer              | Technology                |
| ------------------ | ------------------------- |
| **Backend**        | Python 3.11+, FastAPI     |
| **Database**       | SQLite3                   |
| **ORM**            | SQLAlchemy                |
| **Authentication** | JWT (via `fastapi-users`) |
| **Image Storage**  | ImageKit.io               |
| **Frontend**       | TBD                       |

---

## Prerequisites

Ensure the following are installed before proceeding:

- [Python 3.11+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) — package manager
- [Git](https://git-scm.com/)
- An [ImageKit.io](https://imagekit.io/) account (free tier is sufficient)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Raumdeuter007/FraudGuard.git
cd FraudGuard
```

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

---

## ImageKit.io Setup

FraudGuard uses [ImageKit.io](https://imagekit.io/) to store and serve uploaded document images.

1. **Create an account** at [imagekit.io](https://imagekit.io/) and log in to the dashboard.
2. **Get your credentials** from **Developer Options**:
   - `Public Key`
   - `Private Key`
   - `URL Endpoint` (format: `https://ik.imagekit.io/your_imagekit_id`)
3. **Paste these values** into your `.env` file as shown above.
4. Uploaded documents will be stored under the `/fraudguard/` folder in your ImageKit media library by default.

---

## How to Run

### Backend

```bash
cd backend
uv run main.py
```

The server will start at `http://localhost:8000`

| URL                           | Description                   |
| ----------------------------- | ----------------------------- |
| `http://localhost:8000`       | Base API URL                  |
| `http://localhost:8000/docs`  | Swagger UI (interactive docs) |
| `http://localhost:8000/redoc` | ReDoc documentation           |

### Frontend

> 🚧 Frontend stack is TBD — instructions will be added here once decided.

---

## Project Structure

```
fraudguard/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── files/
│   │   ├── imagekit/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── main.py
├── frontend/                # TBD
└── README.md
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, issues, or collaboration:

| Name                   | Role                         | Email                                                       |
| ---------------------- | ---------------------------- | ----------------------------------------------------------- |
| Muhammad Luqman Arshad | Lead / Backend / AI Engineer | [luqmanarshad05@gmail.com](mailto:luqmanarshad05@gmail.com) |

Or open an [issue](https://github.com/Raumdeuter007/FraudGuard/issues) on GitHub.
