'use client';

import React from 'react';
import { useDashboardView } from '../_components/view-context';
import { OverviewView } from './_views/overview-view';
import { LeadsView } from './_views/leads-view';
import { TemplatesView } from './_views/templates-view';
import { CampaignsView } from './_views/campaigns-view';
import { ConversationsView } from './_views/conversations-view';
import { AnalyticsView } from './_views/analytics-view';
import { SettingsView } from './_views/settings-view';

export default function DashboardPage() {
  const { view } = useDashboardView();

  switch (view) {
    case 'overview':
      return <OverviewView />;
    case 'leads':
      return <LeadsView />;
    case 'templates':
      return <TemplatesView />;
    case 'campaigns':
      return <CampaignsView />;
    case 'conversations':
      return <ConversationsView />;
    case 'analytics':
      return <AnalyticsView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <OverviewView />;
  }
}
