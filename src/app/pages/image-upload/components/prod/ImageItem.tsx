import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { UploadModal } from './UploadModal';
import { storage } from '../../../../../service/firebase';
import {
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../auth/models/UserModel'
import { RootState } from '../../../../../setup'
import { createImageData, updateImageData } from '../../ImageUploadCRUD'

export const ImageItem = (props: any) => {
    const {
        InitialData,
        deleteItem,
        checked,
        onChange,
        handleImgDataChange,
    } = props
    const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
    const [uploading, setUploading] = useState<Boolean>(false);
    const [imageFile, setImageFile] = useState<any>(InitialData.imageFile);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [currentImageUrl, setImageUrl] = useState(InitialData.image_url);
    const [preImageName, setPreImageName] = useState<string>(InitialData.image_name);
    const [progress, setProgress] = useState(0);
    const [startUpdate, setStartUpdate] = useState<boolean>(false);
    const [mdata, setData] = useState({
        id: InitialData.id,
        image_id: InitialData.image_id,
        image_name: InitialData.image_name,
        image_url: InitialData.image_url,
        title: InitialData.title,
        description: InitialData.description,
        tags: InitialData.tags,
        user_id: InitialData.user_id
    });
    const [preData, setPreData] = useState({
        id: InitialData.id,
        image_id: InitialData.image_id,
        image_name: InitialData.image_name,
        image_url: InitialData.image_url,
        title: InitialData.title,
        description: InitialData.description,
        tags: InitialData.tags,
        user_id: InitialData.user_id
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
        if (mdata.image_id > 0) {
            setProgress(100)
        }
        if (imageFile && InitialData.isNew) {
            uploadDataToDb()
        }
        // eslint-disable-next-line
    }, [])


    const handleImageChange = (file: any) => {
        setImageFile(file);
    }

    const handleCheckChange = (event: any) => {
        let value = event.target.checked;
        onChange(value, mdata.id);
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
        deleteItem(mdata.image_id, preImageName, mdata.id);
    }

    const isItemChaged = (data: any) => {
        let flag =
            data.image_url !== preData.image_url
            || data.title !== preData.title
            || data.description !== preData.description
            || data.tags !== preData.tags;

        return flag
    }

    useEffect(() => {
        if (startUpdate) {
            if (isItemChaged(mdata)) {
                Update();
                setPreData(preData => ({ ...preData, ...mdata }));
            }
        }
        // eslint-disable-next-line
    }, [mdata, startUpdate])

    const handleUpdate = () => {
        setStartUpdate(true);
    }

    const Update = () => {

        if (isItemChaged(mdata)) {
            if (mdata.image_url !== currentImageUrl) {
                deleteImageFromStorage();
            }
            else {
                updateDataToDb(mdata.image_url, mdata.image_name, mdata.image_id);
            }
        }
        else {
            console.log('No data changed')
        }
    }


    const uploadDataToDb = () => {
        const item = {
            image_name: mdata.image_name,
            image_url: mdata.image_url,
            title: mdata.title,
            description: mdata.description,
            tags: mdata.tags,
            user_id: user.id,
            upload_completed: false
        };
        try {
            createImageData(item)
                .then((res) => {
                    let { data } = res;
                    InitialData.isNew = false;
                    mdata['image_id'] = data.id;
                    setData(mdata);
                    uploadImageToStorage(data.id);
                })
                .catch((err) => {

                })
        } catch (error) {
            console.log(error);
        }
    };

    // Upload image to stroage, and data to db.
    const uploadImageToStorage = (imgId: number) => {
        let imgName = `${mdata.image_name}_${imgId}`;
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
                    mdata['image_url'] = downloadURL;
                    mdata['image_name'] = imgName;
                    setData(mdata);
                    setImageUrl(downloadURL);
                    setPreImageName(imgName);
                    updateDataToDb(downloadURL, imgName, imgId);
                });
            }
        );
    };


    const updateDataToDb = (downloadURL: string, imgName: string, imgId: number) => {
        setUploading(true);
        const item = {
            image_name: imgName,
            image_url: downloadURL,
            title: mdata.title,
            description: mdata.description,
            tags: mdata.tags,
            user_id: user.id,
            upload_completed: true
        }
        updateImageData(imgId, item)
            .then((res) => {
                let { data } = res
                console.log('success Update');
                mdata["image_id"] = data.id;
                setData(mdata);
                handleImgDataChange(data.image_name, data.id, mdata.id);
                setUploading(false);
            })
            .catch((err) => {
                console.log("Fail imageData Update...")
            })
    }

    // Delete item from storage
    const deleteImageFromStorage = () => {
        const fileRef = ref(storage, "Images/" + preImageName);
        deleteObject(fileRef)
            .then(() => {
                uploadImageToStorage(mdata.image_id);
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
                        <img style={{ objectFit: 'cover' }} src={mdata.image_url} alt='' />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                        <a href='/#' className='text-dark fw-bolder text-hover-primary fs-6'>
                            {mdata.title}
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
                                user.avatar_url.length > 0 ? user.avatar_url : toAbsoluteUrl('/media/avatars/blank.png')
                            } />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                        <a href='/#' className='text-dark fw-bolder text-hover-primary fs-6'>
                            {user.username}
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
                            InitialData={mdata}
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