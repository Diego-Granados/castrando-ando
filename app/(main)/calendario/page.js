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
        // Ajustar las fechas a la zona horaria local (GMT-6)
        const campaignsWithDates = result.campaigns.map(campaign => {
          const utcDate = new Date(campaign.date);
          // Ajustar a GMT-6 (compensar 6 horas)
          const localDate = new Date(utcDate.getTime() + (6 * 60 * 60 * 1000));
          return {
            ...campaign,
            date: localDate
          };
        });
        setCampaigns(campaignsWithDates);
      }
    } catch (error) {
      console.error("Error cargando campañas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    // Ajustar la hora para GMT-6
    const localDate = new Date(date.getTime() + (6 * 60 * 60 * 1000));
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const campaignsForDate = campaigns.filter(campaign => {
        // Comparar solo la fecha (ignorando la hora)
        const campaignDate = new Date(campaign.date);
        return (
          campaignDate.getDate() === tileDate.getDate() &&
          campaignDate.getMonth() === tileDate.getMonth() &&
          campaignDate.getFullYear() === tileDate.getFullYear()
        );
      });

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
                <div className="campaign-time">
                  {formatTime(campaign.date)}
                </div>
              </Badge>
            </Link>
          ))}
        </div>
      ) : null;
    }
  };

  return (
    <main className="calendar-page-container">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Calendario de Campañas
      </h1>

      <div className="calendar-wrapper">
        <div className="calendar-container">
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
        .calendar-page-container {
          padding: 1.5rem;
          min-height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          max-width: 1200px;
          margin: 0 auto;
        }

        .calendar-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px;
        }

        .calendar-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .react-calendar {
          width: 100% !important;
          max-width: 100%;
          border: none;
          font-family: inherit;
        }

        .react-calendar__navigation {
          margin-bottom: 0.5em;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
        }

        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
        }

        .react-calendar__tile {
          max-width: 100% !important;
          padding: 0.75em 0.5em;
          height: auto;
          min-height: 85px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          text-align: center;
        }

        .campaign-indicator {
          font-size: 0.8em;
          margin-top: 0.3em;
          word-break: break-word;
        }

        .badge {
          white-space: normal;
          text-align: center;
          word-break: break-word;
          height: auto;
        }

        .campaign-time {
          font-size: 0.85em;
          opacity: 0.9;
          margin-top: 2px;
        }

        .timezone-indicator {
          color: #666;
          font-size: 0.9em;
          margin-top: -15px;
        }

        @media (max-width: 768px) {
          .calendar-page-container {
            padding: 0.5rem;
          }

          .calendar-wrapper {
            padding: 10px;
          }

          .react-calendar {
            font-size: 14px;
          }

          .react-calendar__tile {
            min-height: 70px;
            padding: 0.5em 0.3em;
          }

          .campaign-indicator {
            font-size: 0.7em;
          }

          .badge {
            font-size: 0.7em;
            padding: 0.2em 0.4em;
          }

          .campaign-time {
            font-size: 0.8em;
          }

          .timezone-indicator {
            font-size: 0.85em;
          }
        }

        @media (max-width: 480px) {
          .calendar-page-container {
            padding: 0.25rem;
          }

          .calendar-wrapper {
            padding: 5px;
          }

          .react-calendar {
            font-size: 12px;
          }

          .react-calendar__tile {
            min-height: 55px;
            padding: 0.3em 0.2em;
          }

          .campaign-indicator {
            font-size: 0.6em;
          }

          .badge {
            font-size: 0.6em;
            padding: 0.15em 0.3em;
          }

          .react-calendar__navigation button {
            padding: 0.15em;
            font-size: 0.9em;
          }

          .campaign-time {
            font-size: 0.75em;
          }

          .timezone-indicator {
            font-size: 0.8em;
          }
        }

        @media (max-width: 360px) {
          .react-calendar__tile {
            min-height: 45px;
          }

          .react-calendar {
            font-size: 11px;
          }

          .badge {
            font-size: 0.55em;
          }

          .campaign-time {
            font-size: 0.7em;
          }
        }
      `}</style>
    </main>
  );
} 