"use client";
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Container, Badge } from 'react-bootstrap';
import CalendarController from '@/controllers/CalendarController';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import Link from 'next/link';

export default function CalendarioCampanas() {
  const [date, setDate] = useState(new Date());
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns(date.getMonth(), date.getFullYear());
  }, [date]);

  const loadCampaigns = async (month, year) => {
    try {
      const result = await CalendarController.getCampaignsByMonth(month, year);
      if (result.ok) {
        setCampaigns(result.campaigns);
      }
    } catch (error) {
      console.error("Error cargando campañas:", error);
    } finally {
      setLoading(false);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const campaignsForDate = campaigns.filter(
        campaign => campaign.date.toDateString() === date.toDateString()
      );

      return campaignsForDate.length > 0 ? (
        <div className="campaign-indicator">
          {campaignsForDate.map((campaign) => (
            <Link 
              href={`/campaign?id=${campaign.id}`}
              key={campaign.id}
              className="d-block mt-1"
            >
              <Badge bg="primary" className="w-100">
                {campaign.title}
              </Badge>
            </Link>
          ))}
        </div>
      ) : null;
    }
  };

  return (
    <main className="container py-4" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Calendario de Campañas
      </h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {loading ? (
            <div className="text-center">Cargando calendario...</div>
          ) : (
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={tileContent}
              className="mx-auto"
              locale="es-CR"
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 800px;
          border: none;
          font-family: inherit;
        }
        .react-calendar__tile {
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          padding: 0.5em;
        }
        .campaign-indicator {
          font-size: 0.8em;
          margin-top: auto;
        }
        .react-calendar__tile--active {
          background: #2055A5 !important;
        }
        .react-calendar__tile--now {
          background: #e6e6e6;
        }
      `}</style>
    </main>
  );
} 