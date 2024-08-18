# Overwatch Champions Series Stats Wrapper

Basic stats wrapper for Overwatch Champions Series.

-   Fetches matches from the Faceit API
-   Displays matches in a list
-   Displays match details
-   Displays match map stats for each team

Built with Next.js 14, React, TypeScript, Tailwind CSS, and Shadcn UI.

## Todo

-   [ ] Add support for multiple championships i.e different section for group stages, playoffs, etc.
-   [ ] Update match page to be more informative

## Contributing

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Create a `.env.local` file in the root directory and add your Faceit API key:
    ```
    FACEIT_API_KEY=your_api_key_here
    ```
4. Run the development server:
    ```
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

-   `/src`: Main source code directory
    -   `/app`: Next.js app router components and pages
    -   `/components`: Reusable React components
    -   `/lib`: Utility functions and API client
-   `/public`: Static assets
