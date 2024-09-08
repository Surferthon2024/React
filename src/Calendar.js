import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './MyCalendar.css'; // 스타일 시트 import

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // 날짜를 순수 날짜로 변환 (시간 제거)
  const stripTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const strippedNewDate = stripTime(newDate);

    const eventsForDate = schedules.filter(schedule => {
      const scheduleStartDate = stripTime(new Date(schedule.startDate));
      const scheduleEndDate = stripTime(new Date(schedule.endDate));
      return (scheduleStartDate <= strippedNewDate && scheduleEndDate >= strippedNewDate);
    });

    setSelectedEvents(eventsForDate);
  };

  // 서버에서 일정 데이터 가져오기
  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/schedule', { withCredentials: true });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // 일정 삭제 핸들러
  const handleDelete = async (index) => {
    const confirmed = window.confirm('정말로 이 일정을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`/schedule/delete-schedule?index=${index}`, { withCredentials: true });
      if (response.data) {
        setSchedules(schedules.filter((_, i) => i !== index));
        setSelectedEvents(selectedEvents.filter((_, i) => i !== index));
        alert('일정이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchSchedules();
  }, []);

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const strippedDate = stripTime(date);

      const eventsForDate = schedules.filter(schedule => {
        const scheduleStartDate = stripTime(new Date(schedule.startDate));
        const scheduleEndDate = stripTime(new Date(schedule.endDate));
        return (scheduleStartDate <= strippedDate && scheduleEndDate >= strippedDate);
      });

      return eventsForDate.length > 0 ? (
        <div className="event-marker" />
      ) : null;
    }
    return null;
  };

  return (
    <div className="calendar-wrapper">
      <h1 className="calendar-title">스마트 캘린더</h1>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={getTileContent}
        />
      </div>
      <div className="selected-events">
        {selectedEvents.length > 0 ? (
          selectedEvents.map((event, index) => (
            <div key={index} className="event-details">
              <div className="event-title">{event.title}</div>
              {event.link && (
                <a href={event.link} className="event-link" target="_blank" rel="noopener noreferrer">
                  {event.link}
                </a>
              )}
              <button className="delete-button" onClick={() => handleDelete(index)}>X</button>
            </div>
          ))
        ) : (
          <p>선택된 날짜에 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
