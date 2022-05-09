/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import PreDeleteManyModal from '../PreDeleteManyModal';
import { PreviousItem } from './PreviousItem';
import { db, storage } from '../../../../../service/firebase';
import { collection, getDocs, doc, deleteDoc, where, query, orderBy } from 'firebase/firestore';
import {
  ref,
  deleteObject,
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import NoPreUpload from '../NoPreUpload'
import Loading from '../Loading'
import { useAuth } from '../../../../../setup/context/AppContext';


type Props = {
  className: string
}


const PreviousUploadPage: React.FC<Props> = ({ className }) => {
  const [imageItems, setImageItems] = useState<any>([]);
  const { userData } = useAuth()
  const [totalImageItems, setTotalImageItems] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [state, setState] = useState<any>({});
  const [singleSelect, setSingleSelect] = useState<boolean>(false);
  const [noneSelect, setNoneSelect] = useState<boolean>(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [empty, setEmpty] = useState(false);
  const [analyseId, setAnalyseId] = useState<any>({});

  // It is called when imageItem's checkbox has changed
  const handleChange = (value: any, id: any, analysedId: any) => {
    const index = imageItems.findIndex((item: any) => item.id === id)
    state[id] = value;
    setState(state);
    let tempSelectedImages: any[] = selectedImages;
    if (value) {
      let tempItem = {
        "ImageId": imageItems[index].ImageId,
        "ImageName": imageItems[index].ImageName,
        "id": id,
        "analysedId": analysedId
      };
      let premake = selectedImages.filter((item: any) => item.id === id)
      if (premake.length <= 0) {
        tempSelectedImages = [...selectedImages, tempItem]
      }
    } else {
      tempSelectedImages = selectedImages.filter((img: any) => img.id !== id)
    }
    setSelectedImages([...tempSelectedImages])
    handleSelectAll(tempSelectedImages);
    handleSelect(tempSelectedImages);
  }

  const handleSelectAll = (selectedImages: any) => {
    if (selectedImages.length >= imageItems.length) {
      setSelectAll(true);
    }
    else {
      setSelectAll(false);
    }
  }
  // it is called when selete All checkbox has checked
  const handleChangeAll = (event: any) => {
    let value = event.target.checked;
    setSelectAll(value);
    for (var i = 0; i < imageItems.length; i++) {
      let id = imageItems[i].id;
      state[id] = value;
      setState(state);
    }

    if (value) {
      let tempItems: any[] = imageItems;
      for (var j = 0; j < tempItems.length; j++) {
        let id = imageItems[j].id;
        tempItems[j].analysedId = analyseId[id]
      }
      setSelectedImages([...tempItems]);
      setNoneSelect(false);
      setSingleSelect(false);
    }
    else {
      setSelectedImages([]);
      setNoneSelect(true);
      setSingleSelect(false);
    }
  }

  // It is called when individual imageItem has updated 
  const handleAnalyseDataChange = (analyseid: any, id: any) => {
    analyseId[id] = analyseid;
    setAnalyseId(analyseId);
  }

  // handle Selection state
  const handleSelect = (selectedImages: any) => {
    if (selectedImages.length === 1) {
      setSingleSelect(true);
      setNoneSelect(false);
    }
    else if (selectedImages.length > 1) {
      setSingleSelect(false);
      setNoneSelect(false);
    }
    else {
      setNoneSelect(true);
      setSingleSelect(false);
    }
  }

  useEffect(() => {
    if (userData !== null) {
      getImageItemsFromDb();
    }
    // eslint-disable-next-line
  }, [userData]);

  useEffect(() => {
    if (imageItems.length <= 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [imageItems, empty])

  const getUid = () => {
    return uuid();
  }

  const handleDelete = () => {
    let promises = [];
    for (var i = 0; i < selectedImages.length; i++) {
      let imageId = selectedImages[i].ImageId;
      let imageName = selectedImages[i].ImageName;
      let id = selectedImages[i].id;
      let analysedId = selectedImages[i].analysedId
      promises.push(deleteItem(imageId, imageName, id, analysedId));
    }
    return Promise.all(promises).then(result => {
    });
  }

  const handleOneDelete = (imageId: string, imageName: string, id: any, analysedId: any) => {
    let tempItem = { "ImageId": imageId, "ImageName": imageName, "id": id, "analysedId": analysedId };
    let premake = selectedImages.filter((item: any) => item.id === id)
    if (premake.length <= 0) {
      setSelectedImages((items: any) => [...items, tempItem]);
    }
  }

  const getImageItemsFromDb = () => {
    setLoading(true);
    const q = query(collection(db, "ImageData"), where("UserId", "==", userData.UserID), orderBy("CreatedDate", "desc"));
    getDocs(q)
      .then((data) => {
        let tempImageItems = data.docs.map((doc) => ({ ...doc.data(), isNew: false, id: getUid(), analysedId: '' }));
        let items = tempImageItems.filter((item: any) => item.UploadCompleted === true)
        setTotalImageItems((images: any) => items);
        for (var i = 0; i < items.length; i++) {
          let id = items[i].id;
          state[id] = false;
          setState(state)
        }
        setImageItems((imageItems: any) => items.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteItem = (imageId: string, imageName: string, id: any, analysedId: any) => {
    setDeleting(true);
    const imgRef = ref(storage, "Images/" + imageName);
    deleteObject(imgRef)
      .then(() => {
        console.log('Sucess image Delete...')
      })
      .catch((error) => {
        // console.log(error);
      });

    const itemDoc = doc(db, "ImageData", imageId);
    deleteDoc(itemDoc);
    if (analysedId.length > 0) {
      const jsonFileRef = ref(storage, "AnalysedJsonData/" + imageName + ".json");
      deleteObject(jsonFileRef)
        .then(() => {
          console.log('Sucess json Delete...')
        })
        .catch((error) => {
          // console.log(error);
        });
      const analyseDoc = doc(db, "AnalysedData", analysedId);
      deleteDoc(analyseDoc);
    }
    // reset imageItems
    setTotalImageItems((totalImageItems: any) => totalImageItems.filter((item: any) => item.id !== id))
    setSelectedImages([]);
    setSelectAll(false);
    setNoneSelect(true);
    setDeleting(false);

  };

  useEffect(() => {
    setImageItems((imageItems: any) => totalImageItems.slice(0, 5));
  }, [totalImageItems])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Previous Uploads</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-placement='top'
        >
          <button
            className='btn btn-light-warning btn-sm'
            disabled={noneSelect || deleting}
            data-bs-toggle="modal" data-bs-target={
              singleSelect ? '#pre-delete-one-confirm-modal' : '#pre-delete-multi-confirm-modal'
            }
          >
            Delete
          </button>
          <PreDeleteManyModal handleDelete={handleDelete} />
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      checked={selectAll}
                      onChange={handleChangeAll}
                    />
                  </div>
                </th>
                <th className='min-w-140px'>Image</th>
                <th className='min-w-150px'>User</th>
                <th className='min-w-120px'>Description</th>
                <th className='min-w-120px'>Tags</th>
                <th className='min-w-120px'>Progress</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {loading ? (
                <Loading />
              ) : (
                imageItems.length > 0 ?
                  imageItems.map((item: any) => {
                    return (
                      <PreviousItem
                        key={item.id}
                        InitialData={item}
                        deleteItem={handleOneDelete}
                        checked={state[item.id]}
                        onChange={handleChange}
                        handleAnalyseDataChange={handleAnalyseDataChange}
                      />
                    );
                  }) : (
                    <NoPreUpload />
                  )
              )

              }
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { PreviousUploadPage }
