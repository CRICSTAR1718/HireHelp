import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input } from "../../components/interviewer";
import { scheduleApi, type Schedule } from "../../api/interviewer";

export const ScheduleCalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showModal, setShowModal] = useState(false);

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const hasSchedule = schedules.some(s => 
        new Date(s.startTime).toDateString() === date.toDateString()
      );

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-blue-50 transition-colors ${
            hasSchedule ? 'bg-blue-100' : 'bg-white'
          }`}
        >
          <span className="text-sm font-medium text-gray-900">{day}</span>
          {hasSchedule && (
            <div className="mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule</h1>
            <p className="text-gray-600">View and manage your interview calendar</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            + New Schedule
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handlePreviousMonth}>
                ← Previous
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <Button variant="outline" onClick={handleNextMonth}>
                Next →
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </CardBody>
        </Card>

        {showModal && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-0 rounded-none border-0">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">Schedule Interview</h3>
              <div className="space-y-4">
                <Input label="Start Time" type="datetime-local" />
                <Input label="End Time" type="datetime-local" />
                <Input label="Location" placeholder="Enter location or meeting link" />
                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowModal(false)}>
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
