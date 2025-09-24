import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { downloadFile } from '../store/filesSlice';

const Downloading = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);

  const handleDownload = (fileId) => {
    dispatch(downloadFile({ fileId }))
      .unwrap()
      .catch((error) => {
        message.error(error || 'Ошибка при загрузке файла');
      });
  };

  const handleGoBack = () => {
    navigate('/admin');
  };

  return (
    <div>
      {currentUser?.is_staff && (
        <Button onClick={handleGoBack}>Вернуться к списку пользователей</Button>
      )}
      <Button onClick={() => handleDownload(1)}>Скачать файл</Button>
    </div>
  );
};

export default Downloading;
