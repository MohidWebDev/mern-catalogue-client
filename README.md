# 🛒 MERN Catalogue — Frontend

> React frontend for the MERN Catalogue App. Lets users browse, add, edit, and delete products in real time.

---

## 🔗 Related Repository

This is the **frontend** half of a two-part project.
👉 **Backend repo:** [mern-catalogue-api](https://github.com/MohidWebDev/mern-catalogue-api.git)

> ⚠️ The backend must be running locally before you start the frontend.

---

## 🛠️ Tech Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React        | UI framework            |
| Vite         | Build tool & dev server |
| React Router | Client-side routing     |
| Tailwind CSS | Styling                 |
| Context API  | Auth state management   |

---

## ✨ Features

- 🔐 Login page with protected routes
- 📦 Product catalogue fetched live from the backend
- ➕ Add a new product via modal form
- ✏️ Edit a product inline on its detail page
- 🗑️ Delete a product with one click
- ⚡ All changes reflect instantly without page refresh

---

## 📁 Folder Structure

```
LOGIN-FORM-PROJECT/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx     # Login/logout state
│   ├── pages/
│   │   ├── Login.jsx           # Login screen
│   │   ├── Dashboard.jsx       # Product grid + Add + Delete
│   │   └── ProductDetails.jsx  # Single product view + Edit
│   ├── App.jsx                 # Route definitions
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── .env                        # API URL config (NOT pushed to GitHub)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Local Setup

### 1. Make sure the backend is running first

Follow setup instructions in the [backend repo](https://github.com/YOUR_USERNAME/mern-catalogue-api).
The API must be live at `http://localhost:5050`.

### 2. Clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/mern-catalogue-client.git
cd mern-catalogue-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your `.env` file

Create a file named `.env` in the root folder and add:

```
VITE_API_URL=http://localhost:5050
```

### 5. Run the development server

```bash
npm run dev
```

App starts at: **http://localhost:5173**

---

## 🔐 Default Login Credentials

```
Email:    example@gmail.com
Password: abc123
```

> This is a hardcoded dummy user for demo purposes. No real authentication is implemented.

---

## 🖥️ Pages Overview

| Route           | Page            | Description                         |
| --------------- | --------------- | ----------------------------------- |
| `/`             | Login           | Enter credentials to access the app |
| `/dashboard`    | Dashboard       | View all products, add or delete    |
| `/products/:id` | Product Details | View full info, edit the product    |

---

## 🔐 Environment Variables

| Variable       | Description                    |
| -------------- | ------------------------------ |
| `VITE_API_URL` | URL of the running backend API |

---

## 👤 Author

**Mohid Yaseen**
GitHub: [@MohidWebDev](https://github.com/MohidWebDev)
