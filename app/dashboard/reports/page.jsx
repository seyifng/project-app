'use client';

import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async (id) => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`/api/reports?id=${id}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.message || 'Failed to fetch report.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const reportTitles = [
    'All Users',
    'All Appointments',
    'All Services',
    'Upcoming Appointments',
    'Completed Appointments',
    'Appointments Per User',
    'Top Providers By Appointments',
    'Users Without Appointments',
    'Services By Cost (High to Low)',
    'Daily Appointments Count',
    'Users by Role',
    'Most Booked Service',
    'Canceled Appointments',
    'User Notification History',
    'Average Appointment Duration Per Service',
    'Total Appointments This Month',
    'Most Active Clients',
    'Top Service Per Provider',
    'Services Without Appointments',
    'Total Revenue Per Provider',
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Reports Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTitles.map((title, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedReport(index + 1);
              fetchReport(index + 1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {title}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-600">Loading report...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {results.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(results[0]).map((col) => (
                  <th key={col} className="border px-4 py-2 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-4 py-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
