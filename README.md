# ADmyBRAND Insights Dashboard

A modern and responsive analytics dashboard built with Next.js and Tailwind CSS. It provides a comprehensive overview of key business metrics, including revenue trends, campaign performance, and traffic sources, all presented in a visually appealing and interactive interface.

### Live Application

**View the live deployed application here: [https://admybrand-insights-taupe.vercel.app/](https://admybrand-insights-taupe.vercel.app/)**


## Key Features

-   **Interactive & Responsive Charts**: Area, Bar, and Pie charts powered by Recharts provide a clear visualization of complex data.
-   **At-a-Glance KPI Cards**: Key performance indicators are displayed prominently for quick insights into total revenue, active users, and conversions.
-   **Advanced Data Table**: A full-featured table for campaign performance with client-side searching, sorting, and pagination.
-   **PDF Export**: Users can export a snapshot of the current dashboard view as a high-quality PDF document.
-   **Modern UI/UX**: A beautiful interface with a Dark/Light mode toggle and a dynamic, animated background for a premium user experience.
-   **Built with Best Practices**: Leverages the Next.js App Router, with client-side interactivity handled gracefully to prevent hydration errors.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Charting**: Recharts
-   **PDF Generation**: jsPDF, html2canvas
-   **Icons**: Lucide React
-   **Deployment**: Vercel

## Local Development

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   Node.js (v18.17 or later)
-   npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/){your-github-username}/admybrand-insights.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd admybrand-insights
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is deployed on **Vercel**. The Vercel platform provides a seamless CI/CD pipeline, where every `git push` to the `main` branch automatically triggers a new, optimized deployment.

## License

This project is licensed under the MIT License.
