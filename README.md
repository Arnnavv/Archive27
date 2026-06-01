# Archive 27 — Thrift Fashion Analytics Platform

> A full-stack predictive and prescriptive analytics platform built on 10,000-respondent consumer data, hosted on GitHub Pages.

**Student:** Peehu Manglik | **ID:** MS25DBM005 | **Programme:** Masters in Business Analytics  
**Institution:** SP Jain School of Global Management | **Course:** Data Analytics — Project-Based Learning

---

## 🚀 Live Demo

After deploying to GitHub Pages, your site will be available at:  
`https://<your-username>.github.io/archive27/`

---

## 📁 Project Structure

```
archive27/
├── index.html                    ← Home / Landing page
├── .nojekyll                     ← Disables Jekyll processing (required)
├── README.md
│
├── css/
│   └── main.css                  ← Full design system (dark editorial theme)
│
├── js/
│   ├── utils.js                  ← Shared utilities, Plotly config, nav builder
│   └── data.js                   ← Pre-computed analytics (from 10K dataset)
│
└── pages/
    ├── customer-intelligence.html  ← Demographics, personas, Sankey, radar charts
    ├── prediction-lab.html         ← ML models, SHAP, CLV, churn, intent predictor
    ├── recommendation-studio.html  ← Recommendations engine, market basket, pricing
    ├── forecasting-hub.html        ← Revenue forecast, budget simulator, demand
    ├── executive-insights.html     ← KPI dashboard, strategic matrix, C-suite view
    └── about.html                  ← Methodology, survey design, ML pipeline, tech stack
```

---

## 🌐 GitHub Pages Deployment — Step by Step

### Method 1: Upload via GitHub Web (Recommended)

1. **Create a new repository** on GitHub
   - Go to [github.com/new](https://github.com/new)
   - Name it `archive27` (or anything you prefer)
   - Set visibility to **Public**
   - Do **not** initialise with README (you already have one)
   - Click **Create repository**

2. **Upload all files**
   - Click **"uploading an existing file"** link or **Add file → Upload files**
   - Drag and drop the entire `archive27/` folder contents
   - Make sure the structure is preserved (see above)
   - Commit with message: `Initial deployment — Archive 27 Analytics Platform`

3. **Enable GitHub Pages**
   - Go to **Settings → Pages**
   - Under **Source**, select **Deploy from a branch**
   - Branch: `main` | Folder: `/ (root)`
   - Click **Save**

4. **Wait ~2 minutes** then visit `https://<your-username>.github.io/archive27/`

---

### Method 2: Git CLI

```bash
# Clone your new empty repo
git clone https://github.com/<your-username>/archive27.git
cd archive27

# Copy all files into this folder
# (copy contents of the archive27/ folder here)

# Commit and push
git add .
git commit -m "Initial deployment — Archive 27 Analytics Platform"
git push origin main

# Enable Pages in GitHub Settings → Pages → main / root
```

---

## ⚙️ Important Notes

- **`.nojekyll` file is required.** GitHub Pages runs Jekyll by default, which ignores files starting with `_`. The `.nojekyll` file disables this. It is already included.
- **No build step needed.** This is a pure static site — HTML, CSS, and vanilla JavaScript. No Node.js, no npm install, no bundler required.
- **All data is embedded.** The `js/data.js` file contains all pre-computed analytics derived from the 10,000-respondent dataset. No external API calls needed.
- **Plotly.js is loaded from CDN.** An internet connection is required to view charts (Plotly is loaded from `cdn.plot.ly`).

---

## 📊 Analytics Layers

| Layer | Description | Pages |
|-------|-------------|-------|
| **Descriptive** | Distribution, demographics, cross-tabs | Customer Intelligence |
| **Diagnostic** | Correlation, segmentation, barriers | Customer Intelligence |
| **Predictive** | ML models, CLV, churn, forecasting | Prediction Lab · Forecasting Hub |
| **Prescriptive** | Recommendations, pricing, budget sim | Recommendation Studio · Executive Insights |

---

## 🤖 ML Models (Pre-computed)

| Model | AUC | Accuracy | F1 |
|-------|-----|----------|----|
| XGBoost | **0.928** | 86.3% | 86.5% |
| Random Forest | 0.912 | 84.7% | 85.0% |
| Logistic Regression | 0.841 | 78.3% | 78.2% |

Model outputs are pre-computed from the 10,000-row dataset and stored in `js/data.js` as JavaScript objects. The interactive predictors on each page run in the browser using these pre-trained output distributions.

---

## 🎨 Design System

- **Theme:** Dark editorial luxury
- **Background:** `#0D0F0E` (deep charcoal)
- **Accent:** `#00C896` (emerald green)
- **Typography:** DM Serif Display (headings) · DM Sans (body) · JetBrains Mono (data)
- **Charts:** Plotly.js with custom dark theme config

---

## 📋 Dataset Details

| Property | Value |
|----------|-------|
| Original responses | 2,000 rows |
| Expanded dataset | 10,000 rows |
| Features | 56 columns |
| Personas | 6 distinct archetypes |
| Generation method | Persona-conditioned probabilistic sampling with Dirichlet noise |
| Missing rate (style_secondary) | ~51.4% (preserved from original) |

### 6 Customer Personas

| Persona | Share | Purchase Intent |
|---------|-------|----------------|
| Aesthetic Chaser | 29.1% | 82% |
| Bargain Hunter | 20.9% | 61% |
| Conscious Spender | 20.3% | 56% |
| Fence-Sitter | 14.5% | 30% |
| Occasional Gifter | 10.0% | 36% |
| Skeptic | 5.3% | 13% |

---

## 🏷️ About the Brand

**Archive 27** is a digital-first curated thrift fashion brand targeting India's secondhand clothing market through Instagram. The brand stands for:
- **Affordability** — accessible price points for young India
- **Uniqueness** — one-of-a-kind curated pieces
- **Sustainability** — circular fashion, upcycled originals

**Product Lines:** Curated outfit drops · Upcycled originals · Mystery boxes · Personal styling · Trade-in programme · Digital lookbooks · Pop-up events

---

*Built with ❤️ for SP Jain School of Global Management · Data Analytics PBL · 2025*
