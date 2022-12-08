import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

const Register = () => {

    const route = useNavigate();

    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);


    useEffect(() => {
        if(user._id){
            route('/');
            
        }
        console.log('xd');
    }, [user]);

    const[data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const {name, email, password} = data;

    const[password2, setPassword2] = useState('');

    const getData = (e) => {
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
    }

    const sendData = async (e) => {
        e.preventDefault();
        if([name, email, password, password2].includes('')){
            alert('error');
            return;
        }
        if(password !== password2){
            alert('passwords ');
            return;
        }

        try {
            await axios.post('http://localhost:4000/api/users', data);
        } catch (error) {
            console.log(error);
        }

        route('/');

    }

  return (
    <>
        {loading ? (
            <p>loading...</p>
        ):(
            <section className="">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl dark:text-white">
                            Sign up
                        </h1>
                        <form   
                            onSubmit={sendData}
                            className="space-y-4 md:space-y-6" 
                        >
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm text-white">Your name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="name" 
                                    required="" 
                                    onChange={getData}
                                    value={name}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm text-white">Your email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="name@company.com" 
                                    required="" 
                                    onChange={getData}
                                    value={email}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm text-white">Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    required="" 
                                    onChange={getData}
                                    value={password}
                                />
                            </div>
                            <div>
                                <label htmlFor="password2" className="block mb-2 text-sm text-white">Repeat Password</label>
                                <input 
                                    type="password" 
                                    name="password2" 
                                    id="password2" 
                                    placeholder="••••••••" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    required="" 
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Sign up</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                I have an account yet <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        )}
    </>

  )
}

export default Register