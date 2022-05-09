/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo } from 'react';
// import { v4 as uuid } from 'uuid';
import { KTSVG } from '../../../../../_metronic/helpers'
import DeleteOneModal from '../DeleteOneModal';
import { storage } from '../../../../../service/firebase';
import {
  ref,
  deleteObject,
} from 'firebase/storage';
import { AnalyseImageCard } from './AnalyseImageCard';
import Fuse from 'fuse.js';
import Pagenation from '../pagination/Pagenation';
import Loading from '../Loading';
import { deleteAnalysedData, getAnalysedDatasByImageIds } from '../../AnalysedDataCRUD'
import { getImageDatasBYUid, deleteImageData } from '../../../image-upload/ImageUploadCRUD'
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../auth/models/UserModel'
import { RootState } from '../../../../../setup'

export function Analyse() {
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  const [loading, setLoading] = useState<boolean>(false);
  const [totalImageItems, setTotalImageItems] = useState<any>([]);
  const [imageItems, setImageItems] = useState<any>([]);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  let PageSize = 20;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return totalImageItems.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, totalImageItems, PageSize]);

  const handlePageChange = (props: any) => {
    setCurrentPage(props);
  }

  const searchData = (pattern: string) => {
    if (!pattern) {
      setImageItems(currentTableData);
      return;
    }

    const fuse = new Fuse(currentTableData, {
      keys: ["Title"]
    })

    const result = fuse.search(pattern);
    const matches: any = [];
    if (!result.length) {
      setImageItems([]);
    } else {
      result.forEach(({ item }) => {
        matches.push(item);
      });
      setImageItems(matches);
    }
  }

  useEffect(() => {
    setImageItems([...currentTableData]);
  }, [totalImageItems, currentTableData])

  const getImageItemsFromDb = () => {
    setLoading(true);
    getImageDatasBYUid(user.id)
      .then((res) => {
        let { data } = res;
        let items = data.filter((item: any) => item.upload_completed === true)

        if(items.length>0){
          getAnalyseDatasFromDb(items);
        }
        else {
          setTotalImageItems([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
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
        setLoading(false);
      },200)
    })
    .catch((error) => {
      console.log("Fail getting analysedData", error)
    })
  }

  const handleDelete = () => {
    let promises = [];
    for (var i = 0; i < selectedImages.length; i++) {
      let imageName = selectedImages[i].imageName;
      let id = selectedImages[i].id;
      let analysedId = selectedImages[i].analysedId
      promises.push(deleteItem(id, imageName,analysedId));
    }
    return Promise.all(promises).then(result => {
    });
  }
  const handleOneDelete = (id: string, imageName: string, analysedId: number) => {
    let tempItem = { "id": id, "imageName": imageName,"analysedId": analysedId };
    let premake = selectedImages.filter((item: any) => tempItem.id === id)
    if (premake.length <= 0) {
      setSelectedImages((items: any) => [...items, tempItem]);
    }
  }

  const deleteItem = (id: number, imageName: string, analysedId: number) => {
    const imgRef = ref(storage, "Images/" + imageName);
    deleteObject(imgRef)
      .then(() => {
        console.log('Success image Delete...')
      })
      .catch((error) => {
        console.log('Fail image Delete...')
      });

    deleteImageData(id)
      .then((res) => {
        console.log('Success imageData Delete...')
      })
      .catch((err) => {
        console.log('Fail imageData Delete...')
      })
    if (analysedId > 0) {
      const jsonFileRef = ref(storage, "AnalysedJsonData/" + imageName + ".json");
      deleteObject(jsonFileRef)
        .then(() => {
          console.log('Success json Delete...')
        })
        .catch((error) => {
          console.log('Fail json Delete...')
        });
      deleteAnalysedData(analysedId)
        .then((res) => {
          console.log('Success analysed Delete...')
        })
        .catch((err) => {
          console.log('Fail analysed Delete...')
        })
    }
    // reset imageItems
    setTotalImageItems((totalImageItems: any) => totalImageItems.filter((item: any) => item.id !== id))
    setSelectedImages([]);
  };

  useEffect(() => {
    getImageItemsFromDb();
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Images
          <span className='fs-6 text-gray-400 fw-bold ms-1'> &nbsp;{totalImageItems.length} images</span>
        </h3>

        <div className='d-flex my-2'>
          <div className='d-flex align-items-center position-relative'>
            <KTSVG
              path='/media/icons/duotune/general/gen021.svg'
              className='svg-icon-3 position-absolute ms-3'
            />
            <input
              type='text'
              className='form-control form-control-white form-control-sm ps-9'
              placeholder='Search'
              onChange={(e) => searchData(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
        {loading ? (
          <Loading />
        ) : (
          imageItems.map((item: any,index: any) => {
            return (
              <AnalyseImageCard
                key={item.id}
                InitialData={item}
                deleteItem={handleOneDelete}
              />
            );
          })
        )
        }
      </div>

      <Pagenation
        currentPage={currentPage}
        totalCount={totalImageItems.length}
        pageSize={PageSize}
        onPageChange={handlePageChange}
      />
      <DeleteOneModal handleDelete={handleDelete} />
    </>
  )
}
