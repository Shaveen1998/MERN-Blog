import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link} from 'react-router-dom'
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, SignoutSuccess } from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashProfile() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [formData, setFormData] = useState({})
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [updateError, setUpdateError] = useState(null)
    const [updateComplete, setUpdateComplete] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    console.log(imageFileUploadProgress, imageFileUploadError)
    const handleImageChange = (e)=>{
      const file = e.target.files[0]
      if(file){
        setImageFile(file) //since only uploading one file
        setImageFileUrl(URL.createObjectURL(file))
      }      
    }
    useEffect(()=>{
      if(imageFile){
        uploadImage()
      }
    },[imageFile])



    const uploadImage = async()=>{

      setImageFileUploadError(null)
      setImageFileUploading(true)
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError(
            'Could not upload image (File must be less than 2MB)'
          );
          console.log(error)
          setImageFileUrl(null)
          setImageFile(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({...formData, profilePicture:downloadURL})
            setImageFileUploading(false)
          });
        }
      );

     
    }

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id] : e.target.value})
    console.log(formData)
  }

    const handleSubmit = async (e)=>{
      e.preventDefault()

      if(Object.keys(formData).length === 0) {
        dispatch(updateFailure(setUpdateError('No fields have beem changed')))
       return
      }

      if (imageFileUploading) {
        setUpdateError('Please wait for image to upload');
        return;
      }

      try{
        dispatch(updateStart())
        const res = await fetch(`/api/user/update/${currentUser._id}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })

          const data = await res.json()
          console.log(data)
          
          if(res.ok){
            dispatch(updateSuccess(data))
            setUpdateComplete('User Updated Successfully')
          }else{
              dispatch((setUpdateError(data.message)))
              updateFailure(data.message)
        
          }

      }catch(err){
        dispatch(updateFailure(err.message))
      }
    }


    const handleDeleteUser = async () => {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };


    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(SignoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form  className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type="file"  accept="image/*" hidden  onChange={handleImageChange} ref={filePickerRef}/>
            <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
            
            {/* {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )} */}
                <img
                    src={imageFileUrl || currentUser.profilePicture}
                    alt='user'
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
                />
            </div>
            {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
             )}
           <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange}/>
           <TextInput type="text" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>
           <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
           <Button
                type='submit'
                gradientDuoTone='purpleToBlue'
                outline
                disabled={loading || imageFileUploading}
              >
                {loading ? 'Loading...' : 'Update'}
            </Button>

            {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}

        </form>

        {updateComplete && (
        <Alert color='success' className='mt-5'>
          {updateComplete}
        </Alert>
      )}
      {updateError && (
        <Alert color='failure' className='mt-5'>
          {updateError}
        </Alert>
      )}
       {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

       <Modal
        show={showModal}
        popup
        onClose={()=>setShowModal(false)}
        size='md'
       >
          <Modal.Header />
          <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, Im sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
       </Modal>
        <div className="text-red-500 flex justify-between mt-5">
            <span  onClick={()=>setShowModal(true)}className="cursor-pointer">Delete Account</span>
            <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
        </div>
    </div>
  )
}
