import React, { useState, useEffect } from 'react'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import * as auth from '../../../auth/redux/AuthRedux';
import { useDispatch } from 'react-redux'
import { storage } from '../../../../../service/firebase'
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';


import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../auth/models/UserModel'
import { RootState } from '../../../../../setup'
import { updateUser } from '../../SettingCRUD';
import { v4 as uuid } from 'uuid';
import { getUserByEmail, getUserByUsername } from '../../../auth/redux/AuthCRUD';
import { useWebSocket } from '../../../../../setup/context/WebSocketContext'
type AcccetedFileGroup = 'image' | 'other';

const ProfileDetails: React.FC = () => {
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  const dispatch = useDispatch()
  const { sendSocketMsg } = useWebSocket();
  const [data, setData] = useState<any>({
    avatarURL: user.avatar_url,
    avatarId: user.avatar_id,
    fullname: user.name,
    username: user.username,
    userid: user.user_auth_id,
    email: user.email,
    timezone: user.timezone,
    currency: user.currency
  })

  const [imageFile, setImageFile] = useState<any>({});
  const [errors, setErrors] = useState({
    fileType: false,
    avatar: false,
    fullname: false,
    username: false,
    duplicateUsername: false,
    email: false,
    emailType: false,
    duplicateEmail: false,
    currency: false,
    timezone: false,
  });

  useEffect(() => {
    data['avatarURL'] = user?.avatar_url || ""
    data['avatarId'] = user?.avatar_id || getAvatarId()
    data['email'] = user?.email || ""
    data['fullname'] = user?.name || ""
    data['username'] = user?.username || ""
    setData(() => data);
    // eslint-disable-next-line
  }, [user])
  const getUid = () => {
    return uuid();
  }

  const getAvatarId = () => {
    let auth_id = getUid().trim().replace(/-/g, "").toUpperCase();
    return auth_id;
  }

  const [isEdit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFileType = (file: File): AcccetedFileGroup => {
    if (file.type.indexOf('image') !== -1) {
      return 'image'
    } else {
      return 'other'
    }
  }

  const handleChange = (event: any) => {
    event.persist();
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
    if (event.target.name === 'username') {
      setErrors(errors => ({
        ...errors,
        'duplicateUsername': false
      }))
    }
    if (event.target.name === 'email') {
      setErrors(errors => ({
        ...errors,
        'duplicateEmail': false,
        'emailType': false
      }))
    }
    setErrors(errors => ({
      ...errors,
      [event.target.name]: false
    }))
    setEdit(true);
  }

  const onImageChange = (event: any) => {
    let imgUrl = URL.createObjectURL(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (getFileType(file) === 'image') {
        setImageFile(event.target.files[0]);
        setData({
          ...data,
          'avatarURL': imgUrl
        })
        setErrors((errors: any) => ({
          ...errors,
          'avatar': false,
          'fileType': false
        }))
        setEdit(true);
      } else {
        setErrors(errors => ({
          ...errors,
          'fileType': true
        }))
      }
    }

  }

  const validateEmail = (email: string) => {
    return email.match(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleSubmit = () => {
    let tempErrors = errors;
    if (data.avatarURL === "") {
      tempErrors.avatar = true;
    }
    if (imageFile === null) {
      tempErrors.avatar = true;
    }
    if (data.fullname === '') {
      tempErrors.fullname = true;
    }
    if (data.username === '') {
      tempErrors.username = true;
    }
    if (data.email === '') {
      tempErrors.email = true;
    } else {
      if (validateEmail(data.email)) {

      } else {
        tempErrors.emailType = true;
      }
    }
    if (data.timezone === '') {
      tempErrors.timezone = true;
    }
    if (data.currency === '') {
      tempErrors.currency = true;
    }

    setErrors({
      ...errors,
      ...tempErrors
    })


    if (!errors.avatar
      && !errors.email
      && !errors.emailType
      && !errors.fullname
      && !errors.username
      && !errors.timezone
      && !errors.currency) {
      setErrors((errors: any) => ({
        ...errors,
        'fileType': false
      }))
      handleUpdate();
    }
  }

  const handleUpdate = () => {
    setLoading(true);
    setData((data: any) => ({ ...data }));
    const isItemsChanged =
      data.avatarURL !== user?.avatar_url
      || data.email !== user?.email
      || data.fullname !== user?.name
      || data.username !== user?.username
      || data.timezone !== user?.timezone
      || data.currency !== user?.currency;

    if (isItemsChanged) {
      if (data.username !== user?.username) {
        getUserByUsername(data.username)
          .then((res) => {
            errors['duplicateUsername'] = true;
            setErrors(errors);
            setLoading(false);
          })
          .catch((err) => {
          })
      }
      if (data.email !== user?.email) {
        getUserByEmail(data.email)
          .then((res) => {
            errors['duplicateEmail'] = true;
            setErrors(errors);
            setLoading(false);
          })
          .catch((err) => {
          })
      }
      if (errors.duplicateEmail === false && errors.duplicateUsername === false) {
        if (data.avatarURL !== user?.avatar_url) {
          if (user?.avatar_url?.length > 0) {
            deleteImageFromStorage();
          } else {
            uploadImageToStorage();
          }
        }
        else {
          updateDataToDb(data.avatarURL);
        }
      } else {
        setLoading(false);
      }
    }
    else {
      setLoading(false);
    }
  }

  const SendSocketMsg = () => {
    let msg: any = {
      type: 'UpdateUser',
      body: `${user.id}`
    }

    sendSocketMsg(JSON.stringify(msg))
  }

  const updateDataToDb = (downloadURL: string) => {
    const item = {
      username: data.username,
      avatar_url: downloadURL,
      avatar_id: data.avatarId,
      user_auth_id: user?.user_auth_id,
      email: data.email,
      name: data.fullname,
      timezone: data.timezone,
      currency: data.currency,
      auth_provider: user?.auth_provider
    }
    updateUser(item, user.id)
      .then((res) => {
        let { data } = res;
        dispatch(auth.actions.setUser(data))
        SendSocketMsg();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        deleteAvatarFromStorage();
      })
  }

  // Upload image to stroage, and data to db.
  const uploadImageToStorage = () => {
    const storageRef = ref(storage, "Avatars/" + user?.avatar_id);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setData({
            ...data,
            'avatar': downloadURL
          })
          updateDataToDb(downloadURL);
        });
      }
    );
  };

  // Delete item from storage
  const deleteImageFromStorage = () => {
    const fileRef = ref(storage, "Avatars/" + user?.avatar_id);
    deleteObject(fileRef)
      .then(() => {
        console.log("Deleted current avatar")
        uploadImageToStorage();
      })
      .catch((error) => {
        console.log("Fail Deleting avatar...");
        uploadImageToStorage();
      });
  };
  // Delete avatar from storage
  const deleteAvatarFromStorage = () => {
    const fileRef = ref(storage, "Avatars/" + user?.avatar_id);
    deleteObject(fileRef)
      .then(() => {
        console.log("Deleted current avatar")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
            <div className='col-lg-8'>
              <label className="btn  mb-4btn-hover-text-primary btn-shadow" data-action="change" data-original-title="Change avatar">
                <div className=' mb-3'>
                  <div className='symbol  symbol-lg-160px position-relative'>
                    <img style={{ objectFit: 'cover' }}
                      src={
                        data.avatarURL?.length > 0 ? data.avatarURL : toAbsoluteUrl('/media/avatars/blank.png')
                      }
                      alt='avatar' />
                  </div>
                </div>
                <input
                  type="file"
                  onChange={onImageChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </label>
              {errors.avatar === true && (
                <div className='fv-plugins-message-container ' style={{ marginLeft: '27px' }}>
                  <div className='fv-help-block'>Image field is required</div>
                </div>
              )}
              {errors.fileType === true && (
                <div className='fv-plugins-message-container' style={{ marginLeft: '27px' }}>
                  <div className='fv-help-block'>
                    Unexpected file type
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full name</label>

            <div className='col-lg-8'>
              <div className='row'>
                <div className='col-lg-12 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                    placeholder='Full name'
                    name={'fullname'}
                    value={data.fullname}
                    onChange={handleChange}
                  />
                  {errors.fullname === true && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        Fullname field is required
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>username</label>

            <div className='col-lg-8'>
              <div className='row'>
                <div className='col-lg-12 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                    placeholder='Full name'
                    name={'username'}
                    value={data.username}
                    onChange={handleChange}
                  />
                  {errors.username === true && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        username field is required
                      </div>
                    </div>
                  )}
                  {errors.duplicateUsername === true && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        This username already exist. Please use another username
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>email</label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                placeholder='email'
                name='email'
                value={data.email}
                onChange={handleChange}
              />
              {errors.email === true && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    email field is required
                  </div>
                </div>
              )}
              {errors.emailType === true && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    Invalid email format
                  </div>
                </div>
              )}
               {errors.duplicateEmail === true && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        This email already exist. Please use another email
                      </div>
                    </div>
                  )}
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Time Zone</label>

            <div className='col-lg-8 fv-row'>
              <select
                className='form-select form-select-solid form-select-lg'
                value={data.timezone}
                name='timezone'
                onChange={handleChange}
              >
                <option value=''>Select a timeZone..</option>
                <option value='International Date Line West'>
                  (GMT-11:00) International Date Line West
                </option>
                <option value='Midway Island'>(GMT-11:00) Midway Island</option>
                <option value='Samoa'>(GMT-11:00) Samoa</option>
                <option value='Hawaii'>(GMT-10:00) Hawaii</option>
                <option value='Alaska'>(GMT-08:00) Alaska</option>
                <option value='Pacific Time (US &amp; Canada)'>
                  (GMT-07:00) Pacific Time (US &amp; Canada)
                </option>
                <option value='Tijuana'>(GMT-07:00) Tijuana</option>
                <option value='Arizona'>(GMT-07:00) Arizona</option>
                <option value='Mountain Time (US &amp; Canada)'>
                  (GMT-06:00) Mountain Time (US &amp; Canada)
                </option>
                <option value='Chihuahua'>(GMT-06:00) Chihuahua</option>
                <option value='Mazatlan'>(GMT-06:00) Mazatlan</option>
                <option value='Saskatchewan'>(GMT-06:00) Saskatchewan</option>
                <option value='Central America'>(GMT-06:00) Central America</option>
                <option value='Central Time (US &amp; Canada)'>
                  (GMT-05:00) Central Time (US &amp; Canada)
                </option>
                <option value='Guadalajara'>(GMT-05:00) Guadalajara</option>
                <option value='Mexico City'>(GMT-05:00) Mexico City</option>
                <option value='Monterrey'>(GMT-05:00) Monterrey</option>
                <option value='Bogota'>(GMT-05:00) Bogota</option>
                <option value='Lima'>(GMT-05:00) Lima</option>
                <option value='Quito'>(GMT-05:00) Quito</option>
                <option value='Eastern Time (US &amp; Canada)'>
                  (GMT-04:00) Eastern Time (US &amp; Canada)
                </option>
                <option value='Indiana (East)'>(GMT-04:00) Indiana (East)</option>
                <option value='Caracas'>(GMT-04:00) Caracas</option>
                <option value='La Paz'>(GMT-04:00) La Paz</option>
                <option value='Georgetown'>(GMT-04:00) Georgetown</option>
                <option value='Atlantic Time (Canada)'>(GMT-03:00) Atlantic Time (Canada)</option>
                <option value='Santiago'>(GMT-03:00) Santiago</option>
                <option value='Brasilia'>(GMT-03:00) Brasilia</option>
                <option value='Buenos Aires'>(GMT-03:00) Buenos Aires</option>
                <option value='Newfoundland'>(GMT-02:30) Newfoundland</option>
                <option value='Greenland'>(GMT-02:00) Greenland</option>
                <option value='Mid-Atlantic'>(GMT-02:00) Mid-Atlantic</option>
                <option value='Cape Verde Is.'>(GMT-01:00) Cape Verde Is.</option>
                <option value='Azores'>(GMT) Azores</option>
                <option value='Monrovia'>(GMT) Monrovia</option>
                <option value='UTC'>(GMT) UTC</option>
                <option value='Dublin'>(GMT+01:00) Dublin</option>
                <option value='Edinburgh'>(GMT+01:00) Edinburgh</option>
                <option value='Lisbon'>(GMT+01:00) Lisbon</option>
                <option value='London'>(GMT+01:00) London</option>
                <option value='Casablanca'>(GMT+01:00) Casablanca</option>
                <option value='West Central Africa'>(GMT+01:00) West Central Africa</option>
                <option value='Belgrade'>(GMT+02:00) Belgrade</option>
                <option value='Bratislava'>(GMT+02:00) Bratislava</option>
                <option value='Budapest'>(GMT+02:00) Budapest</option>
                <option value='Ljubljana'>(GMT+02:00) Ljubljana</option>
                <option value='Prague'>(GMT+02:00) Prague</option>
                <option value='Sarajevo'>(GMT+02:00) Sarajevo</option>
                <option value='Skopje'>(GMT+02:00) Skopje</option>
                <option value='Warsaw'>(GMT+02:00) Warsaw</option>
                <option value='Zagreb'>(GMT+02:00) Zagreb</option>
                <option value='Brussels'>(GMT+02:00) Brussels</option>
                <option value='Copenhagen'>(GMT+02:00) Copenhagen</option>
                <option value='Madrid'>(GMT+02:00) Madrid</option>
                <option value='Paris'>(GMT+02:00) Paris</option>
                <option value='Amsterdam'>(GMT+02:00) Amsterdam</option>
                <option value='Berlin'>(GMT+02:00) Berlin</option>
                <option value='Bern'>(GMT+02:00) Bern</option>
                <option value='Rome'>(GMT+02:00) Rome</option>
                <option value='Stockholm'>(GMT+02:00) Stockholm</option>
                <option value='Vienna'>(GMT+02:00) Vienna</option>
                <option value='Cairo'>(GMT+02:00) Cairo</option>
                <option value='Harare'>(GMT+02:00) Harare</option>
                <option value='Pretoria'>(GMT+02:00) Pretoria</option>
                <option value='Bucharest'>(GMT+03:00) Bucharest</option>
                <option value='Helsinki'>(GMT+03:00) Helsinki</option>
                <option value='Kiev'>(GMT+03:00) Kiev</option>
                <option value='Kyiv'>(GMT+03:00) Kyiv</option>
                <option value='Riga'>(GMT+03:00) Riga</option>
                <option value='Sofia'>(GMT+03:00) Sofia</option>
                <option value='Tallinn'>(GMT+03:00) Tallinn</option>
                <option value='Vilnius'>(GMT+03:00) Vilnius</option>
                <option value='Athens'>(GMT+03:00) Athens</option>
                <option value='Istanbul'>(GMT+03:00) Istanbul</option>
                <option value='Minsk'>(GMT+03:00) Minsk</option>
                <option value='Jerusalem'>(GMT+03:00) Jerusalem</option>
                <option value='Moscow'>(GMT+03:00) Moscow</option>
                <option value='St. Petersburg'>(GMT+03:00) St. Petersburg</option>
                <option value='Volgograd'>(GMT+03:00) Volgograd</option>
                <option value='Kuwait'>(GMT+03:00) Kuwait</option>
                <option value='Riyadh'>(GMT+03:00) Riyadh</option>
                <option value='Nairobi'>(GMT+03:00) Nairobi</option>
                <option value='Baghdad'>(GMT+03:00) Baghdad</option>
                <option value='Abu Dhabi'>(GMT+04:00) Abu Dhabi</option>
                <option value='Muscat'>(GMT+04:00) Muscat</option>
                <option value='Baku'>(GMT+04:00) Baku</option>
                <option value='Tbilisi'>(GMT+04:00) Tbilisi</option>
                <option value='Yerevan'>(GMT+04:00) Yerevan</option>
                <option value='Tehran'>(GMT+04:30) Tehran</option>
                <option value='Kabul'>(GMT+04:30) Kabul</option>
                <option value='Ekaterinburg'>(GMT+05:00) Ekaterinburg</option>
                <option value='Islamabad'>(GMT+05:00) Islamabad</option>
                <option value='Karachi'>(GMT+05:00) Karachi</option>
                <option value='Tashkent'>(GMT+05:00) Tashkent</option>
                <option value='Chennai'>(GMT+05:30) Chennai</option>
                <option value='Kolkata'>(GMT+05:30) Kolkata</option>
                <option value='Mumbai'>(GMT+05:30) Mumbai</option>
                <option value='New Delhi'>(GMT+05:30) New Delhi</option>
                <option value='Sri Jayawardenepura'>(GMT+05:30) Sri Jayawardenepura</option>
                <option value='Kathmandu'>(GMT+05:45) Kathmandu</option>
                <option value='Astana'>(GMT+06:00) Astana</option>
                <option value='Dhaka'>(GMT+06:00) Dhaka</option>
                <option value='Almaty'>(GMT+06:00) Almaty</option>
                <option value='Urumqi'>(GMT+06:00) Urumqi</option>
                <option value='Rangoon'>(GMT+06:30) Rangoon</option>
                <option value='Novosibirsk'>(GMT+07:00) Novosibirsk</option>
                <option value='Bangkok'>(GMT+07:00) Bangkok</option>
                <option value='Hanoi'>(GMT+07:00) Hanoi</option>
                <option value='Jakarta'>(GMT+07:00) Jakarta</option>
                <option value='Krasnoyarsk'>(GMT+07:00) Krasnoyarsk</option>
                <option value='Beijing'>(GMT+08:00) Beijing</option>
                <option value='Chongqing'>(GMT+08:00) Chongqing</option>
                <option value='Hong Kong'>(GMT+08:00) Hong Kong</option>
                <option value='Kuala Lumpur'>(GMT+08:00) Kuala Lumpur</option>
                <option value='Singapore'>(GMT+08:00) Singapore</option>
                <option value='Taipei'>(GMT+08:00) Taipei</option>
                <option value='Perth'>(GMT+08:00) Perth</option>
                <option value='Irkutsk'>(GMT+08:00) Irkutsk</option>
                <option value='Ulaan Bataar'>(GMT+08:00) Ulaan Bataar</option>
                <option value='Seoul'>(GMT+09:00) Seoul</option>
                <option value='Osaka'>(GMT+09:00) Osaka</option>
                <option value='Sapporo'>(GMT+09:00) Sapporo</option>
                <option value='Tokyo'>(GMT+09:00) Tokyo</option>
                <option value='Yakutsk'>(GMT+09:00) Yakutsk</option>
                <option value='Darwin'>(GMT+09:30) Darwin</option>
                <option value='Adelaide'>(GMT+09:30) Adelaide</option>
                <option value='Canberra'>(GMT+10:00) Canberra</option>
                <option value='Melbourne'>(GMT+10:00) Melbourne</option>
                <option value='Sydney'>(GMT+10:00) Sydney</option>
                <option value='Brisbane'>(GMT+10:00) Brisbane</option>
                <option value='Hobart'>(GMT+10:00) Hobart</option>
                <option value='Vladivostok'>(GMT+10:00) Vladivostok</option>
                <option value='Guam'>(GMT+10:00) Guam</option>
                <option value='Port Moresby'>(GMT+10:00) Port Moresby</option>
                <option value='Solomon Is.'>(GMT+10:00) Solomon Is.</option>
                <option value='Magadan'>(GMT+11:00) Magadan</option>
                <option value='New Caledonia'>(GMT+11:00) New Caledonia</option>
                <option value='Fiji'>(GMT+12:00) Fiji</option>
                <option value='Kamchatka'>(GMT+12:00) Kamchatka</option>
                <option value='Marshall Is.'>(GMT+12:00) Marshall Is.</option>
                <option value='Auckland'>(GMT+12:00) Auckland</option>
                <option value='Wellington'>(GMT+12:00) Wellington</option>
                <option value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
              </select>
              {errors.timezone === true && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>timeZone field is required</div>
                </div>
              )}
            </div>
          </div>

          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>currency</label>

            <div className='col-lg-8 fv-row'>
              <select
                className='form-select form-select-solid form-select-lg'
                value={data.currency}
                name='currency'
                onChange={handleChange}
              >
                <option value=''>Select a currency..</option>
                <option value='USD'>USD - USA dollar</option>
                <option value='GBP'>GBP - British pound</option>
                <option value='AUD'>AUD - Australian dollar</option>
                <option value='JPY'>JPY - Japanese yen</option>
                <option value='SEK'>SEK - Swedish krona</option>
                <option value='CAD'>CAD - Canadian dollar</option>
                <option value='CHF'>CHF - Swiss franc</option>
              </select>
              {errors.currency === true && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>currency field is required</div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='button'
            className='btn btn-primary'
            disabled={loading || !isEdit}
            onClick={handleSubmit}
          >
            {!loading && 'Save Changes'}
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
  )
}

export { ProfileDetails }
