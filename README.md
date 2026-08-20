# 🃏 Call Break Score Calculator

A simple, mobile-first **Call Break Score Calculator** made for quickly calculating and tracking scores while playing Call Break with friends.

🌐 **Live Demo:** [Call Break Score Calculator](https://call-break-calculator-delta.vercel.app)

> ⚠️ **Personal Use:** This project was created primarily for **personal use and fun** while playing Call Break with friends. It is not intended to be a commercial product or an official Call Break scoring application. The scoring rules are based on the custom rules used by the creator.

---

## ✨ Features

* 📱 Mobile-first responsive design
* 👥 Support for 3, 4, and 5 players
* 🎯 Custom player names
* 🔢 Configurable number of rounds
* 🧮 Automatic score calculation
* 📊 Round-by-round score tracking
* 🏆 Automatic final rankings
* 💾 Game persistence using LocalStorage
* ✏️ Edit previous round
* 🔄 Start a new game
* 🌙 Dark and light mode
* ⚡ Fast and lightweight
* 🎨 Custom Call Break branding
* 📱 Designed for comfortable mobile use

---

## 🎯 Scoring Rules

The calculator follows the custom Call Break scoring rules used in this project.

### ❌ Bid Failed

If the number of tricks won is less than the bid:

```text
Score = Bid × -10
```

**Example:**

```text
Bid:     5
Tricks:  4
Score:  -50
```

---

### ✅ Exact Bid

If the number of tricks won exactly matches the bid:

```text
Score = Bid × 10
```

**Example:**

```text
Bid:     5
Tricks:  5
Score:  +50
```

---

### ➕ Bid Exceeded

If the number of tricks won is greater than the bid:

```text
Score = (Bid × 10) + (Tricks - Bid)
```

**Example:**

```text
Bid:     5
Tricks:  7
Score:  +52
```

The additional tricks are worth **1 point each**.

---

## 👥 Player & Trick Validation

The number of tricks in a round depends on the number of players.

| Players | Tricks Per Round | Maximum Bid |
| :-----: | :--------------: | :---------: |
|    3    |        17        |      17     |
|    4    |        13        |      13     |
|    5    |        10        |      10     |

The calculator validates that:

* Each bid is at least 1.
* Tricks cannot be negative.
* A player's bid cannot exceed the maximum tricks for the selected player count.
* A player's tricks cannot exceed the maximum tricks for the selected player count.
* The total tricks entered by all players must equal the total tricks available in the round.

---

## 📱 Mobile First

The application is designed primarily for mobile phones.

The interface uses:

* Large touch-friendly controls
* Responsive player cards
* Mobile-friendly number inputs
* Responsive typography
* No unnecessary horizontal scrolling
* Dark/light theme support
* Desktop responsive layout

The calculator can be opened directly from a phone browser and can also be added to the home screen.

---

## 🛠️ Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **Vanilla CSS**
* **Vitest**
* **Lucide React**
* **LocalStorage**

---

## 📂 Project Structure

```text
call-break-calculator/
│
├── public/
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── SetupScreen.tsx
│   │   ├── RoundEntry.tsx
│   │   ├── Scoreboard.tsx
│   │   ├── GameResult.tsx
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── scoring.ts
│   │   ├── validation.ts
│   │   └── scoring.test.ts
│   │
│   ├── types.ts
│   ├── App.tsx
│   └── ...
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

> The exact project structure may change as the application is developed.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### Clone the repository

```bash
git clone https://github.com/Anant13-spec/call-break-calculator.git
```

### Enter the project directory

```bash
cd call-break-calculator
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing

The project uses **Vitest** for automated testing of the scoring and validation logic.

Run the test suite using the test command configured in `package.json`.

The tests cover cases such as:

* Bid failed
* Exact bid
* Bid exceeded
* Maximum valid values
* Invalid bid/trick values
* 3-player round validation
* 4-player round validation
* 5-player round validation

---

## 💾 Data Persistence

The current game state is stored locally using **LocalStorage**.

This means the game can survive:

* Browser refreshes
* Accidental tab closures
* Returning to the application later on the same device/browser

### Important

LocalStorage is **device/browser-specific**.

A game saved on a laptop will not automatically appear on a phone.

---

## 🌐 Deployment

The application is deployed using **Vercel**.

### Live Application

https://call-break-calculator-delta.vercel.app

### Deployment

To deploy a new production version using Vercel:

```bash
vercel --prod
```

---

## 🔄 Updating the Project

Typical development workflow:

```bash
git add .
git commit -m "Describe your changes"
git push
```

For a new Vercel production deployment:

```bash
vercel --prod
```

---

## 🎨 Design

The application uses a clean and modern interface designed around quick score entry.

The design focuses on:

* Simplicity
* Readability
* Fast score entry
* Mobile usability
* Clear positive/negative scores
* Responsive layouts
* Dark/light themes

The project also includes custom Call Break branding and a dedicated application logo.

---

## 🔮 Possible Future Improvements

Possible future improvements include:

* 📲 Installable PWA
* 📴 Better offline support
* 📈 Player statistics
* 📚 Game history
* ☁️ Cloud synchronization
* 🔗 Game sharing
* 👤 Player profiles
* ⚙️ Custom scoring rules
* 🏆 Lifetime player rankings

These are **future ideas and are not currently implemented**.

---

## ⚠️ Personal Use & Disclaimer

This project was created primarily for **personal use and fun** while playing Call Break with friends.

It is **not intended to be a commercial product or an official Call Break scoring application**.

The scoring and validation rules implemented in this application are based on the custom rules used by the creator and may differ from rules used by other Call Break players or variants.

Feel free to explore, use, modify, and learn from the project.

---

## 👨‍💻 Author

### Anant Jain

Computer Science & Engineering Student

GitHub:
https://github.com/Anant13-spec

---

## 📄 License

No specific open-source license has currently been added to this project.

If a license is added in the future, this section will be updated accordingly.

---

⭐ If you find this little project useful, feel free to explore the code and use it for your own Call Break games.
