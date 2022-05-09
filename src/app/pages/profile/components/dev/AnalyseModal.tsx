import React, { useState, useEffect } from "react";
import { KTSVG } from "../../../../../_metronic/helpers";
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from "../../../../../service/firebase";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import AnalyseTabItem from "../AnalyseTabItem";
import FaceTabContent from "../tabContents/FaceTabContent";
import ObjectTabContent from "../tabContents/ObjectTabContent";
import LogoTabContent from "../tabContents/LogoTabContent";
import LabelTabContent from "../tabContents/LabelTabContent";
import ExplicitTabContent from "../tabContents/ExplicitTabContent";
import PropertiesTabContent from "../tabContents/PropertiesTabContent";
import TextTabContent from "../tabContents/TextTabContent";
import WebdetectionTabContent from "../tabContents/WebdetectionTabContent";

const AnalyseModal = (props: any) => {

    const {
        InitialData,
        preImageName,
        analyse,
        setAnalyse,
        analysedData,
        setAnalysedData,
        setAnalysedId,
        closeModal
    } = props;

    const options = {
        api: process.env.REACT_APP_GOOGLE_CLOUD_API || "",
        apiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY || ""
    }
    const BucketName = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '';
    const ImagePath = `Images/${preImageName}`;
    const [width, setWidth] = useState<number>(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 1200;

    const mobileStyle = {
        height: '300px',
        overflow: "auto",
    } as React.CSSProperties;

    const desktopStyle = {
        position: 'absolute',
        inset: '51px 41px 50px 60%'
    } as React.CSSProperties;
    const FaceStyle = {
        position: 'absolute',
        inset: '51px 47px 50px 60%'
    } as React.CSSProperties;
    const ExpliciteStyle = {
        position: 'absolute',
        inset: '51px 51px 50px 60%'
    } as React.CSSProperties;
    const ObjectsStyle = {
        position: 'absolute',
        inset: '55px 50px 50px 60%'
    } as React.CSSProperties;
    const LabelsStyle = {
        position: 'absolute',
        inset: '61px 52px 59px 61%'
    } as React.CSSProperties;

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        setLoading(true);
        callGoogleVisionApi(BucketName, ImagePath);
    };

    const uploadJsonDataToStorage = (json: any) => {
        let fileName = InitialData.ImageName + ".json";
        const storageRef = ref(storage, "AnalysedJsonData/" + fileName);
        // convert your object into a JSON-string
        var jsonString = JSON.stringify(json);
        // create a Blob from the JSON-string
        var blob = new Blob([jsonString], { type: "application/json" })
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {

            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    uploadDataToDb(downloadURL);
                });
            }
        );
    };

    const uploadDataToDb = (downloadURL: any) => {
        const item = {
            ImageId: InitialData.ImageId,
            AnalysedDate: new Date(),
            DataURL: downloadURL,
            JsonFileName:InitialData.ImageName,
            UserId: InitialData.UserId
        };
        try {
            addDoc(collection(db, "AnalysedData"), item)
                .then((docRef: any) => {
                    setAnalyse(true);
                    setAnalysedId(docRef.id);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setAnalyse(false);
                });
        } catch (error) {
            console.log(error);
        }
    };



    const isFirst = () => {
        if (analysedData.faceAnnotations === undefined || null) {
            if (analysedData.localizedObjectAnnotations === undefined || null) {
                if (analysedData.labelAnnotations === undefined || undefined) {

                    if (analysedData.logoAnnotations === undefined || null) {
                        if (analysedData.textAnnotations === undefined || null) {
                            return 'properties'
                        }
                        return 'text                                                                    '
                    }
                    return 'logo'
                }
                return 'labels';
            }
            return 'objects'
        }
    }

    const callGoogleVisionApi = async (bucket_name: any, path: any) => {
        let googleVisionRes = await fetch(options.api + options.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "source": {
                                "imageUri":
                                    `gs://${bucket_name}/${path}`
                            }
                        },
                        features: [
                            { type: "LABEL_DETECTION", maxResults: 50 },
                            { type: "FACE_DETECTION", maxResults: 50 },
                            { type: "OBJECT_LOCALIZATION", maxResults: 50 },
                            { type: "LOGO_DETECTION", maxResults: 50 },
                            { type: "TEXT_DETECTION", maxResults: 50 },
                            { type: "SAFE_SEARCH_DETECTION", maxResults: 50 },
                            { type: "IMAGE_PROPERTIES", maxResults: 50 },
                            { type: "WEB_DETECTION", maxResults: 5 }
                        ],
                    }
                ]
            })
        });



        await googleVisionRes.json()
            .then(googleVisionRes => {
                if (googleVisionRes) {
                    setAnalysedData(googleVisionRes.responses[0])
                    uploadJsonDataToStorage(googleVisionRes.responses[0]);
                    console.log('this.is response', googleVisionRes.responses[0]);
                }
            }).catch((error) => { console.log(error) })
    }

    return (
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 'max-content' }}>
            <div className="modal-content">
                <div className="modal-header">
                    {analyse ? (
                        <ul className="nav nav-tabs nav-line-tabs  border-0  me-5 mb-3 mb-md-0 fs-6">
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Analyse
                                </button>
                            </li>

                            <AnalyseTabItem
                                analyse={analyse}
                                isFirst={true}
                                disable={analysedData.faceAnnotations === undefined}
                                title={'Faces'}
                                target={'#face'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                isFirst={isFirst() === 'objects'}
                                disable={analysedData.localizedObjectAnnotations === undefined}
                                title={'Objects'}
                                target={'#object'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                isFirst={isFirst() === 'labels'}
                                disable={analysedData.labelAnnotations === undefined}
                                title={'Labels'}
                                target={'#label'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                disable={analysedData.logoAnnotations === undefined}
                                isFirst={isFirst() === 'logo'}
                                title={'Logos'}
                                target={'#logo'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                title={'Texts'}
                                disable={analysedData.textAnnotations === undefined}
                                target={'#text'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                disable={analysedData.imagePropertiesAnnotation === undefined}
                                title={'Properties'}
                                target={'#properties'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                disable={analysedData.webDetection === undefined}
                                title={'WebDetection'}
                                target={'#webdetection'}
                            />
                            <AnalyseTabItem
                                analyse={analyse}
                                disable={analysedData.safeSearchAnnotation === undefined}
                                title={'Explicit'}
                                target={'#explicit'}
                            />
                        </ul>
                    ) : (
                        <ul className="nav nav-tabs nav-line-tabs  border-0  me-5 mb-3 mb-md-0 fs-6">
                            <li className="nav-item" >
                                <button
                                    className={`btn-color-primary btn btn-flex btn-active-light-success ${!analyse && 'active'}`}
                                    disabled={analyse}
                                    data-bs-toggle="tab"
                                    data-bs-target="#analyse"
                                >
                                    Analyse
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Faces
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Objects
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Labels
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Logos
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Texts
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Properties
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    WebDetection
                                </button>
                            </li>

                            <li className="nav-item" >
                                <button
                                    className={'btn-color-primary btn btn-flex btn-active-light-success'}
                                    disabled={true}
                                >
                                    Explicit
                                </button>
                            </li>
                        </ul>
                    )}

                    <button
                        className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                        onClick={closeModal}
                    >
                        <KTSVG
                            path="/media/icons/duotune/arrows/arr061.svg"
                            className="svg-icon svg-icon-2x"
                        />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '40px' }}>
                    <div className="tab-content" id="myTabContent">
                        <div
                            className={`tab-pane fade show ${!analyse && 'active'}`}
                            id="analyse"
                            role="tabpanel"
                        >
                            <div className="row gy-5 gx-xl-8">
                                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                                        <img id='imageid' style={{maxHeight: '500px', opacity: "100%", width: 'inherit', borderRadius: '3%' }} src={InitialData.ImageURL} alt='UploadImage' />
                                    </div>
                                </div>
                                <div className="col-12 col-xl-5">
                                    <div className="mb-3">
                                        <label className="col-form-label">Title:</label>
                                        <input type="text"
                                            className="form-control"
                                            id="title"
                                            disabled={true}
                                            name="Title"
                                            value={InitialData.Title}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Description:</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name='Description'
                                            disabled={true}
                                            value={InitialData.Description}
                                        >
                                        </textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="col-form-label">Tags:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tags"
                                            disabled={true}
                                            name='Tags'
                                            value={InitialData.Tags}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={analyse}
                                        className="btn btn-sm btn-light-primary"
                                    >
                                        {!loading && <span className='indicator-label'>Analyse</span>}
                                        {loading && (
                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                Please wait...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {analyse && (<>
                            {analysedData.faceAnnotations &&
                                <FaceTabContent
                                    analyse={analyse}
                                    isFirst={true}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.faceAnnotations}
                                    style={isMobile ? mobileStyle : FaceStyle}
                                />
                            }
                            {analysedData.localizedObjectAnnotations &&
                                <ObjectTabContent
                                    analyse={analyse}
                                    isFirst={isFirst() === 'objects'}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.localizedObjectAnnotations}
                                    style={isMobile ? mobileStyle : ObjectsStyle}
                                />
                            }
                            {analysedData.labelAnnotations &&
                                <LabelTabContent
                                    analyse={analyse}
                                    isFirst={isFirst() === 'labels'}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.labelAnnotations}
                                    style={isMobile ? mobileStyle : LabelsStyle}
                                />
                            }
                            {analysedData.logoAnnotations &&
                                <LogoTabContent
                                    analyse={analyse}
                                    isFirst={isFirst() === 'logo'}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.logoAnnotations}
                                    style={isMobile ? mobileStyle : desktopStyle}
                                />
                            }
                            {analysedData.textAnnotations &&
                                <TextTabContent
                                    analyse={analyse}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.fullTextAnnotation}
                                    style={isMobile ? mobileStyle : desktopStyle}
                                />
                            }
                            {analysedData.imagePropertiesAnnotation &&
                                <PropertiesTabContent
                                    analyse={analyse}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.imagePropertiesAnnotation}
                                    style={isMobile ? mobileStyle : desktopStyle}
                                />
                            }
                           
                            {analysedData.safeSearchAnnotation &&
                                <ExplicitTabContent
                                    analyse={analyse}
                                    imgURL={InitialData.ImageURL}
                                    data={analysedData.safeSearchAnnotation}
                                    style={isMobile ? mobileStyle : ExpliciteStyle}
                                />
                            }
                             {analysedData?.webDetection ?
                                <WebdetectionTabContent
                                    analyse={analyse}
                                    imgURL={InitialData?.ImageURL}
                                    data={analysedData?.webDetection}
                                    style={isMobile ? mobileStyle : desktopStyle}
                                />:<></>
                            }
                        </>

                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}

export { AnalyseModal }