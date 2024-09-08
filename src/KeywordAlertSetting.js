import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeywordAlertSetting.css';

const KeywordAlertSetting = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [sites, setSites] = useState([]);

  // 사이트 데이터 가져오기
  useEffect(() => {
    axios.get('/keywords/sites', { withCredentials: true })
      .then(response => {
        setSites(response.data);
      })
      .catch(error => {
        console.error('사이트 데이터를 가져오는 중 오류 발생:', error);
      });
  }, []); // 빈 배열을 넣어주어 컴포넌트가 마운트될 때 한 번만 실행

  // 키워드 데이터 가져오기
  useEffect(() => {
    axios.get('/keywords', { withCredentials: true })
      .then(response => {
        console.log('Keywords fetched:', response.data); // 응답 데이터 확인
        setKeywords(response.data);
      })
      .catch(error => {
        console.error('키워드 데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);
  

  // 키워드 추가 핸들러
  const handleAddKeyword = async () => {
    if (!keywordInput || !selectedBoard) {
      alert('키워드와 사이트를 선택해주세요.');
      return;
    }

    try {
      await axios.post('/keywords', {
        siteIndex: parseInt(selectedBoard), // 배열이 아닌 단일 값으로 변경
        keyword: keywordInput,
        date: new Date().toISOString().split('T')[0]
      }, { withCredentials: true });

      setKeywordInput(''); // 입력 필드 초기화
      setSelectedBoard(''); // 선택된 보드 초기화
      // 키워드 목록을 다시 가져오도록 설정
      axios.get('/keywords', { withCredentials: true })
        .then(response => {
          setKeywords(response.data);
        })
        .catch(error => {
          console.error('키워드 데이터를 가져오는 중 오류 발생:', error);
        });
    } catch (error) {
      console.error('키워드를 추가하는 중 오류 발생:', error);
    }
  };

  // 키워드 삭제 핸들러
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('정말로 이 키워드를 삭제하시겠습니까?');
    if (!confirmDelete) return; // 사용자가 취소를 선택한 경우 함수 종료

    try {
      await axios.delete(`/keywords/${id}`, { withCredentials: true });
      setKeywords(prevKeywords => prevKeywords.filter(keyword => keyword.id !== id)); // 삭제 후 키워드 목록 업데이트
    } catch (error) {
      console.error('키워드를 삭제하는 중 오류 발생:', error);
    }
  };

  return (
    <div className="keyword-alert-container">
      <header className="header">
        <button className="back-button">←</button>
        <h1>키워드 알림 설정 ({keywords.length}개)</h1>
      </header>

      <div className="filter-container">
        <select
          className="board-select"
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
        >
          <option value="">사이트 선택</option>
          {sites.map((site, index) => (
            <option key={index} value={index}>{site}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="키워드를 입력해주세요."
          className="keyword-input"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />
        <button className="register-button" onClick={handleAddKeyword}>등록</button>
      </div>

      <ul className="keyword-list">
        {keywords.map((keyword) => (
          <li key={keyword.id} className="keyword-item">
            {/* 'keyword.site'가 문자열로 가정하고 출력 */}
            <div>
              {keyword.site}: {keyword.keyword}
            </div>
            <div className="item-controls">
              <button className="delete-button" onClick={() => handleDelete(keyword.id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordAlertSetting;