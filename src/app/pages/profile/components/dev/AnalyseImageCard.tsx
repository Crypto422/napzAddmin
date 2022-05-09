/* eslint-disable jsx-a11y/anchor-is-valid */
import { KTSVG } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { UploadModal } from '../../../image-upload/components/dev/UploadModal';
import { AnalyseModal } from './AnalyseModal';
import { db, storage } from '../../../../../service/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, where, query } from 'firebase/firestore';
import {
    ref,
    deleteObject,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import Modal from 'react-modal';

export const AnalyseImageCard = (props: any) => {
    const {
        InitialData,
        deleteItem,
    } = props
    const [uploading, setUploading] = useState<Boolean>(false);
    const [imageFile, setImageFile] = useState<any>(InitialData.imageFile);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [currentImageUrl, setImageUrl] = useState(InitialData.ImageURL);
    const [preImageName, setPreImageName] = useState<string>(InitialData.ImageName);
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

    // Analyse
    const [analysedData, setAnalysedData] = useState<any>(null);
    const [analysedId, setAnalysedId] = useState<any>('');
    const [analyse, setAnalyse] = useState<boolean>(false);
    const [isAModalOpen, setAModalOpen] = React.useState(false);

    const dateConverted = InitialData.CreatedDate.seconds * 1000;
    const differencetime = Math.abs(new Date().getTime() - new Date(dateConverted).getTime());

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
        deleteItem(data.ImageId, preImageName, data.id, analysedId);
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
        if (startUpdate) {
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
                updateDataToDb(data.ImageURL);
            }
        }
        else {
            console.log("No data changed!!!")
        }
    }

    const uploadDataToDb = (downloadURL: string) => {
        const item = {
            ImageName: data.ImageName,
            ImageId: data.ImageId,
            CreatedDate: new Date(),
            ImageURL: downloadURL,
            Title: data.Title,
            Description: data.Description,
            Tags: data.Tags,
            UserId: data.UserId
        };
        try {
            addDoc(collection(db, "ImageData"), item)
                .then((docRef: any) => {
                    updateDoc(docRef, { ImageId: docRef.id })
                    data['ImageId'] = docRef.id;
                    setData(data);
                    InitialData.isNew = false;
                    setUploading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    // Upload image to stroage, and data to db.
    const uploadImageToStorage = () => {
        let imgName = `${data.ImageName}_${data.ImageId}`;
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
                    data['ImageURL'] = downloadURL;
                    data['ImageName'] = imgName;
                    setData(data);
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
        const itemDocRef = doc(db, "ImageData", data.ImageId);
        const item = {
            ImageName: data.ImageName,
            ImageId: data.ImageId,
            CreatedDate: new Date(),
            ImageURL: downloadURL,
            Title: data.Title,
            Description: data.Description,
            Tags: data.Tags,
            UserId: data.UserId
        }
        updateDoc(itemDocRef, item)
            .then(() => {
                console.log('success Update')
                setUploading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Delete item from storage
    const deleteImageFromStorage = () => {
        const imgRef = ref(storage, "Images/" + preImageName);
        deleteObject(imgRef)
          .then(() => {
            console.log('Sucess image Delete...')
            uploadImageToStorage();
          })
          .catch((error) => {
            // console.log(error);
          });
        const jsonFileRef = ref(storage, "AnalysedJsonData/" + preImageName + ".json");
        deleteObject(jsonFileRef)
          .then(() => {
            console.log('Sucess json Delete...')
          })
          .catch((error) => {
            // console.log(error);
          });
        if (analyse) {
            const analyseDoc = doc(db, "AnalysedData", analysedId);
            deleteDoc(analyseDoc);
            setAnalyse(false);
        }
    };


    const getImageItemsFromDb = () => {
        const q = query(collection(db, "AnalysedData"), where("ImageId", "==", InitialData.ImageId));
        getDocs(q)
            .then((data) => {
                let tempData = data.docs.map((doc) => ({ ...doc.data(), analysedId: doc.id }));
                if (tempData.length > 0) {
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
                    // @ts-ignore
                    xhr.open('GET', tempData[0].DataURL);
                    xhr.send();

                    setAnalysedId(tempData[0].analysedId)
                    setAnalyse(true);

                } else {
                    setAnalysedData(null);
                    setAnalyse(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
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
                                    <img style={{ objectFit: 'cover' }} src={data.ImageURL} alt='' />
                                </div>
                                <div className='fs-5 fw-bolder mb-2'>{data.Title}</div>
                            </a>

                            <Modal
                                isOpen={isAModalOpen}
                                onRequestClose={closeAModal}
                                style={customStyles}
                                ariaHideApp={false}
                                contentLabel="Analyse"
                            >
                                <AnalyseModal
                                    InitialData={data}
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