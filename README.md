# ByteJump Backend

REST API backend untuk platform **ByteJump** — aplikasi komunitas developer yang menyediakan forum diskusi, blog post, AI chatbot (teks & image generation), to-do list manajemen proyek, serta agregasi artikel dari DEV.to.

## Fitur Utama

- **Autentikasi & Otorisasi** — Register, login, refresh token, dan logout menggunakan JWT (access token + refresh token via HTTP-only cookie). Role-based access control (`member` / `admin`).
- **AI Chatbot** — Chat teks menggunakan model Llama-3.1-8B-Instruct dan image generation menggunakan Stable Diffusion XL, keduanya melalui Hugging Face Inference API. Riwayat chat disimpan per user.
- **Sistem Balance** — Setiap user memiliki saldo poin (default 250). Chat teks memotong 50 poin, image generation memotong 75 poin. Top-up tersedia melalui endpoint transaksi.
- **Forum Diskusi** — Membuat thread, membalas, memberi like. Pemilik bisa mengedit thread miliknya sendiri.
- **Blog Post** — CRUD post (khusus admin) dengan upload banner gambar. Fitur pencarian berdasarkan judul dan sortir terbaru.
- **Artikel DEV.to** — Proxy ke DEV.to API untuk mengambil artikel dan tag.
- **To-Do List** — Manajemen task internal (khusus admin) dengan status flow: Not Done → Process → Done.
- **Manajemen User** — Update profil, upload foto profil, dan top-up saldo.
- **File Upload** — Upload gambar (JPEG/PNG) ke Google Drive via service account, menghasilkan link publik.

## Tech Stack

| Komponen | Teknologi | Versi |
|---|---|---|
| Runtime | Node.js | — |
| Framework | Express | ^5.1.0 |
| Database | MongoDB (Atlas) | — |
| ORM | Prisma Client | ^5.14.0 |
| Autentikasi | jsonwebtoken | ^9.0.2 |
| Password Hashing | bcryptjs | ^3.0.2 |
| Validasi | Joi | ^17.13.3 |
| AI Inference | @huggingface/inference | ^4.0.6 |
| File Storage | Google Drive API (googleapis) | ^150.0.1 |
| File Upload | Multer (memory storage) | ^2.0.1 |
| HTTP Client | Axios | ^1.10.0 |
| Streaming | streamifier | ^0.1.1 |

## Struktur Proyek

```
bytejump_backend/
├── index.js                    # Entry point — setup Express, CORS, dan mount semua router
├── package.json                # Manifest & dependencies
├── .env.example                # Template environment variables
├── .env                        # Environment variables (JANGAN di-commit)
├── .gitignore
├── prisma/
│   ├── schema.prisma           # Skema database (model User, Chat, Post, Forum, todolist)
│   ├── prisma.js               # Singleton Prisma Client
│   └── seed.js                 # Seeder: generate 20 user dummy dengan Faker
└── src/
    ├── controllers/
    │   ├── auth.js              # Register, login, refresh token, logout
    │   ├── chatbot.js           # Chat teks (LLM) dan image generation
    │   ├── articles.js          # Proxy ke DEV.to API
    │   ├── post.js              # CRUD blog post + view counter
    │   ├── forum.js             # CRUD forum, like, dan reply
    │   ├── toDoList.js          # CRUD to-do list (admin only)
    │   └── user.js              # Update profil, foto profil, top-up
    ├── middlewares/
    │   ├── checkLogin.js        # Verifikasi JWT access token dari cookie
    │   ├── checkRole.js         # Cek role user (admin/member)
    │   ├── checkOwner.js        # Cek kepemilikan forum thread
    │   ├── business.js          # Cek & kurangi saldo user untuk fitur chatbot
    │   └── upload.js            # Konfigurasi Multer (memory storage, hanya JPEG/PNG)
    ├── routes/
    │   ├── index.js             # Barrel file — export semua router
    │   ├── auth.js              # /api/v1/auth/*
    │   ├── chatbot.js           # /api/v1/chatbot/*
    │   ├── articles.js          # /api/v1/articles/*
    │   ├── post.js              # /api/v1/post/*
    │   ├── forum.js             # /api/v1/forum/*
    │   ├── toDoList.js          # /api/v1/todolist/*
    │   └── user.js              # /api/v1/user/*
    └── utils/
        ├── googleDrive.js       # Upload file ke Google Drive via service account
        └── userSchema.js        # Joi validation schema untuk registrasi user
```

## Prasyarat

- **Node.js** (versi yang mendukung Express 5, direkomendasikan ≥ 18)
- **npm** (bawaan Node.js)
- **MongoDB** — bisa menggunakan MongoDB Atlas (cloud) atau instance lokal

## Instalasi dan Setup

### 1. Clone repository

```bash
git clone https://github.com/FabianKL21/bytejump_backend.git
cd bytejump_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment variables

Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya:

```bash
cp .env.example .env
```

Isi file `.env` di root proyek:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
ACCESS_TOKEN_SECRET=<random-hex-string-untuk-signing-jwt-access-token>
REFRESH_TOKEN_SECRET=<random-hex-string-untuk-signing-jwt-refresh-token>
HF_ACCESS_TOKEN=<hugging-face-api-token>
GDRIVEKEY=<google-drive-folder-id-untuk-upload>
CONFIGGDRIVE=<json-string-google-service-account-credentials>
DEVELOPER_API=https://dev.to/api/
```

