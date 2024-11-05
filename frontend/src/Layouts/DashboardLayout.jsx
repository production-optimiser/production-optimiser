import React from 'react';
import { AppSidebar } from '../components/app-sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl">
          <h1>Dashboard Content</h1>
          {children}
        </div>
      </main>
    </div>
  );
}