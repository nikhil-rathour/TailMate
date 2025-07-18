import React, { useState } from 'react';

const petProfile = {
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: '2 years old',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const wellness = {
  score: 88,
  message: 'Excellent! Keep up the great routine.',
};

const stats = [
  { label: 'Weight', value: '28.5 kg', icon: '⚖️' },
  { label: 'Steps', value: '8,200', icon: '📈' },
  { label: 'Hydration', value: '1.5 L', icon: '💧' },
];

const calendarEvents = [
  { date: '2025-07-01', label: 'Montir', color: 'text-green-600' },
  { date: '2025-07-02', label: 'Break', color: 'text-blue-600' },
  { date: '2025-07-03', label: 'Groom', color: 'text-purple-600' },
  { date: '2025-07-04', label: 'Diner', color: 'text-green-600' },
  { date: '2025-07-05', label: 'Evenin', color: 'text-blue-600' },
  { date: '2025-07-07', label: 'Vet Ch', color: 'text-red-600' },
  { date: '2025-07-10', label: 'Diner', color: 'text-green-600' },
  { date: '2025-07-12', label: 'Playda', color: 'text-blue-600' },
  { date: '2025-07-14', label: 'Montir', color: 'text-green-600' },
  { date: '2025-07-15', label: 'Dental', color: 'text-pink-600' },
  { date: '2025-07-17', label: 'Aftern', color: 'text-blue-600' },
  { date: '2025-07-20', label: 'Cool B', color: 'text-blue-600' },
  { date: '2025-07-22', label: 'Train', color: 'text-purple-600' },
  { date: '2025-07-24', label: 'Amusa', color: 'text-orange-600' },
  { date: '2025-07-27', label: 'Specia', color: 'text-green-600' },
  { date: '2025-07-29', label: 'Night', color: 'text-blue-600' },
];

const rightCards = [
  {
    title: "Today's Meal Plan",
    desc: 'Personalized balanced diet for Buddy.',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    link: '#',
  },
  {
    title: 'Exercise Suggestion',
    desc: 'Engaging activities for mental and physical health.',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
    link: '#',
  },
  {
    title: 'Grooming Tips',
    desc: 'Maintain Buddy’s coat and hygiene.',
    img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
    link: '#',
  },
];

const recentActivity = [
  { text: 'Completed 30 min walk', time: '2 hours ago' },
  { text: 'Ate all breakfast', time: '4 hours ago' },
  { text: 'Took medication', time: '8 hours ago' },
  { text: 'Played fetch in the park', time: 'Yesterday' },
  { text: 'Received a new toy', time: 'Yesterday' },
];

const weather = {
  city: 'San Francisco',
  temp: '18°C',
  icon: '☀️',
  desc: 'Partly Cloudy',
  msg: 'Perfect weather for an extended park visit and fetch!',
  img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
};

function getMonthMatrix(year, month) {
  // Returns a matrix of weeks for the given month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let day = new Date(firstDay);
  day.setDate(day.getDate() - day.getDay()); // Start from Sunday

  // Loop until we've passed the last day of the month and filled the last week
  while (day <= lastDay || week.length > 0) {
    week.push(new Date(day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    day.setDate(day.getDate() + 1);
    // After lastDay, fill the last week and break
    if (day > lastDay && week.length > 0 && week.length < 7) {
      while (week.length < 7) {
        week.push(new Date(day));
        day.setDate(day.getDate() + 1);
      }
      matrix.push(week);
      break;
    }
  }
  return matrix;
}

const AiPetCare = () => {
  const [calendarDate, setCalendarDate] = useState(new Date(2025, 6, 1)); // July 2025
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-navy min-h-screen px-2 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gold tracking-tight drop-shadow">AI PetCare Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full">
          {/* Pet Profile */}
          <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center text-center border-2 border-navy/10">
            <img src={petProfile.avatar} alt={petProfile.name} className="w-16 h-16 rounded-full mb-2 object-cover border-4 border-gold" />
            <div className="font-bold text-base text-navy">{petProfile.name}</div>
            <div className="text-xs text-softgray">{petProfile.breed}</div>
            <div className="text-xs text-softgray mb-2">{petProfile.age}</div>
            <button className="bg-gold text-navy font-bold px-3 py-1 rounded-full hover:bg-accent-orange transition text-xs shadow">View Profile</button>
          </div>
          {/* Wellness Score */}
          <div className="bg-gradient-to-r from-gold/20 via-beige to-white rounded-2xl shadow-xl p-5 flex flex-col items-center text-center border-2 border-gold/10">
            <div className="text-2xl font-extrabold text-gold mb-1">{wellness.score}</div>
            <div className="text-xs text-navy mb-2">{wellness.message}</div>
            <a href="#" className="text-gold hover:underline text-xs font-semibold">View Details</a>
          </div>
          {/* Stats */}
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow p-3 flex items-center justify-between border border-navy/5">
              <div className="font-semibold text-navy text-xs">{stat.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-base">{stat.icon}</span>
                <span className="font-bold text-navy text-xs">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Calendar (center column) */}
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 min-w-0 border-2 border-navy/10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold text-base text-navy">{calendarDate.toLocaleString('default', { month: 'long' })} {year}</div>
            <div className="flex gap-1">
              <button onClick={handlePrevMonth} className="bg-gold hover:bg-accent-orange text-navy rounded-full px-2 py-1 font-bold shadow text-xs">&lt;</button>
              <button onClick={handleNextMonth} className="bg-gold hover:bg-accent-orange text-navy rounded-full px-2 py-1 font-bold shadow text-xs">&gt;</button>
              <button className="bg-gold hover:bg-accent-orange text-navy font-bold px-3 py-1 rounded-full ml-1 shadow text-xs">+ Add</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center select-none text-xs">
              <thead>
                <tr className="text-softgray">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                    <th key={d} className="py-1 font-medium">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthMatrix.map((week, i) => (
                  <tr key={i}>
                    {week.map((day, j) => {
                      const isCurrentMonth = day.getMonth() === month;
                      const event = calendarEvents.find(e => e.date === day.toISOString().slice(0, 10));
                      return (
                        <td
                          key={j}
                          className={`py-1 px-1 md:px-1.5 rounded-lg relative ${isCurrentMonth ? 'text-navy' : 'text-softgray'} ${event ? 'font-bold' : ''}`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{day.getDate()}</span>
                            {event && (
                              <span className={`text-[10px] ${event.color}`}>{event.label}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 w-full">
          {rightCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl flex items-center gap-3 p-3 border border-navy/10">
              <img src={card.img} alt={card.title} className="w-12 h-12 rounded-lg object-cover border-2 border-gold/30" />
              <div className="flex-1">
                <div className="font-semibold text-navy text-sm">{card.title}</div>
                <div className="text-xs text-softgray mb-1">{card.desc}</div>
                <a href={card.link} className="text-gold hover:underline text-xs font-semibold">Learn More &rarr;</a>
              </div>
            </div>
          ))}
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-navy/10">
            <div className="font-bold mb-2 text-navy text-sm">Recent Activity</div>
            <ul className="space-y-2">
              {recentActivity.map((a, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
                  <span className="text-navy">{a.text}</span>
                  <span className="text-softgray text-xs ml-auto">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Weather */}
          <div className="bg-gold/20 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gold/20">
            <img src={weather.img} alt={weather.city} className="w-10 h-10 rounded-lg object-cover border-2 border-gold/30" />
            <div>
              <div className="font-bold text-base text-navy">{weather.city} <span className="text-xs">{weather.temp}</span> <span>{weather.icon}</span></div>
              <div className="text-xs text-navy/80">{weather.desc}</div>
              <div className="text-xs text-navy mt-1">{weather.msg}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPetCare;