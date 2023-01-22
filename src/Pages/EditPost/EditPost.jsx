import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar'

import { useDispatch, useSelector } from 'react-redux';
import { addNewFilePostAction, editPostAction, getAllCategoriesAction, getOnePostAction } from '../../StateRedux/actions/postAction';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../components/EditorToolBar/EditorToolBar.css"
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar';

import Select from 'react-select'
import axios from 'axios';

import Spinner from '../../components/Spinner/Spinner';


const EditPost = () => {

  const route = useNavigate();
  const params = useParams();

  const user = useSelector(state => state.posts.user);
  const post = useSelector(state => state.posts.post);
  const loading = useSelector(state => state.posts.loading);
  
  const PF = useSelector(state => state.posts.PFPost);
  const dispatch = useDispatch();
  const editPostRedux = (id, postUpdate) => dispatch(editPostAction(id, postUpdate));
  const addNewFileRedux = (formData) => dispatch(addNewFilePostAction(formData));
  const getAllCategoriesRedux = () => dispatch(getAllCategoriesAction());
  const categories = useSelector(state => state.posts.categories);

  //local state
  const[title, setTitle] = useState(''); //title
  const[desc, setDesc] = useState(''); //description
  const[categoriesSelect, setCategoriesSelect] = useState([]); //cats of post
  const[content, setContent] = useState(''); //content
  const[image, setImage]= useState(''); //image
  const[file, setFile] = useState(null); //get new image
  const[newImage, setNewImage] = useState(false); //new image validation

  //get cat from restapi
  useEffect(() => {
    getAllCategoriesRedux();
  }, []);

  useEffect(() => {
    const getOnePostState = () => dispatch(getOnePostAction(params.id));
    getOnePostState();  
  }, []);

  useEffect(() => {
    const getOnePost = async() => {
      try {
        const res = await axios.get(`http://localhost:4000/api/posts/${params.id}`);
        console.log(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setImage(res.data.linkImage);
        setCategoriesSelect(res.data.categoriesSelect);
        setDesc(res.data.desc);
        } catch (error) {
            console.log(error);
        }
    }
    getOnePost();
}, [params.id]);

  const onContent = (value) => {
    setContent(value);
  }

  const handleChangeS = (select) => {
    setCategoriesSelect(select);
  }

  const getFile = e => {
    setFile(e.target.files[0]);
    setNewImage(true) //user chose new image
  }

  const newPost = async e => {
    e.preventDefault();

    let cats = [];
    for (let i = 0; i < categoriesSelect.length; i++) {
        cats.push(categoriesSelect[i].name);            
    }

    const postUpdate = {
        title: title,
        content: content,
        categoriesPost: cats,
        categoriesSelect: categoriesSelect,
        desc: desc
    }
    if(newImage){ 
        postUpdate.previousName=image //user chose a new image
    }else{
        postUpdate.linkImage=image //user not chose a new image
    }
    if(file){
        const formData = new FormData();
        const filename = Date.now() + file.name;
        formData.append('name', filename);
        formData.append('image', file);
        postUpdate.linkImage = filename
        addNewFileRedux(formData);
    }
    editPostRedux(params.id, postUpdate);
    route('/');
}

  if(Object.keys(post) === '') return <Spinner />
  return (
    <div>
      <Sidebar />
        <div className="App">
            <div className=" w-4/6  mx-auto my-20">
                <form 
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={newPost}
                >
                    <div className=" flex justify-between">
                        <div className="w-full sm:w-3/6">
                            <div className="mb-2 w-full ">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Title
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="username" 
                                    type="text" 
                                    placeholder="Title" 
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                />
                            </div>
                            <div className="mb-2 w-full ">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Description
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="username" 
                                        type="text" 
                                        placeholder="Description" 
                                        onChange={(e) => setDesc(e.target.value)}
                                        value={desc}
                                    />
                            </div>
                            <div className="mb-4 w-full ">
                                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                                <Select 
                                    onChange={handleChangeS}
                                    options={categories}
                                    isMulti 
                                    value={categoriesSelect}
                                />
                            </div>
                        </div>

                        <div className="mb-4 w-full sm:w-2/6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Image
                            </label>
                            <input 
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                id="file_input" 
                                type="file" 
                                onChange={getFile}
                            />
                            <div className='my-2'>
                                {newImage ? (
                                    <img
                                        className="writeImg"
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                    />
                                ): (
                                    <>
                                        {image !== '' ? (
                                            <img
                                                className=""
                                                src={PF+image}
                                                alt=""
                                            />
                                        ): null}
                                    </>
                                )}
                            </div>
                        </div>         
                    </div>

                    <div className="mb-4">
                        <EditorToolBar toolbarId={'t1'}/>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={onContent}
                            placeholder={"Write something awesome..."}
                            modules={modules('t1')}
                            formats={formats}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <input 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            value='Save Post'
                            type="submit" 
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default EditPost