| Variabel | Fungsi |
|---|---|
| `DATABASE_URL` | Connection string MongoDB (Atlas atau lokal) |
| `ACCESS_TOKEN_SECRET` | Secret key untuk menandatangani JWT access token (expire 6 jam) |
| `REFRESH_TOKEN_SECRET` | Secret key untuk menandatangani JWT refresh token (expire 24 jam) |
| `HF_ACCESS_TOKEN` | Token API Hugging Face untuk mengakses model LLM dan image generation |
| `GDRIVEKEY` | ID folder Google Drive tempat file di-upload |
| `CONFIGGDRIVE` | JSON string credential service account Google (untuk Google Drive API) |
| `DEVELOPER_API` | Base URL API DEV.to untuk mengambil artikel (default: `https://dev.to/api/`) |

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. (Opsional) Jalankan seeder

Mengisi database dengan 20 user dummy:

```bash
node prisma/seed.js
```

## Cara Menjalankan

### Development (Auto-reload dengan Nodemon)

```bash
npm run dev
```

### Production

```bash
npm start
```

Server berjalan di `http://localhost:3000`.

CORS dikonfigurasi untuk menerima request dari:
- `http://localhost:5173` (frontend dev)
- `https://bytejump.vercel.app` (production)

## Cara Testing

<!-- TODO: konfirmasi apakah ada rencana menambah test framework. Saat ini belum ada test yang diimplementasikan. -->

Belum ada test suite yang dikonfigurasi. Script `npm test` saat ini hanya menampilkan pesan error placeholder.

## Penggunaan / API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Auth (`/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | ✗ | Registrasi user baru. Body: `{ user_email, user_password, user_confirmation_password, user_nama }` |
| POST | `/auth/login` | ✗ | Login. Body: `{ user_email, user_password }`. Mengembalikan access token dan set refresh token di cookie. |
| GET | `/auth/refreshtoken` | Cookie | Mendapatkan access token baru menggunakan refresh token dari cookie. |
| GET | `/auth/logout` | Cookie | Logout dan hapus refresh token. |

### Chatbot (`/chatbot`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/chatbot/chat` | ✓ (login, saldo ≥ 50) | Kirim pesan teks ke AI. Body: `{ input }`. Memotong 50 poin. |
| POST | `/chatbot/image` | ✓ (login, saldo ≥ 75) | Generate gambar dari teks. Body: `{ input }`. Memotong 75 poin. |
| GET | `/chatbot/chat` | ✓ | Ambil riwayat chat user yang sedang login. |

### Articles (`/articles`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/articles/tags` | ✗ | Ambil daftar tag dari DEV.to. |
| GET | `/articles` | ✗ | Ambil artikel. Query param: `?tags=<tag>` (opsional). |
| GET | `/articles/:top` | ✗ | Ambil top artikel. |

### Post (`/post`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/post` | ✓ (admin) | Buat post baru. Body (multipart): `post_title`, `post_short_desc`, `post_long_desc`, `post_banner` (file, opsional). |
| PUT | `/post/:id` | ✓ (admin) | Update post. Body (multipart): field yang ingin diubah. |
| PUT | `/post/view/:id` | ✗ | Increment view count sebuah post. |
| DELETE | `/post/:id` | ✓ (admin) | Soft-delete post. |
| GET | `/post` | ✗ | Ambil semua post. Query param: `?view=<number>` (opsional). |
| GET | `/post/newest` | ✗ | Ambil semua post diurutkan terbaru. |
| GET | `/post/:post_title` | ✗ | Cari post berdasarkan judul (case-insensitive, partial match). |

### Forum (`/forum`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/forum` | ✓ | Buat thread forum baru. Body (multipart): `forum_title`, `forum_desc`, `forum_img` (file, opsional). |
| PUT | `/forum/:id` | ✓ (owner) | Update thread milik sendiri. Body (multipart): field yang ingin diubah. |
| POST | `/forum/like/:id` | ✗ | Beri like pada thread. |
| POST | `/forum/reply/:id` | ✓ | Balas thread. Body: `{ reply }`. |
| DELETE | `/forum/:id` | ✓ (admin) | Soft-delete thread. |
| GET | `/forum` | ✗ | Ambil semua thread (yang belum dihapus). |

### To-Do List (`/todolist`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/todolist` | ✓ (admin) | Buat task baru. Body: `{ todolist_desc }`. |
| PUT | `/todolist/:id` | ✓ (admin) | Update status task (Not Done → Process → Done). |
| DELETE | `/todolist/:id` | ✓ (admin) | Soft-delete task. |
| GET | `/todolist` | ✓ (admin) | Ambil semua task. Query params: `?status=<status>&worker=<nama>`. |
| GET | `/todolist/:desc` | ✓ (admin) | Cari task berdasarkan deskripsi (case-insensitive, partial match). |

### User (`/user`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| PUT | `/user/personal` | ✓ | Update data personal (email, password, nama). Body: `{ user_email, user_password, user_nama }` (semua opsional). |
| PUT | `/user/profpic` | ✓ | Update foto profil. Body (multipart): `profpic` (file). |
| POST | `/user/topup` | ✓ | Top-up saldo. Body: `{ trans_detail, trans_total, tambahPoin }`. |

### Contoh Request

**Register:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "john@example.com",
    "user_password": "password123",
    "user_confirmation_password": "password123",
    "user_nama": "John Doe"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "user_email": "john@example.com",
    "user_password": "password123"
  }'
```

**Chat dengan AI (menggunakan cookie dari login):**

```bash
curl -X POST http://localhost:3000/api/v1/chatbot/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{ "input": "Apa itu REST API?" }'
```

## Lisensi

ISC
