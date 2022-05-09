import React, { FC } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { ImageUploadPage } from "./components/prod/ImageUploadPage";
import { PreviousUploadPage } from "./components/prod/PreviousUploadPage";
import { ImageUploadPage as DevImageUploadPage } from "./components/dev/ImageUploadPage";
import { PreviousUploadPage as DevPreviousUploadPage } from "./components/dev/PreviousUploadPage";
const ImageUploadPageWrapper: FC = () => {
    return (
        <>
            <PageTitle breadcrumbs={[]}>Upload</PageTitle>
            {
                process.env.REACT_APP_ENV === "prod" ? (
                    <>
                        <ImageUploadPage className='mb-5 mb-xl-8 ' />
                        <PreviousUploadPage className='mb-5 mb-xl-8' />
                    </>
                ) : <>
                    <DevImageUploadPage className='mb-5 mb-xl-8 ' />
                    <DevPreviousUploadPage className='mb-5 mb-xl-8' /></>
            }
        </>
    )
}

export default ImageUploadPageWrapper