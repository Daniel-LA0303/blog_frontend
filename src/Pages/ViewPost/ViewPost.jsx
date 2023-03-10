import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

import { Link, useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faTrash, faPen, faL, faComment } from '@fortawesome/free-solid-svg-icons'

import { useDispatch, useSelector } from 'react-redux';
import { deletePostAction, getCommentsAction, getOnePostAction, getUserAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import NewComment from '../../components/Comment/NewComment';
import ShowCommenst from '../../components/Comment/ShowCommenst';
import Swal from 'sweetalert2';
import { toast, Toaster } from 'react-hot-toast';



const notify = () => toast(
  'Post saved.',
  {
      duration: 1500,
      icon: '💼'
  }
);

const notify2 = () => toast(
  'Quit post.',
  {
      duration: 1500,
      icon: '👋'
  }
);

const ViewPost = () => {

  const dispatch = useDispatch();

  const params = useParams();
  const route = useNavigate();

  const[like, setLike] = useState(false);
  const[numberLike, setNumberLike] =  useState(0);
  const[save, setSave] = useState(false);
  const[numberSave, setNumberSave] = useState(0);
  const[post, setPost] = useState({})

  //redux
  const userP = useSelector(state => state.posts.user);
  const PF = useSelector(state => state.posts.PFPost);
  const theme = useSelector(state => state.posts.themeW);
  const comments = useSelector(state => state.posts.comments);
  const deletePostRedux = (id) => dispatch(deletePostAction(id));
  const getUserRedux = token => dispatch(getUserAction(token));
  const getCommentsRedux = (comments) => dispatch(getCommentsAction(comments));

  useEffect(() => {
      const getOnePostState = () => dispatch(getOnePostAction(params.id));
      getOnePostState();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);  

  useEffect(() => {
    fetch(`http://localhost:4000/api/posts/${params.id}`)
    .then((response) => response.json())
    .then((post) => {
      setPost(post)
      getCommentsRedux(post.commenstOnPost.comments);
      const userLike = post.likePost.users.includes(userP._id);
      if(userLike){
        setLike(true);
      }
      setNumberLike(post.likePost.users.length);
      setNumberSave(post.usersSavedPost.users.length)
    })   

  }, [params.id]);

  useEffect(() => {
      if(Object.keys(userP) != ''){
        const userPost = userP.postsSaved.posts.includes(params.id);
        if(userPost){
          setSave(true);
        }
      } 
  }, [userP]);

  const deletePostComponent = async (id) => {
    Swal.fire({
      title: 'Are you sure you want to remove this Post?',
      text: "Deleted post cannot be recovered",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel'
    }).then((result) => {
      if (result.value) {
          //consulta a la api
          deletePostRedux(id);
          setTimeout(() => {
            route('/');
          }, 2000);
          
      }
    })
      
      // setTimeout(() => {
        
    // }, 1000);
  }

  const handleLike = async (id) => {
        
    setLike(!like);
    if(like){
        setNumberLike(numberLike-1);
    }else{
        setNumberLike(numberLike+1)
    }
    try {
        const res =await axios.post(`http://localhost:4000/api/posts/like-post/${id}`, userP);
        console.log(res);
    } catch (error) {
        console.log(error);

    }
  }

const handleSave = async (id) => {
    setSave(!save);
    if(save){
        setNumberSave(numberSave-1);
        notify2()
    }else{
        setNumberSave(numberSave+1)
        notify()
    }
    try {
        await axios.post(`http://localhost:4000/api/posts/save-post/${id}`, userP);
    } catch (error) {
        console.log(error);

    }
}

  if(Object.keys(post) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} w-full sm:w-4/6 lg:w-3/6 mx-auto rounded-lg `}>
        <div className=''>
            <div className="overflow-hidden h-96">
                {post.linkImage && (
                    <img 
                        className="img-cover" 
                        src={post.linkImage.secure_url}
                        alt="Sunset in the mountains" 
                    />
                )}
            </div>
        </div>
        {userP._id === post.user._id ? (
          <div className=' flex justify-end'>
            <FontAwesomeIcon 
              onClick={() => deletePostComponent(params.id)}
              className=' text-2xl text-red-500 p-2 cursor-pointer'
              icon={faTrash} 
            />
            <Link
              to={`/edit-post/${params.id}`}
            >
              <FontAwesomeIcon 
                icon={faPen} 
                className=' text-2xl text-sky-500 p-2 cursor-pointer'
              />
            </Link>
          </div>
         ): null} 
        <div className=" mt-2 px-4 py-1">
            <h2 className=' font-bold text-5xl mb-3'>{post.title}</h2>
            <p className="mb-3 font-normal ">Posted on {new Date(post.createdAt).toDateString()}</p>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='flex'>
                  <p className='mx-3'>{numberLike}</p>
                  <button onClick={() => handleLike(params.id)} disabled={Object.keys(userP) != ''? false : true}>
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className={`${like ? ' text-red-400' :  ' text-mode-white'}   mx-auto  rounded`}
                    />
                  </button>
                </div>
                <div className='flex'>
                  <div className='flex items-center'>
                    <p className='mx-3'>{post.commenstOnPost.comments.length}</p>
                    <FontAwesomeIcon 
                      icon={faComment} 
                      className={`text-white  mx-auto  rounded`}                    
                    />
                  </div>
                </div>
              </div>
              <div className='flex'>
                <p className='  mx-3'>{numberSave}</p>
                <button onClick={() => handleSave(params.id)} disabled={Object.keys(userP) != ''? false : true}>
                  <FontAwesomeIcon 
                    icon={faBookmark} 
                    className={`${save ? 'text-blue-500': 'text-mode-white '}    mx-auto  rounded`}          
                  />
                </button>
              </div>
             
            </div>
            {post.categoriesPost.map(cat => (
                <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="inline-block hover:bg-gray-700 hover:text-mode-white transition bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</Link> 
                ))}
            <div 
                className="ql-editor post bg-content" 
                dangerouslySetInnerHTML={{ __html: post.content}}  
            />
        </div>
    </div>
    
    <div className='sm:w-4/6 lg:w-3/6 mx-auto'>
        <p className=' text-5xl my-3'>Comments:</p>
        <NewComment 
          user={userP}
          idPost={params.id}
        />
        {/* {post.commenstOnPost.comments.map(comment => (
          <ShowCommenst 
            comment={comment}
            idPost={params.id}
          />
        ))} */}
        {comments.map(comment => (
          <ShowCommenst
            key={comment.dateComment} 
            comment={comment}
            idPost={params.id}
          />
        ))}
        
    </div>
  </div>
  )
}

export default ViewPost