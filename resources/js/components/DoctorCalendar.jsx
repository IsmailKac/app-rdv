import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const localizer = momentLocalizer(moment);

export default function DoctorCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const profileId = user?.doctor_profile?.id || user?.doctorProfile?.id;
        if (profileId) {
            fetchSlots(profileId);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchSlots = async (profileId) => {
        try {
            setLoading(true);
            const { data } = await api.get('/slots?all=true&doctor_id=' + profileId);

            // Transform to calendar events
            const calendarEvents = data.map(slot => ({
                id: slot.id,
                title: slot.is_booked
                    ? `Booked: ${slot.appointment?.patient?.name || 'Patient'}`
                    : 'Available',
                start: new Date(slot.start_time),
                end: new Date(slot.end_time),
                resource: {
                    ...slot,
                    patient_name: slot.appointment?.patient?.name,
                    notes: slot.appointment?.notes,
                    status: slot.appointment?.status,
                    appointment_id: slot.appointment?.id
                },
                allDay: false,
                color: slot.is_booked ? (slot.appointment?.status === 'completed' ? '#6B7280' : '#EF4444') : '#10B981',
            }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEvent = async (event) => {
        const { resource } = event;

        if (resource.is_booked) {
            let message = `Appointment with: ${resource.patient_name || 'N/A'}\nStatus: ${resource.status}`;
            if (resource.notes) message += `\nNotes: ${resource.notes}`;

            alert(message);

            if (resource.status !== 'completed' && window.confirm('Mark this appointment as completed?')) {
                try {
                    await api.put(`/appointments/${resource.appointment_id}`, { status: 'completed' });
                    fetchSlots();
                } catch (error) {
                    alert('Failed to update appointment');
                }
            }
        } else {
            if (window.confirm('Delete this available slot?')) {
                try {
                    await api.delete(`/slots/${resource.id}`);
                    fetchSlots();
                } catch (error) {
                    alert('Failed to delete slot');
                }
            }
        }
    };

    const handleSelectSlot = async ({ start, end }) => {
        if (window.confirm(`Create available slot for ${moment(start).format('LLL')}?`)) {
            try {
                const { data } = await api.post('/slots', {
                    start_time: start,
                    end_time: end,
                    is_booked: false
                });
                fetchSlots(); // Refresh
            } catch (error) {
                alert('Failed to create slot');
            }
        }
    };

    const handleEventStyle = (event) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    if (loading) return <div className="p-4 text-center">Loading schedule...</div>;

    if (!user?.doctor_profile && !user?.doctorProfile) return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">No doctor profile found for {user?.name}. Please complete your profile settings.</p>
        </div>
    );

    return (
        <div className="human-card bg-white p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl shadow-slate-200/50">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Gestion du Temps
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">Mon <span className="text-indigo-600">Calendrier</span></h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Réservé</span>
                    </div>
                </div>
            </header>

            <div className="h-[700px] relative">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color === '#10B981' ? 'rgba(16, 185, 129, 0.1)' :
                                event.color === '#EF4444' ? 'rgba(79, 70, 229, 0.1)' :
                                    'rgba(148, 163, 184, 0.1)',
                            border: `1px solid ${event.color === '#10B981' ? '#10B981' :
                                event.color === '#EF4444' ? '#4F46E5' :
                                    '#94A3B8'}`,
                            color: event.color === '#10B981' ? '#065F46' :
                                event.color === '#EF4444' ? '#3730A3' :
                                    '#1E293B',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            fontFamily: 'Inter, sans-serif',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }
                    })}
                    defaultView="week"
                    messages={{
                        today: "Aujourd'hui",
                        previous: "Précédent",
                        next: "Suivant",
                        month: "Mois",
                        week: "Semaine",
                        day: "Jour",
                        agenda: "Agenda"
                    }}
                />
            </div>
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aide : Cliquez sur une zone vide pour créer un créneau disponible.</p>
            </div>
        </div>
    );
}
