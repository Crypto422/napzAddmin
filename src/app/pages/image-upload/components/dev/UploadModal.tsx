import React, { useState } from "react";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { auth } from "../../../../../service/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// Image Picker URL.
const DEFAULT_IMAGE_URL = toAbsoluteUrl('media/icons/duotune/general/gen008.svg');

type AcccetedFileGroup = 'image' | 'other';

const UploadModal = (props: any) => {

    const {
        InitialData,
        handleUpload,
        ImageFile,
        edit,
        handleImageChange,
        handleDataChange,
        closeModal
    } = props;

    const [user] = useAuthState(auth);
    const [imageFile, setImageFile] = useState<any>(ImageFile);
    const [errors, setErrors] = useState({
        Title: false,
        FileType: false,
        Description: false,
        Img: false,
        Tags: false,
        Admin: false,
    });
    const [data, setData] = useState({
        ImageName: InitialData.ImageName,
        Image: InitialData.ImageURL,
        Title: InitialData.Title,
        Description: InitialData.Description,
        Tags: InitialData.Tags,
    })
    const [isEdit, setEdit] = useState(false);

    const getFileType = (file: File): AcccetedFileGroup => {
        if (file.type.indexOf('image') !== -1) {
            return 'image'
        } else {
            return 'other'
        }
    }


    const handleChange = (event: any) => {
        event.persist();
        if (edit === undefined || edit === false) {
            handleDataChange({ [event.target.name]: event.target.value })
        }
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
        setErrors(errors => ({
            ...errors,
            [event.target.name]: false
        }))
        setEdit(true);

    }

    const handleSubmit = () => {
        if (data.Image === DEFAULT_IMAGE_URL) {
            errors.Img = true;
        }
        if (imageFile === null) {
            errors.Img = true;
        }
        if (data.Title === '') {
            errors.Title = true;
        }
        if (data.Description === '') {
            errors.Description = true;
        }
        if (data.Tags === '') {
            errors.Tags = true;
        }

        setErrors({
            ...errors
        })

        if (!errors.Img && !errors.Title && !errors.Description && !errors.Tags) {
            closeModal();
            if (edit) {
                handleDataChange({
                    ImageName: data.ImageName,
                    ImageURL: data.Image,
                    Title: data.Title,
                    Description: data.Description,
                    Tags: data.Tags,
                    UserId: user?.uid,
                })
            }

            handleUpload();

        }
    }

    const onImageChange = (event: any) => {
        let imgUrl = URL.createObjectURL(event.target.files[0]);
        let imgName = event.target.files[0].name.replace(" ", "_");
        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (getFileType(file) === 'image') {
                handleImageChange(event.target.files[0])
                if (edit === undefined || edit === false) {
                    handleDataChange({
                        ImageName: imgName,
                        UserId: user?.uid,
                        ImageURL: imgUrl
                    })
                }
                setImageFile(event.target.files[0]);
                data['Image'] = imgUrl;
                data['ImageName'] = imgName;
                setData(data);
                setErrors({
                    ...errors,
                    'Img': false,
                    'FileType': false
                })
                setEdit(true);
            } else {
                setErrors(errors => ({
                    ...errors,
                    FileType: true
                }))
            }
        }

    }


    return (
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="col">
                    </div>
                    <div className="col">
                        <h2 className="modal-title text-center">
                            {
                                edit ? "Update" : "Upload"
                            }
                        </h2>
                    </div>
                    <div className="col">
                    </div>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <div className="row">
                            <div className="col">
                            </div>
                            <div className="col">
                                <label className="btn  mb-4btn-hover-text-primary btn-shadow" data-action="change" data-original-title="Change avatar">
                                    <div className=' mb-3'>
                                        <div className='symbol  symbol-lg-160px position-relative'>
                                            <img style={{ opacity: "75%", objectFit: 'cover' }} src={data.Image} alt='UploadImage' />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={onImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </label>
                                {errors.Img === true && (
                                    <div className='fv-plugins-message-container text-center'>
                                        <div className='fv-help-block'>Image field is required</div>
                                    </div>
                                )}
                                {errors.FileType === true && (
                                    <div className='fv-plugins-message-container text-center'>
                                        <div className='fv-help-block'>
                                            Unexpected file type
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col">
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">Title:</label>
                            <input type="text"
                                className="form-control"
                                onChange={handleChange}
                                id="title"
                                name="Title"
                                value={data.Title}
                            />
                            {errors.Title === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>Title field is required</div>
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label"
                            >Description:</label>
                            <textarea
                                className="form-control"
                                onChange={handleChange}
                                id="description"
                                name='Description'
                                value={data.Description}
                            >
                            </textarea>
                            {errors.Description === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>Description field is required</div>
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">Tags:</label>
                            <input
                                type="text"
                                onChange={handleChange}
                                className="form-control"
                                id="tags"
                                name='Tags'
                                value={data.Tags}
                            />
                            {errors.Tags === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>Tags field is required</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={!isEdit}
                    >
                        {
                            edit ? "Save" : "Upload"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export { UploadModal }