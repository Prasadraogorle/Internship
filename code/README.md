
# RentSphere - Property Rental Platform

A modern web application for property rentals, connecting property owners with tenants.

## Features

- **Multi-role Authentication**: Support for tenants, property owners, and administrators
- **Property Management**: Add, edit, and manage rental properties with image uploads
- **Rental Requests**: Streamlined application process for tenants
- **Dashboard Views**: Role-specific dashboards for different user types
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd rentsphere
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and database
├── pages/              # Page components
└── main.tsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

### Tenants
- Browse available properties
- Submit rental requests
- View application status

### Property Owners
- Add and manage properties
- Upload property images
- Review and respond to rental requests

### Administrators
- Manage all users and properties
- System-wide oversight and control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
