/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { UploadModal } from './UploadModal';
import DeleteManyModal from '../DeleteManyModal';
import { KTSVG } from '../../../../../_metronic/helpers';
import { ImageItem } from './ImageItem';
import { db, storage } from '../../../../../service/firebase';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { doc, deleteDoc } from 'firebase/firestore';
import {
  ref,
  deleteObject,
} from 'firebase/storage';
import Modal from 'react-modal';
import { v4 as uuid } from 'uuid';
import NoUpload from '../NoUpload';
import { useAuth } from '../../../../../setup/context/AppContext';

// Image Picker URL.
const DEFAULT_IMAGE_URL = toAbsoluteUrl('media/icons/duotune/general/gen006.svg');

const InitialData = {
  ImageId: '',
  ImageName: '',
  ImageURL: DEFAULT_IMAGE_URL,
  CreatedDate: new Date(),
  Title: '',
  Description: '',
  Tags: '',
  UserId: ''
}

type Props = {
  className: string
}

type AcccetedFileGroup = 'image' | 'other';

const ImageUploadPage: React.FC<Props> = ({ className }) => {
  const [imageItems, setImageItems] = useState<any>([]);
  const [imageFile, setImageFile] = useState<any>({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const fileInputRef = useRef<any>();
  const { userData } = useAuth()
  const [data, setData] = useState({
    ImageId: InitialData.ImageId,
    ImageName: InitialData.ImageName,
    ImageURL: InitialData.ImageURL,
    Title: InitialData.Title,
    Description: InitialData.Description,
    Tags: InitialData.Tags,
    UserId: InitialData.UserId,
  });
  const [deleting, setDeleting] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [checkState, setCheckState] = useState<any>({});
  const [uploadState, setUploadState] = useState<any>({});
  const [imgName, setImgName] = useState<any>({});
  const [imgId, setImgId] = useState<any>({});
  const [singleSelect, setSingleSelect] = useState<boolean>(false);
  const [noneSelect, setNoneSelect] = useState<boolean>(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [drag, setDrag] = useState<boolean>(false);
  let timer : any = null;
  // Drag and Drop
  const dragOver = (e: any) => {
    e.preventDefault();
    setDrag(true);
    clearTimeout(timer);
  }


  const dragLeave = (e: any) => {
    e.preventDefault();
    timer = setTimeout(() =>setDrag(false) ,500)
  }

  const fileDrop = (e: any) => {
    e.preventDefault();
    setDrag(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }


  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  }

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        let imgUrl = URL.createObjectURL(files[i]);
        let imgName = files[i].name.replace(" ", "_");
        let uid = getUid();
        setImageItems((prevItems: any) => [{
          ImageId: '',
          ImageName: imgName,
          Title: 'Untitled',
          Description: '',
          Tags: '',
          ImageURL: imgUrl,
          UserId: userData.UserID,
          imageFile: files[i],
          isNew: true,
          id: uid
        }, ...prevItems]);
        checkState[uid] = false;
        setCheckState(checkState)
        uploadState[uid] = true;
        setUploadState(uploadState);
      } else {
      }
    }
  }

  const getFileType = (file: File): AcccetedFileGroup => {
    if (file.type.indexOf('image') !== -1) {
      return 'image'
    } else {
      return 'other'
    }
  }

  const validateFile = (file: any) => {
    if (getFileType(file) === 'image') {
      return true;
    }
    else {
      return false;
    }
  }

  // It is called when imageItem's checkbox has changed
  const handleChange = (value: any, id: any) => {
    const index = imageItems.findIndex((item: any) => item.id === id);
    checkState[id] = value;
    setCheckState(checkState);
    let tempSelectedImages: any[] = selectedImages;
    if (value) {
      let imageItem = imageItems[index]
      imageItem.ImageName = imgName[id];
      imageItem.ImageId = imgId[id];
      tempSelectedImages = [...selectedImages, imageItem];
    }
    else {
      tempSelectedImages = selectedImages.filter((img: any) => img.id !== id)
    }
    setSelectedImages([...tempSelectedImages])
    handleSelectAll(tempSelectedImages);
  }

  const handleSelectAll = (selectedImages: any) => {
    if (selectedImages.length >= imageItems.length) {
      setSelectAll(true);
    }
    else {
      setSelectAll(false);
    }
  }
  // It is called when individual imageItem has updated 
  const handleImgDataChange = (imgname: any, imgid: any, id: any) => {
    imgName[id] = imgname;
    imgId[id] = imgid;
    uploadState[id] = false;
    setImgName(imgName);
    setImgId(imgId);
    setUploadState(uploadState);
  }

  useEffect(() => {
    if (selectedImages.length > 1) {
      setNoneSelect(false);
      setSingleSelect(false);
    }
    else if (selectedImages.length === 1) {
      setNoneSelect(false);
      setSingleSelect(true);
    }
    else if (selectedImages.length >= 0) {
      setNoneSelect(true);
      setSingleSelect(false);
    }
  }, [selectedImages])

  // it is called when selete All checkbox has checked
  const handleChangeAll = (event: any) => {
    let value = event.target.checked;
    setSelectAll(selectAll => value);

    let tempItems: any[] = imageItems;
    let j;

    if (value) {
      for (j = 0; j < tempItems.length; j++) {
        let id = imageItems[j].id;

        if (uploadState[id] === false) {
          checkState[id] = value;
          tempItems[j].ImageName = imgName[id];
          tempItems[j].ImageId = imgId[id];
          let item = tempItems[j];
          setImageItems((items: any) => [...tempItems]);
          setCheckState(checkState);
          setSelectedImages((items: any) => [...items, item]);
        }
      }
    }
    else {
      for (var i = 0; i < imageItems.length; i++) {
        let id = imageItems[i].id;
        checkState[id] = value;
        setCheckState(checkState);
      }
      setSelectedImages([]);
      setNoneSelect(true);
      setSingleSelect(false);
    }
  }

  // it is called when Image of Upload modal has changed
  const handleImageChange = (file: any) => {
    setImageFile(file);
  }
  // it is called when Upload button has pressed
  const handleDataChange = (newData: any) => {
    setData(data => ({
      ...data,
      ...newData
    }));
  }
  // get Unique id of imageItem
  const getUid = () => {
    return uuid();
  }
  // handel modal
  function openModal() {
    setIsOpen(true);
    setImageFile({});
  }

  function closeModal() {
    setIsOpen(false);
  }
  // it is called when Upload button has pressed
  const handleUpload = () => {
    let uid = getUid();
    setImageItems([{ ...data, UserId: userData.UserID, imageFile: imageFile, isNew: true, id: uid }, ...imageItems]);
    checkState[uid] = false;
    setCheckState(checkState);
    uploadState[uid] = true;
    setUploadState(uploadState);
  }

  useEffect(() => {
    if (imageItems.length <= 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [imageItems, empty])

  // it is called when Delete button has pressed
  const handleDelete = () => {
    let promises = [];
    for (var i = 0; i < selectedImages.length; i++) {
      let imageId = selectedImages[i].ImageId;
      let imageName = selectedImages[i].ImageName;
      let id = selectedImages[i].id;
      promises.push(deleteItem(imageId, imageName, id));
    }
    return Promise.all(promises).then(result => {

    });
  }

  const handleOneDelete = (imageId: string, imageName: string, id: any) => {
    let tempItem = { "ImageId": imageId, "ImageName": imageName, "id": id };
    let premake = selectedImages.filter((item: any) => tempItem.id === id)
    if (premake.length <= 0) {
      setSelectedImages((items: any) => [...items, tempItem]);
    }
  }

  // Delete item from db and storage.
  const deleteItem = (imageId: string, imageName: string, id: any) => {
    setDeleting(true);
    const fileRef = ref(storage, "Images/" + imageName);
    deleteObject(fileRef)
      .then(() => {
        // File deleted, do something...
        console.log('Sucess Delete...')
      })
      .catch((error) => {
        console.log(error);
      });
    const itemDoc = doc(db, "ImageData", imageId);
    deleteDoc(itemDoc);
    // reset imageItems
    setImageItems((imageItems: any) => imageItems.filter((item: any) => item.id !== id));
    // initialize selectedImages
    setSelectedImages([]);
    setSelectAll(false);
    setNoneSelect(true);
    setDeleting(false);
  };

  const customStyles = {
    content: {
      backgroundColor: 'transparent',
      border: 'none',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      padding: 0
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 1055
    }
  };


  const divStyle = drag ? {
    borderStyle: 'dashed',
    borderColor: 'deepSkyblue',
    borderWidth: '4px'
  } : {}


  return (
    <div className={`card ${className}`}
      style={divStyle}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
    >
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Upload</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-placement='top'
        >
          <button
            className='btn btn-light-warning btn-sm'
            disabled={noneSelect || deleting}
            style={{ marginRight: '5px' }}
            data-bs-toggle="modal" data-bs-target={
              singleSelect ? '#delete-one-confirm-modal' : '#delete-multi-confirm-modal'
            }
          >
            Delete
          </button>
          <DeleteManyModal handleDelete={handleDelete} />


          <button
            className='btn btn-sm btn-light-primary'
            onClick={openModal}
          >
            <KTSVG path='media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            Upload
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Upload"
          >
            <UploadModal
              InitialData={InitialData}
              ImageFile={null}
              handleUpload={handleUpload}
              handleImageChange={handleImageChange}
              handleDataChange={handleDataChange}
              closeModal={closeModal}
            />
          </Modal>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      disabled={empty}
                      checked={selectAll}
                      onChange={handleChangeAll}
                    />
                  </div>
                </th>
                <th className='min-w-140px'>Image</th>
                <th className='min-w-150px'>User</th>
                <th className='min-w-120px'>Progress</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {
                imageItems.length > 0 ?
                  imageItems.map((item: any) => {
                    return (
                      <ImageItem
                        key={item.id}
                        InitialData={item}
                        deleteItem={handleOneDelete}
                        checked={checkState[item.id]}
                        onChange={handleChange}
                        handleImgDataChange={handleImgDataChange}
                      />
                    );
                  }) : (
                    <NoUpload />
                  )
              }
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
        <input
          ref={fileInputRef}
          style={{ display: 'none' }}
          type="file"
          multiple
          onChange={filesSelected}
        />
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { ImageUploadPage }
