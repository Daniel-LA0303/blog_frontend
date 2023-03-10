import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { getAllPostsAction, getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';
import { useDispatch, useSelector } from 'react-redux';
import Aside from '../../components/Aside/Aside';
import ScrollButton from '../../components/ScrollButton/ScrollButton';


const Home = () => {

  const dispatch = useDispatch();

  const[cats, setCats] = useState([]);

  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.posts.themeW);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      dispatch(getUserAction(JSON.parse(token)))
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
    .then((response) => response.json())
    .then((cats) => {
      const result = cats.filter(cat => cat.follows.countFollows > 0);
      setCats(result)      
    })   
  }, []);

  useEffect(() => {
    dispatch(getAllPostsAction())  
  }, []);
  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);
    
  return (
    <div className='  '>
        <Sidebar />
        <div className=' block sm:hidden sm:visible w-full'>
          {/* <Slider cats={cats}/> */}
        </div>
        <div className='flex flex-row mt-10'>
          <div className=' w-full  sm:w-8/12 lg:w-9/12 flex flex-col'>
            {loading ? (
              <>
                <LoadingPosts />
              </>
            ): 
            <>
              {posts.length == 0 ? (
                <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
              ): (
                <>
                  {[...posts].reverse().map(post => (
                    <Post 
                        key={post._id}
                        post={post}
                    />
                  ))}  
                </>
              )}

            </>}

          </div>
          <aside className=' hidden sm:block sm:visible w-0 sm:w-4/12 lg:w-3/12'>
            {cats.map(cat => (
              <Aside 
                cats={cat}
              />
            ))}

          </aside>
          <ScrollButton />
        </div>

    </div>
  )
}

export default Home