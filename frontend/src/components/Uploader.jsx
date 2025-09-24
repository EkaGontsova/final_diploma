import React from 'react';
import { useDispatch } from 'react-redux';
import { Upload, Button, message } from 'antd';
import { uploadFile, getFilesList } from '../store/filesSlice';

const Uploader = ({ setShowForm }) => {
  const dispatch = useDispatch();

  const handleUpload = (file) => {
    dispatch(uploadFile({ file }))
      .unwrap()
      .then(() => {
        if (setShowForm) setShowForm(false);
        dispatch(getFilesList());
        message.success('Файл успешно загружен');
      })
      .catch((error) => {
        const errorMsg = error?.message || error || 'Ошибка загрузки файла';
        message.error(errorMsg);
      });
  };

  return (
    <Upload
      beforeUpload={(file) => {
        handleUpload(file);
        return false;
      }}
      accept=".txt,.doc,.docx,.pdf,.xls,.xlsx,.csv,.bmp,.jpg,.jpeg,.png,.gif,.tiff,.xml"
      showUploadList={false}
    >
      <Button>Выберите файл</Button>
    </Upload>
  );
};

export default Uploader;
