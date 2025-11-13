# CricHeroes Assignment – Full Stack Developer (Semi-Final)

Welcome to the **CricHeroes Full Stack Developer Semi-Final Assignment**!  
This project determines **how much a cricket team needs to score or restrict their opponent** to reach a **desired position** on the points table — just like a real IPL scenario.   

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js |
| **Backend** | Node.js |
| **Testing** | Jest |
| **Storage** | In-memory (no external DB) |

---

## Objective

Develop a tool that:
- Accepts a typical IPL points table and match conditions as input.  
- Calculates dynamically **what performance (runs/overs)** is required for a team to achieve its **target position**.  
- Computes **Net Run Rate (NRR)** values and produces **a valid range** for outcomes.  

---

## Problem Description

You’ll receive a sample IPL-like points table and must build logic that can answer:
- “If Team A bats first and scores X runs, how many should they restrict Team B to?”
- “If Team A chases, how many overs should they take to reach their desired rank?”

### Inputs
1. Your Team  
2. Opposition Team  
3. Number of Overs  
4. Desired Position  
5. Toss Result (Batting First / Bowling First)  
6. Runs Scored (or Target to Chase)

###  Expected Calculations
- Compute NRR dynamically using match data.  
- Determine **ranges** for runs or overs required to achieve a target position.  
- No hardcoded or static values — all should be computed programmatically.

---

##  Example Input

```
Your Team: Rajasthan Royals  
Opposition Team: Delhi Capitals  
Overs: 20  
Desired Position: 3  
Toss: Bat  
Runs Scored: 120  
```

---

## Example Output

```
If Rajasthan Royals score 120 runs in 20 overs,
they must restrict Delhi Capitals between 98–101 runs in 20 overs.

Revised NRR of Rajasthan Royals will be between +0.45 to +0.53.
```

Or (if chasing):

```
If Delhi Capitals score 119 runs in 20 overs,
Rajasthan Royals should chase the target within 16–17 overs
to reach 3rd position.
```

---

## NRR Formula

```
NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
```



## Project Setup

### Clone the Repository
```bash
git clone https://github.com/<your-username>/cricheroes-assignment.git
cd cricheroes-assignment
```

### Backend Setup
```bash
cd backend
pnpm install
pnpm dev

```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Run Tests
```bash
pnpm test
```

The frontend will usually run at **http://localhost:3000**  
and backend at **http://localhost:5000** (or your configured port).

---

## Some added Images of result 
<img width="562" height="268" alt="Screenshot 2025-11-13 154359" src="https://github.com/user-attachments/assets/fcea22fb-6dbb-4172-8c6b-e8f1b8cf8f0a" />
<img width="1302" height="508" alt="Screenshot 2025-11-13 154434" src="https://github.com/user-attachments/assets/8d1e4f26-aec9-454a-89bf-610937de7a83" />
<img width="1510" height="810" alt="Screenshot 2025-11-13 154818" src="https://github.com/user-attachments/assets/efc06d1a-af1e-46eb-a597-b9a38f8f5ef7" />



##  Author

**Sonu Kumar Pandit**  

🌐 [Portfolio](https://www.sonupandit.in)  
💼 [LinkedIn]([https://linkedin.com/in/sonupandit](https://www.linkedin.com/in/sonu-kumar-pandit-563a6b254/))  

