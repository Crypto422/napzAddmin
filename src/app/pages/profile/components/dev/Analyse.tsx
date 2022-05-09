/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { KTSVG } from '../../../../../_metronic/helpers'
import DeleteOneModal from '../DeleteOneModal';
import { collection, getDocs, doc, deleteDoc, where, query, orderBy } from 'firebase/firestore';
import { db, storage } from '../../../../../service/firebase';
import {
  ref,
  deleteObject,
} from 'firebase/storage';
import { AnalyseImageCard } from './AnalyseImageCard';
import Fuse from 'fuse.js';
import Pagenation from '../pagination/Pagenation';
import Loading from '../Loading';
import { useAuth } from '../../../../../setup/context/AppContext';

export function Analyse() {
  const [loading, setLoading] = useState<boolean>(false);
  const [totalImageItems, setTotalImageItems] = useState<any>([]);
  const [imageItems, setImageItems] = useState<any>([]);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const { userData } = useAuth();

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

  const getUid = () => {
    return uuid();
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
    const q = query(collection(db, "ImageData"), where("UserId", "==", userData?.UserID), orderBy("CreatedDate", "desc"));
    getDocs(q)
      .then((data) => {
        let tempImageItems = data.docs.map((doc) => ({ ...doc.data(), id: getUid() }));
        let items = tempImageItems.filter((item: any) => item.UploadCompleted === true)
        setTotalImageItems((images: any) => items);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

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
    let premake = selectedImages.filter((item: any) => tempItem.id === id)
    if (premake.length <= 0) {
      setSelectedImages((items: any) => [...items, tempItem]);
    }
  }

  const deleteItem = (imageId: string, imageName: string, id: any, analysedId: any) => {
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
  };

  useEffect(() => {
    if (userData !== null) {
      getImageItemsFromDb();
    }
    // eslint-disable-next-line
  }, [userData])

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
          imageItems.map((item: any) => {
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
