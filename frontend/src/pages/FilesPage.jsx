import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getFilesList,
  clearError,
  deleteFile,
  changeFile,
  downloadFile,
  getFileLink,
  viewFile,
} from '../store/filesSlice';
import { Button, Modal, Input, message } from 'antd';
import Loading from '../components/Loading';
import Uploader from '../components/Uploader';

const formatSizeMB = (sizeInBytes) => {
  if (!sizeInBytes) return '0 MB';
  return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const formatDateTime = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const FilesPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user_id');
  const { files, loading: isLoading, error } = useSelector(
    (state) => state.files,
  );

  const { isAuthenticated, user: currentUser } = useSelector(
    (state) => state.auth,
  );

  const [renameModal, setRenameModal] = useState({
    visible: false,
    fileId: null,
    file_name: '',
    comment: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const paramUserId = userId && !currentUser?.is_staff ? null : userId;
      dispatch(getFilesList({ userId: paramUserId }))
        .unwrap()
        .catch(() => message.error('Ошибка загрузки списка файлов'));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isAuthenticated, userId, currentUser?.is_staff]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = (fileId) => {
    dispatch(deleteFile(fileId))
      .unwrap()
      .then(() => {
        dispatch(getFilesList({ userId: userId || null }))
          .unwrap()
          .catch(() => message.error('Ошибка обновления списка файлов'));
        message.success('Файл удален');
      })
      .catch(() => message.error('Ошибка удаления'));
  };

  const handleRename = (file) => {
    setRenameModal({
      visible: true,
      fileId: file.id,
      file_name: file.file_name,
      comment: file.comment || '',
    });
  };

  const handleDownload = (fileId) => {
    dispatch(downloadFile(fileId))
      .unwrap()
      .catch(() => message.error('Ошибка скачивания'));
  };

  const handleGetLink = (fileId) => {
    dispatch(getFileLink(fileId))
      .unwrap()
      .then((link) => {
        navigator.clipboard.writeText(link);
        message.success('Ссылка скопирована в буфер обмена');
      })
      .catch(() => message.error('Ошибка получения ссылки'));
  };

  const handleView = (fileId) => {
    dispatch(viewFile(fileId))
      .unwrap()
      .catch(() => message.error('Ошибка просмотра'));
  };

  if (!isAuthenticated) {
    return (
      <div className="page-center" style={{ padding: 20 }}>
        <h1>Ваши файлы</h1>
        <p style={{ color: '#ccc' }}>
          Пожалуйста,{' '}
          <Link to="/login" style={{ color: '#8ef064', textDecoration: 'none' }}>
            войдите
          </Link>{' '}
          чтобы просмотреть файлы
        </p>
      </div>
    );
  }

  return (
    <div className="page-center" style={{ padding: 20 }}>
      <h1>Ваши файлы</h1>
      <Uploader />
      {isLoading && <Loading />}
      {error && <p className="error-message">{error}</p>}

      <div className="file-grid">
        {Array.isArray(files) && files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <strong>{file.file_name}</strong>
                <p>{file.comment || 'Без комментария'}</p>
                <p>Размер: {formatSizeMB(file.size)}</p>
                <p>Загружен: {formatDateTime(file.uploaded)}</p>
              </div>
              <div className="file-actions">
                <Button onClick={() => handleDelete(file.id)} danger>
                  Удалить
                </Button>
                <Button onClick={() => handleRename(file)}>Редактировать</Button>
                <Button onClick={() => handleDownload(file.id)}>Скачать</Button>
                <Button onClick={() => handleView(file.id)}>Просмотреть</Button>
                <Button onClick={() => handleGetLink(file.id)}>Получить ссылку</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="file-card no-files">
            Файлы не загружены или произошла ошибка
          </div>
        )}
      </div>

      <Modal
        title="Переименовать файл"
        open={renameModal.visible}
        onOk={() => {
          dispatch(
            changeFile({
              fileId: renameModal.fileId,
              file_name: renameModal.file_name,
              comment: renameModal.comment,
            }),
          )
            .unwrap()
            .then(() => {
              setRenameModal({
                visible: false,
                fileId: null,
                file_name: '',
                comment: '',
              });
              dispatch(getFilesList({ userId: userId || null }))
                .unwrap()
                .catch(() => message.error('Ошибка обновления списка файлов'));
              message.success('Файл обновлен');
            })
            .catch(() => message.error('Ошибка обновления'));
        }}
        onCancel={() =>
          setRenameModal({
            visible: false,
            fileId: null,
            file_name: '',
            comment: '',
          })
        }
      >
        <Input
          value={renameModal.file_name}
          onChange={(e) =>
            setRenameModal({ ...renameModal, file_name: e.target.value })
          }
          placeholder="Новое имя файла"
          style={{ marginBottom: '10px' }}
        />
        <Input.TextArea
          value={renameModal.comment}
          onChange={(e) =>
            setRenameModal({ ...renameModal, comment: e.target.value })
          }
          placeholder="Комментарий"
        />
      </Modal>
    </div>
  );
};

export default FilesPage;
