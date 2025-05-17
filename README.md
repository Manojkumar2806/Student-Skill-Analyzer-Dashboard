# 🎓 Student Skill Analyzer Dashboard 📊




<p>
  <img src="https://img.shields.io/badge/ReactJS-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Dashboard-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Live%20Data-28A745?style=for-the-badge&logo=google-sheets&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Sheets%20API-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" />
</p>

## 📘 Project Description

**Student Skill Analyzer Dashboard** is a smart, responsive, React-based analytics tool that empowers educators with **live, visual, and real-time** insights into student performance. It supports three core segments — **All Students**, **CSD A**, and **CSD B**, each featuring two modes: **Table View** and **Dashboard View**. 

What sets this project apart? It’s wired to **Google Sheets as a live backend**, so updates made to the sheet are **instantly** reflected across dashboards and tables — zero refresh, zero lag! 🔄⚡

Each dashboard shows:
- 🔢 Total, Good, Average, and Poor students
- 📊 A bar chart with subject-wise performance levels
- 🍩 A donut chart visualizing overall student distribution
- 📈 A line chart tracking every student's performance trend
- 🥇 A dynamic table showcasing Top 15 and Bottom 5 performers
- 🧠 Filters that update all visualizations in real time

---

## 🔗 Live Demo

▶️ **Live Project**: [https://student-skill-analyzer-dashboard.vercel.app/](https://student-skill-analyzer-dashboard.vercel.app/)  
📁 **GitHub Repo**: [https://github.com/Manojkumar2806/Student-Skill-Analyzer-Dashboard](https://github.com/Manojkumar2806/Student-Skill-Analyzer-Dashboard)

---

## 🖼️ Screenshots Preview

| 📌 View                           | 🖼️ Screenshot |
|----------------------------------|---------------|
| Overall Dashboard                | ![image](https://github.com/user-attachments/assets/3c40d19f-b7ea-4425-a5b4-952309f62732) |
| CSD A Dashboard                  | ![image](https://github.com/user-attachments/assets/2bb98918-26be-4cb1-9329-08861bf286cc) |
| CSD B Dashboard                  | ![image](https://github.com/user-attachments/assets/22c8f713-f8d7-46b4-9bf8-2b7f73db70cc) |
| Student Table View (All)        | ![image](https://github.com/user-attachments/assets/f70e5538-2260-4646-9de3-94a06585e5d0)  |
| Filtered Student Data View      | ![image](https://github.com/user-attachments/assets/28c52198-b596-43c7-bbd5-ec9cc0472ad0)  |

---

## 🧩 Features & Functionalities

| ✅ Feature                          | 📋 Description                                                                                  |
|------------------------------------|-----------------------------------------------------------------------------------------------|
| 🔄 Live Data Sync                  | Fetches and reflects live data from a Google Spreadsheet API.                                 |
| 🧭 Three Core Tabs                 | Supports analysis for All Students, CSD A, and CSD B segments.                                |
| 🔁 Table + Dashboard Mode         | Dual-tab layout for every segment, enabling data depth and visualization.                     |
| 🧮 Summary Cards                   | Displays counts for Total, Good, Average, and Poor students dynamically.                      |
| 📊 Bar Chart                       | Subject-wise comparison of performance levels (Good, Average, Poor).                         |
| 🍩 Donut Chart                     | Percentage distribution of student skill levels.                                              |
| 📈 Line Chart                      | Tracks performance trends of individual students across subjects.                             |
| 🥇 Top & Bottom Performers Table  | Showcases top 15 and bottom 5 students dynamically.                                           |
| 🧠 Real-Time Filtering             | Filter by specific students or sections to update all visualizations and tables on the fly.  |
| 📱 Mobile-Responsive Design       | Fully responsive UI built with Bootstrap 5.                                                   |

---

## 🛠️ Tech Stack

| ⚙️ Technology        | 💼 Purpose                            |
|----------------------|----------------------------------------|
| React.js             | Core frontend framework                |
| React Router DOM     | SPA navigation and routing             |
| Recharts             | Data visualization and charting        |
| Bootstrap 5          | Responsive design & layout             |
| Google Sheets API    | Live data backend                      |
| CSS Modules          | Scoped component styling               |

---

## 🧗 Challenges Faced

| 🚧 Challenge                                                             | 💡 Solution                                                            |
|-------------------------------------------------------------------------|------------------------------------------------------------------------|
| Real-time integration with Google Sheets                                | Used polling & sheet-to-JSON integration with structured state updates |
| Multi-tab state sync and routing complexity                             | React Router + centralized state management via props/context          |
| Performance lags on large dataset renders                               | Optimized charts with memoization and limited renders                  |
| Ensuring uniform responsiveness across breakpoints                      | Bootstrap grid + media queries testing on multiple devices             |

---

## 🛫 Getting Started

```bash
# 1️⃣ Clone the Repository
git clone https://github.com/Manojkumar2806/Student-Skill-Analyzer-Dashboard.git

# 2️⃣ Navigate to the folder
cd myapp

# 3️⃣ Install Dependencies
npm install

# 4️⃣ Start the Dev Server
npm run dev
```

---


<h2 align="center">Thank You 💖</h2>

<p align="center">
  <b>Crafted with care and code by</b><br/>
  <strong>💻 Manoj Kumar Pendem</strong><br/>
  <i>Fueled by passion, powered by live data 🔁</i><br/>
  <br/>
  🙌 If you found this helpful, give it a ⭐ on GitHub and share it!
</p>

<hr/>

