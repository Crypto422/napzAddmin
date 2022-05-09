/* eslint-disable jsx-a11y/anchor-is-valid */
import { KTSVG } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { UploadModal } from '../../../image-upload/components/prod/UploadModal';
import { AnalyseModal } from './AnalyseModal';
import { storage } from '../../../../../service/firebase';

import {
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import Modal from 'react-modal';
import { deleteAnalysedData} from '../../AnalysedDataCRUD'
import { createImageData, updateImageData } from '../../../image-upload/ImageUploadCRUD'
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../auth/models/UserModel'
import { RootState } from '../../../../../setup'

export const AnalyseImageCard = (props: any) => {
    const {
        InitialData,
        deleteItem,
    } = props
    const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
    const [uploading, setUploading] = useState<Boolean>(false);
    const [imageFile, setImageFile] = useState<any>(InitialData.imageFile);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [currentImageUrl, setImageUrl] = useState(InitialData.image_url);
    const [preImageName, setPreImageName] = useState<string>(InitialData.image_name);
    const [startUpdate, setStartUpdate] = useState<boolean>(false);
    const [mdata, setData] = useState({
        id: InitialData.id,
        image_name: InitialData.image_name,
        image_url: InitialData.image_url,
        title: InitialData.title,
        description: InitialData.description,
        tags: InitialData.tags,
        user_id: InitialData.user_id
    });
    const [preData, setPreData] = useState({
        id: InitialData.id,
        image_name: InitialData.image_name,
        image_url: InitialData.image_url,
        title: InitialData.title,
        description: InitialData.description,
        tags: InitialData.tags,
        user_id: InitialData.user_id
    });

    // Analyse
    const [analysedData, setAnalysedData] = useState<any>(null);
    const [analysedId, setAnalysedId] = useState<any>('');
    const [analyse, setAnalyse] = useState<boolean>(false);
    const [isAModalOpen, setAModalOpen] = React.useState(false);

    const differencetime = Math.abs(new Date().getTime() - new Date(InitialData.created_date).getTime());

    let difDays = 0

    const differenceDays = differencetime / (1000 * 3600 * 24);

    if (differenceDays < 1) {
        difDays = 0;
    } else {
        difDays = Math.ceil(differenceDays);
    }

    const display = difDays <= 0 ? "Today" : `${difDays} days ago`;
    // handel modal
    function openAModal() {
        if (!uploading)
            setAModalOpen(true);
    }

    function closeAModal() {
        setAModalOpen(false);
    }

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

    const handleImageChange = (file: any) => {
        setImageFile(file);
    }

    const handleDataChange = (newData: any) => {
        setData(mdata => ({
            ...mdata,
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
        deleteItem(mdata.id, preImageName, analysedId);
    }

    const isItemChaged = (mdata: any) => {
        let flag =
            mdata.image_url !== preData.image_url
            || mdata.title !== preData.title
            || mdata.description !== preData.description
            || mdata.tags !== preData.tags;

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
                updateDataToDb(mdata.image_url);
            }
        }
        else {
            console.log("No mdata changed!!!")
        }
    }

    const uploadDataToDb = (downloadURL: string) => {
        const item = {
            image_name: mdata.image_name,
            image_url: downloadURL,
            title: mdata.title,
            description: mdata.description,
            tags: mdata.tags,
            user_auth_id: user.user_auth_id,
            user_id: user.id,
            upload_completed: false
        };
        try {
            createImageData(item)
                .then((res) => {
                    let { data } = res;
                    mdata['id'] = data.id;
                    setData(mdata);
                    InitialData.isNew = false;
                    setUploading(false);
                })
                .catch((error) => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    };

    // Upload image to stroage, and mdata to db.
    const uploadImageToStorage = () => {
        let imgName = `${mdata.image_name}_${mdata.id}`;
        const storageRef = ref(storage, "Images/" + imgName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        setUploading(true);
        uploadTask.on(
            "state_changed",
            (snapshot) => {

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
                    if (InitialData.isNew) {
                        uploadDataToDb(downloadURL);
                    } else {
                        updateDataToDb(downloadURL);
                    }
                });
            }
        );
    };



    const updateDataToDb = (downloadURL: string) => {
        setUploading(true);
        const item = {
            image_name: mdata.image_name,
            image_url: downloadURL,
            title: mdata.title,
            description: mdata.description,
            tags: mdata.tags,
            user_id: user.id,
            upload_completed: true
        }

        updateImageData(mdata.id, item)
            .then((res) => {
                console.log('Success imageData Update...');
                setUploading(false);
            })
            .catch((err) => {
                console.log('Fail imageData Update...');
            })
    }

    // Delete item from storage
    const deleteImageFromStorage = () => {
        const imgRef = ref(storage, "Images/" + preImageName);
        deleteObject(imgRef)
            .then(() => {
                console.log('Success image Delete...')
                uploadImageToStorage();
            })
            .catch((error) => {
                // console.log(error);
            });
        if (analyse) {
            const jsonFileRef = ref(storage, "AnalysedJsonData/" + preImageName + ".json");
            deleteObject(jsonFileRef)
                .then(() => {
                    console.log('Success json Delete...')
                })
                .catch((error) => {
                    console.log('Fail json Delete...')
                });
            deleteAnalysedData(analysedId)
                .then((res) => {
                    console.log('Success analysedData Delete...')
                })
                .catch((err) => {
                    console.log('Fail analysedData Delete...')
                })
            setAnalyse(false);
        }
    };


    const getImageItemsFromDb = () => {
        const { analysedData } = InitialData;
        if (analysedData === undefined) {
            setAnalysedData(null);
            setAnalyse(false);
        } else {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
                const fr = new FileReader();
                fr.onload = (e: any) => {
                    setAnalysedData(JSON.parse(e.target.result));
                };
                fr.readAsText(blob);
            };
            xhr.open('GET', analysedData.data_url);
            xhr.send();

            setAnalysedId(analysedData.id)
            setAnalyse(true);
        }
    };

    useEffect(() => {
        getImageItemsFromDb();
        // eslint-disable-next-line
    }, [])

    return (
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
            <div className='card  h-100' style={{ minWidth: '200px', cursor: 'pointer' }}>
                <div className={uploading ? `overlay overlay-block rounded` : ''}>
                    <div className={uploading ? `overlay-wrapper` : ''}>
                        <div className='card-toolbar d-flex justify-content-end'>
                            <button
                                type='button'
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary mr-2'
                                disabled={uploading === true}
                                onClick={openModal}
                            >
                                <KTSVG path='/media/icons/duotune/art/art003.svg' className='svg-icon-2' />
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
                                type='button'
                                onClick={handleDelete}
                                disabled={uploading === true}
                                data-bs-toggle="modal" data-bs-target="#delete-confirm-modal"
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                            >
                                <KTSVG path='/media/icons/duotune/art/art004.svg' className='svg-icon-2' />
                            </button>
                        </div>
                        <div className='card-body d-flex justify-content-center text-center flex-column p-2'>
                            <a
                                onClick={openAModal}
                                className='text-gray-800 text-hover-primary d-flex flex-column'
                            >
                                <div className='symbol symbol-75px mb-6'>
                                    <img style={{ objectFit: 'cover' }} src={mdata.image_url} alt='' />
                                </div>
                                <div className='fs-5 fw-bolder mb-2'>{mdata.title}</div>
                            </a>

                            <Modal
                                isOpen={isAModalOpen}
                                onRequestClose={closeAModal}
                                style={customStyles}
                                ariaHideApp={false}
                                contentLabel="Analyse"
                            >
                                <AnalyseModal
                                    InitialData={mdata}
                                    preImageName={preImageName}
                                    analysedData={analysedData}
                                    setAnalysedData={setAnalysedData}
                                    analyse={analyse}
                                    setAnalyse={setAnalyse}
                                    setAnalysedId={setAnalysedId}
                                    closeModal={closeAModal}
                                />
                            </Modal>
                            <div className='fs-7 fw-bold text-gray-400 mt-auto'>{display}</div>
                        </div>
                    </div>
                    {
                        uploading ? (<div className="overlay-layer rounded bg-dark bg-opacity-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>) : (<></>)
                    }

                </div>
            </div>
        </div>
    )
};