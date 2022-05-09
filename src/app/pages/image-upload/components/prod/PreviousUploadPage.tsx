/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import PreDeleteManyModal from '../PreDeleteManyModal';
import { PreviousItem } from './PreviousItem';
import { storage } from '../../../../../service/firebase';
import {
  ref,
  deleteObject,
} from 'firebase/storage';
import NoPreUpload from '../NoPreUpload'
import Loading from '../Loading'
import { getImageDatasBYUid, deleteImageData } from '../../ImageUploadCRUD';
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../../../app/pages/auth/models/UserModel'
import { RootState } from '../../../../../setup'
import { deleteAnalysedData, getAnalysedDatasByImageIds } from '../../../profile/AnalysedDataCRUD'

type Props = {
  className: string
}


const PreviousUploadPage: React.FC<Props> = ({ className }) => {
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  const [imageItems, setImageItems] = useState<any>([]);
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
  const handleChange = (value: boolean, id: number, analysedId: number) => {
    const index = imageItems.findIndex((item: any) => item.id === id)
    state[id] = value;
    setState(state);
    let tempSelectedImages: any[] = selectedImages;
    if (value) {
      let tempItem = {
        "id": imageItems[index].id,
        "image_name": imageItems[index].image_name,
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
        console.log(tempItems)
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
  const handleAnalyseDataChange = (analyseid: number, id: number) => {
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
    getImageItemsFromDb();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (imageItems.length <= 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [imageItems, empty])

  const handleDelete = () => {
    let promises = [];
    for (var i = 0; i < selectedImages.length; i++) {
      let image_name = selectedImages[i].image_name;
      let id = selectedImages[i].id;
      let analysedId = selectedImages[i].analysedId
      promises.push(deleteItem(id, image_name, analysedId));
    }
    return Promise.all(promises).then(result => {
    });
  }

  const handleOneDelete = (id: number, image_name: string, analysedId: number) => {
    let tempItem = { "id": id, "image_name": image_name, "analysedId": analysedId };
    let premake = selectedImages.filter((item: any) => item.id === id)
    if (premake.length <= 0) {
      setSelectedImages((items: any) => [...items, tempItem]);
    }
  }

  const getImageItemsFromDb = () => {
    setLoading(true);
    getImageDatasBYUid(user.id)
      .then((res) => {
        let { data } = res;
        let tempImageItems = data.map((doc) => ({ ...doc, isNew: false}));
        let items = tempImageItems.filter((item: any) => item.upload_completed === true)
        if(items.length > 0) {
          getAnalyseDatasFromDb(items)
        } else {
          setImageItems([]);
          setLoading(false);
        }
      
      })
      .catch((err) => {
        setLoading(false);
      })
  };

  const getAnalyseDatasFromDb = (items:any) => {
    let ids = items.map((item:any) => item.id).join(",")
    getAnalysedDatasByImageIds(ids)
    .then((res) => {
      let {data} = res;
      for(let i = 0; i < items.length; i++){
        for(let j = 0; j < data.length;j++){
          let id = items[i].id;
          let aid = data[j].image_data_id;
          if(id === aid){
            let temp = items[i];
            items[i] = {...temp,analysedData: data[j]};
          }
        }
      }
      setTimeout(() => {
        setTotalImageItems((images: any) => items);
        for (var i = 0; i < items.length; i++) {
          let id = items[i].id;
          state[id] = false;
          setState(state)
        }
        setImageItems((imageItems: any) => items.slice(0, 5));
        setLoading(false);
      },200)
    })
    .catch((error) => {
      console.log("Fail getting analysedData", error)
    })
  }

  const deleteItem = (id: number, image_name: string, analysedId: number) => {
    setDeleting(true);
    const imgRef = ref(storage, "Images/" + image_name);
    deleteObject(imgRef)
      .then(() => {
        console.log('Sucess image Delete...')
      })
      .catch((error) => {
        console.log('Fail image Delete...')
      });

    deleteImageData(id)
      .then((res) => {
        "Sucess: imageData Delete..."
      })
      .catch((err) => {
        console.log("Fail  imageData Delete...")
      })
    if (analysedId > 0) {
      const jsonFileRef = ref(storage, "AnalysedJsonData/" + image_name + ".json");
      deleteObject(jsonFileRef)
        .then(() => {
          console.log('Sucess json Delete...')
        })
        .catch((error) => {
          console.log('Fail json Delete...')
        });

      deleteAnalysedData(analysedId)
        .then((res) => {
          console.log('Sucess analysedData Delete...')
        })
        .catch((error) => {
          console.log('Fail analysedData Delete...')
        })
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
