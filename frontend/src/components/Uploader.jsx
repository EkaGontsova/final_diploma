import { useDispatch } from 'react-redux';
import { Button, Upload } from 'antd';
import { uploadFile, getFilesList } from '../store/filesSlice';  

const Uploader = ({ setShowForm }) => {
  const dispatch = useDispatch();

  const handleUpload = (file) => {
    dispatch(uploadFile({ file }))
      .unwrap()
      .then(() => {
        if (setShowForm) {
          setShowForm(false);
        }
        dispatch(getFilesList());
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="uploader">
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
    </div>
  );
};

export default Uploader;
