/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { KTSVG } from '../../../../../_metronic/helpers';
import { MenuComponent } from '../../../../../_metronic/assets/ts/components';
import Lightbox from "../react-image-lightbox";

import 'react-image-lightbox/style.css'

const DOC_URL = toAbsoluteUrl('/media/svg/files/dark/doc.svg');

const AttachmentItem = (props: any) => {
    const { initialData } = props;
    const [displayName, setDisplayName] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        let realNameIndex = initialData.name.lastIndexOf("_");
        let realName = initialData.name.slice(0, realNameIndex);
        let index = realName.lastIndexOf(".")
        let extension = realName.slice(index);
        let name = realName.slice(0, index);
        if (name.length > 40) {
            name = name.slice(0, 40) + "...  " + extension
            setDisplayName(name);
        } else {
            setDisplayName(realName);
        }
    }, [initialData])

    useEffect(() => {
        setTimeout(() => {
            MenuComponent.reinitialization()
        }, 500)
    }, [])

    const handleDownload = () => {
        // download image directly via url
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            var blob = xhr.response;
            //create a file from the returned blob
            var file = new File([blob], displayName, { type: blob.type });
            let url = window.URL.createObjectURL(file);
            let a = document.createElement('a');
            a.href = url;
            a.download = displayName;
            a.click();
        };
        xhr.open('GET', initialData.url);
        xhr.send();
    }

    const handleImageClick = () => {
        if (initialData.type === 'image') {
            setShow(true);
        }
    }
    return (
        <div className='d-flex flex-wrap align-items-center mt-7'>
            {/* begin::Symbol */}
            <div className='symbol symbol-40px  me-4'>
                <img
                    alt=''
                    onClick={handleImageClick}
                    src={initialData.type === 'image' ? initialData.url : DOC_URL}
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    className='mw-100'
                />
            </div>
            {
                show && (
                    <Lightbox
                        mainSrc={initialData.url}
                        onCloseRequest={() => setShow(false)}
                    />
                )
            }
            {/* end::Symbol */}

            {/* begin::Title */}
            <div onClick={handleImageClick} className='d-flex flex-column flex-row-auto w-50px flex-grow-1 my-lg-0 my-2 pe-3 '>
                <a className='text-white fw-bolder text-hover-primary fs-6 cursor-pointer'>
                    {initialData.type === "image" ? "Image" : "Document"}
                </a>
                <span className='text-muted d-block fw-bold cursor-pointer'>
                    {displayName}
                </span>
            </div>
            <button
                type='button'
                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='top-end'
            >
                <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
            </button>
            <div
                className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px py-3'
                data-kt-menu='true'
            >
                <div className='menu-item px-3'>
                    <a
                        onClick={handleDownload}
                        className='menu-link flex-stack px-3'
                    >
                        Download
                        <i
                            className='fas fa-folder-download ms-2 fs-7'
                            data-bs-toggle='tooltip'
                            title='Download file'
                        ></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

export { AttachmentItem };