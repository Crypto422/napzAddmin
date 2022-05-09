/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { storage } from '../../../../../service/firebase';
import { useState } from 'react';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useEffect } from 'react';

const DOC_URL = toAbsoluteUrl('/media/svg/files/dark/doc.svg')

const AttachmentFileItem = (props: any) => {
    const {
        initialData,
        deleteItem,
        save,
        handleFileUploadFinished
    } = props;

    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0);
    const [displayName, setDisplayName] = useState<string>("");

    const handleDelete = () => {
        deleteItem(initialData.id);
    }

    const handeFileDataChanged = (downloadURL: string, fileName: string) => {
        handleFileUploadFinished(initialData.id, downloadURL, fileName)
    }

    useEffect(() => {
        if (initialData.uploaded) {
            setProgress(100);
        } else {
            setProgress(0);
        }
        // eslint-disable-next-line
    }, [])

    // get Unique id of imageItem
    const getUid = () => {
        return uuid();
    }

    const uploadFileToStorage = () => {
        let fileName = `${initialData.name}_${getUid()}`
        const storageRef = ref(storage, 'TicketFiles/' + fileName);
        try {
            const uploadTask = uploadBytesResumable(storageRef, initialData.file);
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
                        handeFileDataChanged(downloadURL, fileName);
                    });
                }
            );
        } catch (error) {
            console.log("MediaFileUploadFail:  ", error);
        }
    }

    useEffect(() => {
        if (save) {
            if (!initialData.uploaded) {
                uploadFileToStorage();
            }
        }
        // eslint-disable-next-line
    }, [save])

    useEffect(() => {
        let index = initialData.name.lastIndexOf(".")
        let extension = initialData.name.slice(index);
        let name = initialData.name.slice(0, index);
        if (name.length > 12) {
            name = name.slice(0, 12) + "...  " + extension
            setDisplayName(name);
        } else {
            setDisplayName(initialData.name);
        }
    }, [initialData])

    return (
        <div className='d-flex  flex-wrap gap-3  align-items-center mt-7'>
            {/* begin::Symbol */}
            <div className='symbol symbol-40px  me-4'>
                <img
                    alt=''
                    src={initialData.type === 'image' ? initialData.url : DOC_URL}
                    style={{ objectFit: 'cover' }}
                    className='mw-100'
                />
            </div>
            {/* end::Symbol */}

            {/* begin::Title */}
            <div className='d-flex flex-column flex-row-auto w-50px flex-grow-1 my-lg-0 my-2 pe-3'>
                <a className='text-white fw-bolder text-hover-primary fs-6'>
                    {initialData.type === "image" ? "Image" : "Document"}
                </a>
                <span className='text-muted d-block fw-bold'>
                    {displayName}
                </span>
            </div>
            <div className='d-flex flex-column w-80 flex-row-fluid me-10 mt-3'>
                <div className='d-flex flex-stack mb-2'>
                    <span className='text-muted me-2 fs-7 fw-bold'>{progress}% / 100%</span>
                </div>
                <div className='progress h-5px w-100'>
                    <div
                        className='progress-bar bg-primary'
                        role='progressbar'
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <button
                type="button"
                className="btn btn-sm btn-icon btn-light-danger d-flex flex-row-auto"
                disabled={uploading}
                onClick={handleDelete}
            >
                <span className="svg-icon svg-icon-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect opacity="0.5" x="7.05025" y="15.5356" width="12" height="2" rx="1" transform="rotate(-45 7.05025 15.5356)" fill="black" />
                        <rect x="8.46447" y="7.05029" width="12" height="2" rx="1" transform="rotate(45 8.46447 7.05029)" fill="black" />
                    </svg>
                </span>
            </button>
        </div>
    )
}

export default AttachmentFileItem;