# 🃏 Call Break Score Calculator

A simple **mobile-friendly Call Break score calculator** made for personal use and fun while playing Call Break with friends.

🌐 **Live Demo:** https://call-break-calculator-delta.vercel.app

---

## ✨ Features

* 📱 Mobile-friendly design
* 👥 Supports 3, 4, and 5 players
* 🎯 Custom player names
* 🔢 Multiple rounds
* 🧮 Automatic score calculation
* 📊 Round-wise score tracking
* 🏆 Final player ranking
* 💾 Saves the current game locally
* 🌙 Dark & light mode
* ✏️ Edit previous rounds

---

## 🎯 Scoring Rules

### Bid Failed

If **tricks < bid**:

`Score = Bid × -10`

Example:
`Bid 5, Tricks 4 → -50`

### Exact Bid

If **tricks = bid**:

`Score = Bid × 10`

Example:
`Bid 5, Tricks 5 → +50`

### Bid Exceeded

If **tricks > bid**:

`Score = (Bid × 10) + (Tricks - Bid)`

Example:
`Bid 5, Tricks 7 → +52`

---

## 👥 Player Rules

| Players | Tricks |
| ------: | -----: |
|       3 |     17 |
|       4 |     13 |
|       5 |     10 |

The calculator validates the total tricks for each round according to the number of players.

---

## 🛠️ Tech Stack

* React
* TypeScript
* Vite
* Vanilla CSS
* Vitest
* LocalStorage

---

## 🚀 Run Locally

```bash
git clone https://github.com/Anant13-spec/call-break-calculator.git
cd call-break-calculator
npm install
npm run dev
```

---

## ⚠️ Personal Use

This project was made **for personal use and fun** while playing Call Break with friends.

It is not an official Call Break scoring application, and the scoring rules are based on the custom rules used in this project.

---

## 👨‍💻 Author

**Anant Jain**

GitHub: https://github.com/Anant13-spec
