import React, { useState } from "react";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { auth } from "../../../../../service/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// image Picker URL.
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
        title: false,
        file_type: false,
        description: false,
        img: false,
        tags: false,
        admin: false,
    });
    const [data, setData] = useState({
        image_name: InitialData.image_name,
        image: InitialData.image_url,
        title: InitialData.title,
        description: InitialData.description,
        tags: InitialData.tags,
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
        if (data.image === DEFAULT_IMAGE_URL) {
            errors.img = true;
        }
        if (imageFile === null) {
            errors.img = true;
        }
        if (data.title === '') {
            errors.title = true;
        }
        if (data.description === '') {
            errors.description = true;
        }
        if (data.tags === '') {
            errors.tags = true;
        }

        setErrors({
            ...errors
        })

        if (!errors.img && !errors.title && !errors.description && !errors.tags) {
            closeModal();
            if (edit) {
                handleDataChange({
                    image_name: data.image_name,
                    image_url: data.image,
                    title: data.title,
                    description: data.description,
                    tags: data.tags,
                    user_id: user?.uid,
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
                        image_name: imgName,
                        user_id: user?.uid,
                        image_url: imgUrl
                    })
                }
                setImageFile(event.target.files[0]);
                data['image'] = imgUrl;
                data['image_name'] = imgName;
                setData(data);
                setErrors({
                    ...errors,
                    'img': false,
                    'file_type': false
                })
                setEdit(true);
            } else {
                setErrors(errors => ({
                    ...errors,
                    file_type: true
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
                                            <img style={{ opacity: "75%", objectFit: 'cover' }} src={data.image} alt='UploadImage' />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={onImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </label>
                                {errors.img === true && (
                                    <div className='fv-plugins-message-container text-center'>
                                        <div className='fv-help-block'>image field is required</div>
                                    </div>
                                )}
                                {errors.file_type === true && (
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
                                name="title"
                                value={data.title}
                            />
                            {errors.title === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>title field is required</div>
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
                                name='description'
                                value={data.description}
                            >
                            </textarea>
                            {errors.description === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>description field is required</div>
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
                                name='tags'
                                value={data.tags}
                            />
                            {errors.tags === true && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>tags field is required</div>
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