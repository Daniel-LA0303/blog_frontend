import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux';
import { resetStatePostAction } from '../StateRedux/actions/postAction';

import { useParams } from 'react-router-dom';

import Post from '../components/Post/Post';
import Sidebar from '../components/Sidebar/Sidebar'


const CategoryPost = () => {

  const dispatch = useDispatch();
  const params = useParams();

  const[postsFilter, setPostsFilters]=useState([]);
  const[charge, setCharge] = useState(true); 
  
  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
      .then((response) => response.json())
      .then((post) => {
        const filterByTags = [params.id];
        const filterByTagSet = new Set(filterByTags);
        const result = post.filter((o) => 
          o.categoriesPost.some((tag) => filterByTagSet.has(tag))
        );
        setPostsFilters(result);
        setCharge(false);
      })
}, [params.id]);
  
  return (
    <div>
      <Sidebar />
      <div className='w-full flex flex-wrap justify-evenly'>
        {postsFilter.map(post => (
          <Post 
            key={post._id}
            post={post}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryPost