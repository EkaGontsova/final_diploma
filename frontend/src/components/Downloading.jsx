import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import Uploader from './Uploader';

const Downloading = () => {
  const { currentUser } = useSelector(state => state.auth);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/admin');
  };

  return (
    <div className="downloading">
      {showUploadForm ? (
        <Uploader setShowForm={setShowUploadForm} />
      ) : (
        <div className="actions">
          {currentUser?.is_staff && (
            <Button onClick={handleGoBack}>Вернуться к списку пользователей</Button>
          )}
          <Button onClick={() => setShowUploadForm(true)}>Загрузить файл</Button>
        </div>
      )}
    </div>
  );
};

export default Downloading;
