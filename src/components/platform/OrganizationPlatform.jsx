import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// 13 Multi-Page Platform Views
import DashboardView from './DashboardView';
import AIAnalysisView from './AIAnalysisView';
import BulkUploadView from './BulkUploadView';
import AllReportsView from './AllReportsView';
import WeekSignalsView from './WeekSignalsView';
import StrongReportView from './StrongReportView';
import SIFPrecursorsView from './SIFPrecursorsView';
import AlertsView from './AlertsView';
import CorrectiveActionsView from './CorrectiveActionsView';
import AnalyticsView from './AnalyticsView';
import RiskHeatmapView from './RiskHeatmapView';
import LifeSavingRulesView from './LifeSavingRulesView';
import SettingsView from './SettingsView';

export default function OrganizationPlatform({ 
  currentPath = '/dashboard', 
  onNavigate, 
  onExitPlatform 
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Render the appropriate view based on the current route path
  const renderCurrentView = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardView onNavigate={onNavigate} />;

      case '/ai-analysis':
        return <AIAnalysisView onNavigate={onNavigate} />;

      case '/bulk-upload':
        return <BulkUploadView onNavigate={onNavigate} />;

      case '/reports':
        return <AllReportsView onNavigate={onNavigate} />;

      case '/week-signals':
        return <WeekSignalsView onNavigate={onNavigate} />;

      case '/strong-report':
        return <StrongReportView onNavigate={onNavigate} />;

      case '/sif-precursors':
        return <SIFPrecursorsView onNavigate={onNavigate} />;

      case '/critical-alerts':
        return <AlertsView onNavigate={onNavigate} />;

      case '/corrective-actions':
        return <CorrectiveActionsView onNavigate={onNavigate} />;

      case '/analytics':
        return <AnalyticsView onNavigate={onNavigate} />;

      case '/risk-heatmap':
        return <RiskHeatmapView onNavigate={onNavigate} />;

      case '/life-saving-rules':
        return <LifeSavingRulesView onNavigate={onNavigate} />;

      case '/settings':
        return <SettingsView onNavigate={onNavigate} />;

      default:
        return <DashboardView onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* 1. Shared Left Enterprise Sidebar with yellow/gold active indicators */}
      <Sidebar 
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onExitPlatform={onExitPlatform}
      />

      {/* 2. Main Content Area with Clean Solid Dark Navy Background */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#070D18]">
        {/* Shared Top Header */}
        <Header 
          currentPath={currentPath}
          onNavigate={onNavigate}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onExitPlatform={onExitPlatform}
        />

        {/* Dynamic Route View Page */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

    </div>
  );
}
