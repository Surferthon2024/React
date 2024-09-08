import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './KeywordDetail.css';

const KeywordDetail = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get('/keywords', { withCredentials: true });
        setKeywords(response.data);
      } catch (error) {
        console.error('키워드 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchKeywords();
  }, []);

  const handleBackButtonClick = () => {
    navigate('/add'); // /add 경로로 이동
  };

  const handleKeywordClick = async (site, keyword) => {
    try {
      console.log('전송 데이터:', site, keyword);
      const response = await axios.get(`/post/${site}/${keyword}`, { withCredentials: true });
      console.log('API 응답:', response.data); // 데이터 확인
      setPosts(response.data);
      setSelectedKeyword({ site, keyword });
      setSelectedPosts(response.data);
    } catch (error) {
      console.error('키워드 상세 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const handleRecommendClick = async () => {
    if (selectedPosts.length === 0) {
      alert('선택된 게시글이 없습니다.');
      return;
    }
  
    try {
      // ScheduleDto 객체 배열 생성
      const schedules = selectedPosts.map(post => ({
        title: post.title,
        startDate: new Date(post.date).toISOString().split('T')[0], // 시작일 설정
        endDate: new Date(post.date).toISOString().split('T')[0] // 종료일 설정 (예제에서는 동일한 날짜로 설정)
      }));
  
      // JSON 배열을 전송
      await axios.post('/schedule/add-schedule', schedules, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      // 스케줄 등록 완료 후 /calendar 페이지로 이동
      alert('스케줄이 성공적으로 등록되었습니다.');
      navigate('/calendar');
    } catch (error) {
      console.error('스케줄을 등록하는 중 오류 발생:', error);
    }
  };

  return (
    <div className="keyword-detail-container">
      <header className="header">
        <button className="back-button" onClick={handleBackButtonClick}>←</button>
        <h1>내역 조회</h1>
      </header>

      <div className="keyword-box">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="keyword-card"
              onClick={() => handleKeywordClick(keyword.site, keyword.keyword)}
            >
              <div className="notification-icon">🔔</div>
              <div className="site-name">{keyword.site}</div>
              <div className="keyword-content">{keyword.keyword}</div>
            </div>
          ))
        ) : (
          <p>키워드가 없습니다.</p>
        )}
      </div>

      {selectedKeyword && (
        <div className="post-info">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="post-item">
                <a
                  className="post-link"
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.title}
                </a>
                <div className="post-date">{post.date}</div>
              </div>
            ))
          ) : (
            <p>관련 게시글이 없습니다.</p>
          )}
          <button className="calendar-button" onClick={handleRecommendClick}>
            스마트 캘린더 등록
          </button>
        </div>
      )}
    </div>
  );
};

export default KeywordDetail;
