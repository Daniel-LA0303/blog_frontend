import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux';
import { getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';

import { useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner';


const CategoryPost = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  const params = useParams();

  const[postsFilter, setPostsFilters]=useState([]);
  const[charge, setCharge] = useState(true); 
  const[category, setCategory] = useState({});
  
  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
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

useEffect(() => {
  const getOneUser = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/categories/${params.id}`);
      setCategory(res.data);
    } catch (error) {
        console.log(error);
    }
  }
  getOneUser();

}, [params.id]);
if(Object.keys(category) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      
      <div className='w-full flex flex-wrap justify-evenly'>
      <CategoryCard category={category}/>
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