import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Prisma v7 requires a driver adapter — connection URL is read from DATABASE_URL env var
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // ─────────────────────────────────────────────
    // Badges
    // ─────────────────────────────────────────────
    console.log('Creating badges...');

    await prisma.badge.createMany({
        skipDuplicates: true,
        data: [
            {
                name: 'First Step',
                description: 'Selesaikan lesson pertamamu.',
                icon: '👣',
                condition_type: 'EXERCISE_COUNT',
                condition_value: 1,
            },
            {
                name: 'On Fire',
                description: 'Pertahankan streak 7 hari berturut-turut.',
                icon: '🔥',
                condition_type: 'STREAK',
                condition_value: 7,
            },
            {
                name: 'Century',
                description: 'Kumpulkan 100 XP.',
                icon: '💯',
                condition_type: 'XP',
                condition_value: 100,
            },
            {
                name: 'HTML Master',
                description: 'Selesaikan semua lesson di Course HTML.',
                icon: '🧡',
                condition_type: 'COURSE_COMPLETE',
                condition_value: 1,
            },
            {
                name: 'Git Initiate',
                description: 'Selesaikan semua lesson di Course Git & GitHub.',
                icon: '🐙',
                condition_type: 'COURSE_COMPLETE',
                condition_value: 1,
            },
        ],
    });

    // ─────────────────────────────────────────────
    // Course: HTML (Phase: CORE)
    // ─────────────────────────────────────────────
    console.log('Creating HTML course...');

    const htmlCourse = await prisma.course.upsert({
        where: { slug: 'html' },
        update: {},
        create: {
            title: 'HTML',
            slug: 'html',
            description:
                'Pelajari fondasi web: struktur halaman dengan HTML. Mulai dari elemen dasar hingga form dan tabel.',
            icon: '🧡',
            color: '#E44D26',
            order: 1,
            phase: 'CORE',
        },
    });

    // Module 1: HTML Dasar
    const htmlModule1 = await prisma.module.upsert({
        where: { slug: 'html-dasar' },
        update: {},
        create: {
            course_id: htmlCourse.id,
            title: 'HTML Dasar',
            slug: 'html-dasar',
            description: 'Mengenal elemen-elemen dasar HTML dan cara kerjanya.',
            order: 1,
        },
    });

    // Module 1 → Lesson 1
    const htmlL1 = await prisma.lesson.upsert({
        where: { slug: 'apa-itu-html' },
        update: {},
        create: {
            module_id: htmlModule1.id,
            title: 'Apa itu HTML?',
            slug: 'apa-itu-html',
            content: `# Apa itu HTML?

**HTML** (HyperText Markup Language) adalah bahasa markup standar untuk membuat halaman web.

HTML mendeskripsikan **struktur** halaman web menggunakan elemen-elemen yang dilambangkan oleh **tag**.

## Contoh Dokumen HTML

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Halaman Pertamaku</title>
  </head>
  <body>
    <h1>Halo, Dunia!</h1>
    <p>Ini adalah paragraf pertamaku.</p>
  </body>
</html>
\`\`\`

- \`<!DOCTYPE html>\` → memberitahu browser bahwa ini adalah dokumen HTML5
- \`<html>\` → elemen root dari halaman
- \`<head>\` → berisi meta-informasi (tidak ditampilkan)
- \`<body>\` → berisi konten yang ditampilkan di browser`,
            xp_reward: 20,
            order: 1,
            type: 'LESSON',
        },
    });

    await createExercises(htmlL1.id, 'HTML', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question: 'Apa kepanjangan dari HTML?',
            options: [
                'HyperText Markup Language',
                'HighText Machine Language',
                'Hyperlink and Text Markup Language',
                'Home Tool Markup Language',
            ],
            correct_answer: 'HyperText Markup Language',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'MULTIPLE_CHOICE',
            question: 'Tag HTML mana yang benar untuk membuat heading terbesar (paling penting)?',
            options: ['<h6>', '<heading>', '<h1>', '<head>'],
            correct_answer: '<h1>',
            xp_reward: 5,
        },
        {
            order: 3,
            type: 'FILL_BLANK',
            question:
                'Lengkapi kode berikut untuk membuat dokumen HTML yang valid:\n```html\n<!___ html>\n<html>\n  <head><title>Test</title></head>\n  <body></body>\n</html>```',
            options: null,
            correct_answer: 'DOCTYPE',
            hint: 'Deklarasi ini selalu berada di baris pertama dokumen HTML.',
            xp_reward: 5,
        },
    ]);

    // Module 1 → Lesson 2
    const htmlL2 = await prisma.lesson.upsert({
        where: { slug: 'elemen-dan-tag-html' },
        update: {},
        create: {
            module_id: htmlModule1.id,
            title: 'Elemen & Tag HTML',
            slug: 'elemen-dan-tag-html',
            content: `# Elemen & Tag HTML

Elemen HTML terdiri dari **opening tag**, **konten**, dan **closing tag**.

\`\`\`
<tagname>Konten di sini...</tagname>
\`\`\`

## Elemen Umum

| Tag | Fungsi |
|-----|--------|
| \`<p>\` | Paragraf |
| \`<a>\` | Hyperlink |
| \`<img>\` | Gambar |
| \`<ul>\` / \`<ol>\` | Daftar |
| \`<div>\` | Kontainer blok |
| \`<span>\` | Kontainer inline |

## Self-closing Tags

\`\`\`html
<img src="foto.jpg" alt="Foto saya" />
<br />
<hr />
<input type="text" />
\`\`\``,
            xp_reward: 20,
            order: 2,
            type: 'LESSON',
        },
    });

    await createExercises(htmlL2.id, 'HTML', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question: 'Tag HTML mana yang digunakan untuk membuat hyperlink (tautan)?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correct_answer: '<a>',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'FILL_BLANK',
            question:
                'Lengkapi atribut yang hilang:\n```html\n<img ___ ="logo.png" alt="Logo" />\n```',
            options: null,
            correct_answer: 'src',
            hint: 'Atribut ini menentukan sumber/lokasi gambar.',
            xp_reward: 5,
        },
        {
            order: 3,
            type: 'MULTIPLE_CHOICE',
            question: 'Manakah yang merupakan self-closing tag?',
            options: ['<p>', '<div>', '<br>', '<span>'],
            correct_answer: '<br>',
            xp_reward: 5,
        },
    ]);

    // Module 2: Form & Tabel
    const htmlModule2 = await prisma.module.upsert({
        where: { slug: 'form-dan-tabel' },
        update: {},
        create: {
            course_id: htmlCourse.id,
            title: 'Form & Tabel',
            slug: 'form-dan-tabel',
            description: 'Belajar membuat form interaktif dan tabel data di HTML.',
            order: 2,
        },
    });

    // Module 2 → Lesson 3
    const htmlL3 = await prisma.lesson.upsert({
        where: { slug: 'html-form' },
        update: {},
        create: {
            module_id: htmlModule2.id,
            title: 'HTML Form',
            slug: 'html-form',
            content: `# HTML Form

Form digunakan untuk mengumpulkan input dari pengguna.

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Nama:</label>
  <input type="text" id="name" name="name" />
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
  <button type="submit">Kirim</button>
</form>
\`\`\`

## Atribut \`<input>\`

- \`type\` — jenis input: \`text\`, \`email\`, \`password\`, \`checkbox\`, \`radio\`, \`number\`, dll.
- \`name\` — nama field yang dikirim ke server
- \`placeholder\` — teks petunjuk di dalam field
- \`required\` — field wajib diisi`,
            xp_reward: 20,
            order: 1,
            type: 'LESSON',
        },
    });

    await createExercises(htmlL3.id, 'HTML', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question: 'Atribut mana pada tag `<form>` yang menentukan metode pengiriman data?',
            options: ['action', 'method', 'type', 'submit'],
            correct_answer: 'method',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'FILL_BLANK',
            question:
                'Lengkapi tag input untuk kolom email:\n```html\n<input type="___" name="email" />\n```',
            options: null,
            correct_answer: 'email',
            hint: 'Gunakan tipe khusus HTML5 yang memvalidasi format email.',
            xp_reward: 5,
        },
        {
            order: 3,
            type: 'MULTIPLE_CHOICE',
            question: 'Tag HTML mana yang digunakan untuk membuat tombol submit?',
            options: [
                '<input type="submit">',
                '<button type="submit">',
                'Keduanya benar',
                'Tidak ada yang benar',
            ],
            correct_answer: 'Keduanya benar',
            xp_reward: 5,
        },
    ]);

    // Module 2 → Lesson 4
    const htmlL4 = await prisma.lesson.upsert({
        where: { slug: 'html-tabel' },
        update: {},
        create: {
            module_id: htmlModule2.id,
            title: 'HTML Tabel',
            slug: 'html-tabel',
            content: `# HTML Tabel

Tabel digunakan untuk menampilkan data dalam baris dan kolom.

\`\`\`html
<table>
  <thead>
    <tr>
      <th>Nama</th>
      <th>Usia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Budi</td>
      <td>20</td>
    </tr>
  </tbody>
</table>
\`\`\`

- \`<table>\` → kontainer tabel
- \`<thead>\` → bagian header tabel
- \`<tbody>\` → bagian isi tabel
- \`<tr>\` → baris (table row)
- \`<th>\` → sel header (bold & center by default)
- \`<td>\` → sel data`,
            xp_reward: 20,
            order: 2,
            type: 'LESSON',
        },
    });

    await createExercises(htmlL4.id, 'HTML', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question: 'Tag apa yang digunakan untuk mendefinisikan baris tabel?',
            options: ['<td>', '<th>', '<tr>', '<row>'],
            correct_answer: '<tr>',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'FILL_BLANK',
            question:
                'Lengkapi struktur tabel:\n```html\n<table>\n  <___>\n    <tr><th>Nama</th></tr>\n  </___>\n</table>```',
            options: null,
            correct_answer: 'thead',
            hint: 'Bagian kepala tabel menggunakan tag semantik khusus.',
            xp_reward: 5,
        },
        {
            order: 3,
            type: 'MULTIPLE_CHOICE',
            question: 'Perbedaan antara `<th>` dan `<td>` adalah...',
            options: [
                '<th> untuk header, <td> untuk data biasa',
                '<th> untuk kolom, <td> untuk baris',
                'Tidak ada perbedaan',
                '<td> lebih besar dari <th>',
            ],
            correct_answer: '<th> untuk header, <td> untuk data biasa',
            xp_reward: 5,
        },
    ]);

    // ─────────────────────────────────────────────
    // Course: Git & GitHub (Phase: CORE)
    // ─────────────────────────────────────────────
    console.log('Creating Git & GitHub course...');

    const gitCourse = await prisma.course.upsert({
        where: { slug: 'git-dan-github' },
        update: {},
        create: {
            title: 'Git & GitHub',
            slug: 'git-dan-github',
            description:
                'Kuasai version control dengan Git dan kolaborasi kode menggunakan GitHub.',
            icon: '🐙',
            color: '#171515',
            order: 2,
            phase: 'CORE',
        },
    });

    const gitModule1 = await prisma.module.upsert({
        where: { slug: 'git-dasar' },
        update: {},
        create: {
            course_id: gitCourse.id,
            title: 'Git Dasar',
            slug: 'git-dasar',
            description: 'Pelajari perintah-perintah dasar Git untuk mengelola versi kode.',
            order: 1,
        },
    });

    // Git Lesson 1
    const gitL1 = await prisma.lesson.upsert({
        where: { slug: 'apa-itu-git' },
        update: {},
        create: {
            module_id: gitModule1.id,
            title: 'Apa itu Git?',
            slug: 'apa-itu-git',
            content: `# Apa itu Git?

**Git** adalah sistem version control terdistribusi yang paling populer. Git memungkinkan kamu untuk:

- Melacak perubahan kode dari waktu ke waktu
- Bekerja sama dengan developer lain
- Kembali ke versi sebelumnya jika ada kesalahan

## Perintah Dasar Git

\`\`\`bash
git init           # inisialisasi repository baru
git status         # cek status perubahan
git add .          # tambahkan semua file ke staging
git commit -m "pesan commit"
git log --oneline  # lihat riwayat commit
\`\`\``,
            xp_reward: 20,
            order: 1,
            type: 'LESSON',
        },
    });

    await createExercises(gitL1.id, 'GIT', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question: 'Perintah Git mana yang digunakan untuk memulai repository baru?',
            options: ['git start', 'git init', 'git new', 'git create'],
            correct_answer: 'git init',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'FILL_BLANK',
            question:
                'Lengkapi perintah untuk menambahkan SEMUA file ke staging area:\n```bash\ngit ___ .\n```',
            options: null,
            correct_answer: 'add',
            hint: 'Perintah ini mempersiapkan file sebelum di-commit.',
            xp_reward: 5,
        },
    ]);

    // Git Lesson 2
    const gitL2 = await prisma.lesson.upsert({
        where: { slug: 'git-branch-dan-merge' },
        update: {},
        create: {
            module_id: gitModule1.id,
            title: 'Git Branch & Merge',
            slug: 'git-branch-dan-merge',
            content: `# Git Branch & Merge

**Branch** memungkinkan kamu bekerja pada fitur baru tanpa mengganggu kode utama.

\`\`\`bash
git branch nama-branch          # buat branch baru
git checkout -b nama-branch     # buat & langsung pindah
git switch nama-branch          # pindah branch (cara modern)
git checkout main && git merge nama-branch   # merge ke main
git branch -d nama-branch       # hapus branch
\`\`\``,
            xp_reward: 20,
            order: 2,
            type: 'LESSON',
        },
    });

    await createExercises(gitL2.id, 'GIT', [
        {
            order: 1,
            type: 'MULTIPLE_CHOICE',
            question:
                'Perintah mana yang membuat branch baru DAN langsung berpindah ke branch tersebut?',
            options: [
                'git branch -new',
                'git checkout -b nama-branch',
                'git switch --create nama-branch',
                'B dan C benar',
            ],
            correct_answer: 'B dan C benar',
            xp_reward: 5,
        },
        {
            order: 2,
            type: 'FILL_BLANK',
            question:
                'Lengkapi perintah untuk menggabungkan branch `feature/login` ke `main`:\n```bash\ngit checkout main\ngit ___ feature/login\n```',
            options: null,
            correct_answer: 'merge',
            hint: 'Perintah ini menggabungkan dua branch menjadi satu.',
            xp_reward: 5,
        },
    ]);

    console.log('✅ Seeding complete!');
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

type ExerciseSeed = {
    order: number;
    type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'CODE_CHALLENGE' | 'FIX_THE_BUG';
    question: string;
    options: string[] | null;
    correct_answer: string;
    xp_reward: number;
    hint?: string;
};

async function createExercises(
    lessonId: string,
    language: 'HTML' | 'CSS' | 'JS' | 'TYPESCRIPT' | 'REACT' | 'GIT' | 'SQL',
    exercises: ExerciseSeed[],
) {
    for (const ex of exercises) {
        await prisma.exercise.create({
            data: {
                lesson_id: lessonId,
                order: ex.order,
                type: ex.type,
                question: ex.question,
                options: ex.options ?? undefined,
                correct_answer: ex.correct_answer,
                xp_reward: ex.xp_reward,
                hint: ex.hint ?? null,
                language,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
