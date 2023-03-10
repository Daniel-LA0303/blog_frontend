import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import LoadingPosts from '../../components/Spinner/LoadingPosts'
import { useSelector } from 'react-redux'

const SavePost = () => {

  const params = useParams();

  const[posts, setPosts] = useState([]);
  const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    const getOneUser = async() => {
      try {
        const res = await axios.get(`http://localhost:4000/api/users/get-profile/${params.id}`);
        setPosts(res.data.postsSaved.posts);
        setCharge(true);
      } catch (error) {
          console.log(error);
      }      
    }
    setTimeout(() => {
      getOneUser();
    }, 1000);
  }, []);
  
  return (
    <div>
        <Sidebar />
        <div className=' w-full  flex flex-col mt-10'>
        {!charge ? (
          <>
            <LoadingPosts />
          </>
        ) : (
          <>
            {posts.length === 0 ? (
              <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
            ) : (
              <>
                {[...posts].reverse().map(post => (
                    <Post 
                        key={post._id}
                        post={post}
                    />
                ))}  
              </>
            )}
          </>
        )}

          </div>
    </div>
  )
}

export default SavePost