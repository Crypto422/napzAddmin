import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import MediaFileitem from './AttachmentFileItem'

type AcccetedFileGroup = 'image' | 'other';

const Attachments = (props: any) => {
    const { save, handleMediaDataChanged, prepare, initialData, setEdit } = props;
    const [drag, setDrag] = useState<boolean>(false);
    const fileInputRef = useRef<any>();
    const [fileItems, setFileItems] = useState<any>([]);
    const [tempfileItems, setTempFileItems] = useState<any>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [urls, setUrls] = useState<any>({});
    const [names, setNames] = useState<any>({});
    const [uploadeds, setUploadeds] = useState<any>({});

    useEffect(() => {
        for (let i = 0; i < initialData.length; i++) {
            let fileUrl = initialData[i].url;
            let fileName = initialData[i].name.replace(" ", "_");
            let name = getDisplayName(fileName);
            let filetype = initialData[i].type;
            let uid = getUid();
            setFileItems((prevItems: any) => [{
                id: uid,
                url: fileUrl,
                name: name,
                type: filetype,
                uploaded: true
            }, ...prevItems]);
            setTempFileItems((prevItems: any) => [{
                id: uid,
                url: fileUrl,
                name: name,
                type: filetype,
                uploaded: true
            }, ...prevItems]);

            urls[uid] = fileUrl;
            names[uid] = fileName;
            uploadeds[uid] = true;
            setUrls(urls);
            setNames(names);
            setUploadeds(uploadeds);
        }
        // eslint-disable-next-line
    }, [initialData])


    // get Unique id of imageItem
    const getUid = () => {
        return uuid();
    }

    useEffect(() => {
        if (save) {
            let filterdItems = fileItems.filter((item: any) => item.uploaded === false);
            if (filterdItems.length > 0) {
                setUploading(true);
            }
            else {
                handleMediaDataChanged(fileItems, false, true);
            }
        }
        if (prepare) {
            handleMediaDataChanged(fileItems, false, false);
        }
        // eslint-disable-next-line
    }, [save, prepare])

    const dropzone = drag ? {
        width: '100%',
        minHeight: 'auto',
        padding: '1.5rem 1.75rem',
        cursor: 'pointer',
        border: '3px dashed #009ef7',
        backgroundColor: '#212E48',
        borderRadius: '0.475rem',
    } : {
        width: '100%',
        minHeight: 'auto',
        padding: '1.5rem 1.75rem',
        cursor: 'pointer',
        border: '1px dashed #009ef7',
        backgroundColor: '#212E48',
        borderRadius: '0.475rem',
    }
    let timer: any = null;

    // Drag and Drop
    const dragOver = (e: any) => {
        e.preventDefault();
        setDrag(true);
        clearTimeout(timer);
    }


    const dragLeave = (e: any) => {
        e.preventDefault();
        timer = setTimeout(() => setDrag(false), 500)
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
                let fileUrl = URL.createObjectURL(files[i]);
                let fileName = files[i].name.replace(" ", "_");
                let uid = getUid();
                let filetype = getFileType(files[i])
                setFileItems((prevItems: any) => [{
                    id: uid,
                    url: fileUrl,
                    name: fileName,
                    type: filetype,
                    file: files[i],
                    uploaded: false
                }, ...prevItems]);
                setTempFileItems((prevItems: any) => [{
                    id: uid,
                    url: fileUrl,
                    name: fileName,
                    type: filetype,
                    uploaded: false
                }, ...prevItems]);
                setEdit(true);

            } else {
                console.log('Invalide File')
            }
        }
    }

    const handleDelete = (id: any) => {
        let temp = fileItems.filter((item: any) => item.id !== id)

        setFileItems(temp);
        setTempFileItems(temp);
        setEdit(true);
    }

    const getDisplayName = (rowName: string) => {
        let realNameIndex = rowName.lastIndexOf("_");
        let realName = rowName.slice(0, realNameIndex);
        let index = realName.lastIndexOf(".")
        let extension = realName.slice(index);
        let name = realName.slice(0, index);
        if (name.length > 40) {
            name = name.slice(0, 40) + "...  " + extension
            return name;
        } else {
            return realName;
        }
    }

    const handleFileUploadFinished = (id: any, downloadURL: string, fileName: string) => {
        urls[id] = downloadURL;
        names[id] = fileName;
        uploadeds[id] = true;
        setUrls(urls);
        setNames(names);
        setUploadeds(uploadeds);
        for (var i = 0; i < tempfileItems.length; i++) {
            let id = tempfileItems[i].id;
            tempfileItems[i].url = urls[id];
            tempfileItems[i].name = names[id];
            tempfileItems[i].uploaded = uploadeds[id];
            setTempFileItems(tempfileItems);
        }
        let UploadedFiles = tempfileItems.filter((item: any) => item.uploaded === true)

        if (UploadedFiles.length === tempfileItems.length) {
            handleMediaDataChanged(tempfileItems, false, true);
        }
    }

    const getFileType = (file: File): AcccetedFileGroup => {
        if (file.type.indexOf('image') !== -1) {
            return 'image'
        } else {
            return 'other'
        }
    }

    const _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".doc", ".docx", ".odt", ".txt", ".wps", ".pdf", ".ppt", ".dotx", ".potx", ".pps", ".ppsx", ".pptx", ".docm", ".dotm", ".potm", ".ppam", ".pptm", ".xls", ".xlsx", ".rtf"];
    const validateFile = (file: any) => {
        var sFileName = file.name;
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() === sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                alert("Sorry, " + sFileName + " is invalid,\n allowed extensions are: \n" + _validFileExtensions.join(", "));
                return false;
            }
        }
        return true
    }

    return (
        <>
            <div >
                <div className="fv-row mb-8">
                    <label className="fs-6 fw-bold mb-2">Attachments</label>
                    <label
                        className="dropzone"
                        style={dropzone}
                        onDragOver={dragOver}
                        onDragLeave={dragLeave}
                        onDrop={fileDrop}
                    >
                        <div className="dz-message needsclick align-items-center">
                            <i className="bi bi-file-earmark-arrow-up text-primary fs-3x"></i>
                            <div className="ms-4">
                                <h3 className="fs-5 fw-bolder text-gray-900 mb-1">
                                    Drop files here or click to upload.
                                </h3>
                                <input
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    type="file"
                                    multiple
                                    onChange={filesSelected}
                                />
                                <span className="fs-7 fw-bold text-gray-400">
                                    Upload up to 10 files
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
                <div className="text-muted fs-7">
                    Set the tickets attachments gallery.
                </div>
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {
                        fileItems.map((item: any) => {
                            return (
                                <MediaFileitem
                                    key={item.id}
                                    initialData={item}
                                    deleteItem={handleDelete}
                                    save={uploading}
                                    handleFileUploadFinished={handleFileUploadFinished}
                                />
                            )
                        })
                    }

                </div>
            </div>
        </>
    )
}

export default Attachments;