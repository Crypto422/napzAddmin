import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { UploadModal } from './UploadModal'
import { db, storage } from '../../../../../service/firebase';
import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import {
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import Modal from 'react-modal';
import { useAuth } from '../../../../../setup/context/AppContext';

export const ImageItem = (props: any) => {
    const {
        InitialData,
        deleteItem,
        checked,
        onChange,
        handleImgDataChange,
    } = props
    const [uploading, setUploading] = useState<Boolean>(false);
    const { userData } = useAuth()
    const [avatar, setAvatar] = useState('')
    const [imageFile, setImageFile] = useState<any>(InitialData.imageFile);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [currentImageUrl, setImageUrl] = useState(InitialData.ImageURL);
    const [preImageName, setPreImageName] = useState<string>(InitialData.ImageName);
    const [progress, setProgress] = useState(0);
    const [startUpdate, setStartUpdate] = useState<boolean>(false);
    const [data, setData] = useState({
        id: InitialData.id,
        ImageId: InitialData.ImageId,
        ImageName: InitialData.ImageName,
        ImageURL: InitialData.ImageURL,
        Title: InitialData.Title,
        Description: InitialData.Description,
        Tags: InitialData.Tags,
        UserId: InitialData.UserId
    });
    const [preData, setPreData] = useState({
        id: InitialData.id,
        ImageId: InitialData.ImageId,
        ImageName: InitialData.ImageName,
        ImageURL: InitialData.ImageURL,
        Title: InitialData.Title,
        Description: InitialData.Description,
        Tags: InitialData.Tags,
        UserId: InitialData.UserId
    });
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

    useEffect(() => {
        if (data.ImageId !== "") {
            setProgress(100)
        }
        if (imageFile && InitialData.isNew) {
            uploadDataToDb()
        }
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setAvatar(
            userData?.AvatarURL || ''
        )
    }, [userData])


    const handleImageChange = (file: any) => {
        setImageFile(file);
    }

    const handleCheckChange = (event: any) => {
        let value = event.target.checked;
        onChange(value, data.id);
    }

    const handleDataChange = (newData: any) => {
        setData(data => ({
            ...data,
            ...newData
        }));
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleDelete = () => {
        deleteItem(data.ImageId, preImageName, data.id);
    }

    const isItemChaged = (data: any) => {
        let flag =
            data.ImageURL !== preData.ImageURL
            || data.Title !== preData.Title
            || data.Description !== preData.Description
            || data.Tags !== preData.Tags;

        return flag
    }

    useEffect(() => {
        if(startUpdate){
            if (isItemChaged(data)) {
                Update();
                setPreData(preData => ({ ...preData, ...data }));
            }
        }
        // eslint-disable-next-line
    }, [data, startUpdate])

    const handleUpdate = () => {
        setStartUpdate(true);
    }

    const Update = () => {

        if (isItemChaged(data)) {
            if (data.ImageURL !== currentImageUrl) {
                deleteImageFromStorage();
            }
            else {
                updateDataToDb(data.ImageURL, data.ImageName, data.ImageId);
            }
        }
        else {
            console.log('No data changed')
        }
    }


    const uploadDataToDb = () => {
        const item = {
            ImageName: data.ImageName,
            ImageId: data.ImageId,
            CreatedDate: new Date(),
            ImageURL: data.ImageURL,
            Title: data.Title,
            Description: data.Description,
            Tags: data.Tags,
            UserId: data.UserId,
            UploadCompleted: false
        };
        try {
            addDoc(collection(db, "ImageData"), item)
                .then((docRef: any) => {
                    let imgName = `${data.ImageName}_${docRef.id}`;
                    updateDoc(docRef, 
                        { 
                            ImageId: docRef.id, 
                            ImageName: imgName,
                            UploadCompleted: true
                         })
                    data['ImageId'] = docRef.id;
                    setData(data);
                    InitialData.isNew = false;
                    uploadImageToStorage(docRef.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    // Upload image to stroage, and data to db.
    const uploadImageToStorage = (imgId: string) => {
        let imgName = `${data.ImageName}_${imgId}`;
        const storageRef = ref(storage, "Images/" + imgName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        setUploading(true);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                let prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    data['ImageURL'] = downloadURL;
                    data['ImageName'] = imgName;
                    setData(data);
                    setImageUrl(downloadURL);
                    setPreImageName(imgName);
                    updateDataToDb(downloadURL, imgName, imgId);
                });
            }
        );
    };


    const updateDataToDb = (downloadURL: string, imgName: string, imgId: string) => {
        setUploading(true);
        const itemDocRef = doc(db, "ImageData", imgId);
        const item = {
            ImageName: imgName,
            ImageId: imgId,
            CreatedDate: new Date(),
            ImageURL: downloadURL,
            Title: data.Title,
            Description: data.Description,
            Tags: data.Tags,
            UserId: data.UserId
        }
        updateDoc(itemDocRef, item)
            .then(() => {
                console.log('success Update');
                handleImgDataChange(item.ImageName, item.ImageId, data.id);
                setUploading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Delete item from storage
    const deleteImageFromStorage = () => {
        const fileRef = ref(storage, "Images/" + preImageName);
        deleteObject(fileRef)
            .then(() => {
                uploadImageToStorage(data.ImageId);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <tr>
            <td>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                        className='form-check-input widget-9-check' type='checkbox'
                        checked={checked}
                        disabled={uploading === true}
                        onChange={handleCheckChange}
                    />
                </div>
            </td>
            <td>
                <div className='d-flex align-items-center'>
                    <div className='symbol symbol-45px me-5'>
                        <img style={{ objectFit: 'cover' }} src={data.ImageURL} alt='' />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                        <a href='/#' className='text-dark fw-bolder text-hover-primary fs-6'>
                            {data.Title}
                        </a>
                    </div>
                </div>
            </td>
            <td>
                <div className='d-flex align-items-center'>
                    <div className='symbol symbol-45px me-5'>
                        <img style={{ objectFit: 'cover' }}
                            alt='Logo'
                            src={
                                avatar.length > 0 ? avatar : toAbsoluteUrl('/media/avatars/blank.png')
                            } />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                        <a href='/#' className='text-dark fw-bolder text-hover-primary fs-6'>
                            {userData.Username}
                        </a>
                        <span className='text-muted fw-bold text-muted d-block fs-7'>
                            HTML, JS, ReactJS
                        </span>
                    </div>
                </div>
            </td>
            <td className='text-end'>
                <div className='d-flex flex-column w-100 me-2'>
                    <div className='d-flex flex-stack mb-2'>
                        <span className='text-muted me-2 fs-7 fw-bold'>
                            {progress}% / 100%
                        </span>
                    </div>
                    <div className='progress h-6px w-100'>
                        <div
                            className='progress-bar bg-primary'
                            role='progressbar'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </td>
            <td>
                <div className='d-flex justify-content-end flex-shrink-0'>
                    <button
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        disabled={uploading === true}
                        onClick={openModal}
                    >
                        <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                    </button>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Edit"
                    >
                        <UploadModal
                            InitialData={data}
                            ImageFile={imageFile}
                            handleUpload={handleUpdate}
                            handleImageChange={handleImageChange}
                            handleDataChange={handleDataChange}
                            edit={true}
                            closeModal={closeModal}
                        />
                    </Modal>
                    <button
                        disabled={uploading === true}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        data-bs-toggle="modal" data-bs-target="#delete-one-confirm-modal"
                        onClick={handleDelete}
                    >
                        <KTSVG
                            path='/media/icons/duotune/general/gen027.svg'
                            className='svg-icon-3'
                        />
                    </button>
                </div>
            </td>
        </tr>
    )
};