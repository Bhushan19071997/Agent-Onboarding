
  # Agent Onboarding Application

A comprehensive React-based application for managing agent onboarding and lifecycle management for Ageas Federal Life Insurance (AFLI).

## 🚀 Features

- **User Authentication**: Role-based access control (Admin, Manager, Operator)
- **Agent Management**: Complete CRUD operations for agent onboarding
- **Dashboard**: Real-time statistics and monitoring
- **Approval Workflow**: Review and approve agent requests
- **Batch Operations**: Bulk agent management operations
- **Admin Panel**: User management and system settings
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Data Storage**: LocalStorage (for demo purposes)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agent-onboarding-application.git
cd agent-onboarding-application
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Credentials

Use these credentials to test the application:

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`

### Manager Access
- **Username**: `manager`
- **Password**: `manager123`

### Operator Access
- **Username**: `operator`
- **Password**: `operator123`

## 📱 Usage

### Agent Onboarding
1. Login with appropriate credentials
2. Navigate to "Agent Onboarding"
3. Fill in the agent details form
4. Submit for approval (if required based on role)

### Dashboard Monitoring
- View real-time statistics
- Monitor agent statuses
- Track approval requests
- Review recent activities

### Batch Operations
- Select multiple agents
- Perform bulk actions (termination, suspension, etc.)
- Upload CSV files for bulk operations
- Track batch job progress

### Approval Workflow
- Review pending requests
- Approve or reject with comments
- Track approval history
- Automated status updates

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── agents/         # Agent management components
│   ├── ui/             # Base UI components
│   └── workflow/       # Workflow components
├── guidelines/         # Business rules and guidelines
├── styles/            # Global styles
└── utils/             # Utility functions and data
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add deployment script to package.json:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/agent-onboarding-application"
}
```

3. Deploy:
```bash
npm run build && npm run deploy
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_TITLE=Agent Onboarding Application
VITE_API_URL=http://localhost:3001/api
```

### Customization
- Modify `src/utils/mockData.ts` to connect to a real backend
- Update styling in `tailwind.config.js`
- Add new components in the `src/components` directory

## 📈 Features Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced reporting
- [ ] Document management
- [ ] Email integration
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ageasfederal.com or create an issue in the GitHub repository.

## 🏢 About

This application was developed for Ageas Federal Life Insurance to streamline the agent onboarding and management process. It provides a comprehensive solution for managing the entire agent lifecycle from initial application to ongoing management.

---

**Built with ❤️ for Ageas Federal Life Insurance**

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  